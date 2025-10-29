// ==========================
// ✅ data.js (Bank System)
// ==========================

// 🧩 Utility functions
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getLoggedInUserEmail() {
  return localStorage.getItem("loggedInUser");
}
function getLoggedInUser() {
  const users = getUsers();
  const email = getLoggedInUserEmail();
  return users.find((u) => u.email === email);
}
function saveLoggedInUser(user) {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === user.email);
  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
}

// ==========================
// 📝 Register
// ==========================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const msg = document.getElementById("message");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      return showMessage("❌ Passwords do not match!", "text-red-600");
    }

    let users = getUsers();
    if (users.find((u) => u.email === email)) {
      return showMessage("⚠️ Email already registered!", "text-yellow-600");
    }

    users.push({
      fullname,
      email,
      password,
      balance: 50000, // 🟢 Initial balance
      transactions: [],
    });

    saveUsers(users);
    showMessage("✅ Registered successfully!", "text-green-600");
    registerForm.reset();
    setTimeout(() => (window.location.href = "login.html"), 1200);
  });

  function showMessage(text, color) {
    msg.className = `text-center mt-4 font-semibold ${color}`;
    msg.textContent = text;
    msg.classList.remove("hidden");
  }
}

// ==========================
// 🔐 Login
// ==========================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const msg = document.getElementById("message");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return showMessage("❌ Invalid email or password!", "text-red-600");
    }

    localStorage.setItem("loggedInUser", user.email);
    showMessage("✅ Login successful! Redirecting...", "text-green-600");
    setTimeout(() => (window.location.href = "dashboard.html"), 1200);
  });

  function showMessage(text, color) {
    msg.className = `text-center mt-4 font-semibold ${color}`;
    msg.textContent = text;
    msg.classList.remove("hidden");
  }
}

// ==========================
// 💰 Deposit
// ==========================
const depositForm = document.getElementById("depositForm");
if (depositForm) {
  const messageBox = document.getElementById("successMessage");

  depositForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("depositAmount").value);
    const user = getLoggedInUser();

    if (!user) {
      return showMsg("User not logged in!", false);
    }
    if (isNaN(amount) || amount <= 0) {
      return showMsg("Please enter valid amount!", false);
    }

    user.balance += amount;
    user.transactions.push({
      type: "Deposit",
      amount,
      date: new Date().toLocaleString(),
    });

    saveLoggedInUser(user);
    showMsg(`✅ ${amount} deposited! New balance: Rs. ${user.balance}`, true);
    depositForm.reset();
  });

  function showMsg(text, success) {
    messageBox.style.display = "block";
    messageBox.textContent = text;
    messageBox.className = success
      ? "bg-green-100 text-green-700 text-center p-2 rounded"
      : "bg-red-100 text-red-700 text-center p-2 rounded";
  }
}

// ==========================
// 💸 Withdraw
// ==========================
const withdrawBtn = document.getElementById("withdrawBtn");
if (withdrawBtn) {
  withdrawBtn.addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("withdrawAmount").value);
    const resultMsg = document.getElementById("resultMsg");
    const userName = document.getElementById("userName");
    const resultArea = document.getElementById("resultArea");
    const user = getLoggedInUser();

    if (!user) return show("User not logged in!", false);
    if (isNaN(amount) || amount <= 0) return show("Enter valid amount!", false);
    if (amount > user.balance) return show("Insufficient balance!", false);

    user.balance -= amount;
    user.transactions.push({
      type: "Withdraw",
      amount,
      date: new Date().toLocaleString(),
    });

    saveLoggedInUser(user);
    show(`Withdrawn Rs. ${amount}. New balance: Rs. ${user.balance}`, true);

    function show(text, success) {
      resultMsg.textContent = text;
      resultMsg.className = success ? "text-green-600" : "text-red-600";
      resultArea.classList.remove("hidden");
      userName.textContent = `Transaction by: ${user.fullname}`;
      document.getElementById("withdrawAmount").value = "";
    }
  });
}

