import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import AddExpensesModal from "../modals/AddExpensesModal";
import ReactMarkdown from "react-markdown"; // Import React Markdown

const ExpensesPage = () => {
  const { token, user } = useUser();
  const currentUser = user.user;
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    merchant: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    merchant: "",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
    userId: currentUser._id,
  });
  // New state for expense insights
  const [expenseInsight, setExpenseInsight] = useState({
    tip: "Loading personalized expense insights...",
    loading: true,
    error: null,
  });

  // Payment method options
  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Gcash",
    "Maya",
  ];

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/expense?userId=${currentUser._id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Expenses data:", response.data);
        setExpenses(response.data.expense || []);
        setFilteredExpenses(response.data.expense || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        // alert("Failed to fetch expenses. Please try again.");
      }
    };

    fetchExpenses();
  }, [currentUser._id, token]);

  // Fetch budget categories for dropdown
  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/budget?userId=${currentUser._id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setBudgetCategories(response.data);
      } catch (error) {
        console.error("Error fetching budget categories:", error);
      }
    };

    fetchBudgetCategories();
  }, [currentUser._id, token]);

  // Fetch expense insights
  useEffect(() => {
    const fetchExpenseInsights = async () => {
      try {
        setExpenseInsight((prev) => ({ ...prev, loading: true, error: null }));

        // Make POST request to /insight/expense with empty body
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/insight/expense`,
          {}, // Empty body
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Expense insights response:", response.data.reply);
        // Update state with the response data
        setExpenseInsight({
          tip:
            response.data.reply ||
            "You could save money by reviewing your spending patterns.",
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching expense insights:", error);
        setExpenseInsight({
          tip: "Unable to load expense insights at this time.",
          loading: false,
          error: error.message || "An error occurred",
        });
      }
    };

    // Call the function when component mounts
    fetchExpenseInsights();
  }, [token]); // Only depends on token

  const applyFilters = () => {
    let filtered = expenses;
    if (filters.date) {
      filtered = filtered.filter(
        (expense) => expense.date && expense.date.split("T")[0] === filters.date
      );
    }
    if (filters.category) {
      filtered = filtered.filter(
        (expense) =>
          expense.category && expense.category._id === filters.category
      );
    }
    if (filters.merchant) {
      filtered = filtered.filter((expense) =>
        expense.description
          ? expense.description
              .toLowerCase()
              .includes(filters.merchant.toLowerCase())
          : false
      );
    }
    setFilteredExpenses(filtered);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async () => {
    try {
      const payload = {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(),
        amount: parseFloat(newExpense.amount),
      };

      console.log("Payload for new expense:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/expense?userId=${currentUser._id}`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Expense added:", response.data);

      // Refresh expenses after adding
      const updatedResponse = await axios.get(
        `${import.meta.env.VITE_URL}/expense?userId=${currentUser._id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setExpenses(updatedResponse.data.expense || []);
      setFilteredExpenses(updatedResponse.data.expense || []);

      // Reset form and close modal
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        merchant: "",
        paymentMethod: "Cash",
        date: new Date().toISOString().split("T")[0],
        userId: currentUser._id,
      });
      closeModal();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="md:ml-64 min-h-screen p-4 sm:p-6">
      {/* Spending Summary Card with AI Tip */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-[10px] border-2 border-[#6147AA] shadow-md mb-6 sm:mb-8">
        <h2 className="text-lg font-bold">Spending Summary</h2>
        <p>Total Spent: ₱{totalSpent.toLocaleString()}</p>

        {/* Display AI Tip with loading state and Markdown */}
        <div className="mt-2">
          {expenseInsight.loading ? (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-[#6147AA] rounded-full"></div>
              <p>Loading AI insights...</p>
            </div>
          ) : expenseInsight.error ? (
            <p className="text-red-500 text-sm">
              Error loading AI tip: {expenseInsight.error}
            </p>
          ) : (
            <div className="flex items-start">
              <span
                role="img"
                aria-label="bulb"
                className="mr-2 text-xl mt-0.5"
              >
                💡
              </span>
              <div className="text-sm flex-1">
                <span className="font-semibold block mb-1">AI Tip:</span>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown>{expenseInsight.tip}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          className="border-2 border-[#6147AA] rounded-[10px] px-4 py-2 flex-grow min-w-[150px]"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <select
          className="border-2 border-[#6147AA] rounded-[10px] px-4 py-2 flex-grow min-w-[150px]"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Filter by Category</option>
          {budgetCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by Merchant/Description"
          className="border-2 border-[#6147AA] rounded-[10px] px-4 py-2 flex-grow min-w-[200px]"
          value={filters.merchant}
          onChange={(e) => setFilters({ ...filters, merchant: e.target.value })}
        />
        <button
          className="bg-[#6147AA] text-white px-4 py-2 rounded-[10px] flex-grow-0 min-w-[120px]"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-[10px] flex-grow-0 min-w-[120px]"
          onClick={() => {
            setFilters({ date: "", category: "", merchant: "" });
            setFilteredExpenses(expenses);
          }}
        >
          Clear Filters
        </button>
        <button
          className="bg-[#6147AA] text-white px-4 py-2 rounded-[10px] flex-grow-0 min-w-[120px]"
          onClick={openModal}
        >
          Add New Expense
        </button>
      </div>

      {/* Recent Expenses Table */}
      <div className="mt-8 overflow-x-auto">
        <h2 className="text-black text-xl font-bold mb-4">Recent Expenses</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border border-gray-300 px-4 py-2">Item</th>
              <th className="border border-gray-300 px-4 py-2">Merchant</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses && filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {expense.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {expense.merchant}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₱{expense.amount.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="text-primary">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No expenses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <AddExpensesModal
        isOpen={isModalOpen}
        onClose={closeModal}
        newExpense={newExpense}
        handleChange={handleChange}
        handleAddExpense={handleAddExpense}
        budgetCategories={budgetCategories}
        paymentMethods={paymentMethods}
      />
    </div>
  );
};

export default ExpensesPage;
