package banking.util;

import banking.model.Account;
import banking.model.CheckingAccount;
import banking.model.SavingsAccount;

import java.util.Collection;

/**
 * Small JSON utility written with standard Java only.
 * It escapes strings and serializes the application's response objects.
 */
public final class JsonUtil {
    private JsonUtil() {}

    public static String account(Account a) {
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"accountId\":\"").append(escape(a.getAccountId())).append("\",");
        json.append("\"accountHolderName\":\"").append(escape(a.getAccountHolderName())).append("\",");
        json.append("\"balance\":").append(number(a.getBalance())).append(",");
        json.append("\"accountType\":\"").append(escape(a.getAccountType())).append("\"");

        if (a instanceof SavingsAccount) {
            json.append(",\"interestRate\":").append(number(((SavingsAccount) a).getInterestRate()));
        } else if (a instanceof CheckingAccount) {
            json.append(",\"transactionFee\":").append(number(((CheckingAccount) a).getTransactionFee()));
        }

        json.append("}");
        return json.toString();
    }

    public static String accounts(Collection<Account> accounts) {
        StringBuilder json = new StringBuilder("[");
        boolean first = true;
        for (Account a : accounts) {
            if (!first) json.append(",");
            json.append(account(a));
            first = false;
        }
        return json.append("]").toString();
    }

    public static String message(String message) {
        return "{\"message\":\"" + escape(message) + "\"}";
    }

    public static String error(String message) {
        return "{\"error\":\"" + escape(message) + "\"}";
    }

    public static String transaction(Account account, String operation, double amount) {
        return "{\"operation\":\"" + escape(operation) + "\",\"amount\":" +
                number(amount) + ",\"account\":" + account(account) + "}";
    }

    public static String interest(Account account) {
        return "{\"accountId\":\"" + escape(account.getAccountId()) +
                "\",\"accountType\":\"" + escape(account.getAccountType()) +
                "\",\"interest\":" + number(account.calculateInterest()) + "}";
    }

    private static String number(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) return "0";
        return String.valueOf(value);
    }

    private static String escape(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\r", "\\r").replace("\n", "\\n");
    }
}
