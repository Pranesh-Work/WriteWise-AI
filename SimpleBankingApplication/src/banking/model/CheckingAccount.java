package banking.model;

/**
 * Checking account with a flat transaction fee for withdrawals.
 */
public class CheckingAccount extends Account {
    private double transactionFee;

    public CheckingAccount(String accountId, String accountHolderName, double balance, double transactionFee) {
        super(accountId, accountHolderName, balance);
        if (transactionFee < 0) throw new IllegalArgumentException("Transaction fee cannot be negative.");
        this.transactionFee = transactionFee;
    }

    public double getTransactionFee() { return transactionFee; }
    public void setTransactionFee(double transactionFee) {
        if (transactionFee < 0) throw new IllegalArgumentException("Transaction fee cannot be negative.");
        this.transactionFee = transactionFee;
    }

    @Override
    public void withdraw(double amount) {
        validatePositiveAmount(amount);
        double total = amount + transactionFee;
        ensureSufficientFunds(total);
        setBalance(getBalance() - total);
    }

    @Override
    public double calculateInterest() {
        return 0.0;
    }

    @Override
    public String getAccountType() {
        return "CHECKING";
    }
}
