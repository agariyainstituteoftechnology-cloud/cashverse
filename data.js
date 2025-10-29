// ==========================
//  data.js  (Shared Storage)
// ==========================

// Default setup if localStorage empty
if (!localStorage.getItem("balance")) {
  localStorage.setItem("balance", "0");
}
if (!localStorage.getItem("transactions")) {
  localStorage.setItem("transactions", JSON.stringify([]));
}

// 🪙 Get current balance
function getBalance() {
  return parseFloat(localStorage.getItem("balance")) || 0;
}

// 💰 Update balance
function updateBalance(newBalance) {
  localStorage.setItem("balance", newBalance.toFixed(2));
}

// 🧾 Add transaction (Deposit / Withdraw / Transfer)
function addTransaction(type, amount) {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const newTx = {
    type,
    amount: parseFloat(amount),
    date: new Date().toLocaleString(),
  };
  transactions.push(newTx);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// 📜 Get all transactions
function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

// 🔄 Clear all (for testing)
function clearAllData() {
  localStorage.removeItem("balance");
  localStorage.removeItem("transactions");
}
