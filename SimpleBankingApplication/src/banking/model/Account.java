package banking.model;

/**
 * Abstract base class for all bank accounts.
 *
 * OOP:
 * - Abstraction: common account contract.
 * - Encapsulation: private state with getters/setters.
 * - Polymorphism: child classes override withdrawal and interest behavior.
 */
public abstract class Account {
    private String accountId;
    private String accountHolderName;
    private double balance;

    public Account(String accountId, String accountHolderName, double balance) {
        if (accountId == null || accountId.trim().isEmpty()) throw new IllegalArgumentException("Account ID cannot be empty.");
        if (accountHolderName == null || accountHolderName.trim().isEmpty()) throw new IllegalArgumentException("Account holder name cannot be empty.");
        if (balance < 0) throw new IllegalArgumentException("Initial balance cannot be negative.");
        this.accountId = accountId;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) {
        if (accountId == null || accountId.trim().isEmpty()) throw new IllegalArgumentException("Account ID cannot be empty.");
        this.accountId = accountId;
    }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) {
        if (accountHolderName == null || accountHolderName.trim().isEmpty()) throw new IllegalArgumentException("Account holder name cannot be empty.");
        this.accountHolderName = accountHolderName;
    }

    public double getBalance() { return balance; }
    public void setBalance(double balance) {
        if (balance < 0) throw new IllegalArgumentException("Balance cannot be negative.");
        this.balance = balance;
    }

    public void deposit(double amount) {
        validatePositiveAmount(amount);
        balance += amount;
    }

    public abstract void withdraw(double amount);
    public abstract double calculateInterest();
    public abstract String getAccountType();

    protected void validatePositiveAmount(double amount) {
        if (Double.isNaN(amount) || Double.isInfinite(amount) || amount <= 0)
            throw new IllegalArgumentException("Amount must be greater than zero.");
    }

    protected void ensureSufficientFunds(double requiredAmount) {
        if (balance < requiredAmount)
            throw new IllegalArgumentException("Insufficient funds.");
    }

    @Override
    public String toString() {
        return "Account{id='" + accountId + "', holder='" + accountHolderName +
                "', balance=" + balance + ", type='" + getAccountType() + "'}";
    }
}
