const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const authHeader = req.headers.authorization;
// console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const token = authHeader.split(" ")[1];

  const decodedData = jwt.verify(token,process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});
