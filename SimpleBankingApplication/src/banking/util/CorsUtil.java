package banking.util;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

/**
 * Centralized CORS helper.
 * Allows the browser frontend to call the Java API.
 */
public final class CorsUtil {
    private CorsUtil() {}

    public static void apply(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        headers.set("Access-Control-Max-Age", "86400");
    }

    public static boolean handlePreflight(HttpExchange exchange) throws java.io.IOException {
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            apply(exchange);
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }
}
