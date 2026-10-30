const { errorResponse } = require('../utils/response');

const validate = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);
    if (!isValid) {
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    next();
  };
};

module.exports = { validate };
