/* eslint-disable no-return-assign */
/* eslint-disable no-const-assign */
/* eslint-disable no-underscore-dangle */
const {
  body,
  param,
  validationResult,
} = require('express-validator');
const errorHandler = require('../router/errors/routes');
const errors = require('../../../common/errors');
const {
  SHORTCODE_REGEX,
} = require('../../../common/constants');

const validate = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }
  const validationError = validationErrors.array({
    onlyFirstError: true,
  })[0];
  const errMsg = validationError?.msg?.message || 'Bad request';
  const errStatus = validationError?.msg?.status || 400;
  return errorHandler(new errors[errStatus](errMsg, 'BAD_BODY_PARAMS'), req, res, next);
};

module.exports = {
  validateCreateUrlAddressDto: () => [
    (() => [
      body('url')
        .exists()
        .withMessage({
          message: 'url not provided. Make sure you have a "url" property in your body params.',
          status: 400,
        })
        .isURL()
        .withMessage({
          message: 'url not provided. Make sure you have a "url" property with correct format in your body params.',
          status: 400,
        }),
      body('shortcode')
        .optional()
        .matches(SHORTCODE_REGEX)
        .withMessage({
          message: 'shortcode does not have correct format. Make sure you have a "shortcode" property with correct format in your body params.',
          status: 422,
        }),
    ])(),
    validate,
  ],

  validateGetUrlAddressDto: () => [
    (() => [
      param('shortcode')
        .optional()
        .matches(SHORTCODE_REGEX)
        .withMessage({
          message: 'shortcode does not have correct format. Make sure you have a "shortcode" property with correct format in your body params.',
          status: 422,
        }),
    ])(),
    validate,
  ],

};
