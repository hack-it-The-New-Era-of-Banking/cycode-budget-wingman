import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import ExpensesBarChart from "../components/dashboard/ExpensesBarChart";
import BalanceLineChart from "../components/dashboard/BalanceLineChart";

const DashboardPage = (props) => {
  const { user } = useUser();
  const currentUser = user.user;

  const [showInterestsModal, setShowInterestsModal] = useState(true); // Show modal by default after signing up
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    { id: 1, name: "Sports", icon: "⚽" },
    { id: 2, name: "Music", icon: "🎵" },
    { id: 3, name: "Travel", icon: "✈️" },
    { id: 4, name: "Art", icon: "🎨" },
    { id: 5, name: "Technology", icon: "💻" },
    { id: 6, name: "Food", icon: "🍔" },
    { id: 7, name: "Video Games", icon: "🎮" },
    { id: 8, name: "Comics and Manga", icon: "📚" },
    { id: 9, name: "Self-Care", icon: "🛀" },
    { id: 10, name: "Travelling", icon: "🌍" },
    { id: 11, name: "Home Decorations", icon: "🏠" },
    { id: 12, name: "Sneaker Collecting", icon: "👟" },
  ];

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((interest) => interest !== id) : [...prev, id]
    );
  };

  const handleInterestsSubmit = () => {
    console.log("Selected Interests:", selectedInterests);
    setShowInterestsModal(false); // Close the modal after submission
  };

  const handleInterestsClose = () => {
    setShowInterestsModal(false); // Close the modal without submission
  };

  useEffect(() => {
    console.log(currentUser); // Log the current user object
  }, [currentUser]);

  return (
    <>
      {showInterestsModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md sm:max-w-lg lg:max-w-xl border-2 border-[#6147AA] rounded-xl shadow-lg mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h2 className="text-lg font-bold mb-4 text-[#6147AA]">Select Your Interests</h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose your interests to personalize your experience.
              </p>

              {/* Interests Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {interests.map((interest) => (
                  <div
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer ${
                      selectedInterests.includes(interest.id)
                        ? "border-[#6147AA] bg-[#F3E8FF]"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="text-3xl mb-2">{interest.icon}</span>
                    <p className="text-sm font-semibold text-gray-700">{interest.name}</p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-gray-200 text-black px-4 py-2 rounded-[10px] border border-gray-300 hover:bg-gray-300"
                  onClick={handleInterestsClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#6147AA] text-white px-4 py-2 rounded-[10px] hover:bg-[#503a8c]"
                  onClick={handleInterestsSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:ml-64 relative z-10">
        {/* Dashboard Greetings */}
        <div className="mb-4">
          <h1 className="">Hi, {currentUser.firstName}</h1>
          <p>Here's what's happening to your finances👋</p>
        </div>

        {/* Dashboard AI Insight */}
        <div className="h-40 border-2 mb-4 border-primary rounded-lg"></div>

        {/* Dashboard Summary */}
        <div className="flex gap-4">
          <div className="dashboard-summary">
            <p className="title">Total Budget: $10k</p>
          </div>
          <div className="dashboard-summary">
            <p className="title">Total Expenses: $10k</p>
          </div>
          <div className="dashboard-summary">
            <p className="title">Total Savings: $10k</p>
          </div>
        </div>

        {/* Dashboard Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
          <div className="border-2 border-primary rounded-lg p-4">
            <p className="title">Expenses Last 7 days</p>
            <ExpensesBarChart />
          </div>
          <div className="border-2 border-primary rounded-lg p-4">
            <p className="title">Balance for months</p>
            <BalanceLineChart />
          </div>
        </div>

        {/* User Budgets */}
        <div className="mb-4">
          <h2 className="mb-4">Budgets</h2>
          <div className="flex flex-wrap gap-4">
            <div className="border-2 border-primary rounded-lg p-2 flex-grow justify-start items-start min-w-80">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-[#D9D9D9] border-2 border-[#6147AA] rounded-full flex items-center justify-center mr-[15px]">
                    <span role="img" aria-label="icon">
                      📊
                    </span>
                  </div>
                  <p className="title">Groceries</p>
                </div>
                <div className="relative w-full h-2 bg-gray-200 rounded-lg">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-lg"
                    style={{ width: "32%" }} // Replace with dynamic value if needed
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Expenses Summary */}
        <div className="mb-4">
          <h2 className="mb-4">Recent Expenses</h2>
          <div className="overflow-x-auto">
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
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Coffee</td>
                  <td className="border border-gray-300 px-4 py-2">Starbucks</td>
                  <td className="border border-gray-300 px-4 py-2">2023-03-01</td>
                  <td className="border border-gray-300 px-4 py-2">$5.00</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="text-primary">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Groceries</td>
                  <td className="border border-gray-300 px-4 py-2">Walmart</td>
                  <td className="border border-gray-300 px-4 py-2">2023-03-02</td>
                  <td className="border border-gray-300 px-4 py-2">$50.00</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button className="text-primary">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
