import { body, validationResult } from 'express-validator';


//  login middleware
export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ✅ Middleware to Validate Driver Creation Request
export const validateDriver = [
  // 🚀 Check if `driverName` is a non-empty string
  body("driverName")
    .trim()
    .notEmpty()
    .withMessage("Driver name is required")
    .isString()
    .withMessage("Driver name must be a string"),

  // 🚀 Validate `phoneNo` as a 10-digit number
  body("phoneNo")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be a 10-digit numeric value"),

  // 🚀 Ensure `vehicleId` is a valid integer
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .isInt()
    .withMessage("Vehicle ID must be a valid number"),

  // ✅ Middleware to check for errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // ✅ Proceed to controller if no errors
  }
];
