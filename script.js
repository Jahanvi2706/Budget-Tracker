const balanceAmount = document.getElementById("balance-amount");
const incomeAmount = document.getElementById("income-amount");
const expenseAmount = document.getElementById("expense-amount");
const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const signupUsernameInput = document.getElementById("signup-username");
const signupPasswordInput = document.getElementById("signup-password");
const signupConfirmPasswordInput = document.getElementById("signup-confirm-password");

const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const trackerSection = document.getElementById("tracker-section");

const loginErrorMessage = document.getElementById("login-error-message");
const signupErrorMessage = document.getElementById("signup-error-message");

let transactions = [];
let currentUser = null;

function checkLoginStatus() {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    loadTransactions();
    showTracker();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginSection.style.display = 'block';
  signupSection.style.display = 'none';
  trackerSection.style.display = 'none';
}

function showSignup() {
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
  trackerSection.style.display = 'none';
}

function showTracker() {
  loginSection.style.display = 'none';
  signupSection.style.display = 'none';
  trackerSection.style.display = 'block';
  updateUI();
}

function loadTransactions() {
  transactions = JSON.parse(localStorage.getItem(`transactions_${currentUser.username}`)) || [];
}

function saveTransactions() {
  localStorage.setItem(`transactions_${currentUser.username}`, JSON.stringify(transactions));
}

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

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    showTracker();
  } else {
    loginErrorMessage.style.display = 'block';
  }
});

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = signupUsernameInput.value.trim();
  const password = signupPasswordInput.value.trim();
  const confirmPassword = signupConfirmPasswordInput.value.trim();

  if (password !== confirmPassword) {
    signupErrorMessage.style.display = 'block';
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    signupErrorMessage.textContent = "Username already exists.";
    signupErrorMessage.style.display = 'block';
    return;
  }

  const newUser = { username, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  currentUser = newUser;
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  showTracker();
});

function logout() {
  localStorage.removeItem('currentUser');
  showLogin();
}
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (description && !isNaN(amount)) {
    transactions.push({ description, amount });
    saveTransactions();
    updateUI();

    descriptionInput.value = "";
    amountInput.value = "";
  }
});

function deleteAllHistory() {
  const confirmDelete = confirm("Are you sure you want to delete all transaction history?");
  if (confirmDelete) {
    transactions = [];
    saveTransactions();
    updateUI();
  }
}
checkLoginStatus();
