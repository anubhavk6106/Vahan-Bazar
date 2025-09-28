import { body, validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Support ticket validation rules
const supportTicketValidationRules = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters')
    .trim(),
  
  body('category')
    .isIn(['account', 'vehicles', 'booking', 'payment', 'technical', 'feedback', 'other'])
    .withMessage('Invalid category selected'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level'),
  
  body('message')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .trim(),
  
  body('user_id')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format')
];

// FAQ validation rules
const faqValidationRules = [
  body('question')
    .isLength({ min: 10, max: 500 })
    .withMessage('Question must be between 10 and 500 characters')
    .trim(),
  
  body('answer')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Answer must be between 20 and 2000 characters')
    .trim(),
  
  body('category')
    .isIn(['general', 'account', 'vehicles', 'booking', 'payment', 'technical', 'policies'])
    .withMessage('Invalid category selected'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .trim(),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
  
  body('sort_order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  
  body('created_by')
    .optional()
    .isUUID()
    .withMessage('Invalid created_by user ID format'),
  
  body('updated_by')
    .optional()
    .isUUID()
    .withMessage('Invalid updated_by user ID format')
];

// User registration validation rules
const userRegistrationRules = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Invalid role specified')
];

// User login validation rules
const userLoginRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Vehicle validation rules
const vehicleValidationRules = [
  body('make')
    .isLength({ min: 2, max: 50 })
    .withMessage('Make must be between 2 and 50 characters')
    .trim(),
  
  body('model')
    .isLength({ min: 2, max: 50 })
    .withMessage('Model must be between 2 and 50 characters')
    .trim(),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('mileage')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  
  body('fuel_type')
    .optional()
    .isIn(['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'])
    .withMessage('Invalid fuel type'),
  
  body('transmission')
    .optional()
    .isIn(['manual', 'automatic', 'cvt', 'dsg'])
    .withMessage('Invalid transmission type'),
  
  body('color')
    .optional()
    .isLength({ min: 2, max: 30 })
    .withMessage('Color must be between 2 and 30 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters')
    .trim(),
  
  body('location')
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters')
    .trim(),
  
  body('condition')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition specified')
];

// Booking validation rules
const bookingValidationRules = [
  body('vehicle_id')
    .isUUID()
    .withMessage('Invalid vehicle ID format'),
  
  body('test_drive_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid test drive date format'),
  
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters')
    .trim(),
  
  body('contact_phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number')
];

// Export validation middleware functions
export const validateSupportTicket = [
  ...supportTicketValidationRules,
  handleValidationErrors
];

export const validateFAQ = [
  ...faqValidationRules,
  handleValidationErrors
];

export const validateUserRegistration = [
  ...userRegistrationRules,
  handleValidationErrors
];

export const validateUserLogin = [
  ...userLoginRules,
  handleValidationErrors
];

export const validateVehicle = [
  ...vehicleValidationRules,
  handleValidationErrors
];

export const validateBooking = [
  ...bookingValidationRules,
  handleValidationErrors
];

export { handleValidationErrors };