const Income = require("../../models/Main/Income");
const User = require("../../models/User/User");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get Income by Id
const income_get = catchAsync(async (req, res, next) => {
  const { id, userId } = req.query;

  let income;

  if (!id && !userId) return next(new AppError("Income identifier not found", 400));

  id ? income = await Income.findById(id)
  .populate("userId") : income = await Income.find({userId: userId})
  .populate("userId");

  if (!income)
    return next(new AppError("Income not found. Invalid Income Identifier.", 404));

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let totalIncomeSum = 0;

  if (Array.isArray(income)) {
    income = income
      .filter((item) => {
        const incomeDate = new Date(item.dateReceived);
        return (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      })
      .map((item) => {
        const totalIncome = item.earnedIncome + item.additionalCompensation;
        totalIncomeSum += totalIncome;
        return {
          ...item.toObject(),
          totalIncome,
        };
      });
  } else {
    const incomeDate = new Date(income.dateReceived);
    if (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    ) {
      const totalIncome = income.earnedIncome + income.additionalCompensation;
      totalIncomeSum = totalIncome;
      income = {
        ...income.toObject(),
        totalIncome,
      };
    } else {
      income = null;
    }
  }

  return res
    .status(200)
    .json({ message: "Income Successfully Fetched", totalIncomeSum, income});
});

// Create Income
const income_post = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const { jobTitle, earnedIncome, additionalCompensation, category, dateReceived } = req.body;

  const isUserValid = await User.findById(userId);

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  if (
    !jobTitle &&
    !earnedIncome &&
    !additionalCompensation &&
    !category && !dateReceived
  ) {
    return next(new AppError("Cannot create income, empty income.", 400));
  }
  
  const newIncome = new Income({
    userId, jobTitle, earnedIncome, additionalCompensation, category, dateReceived
  });

  await User.findByIdAndUpdate(
    userId,
    { $push: { income: newIncome._id } },
    { new: true }
  );

  await newIncome.save();

  return res
    .status(200)
    .json({ message: "Income Successfully Created", newIncome });
});

// Update Income
const income_put = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const { jobTitle, earnedIncome, additionalCompensation, category, dateReceived } =
    req.body;

  if (!id) return next(new AppError("Income identifier not found", 400));

  if (
    !jobTitle &&
    !earnedIncome &&
    !additionalCompensation &&
    !category && !dateReceived
  ) {
    return next(new AppError("No data to update", 400));
  }

  const income = await Income.findById(id);

  if (!income) {
    return next(new AppError("Income not found. Invalid Income ID.", 404));
  }

  let updates = {};

  if (jobTitle) updates.jobTitle = jobTitle;
  if (earnedIncome) updates.earnedIncome = earnedIncome;
  if (additionalCompensation) updates.additionalCompensation = additionalCompensation;
  if (category) updates.category = category;
  if (dateReceived) updates.dateReceived = dateReceived;

  const updatedIncome = await Income.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedIncome) {
    return next(new AppError("Income not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Income Updated Successfully", updatedIncome });
});

// Delete Income
const income_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Income identifier not found", 400));

  const income = await Income.findById(id);
  if (!income) return next(new AppError("Income not found", 404));

  if(income.userId.toString() !== req.userId) {
    return next(new AppError("You are not authorized to delete this budget category", 403));
  }

  const deletedIncome = await Income.findByIdAndDelete(id);

  if (!deletedIncome) return next(new AppError("Income not found", 404));

  return res
    .status(200)
    .json({ message: "Income Successfully Deleted", deletedIncome });
});

module.exports = {
  income_get,
  income_post,
  income_put,
  income_delete,
};