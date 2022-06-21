const express = require('express');
const logging = require('../../../../common/logging');
const {
  validateCreateUrlAddressDto,
  validateGetUrlAddressDto,
} = require('../../middleware/endpointValidator');
const errors = require('../../../../common/errors');
const {
  SHORTCODE_IN_USE_ERROR_MSG,
  URL_ADDRESS_IN_USE_ERROR_MSG,
  URL_ADDRESS_VALIDATION_ERROR_MSG,
  URL_ADDRESS_NOT_FOUND_ERROR,
} = require('../../../../common/constants');

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true });

function init({ urlAddressesService }) {
  router.post(
    '/',
    validateCreateUrlAddressDto(),
    async (req, res, next) => {
      try {
        const response = await urlAddressesService.createUrlAddress(req.body.url, req.body.shortcode);
        return res.status(201).send({
          shortcode: response.shortcode,
        });
      } catch (error) {
        logging.error('Route POST /shorten error', error);
        if (error.message === SHORTCODE_IN_USE_ERROR_MSG
          || error.message === URL_ADDRESS_IN_USE_ERROR_MSG
          || error.message === URL_ADDRESS_VALIDATION_ERROR_MSG) {
          return next(new errors[409](error.message));
        }
        return next(error);
      }
    },
  );

  router.get(
    '/:shortcode',
    validateGetUrlAddressDto(),
    async (req, res, next) => {
      try {
        const response = await urlAddressesService.getUrlAddress(req.params.shortcode);
        return res.redirect(302, response.url);
      } catch (error) {
        logging.error('Route GET /shorten/:shortcode error', error);
        if (error.message === URL_ADDRESS_NOT_FOUND_ERROR) {
          return next(new errors[404](error.message));
        }
        return next(error);
      }
    },
  );

  router.get(
    '/:shortcode/stats',
    validateGetUrlAddressDto(),
    async (req, res, next) => {
      try {
        const response = await urlAddressesService.getUrlAddressStats(req.params.shortcode);
        return res.status(200).send(response);
      } catch (error) {
        logging.error('Route POST /shorten error', error);
        if (error.message === URL_ADDRESS_NOT_FOUND_ERROR) {
          return next(new errors[404](error.message));
        }
        return next(error);
      }
    },
  );

  return router;
}

module.exports.init = init;
