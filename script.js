const balanceAmount = document.getElementById("balance-amount");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

let transactions = [];

// Update the UI
function updateUI() {
  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = income + expense;

  balanceAmount.textContent = `Rs ${balance.toFixed(2)}`;
  incomeAmount.textContent = `Rs ${income.toFixed(2)}`;
  expenseAmount.textContent = `Rs ${Math.abs(expense).toFixed(2)}`;

  transactionList.innerHTML = "";
  transactions.forEach(transaction => {
    const li = document.createElement("li");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");
    li.innerHTML = `
      ${transaction.description}
      <span>${transaction.amount > 0 ? "+" : ""}$${transaction.amount.toFixed(2)}</span>
    `;
    transactionList.appendChild(li);
  });
}

// Add Transaction
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (description && !isNaN(amount)) {
    transactions.push({ description, amount });
    updateUI();

    // Clear inputs
    descriptionInput.value = "";
    amountInput.value = "";
  }
});

// Initial UI Update
updateUI();
