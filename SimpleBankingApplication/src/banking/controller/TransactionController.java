package banking.controller;

import banking.model.Account;
import banking.repository.AccountRepository;
import banking.util.CorsUtil;
import banking.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * REST controller for deposits, withdrawals and interest.
 *
 * POST /api/accounts/{id}/deposit
 * POST /api/accounts/{id}/withdraw
 * GET  /api/accounts/{id}/interest
 */
public class TransactionController implements HttpHandler {
    private final AccountRepository repository;
    private static final Pattern AMOUNT_PATTERN =
            Pattern.compile("\"amount\"\\s*:\\s*(-?\\d+(?:\\.\\d+)?)");

    public TransactionController(AccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        CorsUtil.apply(exchange);
        if (CorsUtil.handlePreflight(exchange)) return;

        try {
            String[] parts = exchange.getRequestURI().getPath().split("/");
            // Expected: ["", "api", "accounts", "{id}", "{operation}"]
            if (parts.length != 5) {
                send(exchange, 404, JsonUtil.error("Endpoint not found."));
                return;
            }

            String id = parts[3];
            String operation = parts[4];
            Account account = repository.findById(id);

            if (account == null) {
                send(exchange, 404, JsonUtil.error("Account not found."));
                return;
            }

            if ("interest".equalsIgnoreCase(operation)) {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    send(exchange, 405, JsonUtil.error("Method not allowed."));
                    return;
                }
                send(exchange, 200, JsonUtil.interest(account));
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                send(exchange, 405, JsonUtil.error("Method not allowed."));
                return;
            }

            double amount = parseAmount(exchange);
            if ("deposit".equalsIgnoreCase(operation)) {
                account.deposit(amount);
                send(exchange, 200, JsonUtil.transaction(account, "DEPOSIT", amount));
            } else if ("withdraw".equalsIgnoreCase(operation)) {
                // Polymorphism: Account reference invokes the child implementation.
                account.withdraw(amount);
                send(exchange, 200, JsonUtil.transaction(account, "WITHDRAW", amount));
            } else {
                send(exchange, 404, JsonUtil.error("Unknown transaction."));
            }
        } catch (Exception e) {
            send(exchange, 400, JsonUtil.error(e.getMessage() == null ? "Invalid request." : e.getMessage()));
        }
    }

    private double parseAmount(HttpExchange exchange) throws IOException {
        String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Matcher matcher = AMOUNT_PATTERN.matcher(body);
        if (!matcher.find()) throw new IllegalArgumentException("JSON body must contain a numeric amount.");
        return Double.parseDouble(matcher.group(1));
    }

    private void send(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }
}
