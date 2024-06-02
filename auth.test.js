const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Mock the User.findById function
jest.mock("../models/user", () => ({
  findById: jest.fn(),
}));

// Mock the jwt.verify function
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

// Import the middleware function
const { isAuthenticatedUser } = require("/c:/Users/SURINENI SATHVIK TEJ/Desktop/db/middleware/auth");

describe("isAuthenticatedUser middleware", () => {
  test("should set req.user with the user data from decoded token", async () => {
    const req = {
      headers: {
        authorization: "Bearer token",
      },
    };
    const res = {};
    const next = jest.fn();

    const decodedData = {
      id: "user_id",
    };

    // Mock the jwt.verify function to return the decodedData
    jwt.verify.mockReturnValue(decodedData);

    // Mock the User.findById function to return the user data
    const userData = { name: "John Doe" };
    User.findById.mockResolvedValue(userData);

    await isAuthenticatedUser(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("token", process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith("user_id");
    expect(req.user).toBe(userData);
    expect(next).toHaveBeenCalled();
  });
});