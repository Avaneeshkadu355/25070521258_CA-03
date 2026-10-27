import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Utensils,
  Car,
  House,
  Menu,
} from "lucide-react";
import "./App.css";

const transactions = [
  {
    id: 1,
    name: "Grocery shopping",
    category: "Food & Groceries",
    date: "Today, 10:42 AM",
    amount: -1250,
    icon: ShoppingBag,
    color: "orange",
  },
  {
    id: 2,
    name: "Monthly salary",
    category: "Income",
    date: "Today, 9:15 AM",
    amount: 45000,
    icon: Wallet,
    color: "green",
  },
  {
    id: 3,
    name: "Restaurant",
    category: "Food & Dining",
    date: "Yesterday",
    amount: -680,
    icon: Utensils,
    color: "purple",
  },
  {
    id: 4,
    name: "Cab ride",
    category: "Transportation",
    date: "Yesterday",
    amount: -240,
    icon: Car,
    color: "blue",
  },
  {
    id: 5,
    name: "Electricity bill",
    category: "Housing",
    date: "24 Oct 2026",
    amount: -1800,
    icon: House,
    color: "pink",
  },
];



const formatMoney = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  
  const [transactionList, setTransactionList] = useState(() => {
  try {
    const savedTransactions = localStorage.getItem("vaultly-transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions).map((transaction) => ({
        ...transaction,
        icon:
          transaction.category === "Housing" ? House :
          transaction.category === "Transportation" ? Car :
          transaction.category === "Income" ? Wallet :
          transaction.category === "Food & Dining" ? Utensils :
          ShoppingBag,
      }));
    }
  } catch (error) {
    console.error("Could not load saved transactions:", error);
  }

  return transactions;
});



useEffect(() => {
  localStorage.setItem(
    "vaultly-transactions",
    JSON.stringify(transactionList)
  );
}, [transactionList]);



  const totalIncome = transactionList
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactionList
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  const totalBalance = totalIncome - totalExpenses;


