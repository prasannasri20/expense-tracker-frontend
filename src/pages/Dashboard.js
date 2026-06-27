import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../components/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/transactions");
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addExpense = async () => {
    if (!category || !type || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await api.put(`/transaction/${editId}`, {
          id: editId,
          category,
          type,
          amount,
          date,
        });
      } else {
        await api.post("/transaction", {
          category,
          type,
          amount,
          date,
        });
      }

      fetchExpenses();

      setCategory("");
      setType("");
      setAmount("");
      setDate("");
      setEditId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const editExpense = (expense) => {
    setEditId(expense.id);
    setCategory(expense.category);
    setType(expense.type);
    setAmount(expense.amount);
    setDate(expense.date);
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/transaction/${id}`);
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalIncome = expenses
    .filter((exp) => exp.type && exp.type.toLowerCase() === "income")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const totalExpense = expenses
    .filter((exp) => exp.type && exp.type.toLowerCase() === "expense")
    .reduce((sum, exp) => sum + Number(exp.amount), 0);

  const balance = totalIncome - totalExpense;


  const filteredExpenses = expenses.filter((exp) => {
  const matchesFilter =
    filter === "all" || exp.type.toLowerCase() === filter;

  const matchesSearch =
    exp.category.toLowerCase().includes(search.toLowerCase());

  const matchesDate =
    selectedDate === "" || exp.date === selectedDate;

  return matchesFilter && matchesSearch && matchesDate;
});
  return (
    <div className="dashboard">

      <div className="header">
        <h1>Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="summary">

        <div className="card income-card">
          <h3>Total Income</h3>
          <h2>₹{totalIncome}</h2>
        </div>

        <div className="card expense-card">
          <h3>Total Expense</h3>
          <h2>₹{totalExpense}</h2>
        </div>

        <div className="card balance-card">
          <h3>Balance</h3>
          <h2>₹{balance}</h2>
        </div>

      </div>

      <hr />

      <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>

      <div className="form">

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Type (Income/Expense)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="add-btn" onClick={addExpense}>
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>

      </div>

      <hr />
        <div className="filters">

  <input
    type="text"
    placeholder="Search by category"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">All</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

</div>

      <h3>Transaction List</h3>

      {expenses.length === 0 ? (
        <p>No Transactions Found</p>
      ) : (
        filteredExpenses.map((exp) => (
          <div className="transaction" key={exp.id}>

            <span>
              <strong>{exp.category}</strong> | ₹{exp.amount} | {exp.type} | {exp.date}
            </span>

            <div>
              <button onClick={() => editExpense(exp)}>
                Edit
              </button>

              <button onClick={() => deleteExpense(exp.id)}>
                Delete
              </button>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Dashboard;