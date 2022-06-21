const Sequelize = require('sequelize');
const moment = require('moment');

function getUpdatedDocResponse(res, message = 'Doc did not found.') {
  if (!res || res == 0) {
    throw new Error(message);
  }
  if (!Array.isArray(res) || res.length < 2 || !Array.isArray(res[1]) || res[1].length <= 0) {
    throw new Error(message);
  }
  return res[1][0].dataValues;
}

const usersDataStore = {
  async getUrlAddress({
    url,
    shortcode,
    transaction,
    attributes = [],
    lock,
  }) {
    const {
      urlAddress: urlAddressModel,
    } = this.getDbModels();
    if (!url && !shortcode) {
      throw new Error('Add url or shortcode to get url address entity.');
    }
    const res = await urlAddressModel.findOne({
      where: ({
        ...(url && { url }),
        ...(shortcode && { shortcode }),
      }),
      attributes: attributes && Array.isArray(attributes) && attributes.length > 0
        ? attributes
        : { exclude: [] },
      ...(lock != null && { lock }),
      ...(transaction != null && { transaction }),
    });
    if (!res) {
      return null;
    }
    return res.get({ plain: true });
  },
  async createUrlAddress({
    url,
    shortcode,
    transaction,
  }) {
    const {
      urlAddress: urlAddressModel,
    } = this.getDbModels();
    const res = await urlAddressModel.create({
      url,
      shortcode,
    }, {
      ...(transaction != null && { transaction }),
    });
    return res.get({ plain: true });
  },
  async updateUrlAddress({
    url,
    shortcode,
    lock,
    transaction,
  }) {
    const {
      urlAddress: urlAddressModel,
    } = this.getDbModels();
    if (!shortcode && !url) {
      throw new Error('Add url or shortcode to get url address entity.');
    }
    const res = await urlAddressModel.update(({
      redirect_count: Sequelize.literal('"url_addresses"."redirect_count"+1'),
      last_seen_date: moment.utc().toISOString(),
    }), {
      where: ({
        ...(url && { url }),
        ...(shortcode && { shortcode }),
      }),
      returning: true,
      limit: 1,
      ...(lock != null && { lock }),
      ...(transaction != null && { transaction }),
    });
    return getUpdatedDocResponse(res, 'Url address not has not been updated.');
  },
};

module.exports.init = function init({
  urlAddress,
}) {
  return Object.assign(Object.create(usersDataStore), {
    getDbModels() {
      return {
        urlAddress,
      };
    },
  });
};