const expenses = [
  { name: "Housing", color: "#6c63ff" },
  { name: "Food", color: "#f4a261" },
  { name: "Transport", color: "#38b2ac" },
  { name: "Shopping", color: "#f071a8" },
].map((category) => ({
  ...category,
  amount: transactionList
    .filter(
      (transaction) =>
        transaction.amount < 0 &&
        (
          (category.name === "Housing" &&
            transaction.category === "Housing") ||
          (category.name === "Food" &&
            ["Food", "Food & Groceries", "Food & Dining"].includes(
              transaction.category
            )) ||
          (category.name === "Transport" &&
            transaction.category === "Transportation") ||
          (category.name === "Shopping" &&
            transaction.category === "Shopping")
        )
    )
    .reduce(
      (total, transaction) => total + Math.abs(transaction.amount),
      0
    ),
}));


  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Transactions", icon: ArrowLeftRight },
    { label: "My Wallet", icon: Wallet },
    { label: "Analytics", icon: ChartNoAxesCombined },
  ];


  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("Food & Groceries");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const handleAddTransaction = (event) => {
    event.preventDefault();

    const amount = Number(transactionAmount);

    if (!transactionName.trim() || !Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a transaction name and a valid amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: transactionName.trim(),
      category:
        transactionType === "income" ? "Income" : transactionCategory,
      date: new Date(`${transactionDate}T12:00:00`).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" }
      ),
      amount: transactionType === "income" ? amount : -amount,
      icon: Wallet,
      color: transactionType === "income" ? "green" : "orange",
    };

    setTransactionList((previous) => [newTransaction, ...previous]);
    setTransactionName("");
    setTransactionAmount("");
    setTransactionCategory("Food & Groceries");
    setTransactionDate(new Date().toLocaleDateString("en-CA"));
    setShowTransactionForm(false);
  };


  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <span>vaultly<span className="brand-dot">.</span></span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => {
                setActivePage(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Transactions" && (
                <span className="nav-count">5</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h3>Your money, in focus.</h3>
            <p>Build better habits, one day at a time.</p>
            <button onClick={() => setActivePage("Analytics")}>
              Explore insights <ArrowUpRight size={15} />
            </button>
          </div>

          <button
            className={`nav-item settings-link ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => setActivePage("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">M</div>
            <div className="profile-info">
              <strong>My Account</strong>
              <span>Personal workspace</span>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-divider">/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="top-avatar">M</div>
          </div>
        </header>

        <div className="dashboard">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="status-dot" />
                YOUR FINANCIAL SPACE
              </div>
              <h1>
                Good evening, <span>there.</span>
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your money.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowTransactionForm(true)}
            >
             <Plus size={18} />
              Add transaction
            </button>
          </section>

          
{showTransactionForm && (
  <div className="transaction-modal-backdrop">
    <section
      className="transaction-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
    >
      <div className="transaction-modal-heading">
        <div>
          <span className="form-eyebrow">YOUR MONEY, YOUR WAY</span>
          <h2 id="transaction-form-title">Add transaction</h2>
          <p>Record where your money goes.</p>
        </div>
        <button
          type="button"
          className="modal-close"
          onClick={() => setShowTransactionForm(false)}
          aria-label="Close form"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleAddTransaction}>
        <label className="form-label">Transaction type</label>
        <div className="transaction-type-toggle">
          <button
            type="button"
            className={transactionType === "expense" ? "selected" : ""}
            onClick={() => setTransactionType("expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={transactionType === "income" ? "selected" : ""}
            onClick={() => setTransactionType("income")}
          >
            Income
          </button>
        </div>

        <label className="form-label" htmlFor="transaction-name">
          Transaction name
        </label>
        <input
          id="transaction-name"
          className="form-input"
          type="text"
          placeholder="e.g. Grocery shopping"
          value={transactionName}
          onChange={(event) => setTransactionName(event.target.value)}
          required
        />

        <label className="form-label" htmlFor="transaction-amount">
          Amount (₹)
        </label>
        <input
          id="transaction-amount"
          className="form-input"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={transactionAmount}
          onChange={(event) => setTransactionAmount(event.target.value)}
          required
        />

        {transactionType === "expense" && (
          <>
            <label className="form-label" htmlFor="transaction-category">
              Category
            </label>
            <select
              id="transaction-category"
              className="form-input"
              value={transactionCategory}
              onChange={(event) =>
                setTransactionCategory(event.target.value)
              }
            >
              <option>Food & Groceries</option>
              <option>Food & Dining</option>
              <option>Housing</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Health</option>
              <option>Education</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>
          </>
        )}

        <label className="form-label" htmlFor="transaction-date">
          Date
        </label>
        <input
          id="transaction-date"
          className="form-input"
          type="date"
          value={transactionDate}
          onChange={(event) => setTransactionDate(event.target.value)}
          required
        />

        <div className="transaction-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowTransactionForm(false)}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button">
            <Plus size={17} />
            Save transaction
          </button>
        </div>
      </form>
    </section>
  </div>
)}

          <section className="summary-grid">
            <article className="summary-card balance-card">
              <div className="card-top">
                <span className="card-label">Total balance</span>
                <span className="card-icon balance-icon">
                  <Wallet size={19} />
                </span>
              </div>
              <h2>{formatMoney(totalBalance)}</h2>
              <div className="card-footer">
                <span className="trend positive">
                  <ArrowUpRight size={15} /> 12.8%
                </span>
                <span>vs. last month</span>
              </div>
              <div className="balance-decoration decoration-one" />
              <div className="balance-decoration decoration-two" />
            </article>

            <article className="summary-card">
              <div className="card-top">
                <span className="card-label">Total income</span>
                <span className="card-icon income-icon">
                  <ArrowDownRight size={19} />
                </span>
              </div>
              <h2>{formatMoney(totalIncome)}</h2>
              <div className="card-footer">
                <span className="trend positive">
                  <ArrowUpRight size={15} /> 8.2%
                </span>
                <span>vs. last month</span>
              </div>
              <div className="mini-bars income-bars">
                {[35, 55, 42, 70, 48, 80, 62, 100, 73, 90, 66, 84].map(
                  (height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  )
                )}
              </div>
            </article>

            <article className="summary-card">
              <div className="card-top">
                <span className="card-label">Total expenses</span>
                <span className="card-icon expense-icon">
                  <ArrowUpRight size={19} />
                </span>
              </div>
              <h2>{formatMoney(totalExpenses)}</h2>
              <div className="card-footer">
                <span className="trend negative">
                  <ArrowUpRight size={15} /> 4.3%
                </span>
                <span>vs. last month</span>
              </div>
              <div className="mini-bars expense-bars">
                {[70, 45, 65, 35, 82, 55, 72, 48, 92, 62, 78, 52].map(
                  (height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  )
                )}
              </div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel spending-panel">
              <div className="panel-heading">
                <div>
                  <h3>Spending overview</h3>
                  <p>Understand where your money goes.</p>
                </div>
                <select defaultValue="month" aria-label="Spending period">
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
              </div>

              <div className="spending-total">
                <strong>₹ 18,400</strong>
                <span className="spending-change">
                  <ArrowDownRight size={15} /> 4.3% less than last month
                </span>
              </div>

              <div className="chart-area">
                <div className="chart-y-labels">
                  <span>₹10k</span>
                  <span>₹7.5k</span>
                  <span>₹5k</span>
                  <span>₹2.5k</span>
                  <span>₹0</span>
                </div>
                <div className="chart">
                  <div className="chart-grid-lines">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <span key={line} />
                    ))}
                  </div>
                  <svg
                    className="chart-svg"
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Illustrative weekly spending chart"
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b83ff" stopOpacity=".23" />
                        <stop offset="100%" stopColor="#8b83ff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,145 C28,138 45,118 75,125 S125,155 150,112 S200,94 225,111 S275,65 300,82 S350,130 375,95 S425,70 450,87 S500,35 525,58 S575,48 600,24 L600,200 L0,200 Z"
                      fill="url(#areaGradient)"
                    />
                    <path
                      d="M0,145 C28,138 45,118 75,125 S125,155 150,112 S200,94 225,111 S275,65 300,82 S350,130 375,95 S425,70 450,87 S500,35 525,58 S575,48 600,24"
                      fill="none"
                      stroke="#766af5"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx="525" cy="58" r="5" fill="#fff" stroke="#766af5" strokeWidth="3" />
                  </svg>
                  <div className="chart-x-labels">
                    {["01", "05", "10", "15", "20", "25", "30"].map((day) => (
                      <span key={day}>{day} Oct</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                <span><i className="legend-dot actual-dot" /> This month</span>
                <span><i className="legend-dot previous-dot" /> Previous month</span>
              </div>
            </article>

            <article className="panel categories-panel">
              <div className="panel-heading">
                <div>
                  <h3>Spending by category</h3>
                  <p>Your biggest expense areas.</p>
                </div>
                <button
                  className="more-button"
                  onClick={() => setActivePage("Analytics")}
                  aria-label="View category analytics"
                >
                  •••
                </button>
              </div>

              <div className="category-chart-wrap">
                <div className="donut-chart">
                  <div className="donut-hole">
                    <span>Total spent</span>
                    <strong>₹18.4k</strong>
                  </div>
                </div>
              </div>

              <div className="category-list">
                {expenses.map((expense) => (
                  <div className="category-row" key={expense.name}>
                    <div className="category-name">
                      <i style={{ background: expense.color }} />
                      <span>{expense.name}</span>
                    </div>
                    <strong>{formatMoney(expense.amount)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <h3>Recent transactions</h3>
                <p>A little overview of your latest activity.</p>
              </div>
              <button
                className="text-button"
                onClick={() => setActivePage("Transactions")}
              >
                View all <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="transaction-table">
              <div className="transaction-header">
                <span>TRANSACTION</span>
                <span>CATEGORY</span>
                <span>DATE</span>
                <span className="amount-heading">AMOUNT</span>
              </div>

             {transactionList.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div className="transaction-row" key={transaction.id}>
                    <div className="transaction-main">
                      <span className={`transaction-icon ${transaction.color}`}>
                        <Icon size={18} />
                      </span>
                      <strong>{transaction.name}</strong>
                    </div>
                    <span className="transaction-category">
                      {transaction.category}
                    </span>
                    <span className="transaction-date">{transaction.date}</span>
                    <strong
                      className={`transaction-amount ${
                        transaction.amount > 0 ? "amount-positive" : ""
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : "−"}
                      {formatMoney(Math.abs(transaction.amount)).replace("₹", "₹ ")}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>© 2026 Vaultly. Made for mindful money management.</span>
            <span><i className="footer-status" /> All systems operational</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
