const API_BASE = "http://localhost:8080/api";

const accountsEl = document.getElementById("accounts");
const accountSelect = document.getElementById("accountId");
const form = document.getElementById("transactionForm");
const messageEl = document.getElementById("message");
const statusEl = document.getElementById("status");

async function loadAccounts() {
    try {
        const response = await fetch(`${API_BASE}/accounts`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to load accounts.");

        renderAccounts(data);
        statusEl.textContent = "● API Connected";
        statusEl.style.color = "green";
    } catch (error) {
        statusEl.textContent = "● API Offline";
        statusEl.style.color = "crimson";
        messageEl.textContent = error.message;
    }
}

function renderAccounts(accounts) {
    accountsEl.innerHTML = accounts.map(account => `
        <article class="card">
            <h3>${escapeHtml(account.accountHolderName)}</h3>
            <div class="meta"><span>Account ID</span><strong>${escapeHtml(account.accountId)}</strong></div>
            <div class="meta"><span>Type</span><strong>${escapeHtml(account.accountType)}</strong></div>
            <div class="balance">₹${Number(account.balance).toFixed(2)}</div>
            <div class="meta">
                <span>${account.accountType === "SAVINGS" ? "Interest Rate" : "Transaction Fee"}</span>
                <strong>${account.accountType === "SAVINGS"
                    ? account.interestRate + "%"
                    : "₹" + Number(account.transactionFee).toFixed(2)}</strong>
            </div>
        </article>
    `).join("");

    accountSelect.innerHTML = accounts.map(account =>
        `<option value="${escapeHtml(account.accountId)}">${escapeHtml(account.accountId)} — ${escapeHtml(account.accountHolderName)}</option>`
    ).join("");
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = accountSelect.value;
    const operation = document.getElementById("operation").value;
    const amount = Number(document.getElementById("amount").value);

    if (amount <= 0) {
        messageEl.textContent = "Enter an amount greater than zero.";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/accounts/${encodeURIComponent(id)}/${operation}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Transaction failed.");

        messageEl.textContent = `${operation.toUpperCase()} successful. New balance: ₹${Number(data.account.balance).toFixed(2)}`;
        form.reset();
        await loadAccounts();
    } catch (error) {
        messageEl.textContent = error.message;
    }
});

document.getElementById("refreshBtn").addEventListener("click", loadAccounts);

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadAccounts();
