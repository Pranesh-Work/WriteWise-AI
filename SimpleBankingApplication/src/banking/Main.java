package banking;

import banking.controller.AccountController;
import banking.controller.TransactionController;
import banking.repository.AccountRepository;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;

/**
 * Application entry point.
 */
public class Main {
    public static void main(String[] args) throws Exception {
        int port = 8080;

        AccountRepository repository = new AccountRepository();
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/accounts", new AccountController(repository));
        server.createContext("/api/accounts/", new TransactionController(repository));

        server.setExecutor(null);
        server.start();

        System.out.println("==============================================");
        System.out.println(" Simple Banking Application");
        System.out.println(" Server: http://localhost:" + port);
        System.out.println(" API:    http://localhost:" + port + "/api/accounts");
        System.out.println("==============================================");
    }
}
