import { validationResult } from "express-validator";
import { badRequest } from "../utils/apiResponse.js";

// Runs after an array of express-validator checks.
// If any check failed, respond 400 with the error list.
// Otherwise call next().
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return badRequest(res, "Validation failed", formatted);
  }
  next();
};

export default validate;