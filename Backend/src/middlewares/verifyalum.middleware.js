import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const verifyAlum = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "alumni") {
    throw new ApiError(403, "Unauthorized access, Alum role is required");
  }
  next();
});