// ==========================
// 🔄 Transfer
// ==========================
const transferForm = document.getElementById("transferForm");
if (transferForm) {
  const resultMsg = document.getElementById("resultMsg");

  transferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const receiverEmail = document
      .getElementById("receiverEmail")
      .value.trim()
      .toLowerCase();
    const amount = parseFloat(document.getElementById("transferAmount").value);
    const sender = getLoggedInUser();
    const users = getUsers();
    const receiver = users.find((u) => u.email === receiverEmail);

    if (!sender) return msg("User not logged in!", false);
    if (!receiver) return msg("Receiver not found!", false);
    if (receiver.email === sender.email)
      return msg("Cannot transfer to yourself!", false);
    if (isNaN(amount) || amount <= 0)
      return msg("Enter valid transfer amount!", false);
    if (amount > sender.balance) return msg("Insufficient balance!", false);

    // ✅ Balance updates
    sender.balance -= amount;
    receiver.balance += amount;

    // ✅ Transaction entries
    sender.transactions.push({
      type: "Transfer Sent",
      to: receiver.email,
      amount,
      date: new Date().toLocaleString(),
    });
    receiver.transactions.push({
      type: "Transfer Received",
      from: sender.email,
      amount,
      date: new Date().toLocaleString(),
    });

    // ✅ Save both
    saveLoggedInUser(sender);
    saveLoggedInUser(receiver);

    msg(`✅ Rs. ${amount} transferred to ${receiver.email}`, true);
    transferForm.reset();

    function msg(text, success) {
      resultMsg.textContent = text;
      resultMsg.className = success
        ? "text-green-600 text-center font-semibold"
        : "text-red-500 text-center font-semibold";
    }
  });
}

// ==========================
// 📜 Transaction History
// ==========================
const txTable = document.getElementById("allTransactions");
if (txTable) {
  const user = getLoggedInUser();
  if (!user || !user.transactions.length) {
    txTable.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">No transactions yet.</td></tr>`;
  } else {
    user.transactions
      .slice()
      .reverse()
      .forEach((t) => {
        const row = document.createElement("tr");
        const color =
          t.type.includes("Deposit") || t.type.includes("Received")
            ? "text-green-600"
            : "text-red-600";
        row.innerHTML = `
          <td class="${color}">${t.type}</td>
          <td>Rs. ${t.amount.toFixed(2)}</td>
          <td>${t.date}</td>
        `;
        txTable.appendChild(row);
      });
  }
}

// ==========================
// 🚪 Logout + Page Access Control
// ==========================

// 🔐 Auth guard function
function protectPage() {
  const publicPages = ["login.html", "register.html"];
  const currentPage = window.location.pathname.split("/").pop();
  const loggedInEmail = localStorage.getItem("loggedInUser");

  // If user is logged in and on login/register → redirect to dashboard
  if (loggedInEmail && publicPages.includes(currentPage)) {
    window.location.href = "dashboard.html";
  }

  // If user not logged in and trying to access protected page → redirect to login
  if (!loggedInEmail && !publicPages.includes(currentPage)) {
    window.location.href = "login.html";
  }
}

// Run protection on every page load
protectPage();

// 🧭 Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });
}

// ================================
// 🧩 Load Logged-in User Info
// ================================
const loggedInEmail = localStorage.getItem("loggedInUser");
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = users.find((u) => u.email === loggedInEmail);

if (
  !currentUser &&
  window.location.href.indexOf("login.html") === -1 &&
  window.location.href.indexOf("register.html") === -1
) {
  window.location.href = "login.html";
}

// Show data in profile
if (document.getElementById("profileName"))
  document.getElementById("profileName").textContent = currentUser.fullname;
if (document.getElementById("profileEmail"))
  document.getElementById("profileEmail").textContent = currentUser.email;
if (document.getElementById("profileBalance"))
  document.getElementById("profileBalance").textContent =
    currentUser.balance.toFixed(2);
if (document.getElementById("profileTransactions"))
  document.getElementById("profileTransactions").textContent =
    currentUser.transactions ? currentUser.transactions.length : 0;

// ==========================
// ✏️ Update User Name
// ==========================
function updateName() {
  const newName = document.getElementById("newName").value.trim();
  const message = document.getElementById("message");

  if (newName === "") {
    message.textContent = "Please enter a valid name!";
    message.classList.replace("text-green-600", "text-red-600");
    return;
  }

  const index = users.findIndex((u) => u.email === loggedInEmail);
  if (index !== -1) {
    users[index].fullname = newName;
    localStorage.setItem("users", JSON.stringify(users));

    // Update UI instantly
    document.getElementById("profileName").textContent = newName;
    message.textContent = "Name updated successfully!";
    message.classList.replace("text-red-600", "text-green-600");
  }
}
