const throwHttpErrors = require('throw-http-errors');

const httpErrors = throwHttpErrors.default;

const isCustomError = (error) => {
  if (Object.keys(httpErrors).includes(error.name) || (error.status && Object.keys(httpErrors).includes(error.status.toString()))) {
    return true;
  }

  return false;
};

module.exports = {
  ...httpErrors,
  isCustomError,
};
