package banking.controller;

import banking.model.Account;
import banking.repository.AccountRepository;
import banking.util.CorsUtil;
import banking.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;

/**
 * REST controller for account retrieval.
 *
 * GET /api/accounts
 * GET /api/accounts/{id}
 */
public class AccountController implements HttpHandler {
    private final AccountRepository repository;

    public AccountController(AccountRepository repository) {
        this.repository = repository;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        CorsUtil.apply(exchange);
        if (CorsUtil.handlePreflight(exchange)) return;

        try {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                send(exchange, 405, JsonUtil.error("Method not allowed."));
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String base = "/api/accounts";

            if (path.equals(base) || path.equals(base + "/")) {
                send(exchange, 200, JsonUtil.accounts(repository.findAll()));
                return;
            }

            if (path.startsWith(base + "/")) {
                String id = path.substring((base + "/").length());
                Account account = repository.findById(id);
                if (account == null) {
                    send(exchange, 404, JsonUtil.error("Account not found."));
                } else {
                    send(exchange, 200, JsonUtil.account(account));
                }
                return;
            }

            send(exchange, 404, JsonUtil.error("Endpoint not found."));
        } catch (Exception e) {
            send(exchange, 400, JsonUtil.error(e.getMessage()));
        }
    }

    private void send(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes("UTF-8");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }
}
