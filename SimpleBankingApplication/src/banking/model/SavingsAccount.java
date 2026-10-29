package banking.model;

/**
 * Savings account with an annual interest rate.
 */
public class SavingsAccount extends Account {
    private double interestRate;

    public SavingsAccount(String accountId, String accountHolderName, double balance, double interestRate) {
        super(accountId, accountHolderName, balance);
        if (interestRate < 0) throw new IllegalArgumentException("Interest rate cannot be negative.");
        this.interestRate = interestRate;
    }

    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) {
        if (interestRate < 0) throw new IllegalArgumentException("Interest rate cannot be negative.");
        this.interestRate = interestRate;
    }

    @Override
    public void withdraw(double amount) {
        validatePositiveAmount(amount);
        ensureSufficientFunds(amount);
        setBalance(getBalance() - amount);
    }

    @Override
    public double calculateInterest() {
        return getBalance() * (interestRate / 100.0);
    }

    @Override
    public String getAccountType() {
        return "SAVINGS";
    }
}
