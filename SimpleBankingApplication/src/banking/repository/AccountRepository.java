package banking.repository;

import banking.model.Account;
import banking.model.CheckingAccount;
import banking.model.SavingsAccount;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * In-memory repository acting as a volatile database.
 */
public class AccountRepository {
    private final Map<String, Account> accounts = new LinkedHashMap<String, Account>();

    public AccountRepository() {
        seedDemoAccounts();
    }

    private void seedDemoAccounts() {
        save(new SavingsAccount("SAV001", "Alice Johnson", 5000.0, 4.5));
        save(new CheckingAccount("CHK001", "Bob Smith", 3000.0, 25.0));
    }

    public synchronized void save(Account account) {
        accounts.put(account.getAccountId(), account);
    }

    public synchronized Account findById(String accountId) {
        return accounts.get(accountId);
    }

    public synchronized Collection<Account> findAll() {
        return new ArrayList<Account>(accounts.values());
    }
}
