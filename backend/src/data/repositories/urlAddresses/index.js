const mapper = require('./mapper');
const logging = require('../../../common/logging');

module.exports.init = (dataStores) => {
  const { urlAddressesDataStore } = dataStores;

  const urlAddressesRepository = {
    async createUrlAddress({
      url,
      shortcode,
      transaction,
    }) {
      try {
        const urlAddressEntity = await urlAddressesDataStore.createUrlAddress({
          url,
          shortcode,
          transaction,
        });
        return mapper.toDomainModel(urlAddressEntity);
      } catch (e) {
        logging.error('Create url address failed with error:', e);
        throw e;
      }
    },

    async updateUrlAddress({
      url,
      shortcode,
      lock,
      transaction,
    }) {
      try {
        const urlAddressEntity = await urlAddressesDataStore.updateUrlAddress({
          url,
          shortcode,
          lock,
          transaction,
        });
        return mapper.toDomainModel(urlAddressEntity);
      } catch (e) {
        logging.error('Update url address failed with error:', e);
        throw e;
      }
    },

    async getUrlAddress({
      url,
      shortcode,
      transaction,
    }) {
      try {
        const urlAddressEntity = await urlAddressesDataStore.getUrlAddress({
          url,
          shortcode,
          transaction,
        });
        if (!urlAddressEntity) { return null; }
        return mapper.toDomainModel(urlAddressEntity);
      } catch (e) {
        logging.error('Get url address failed with error:', e);
        throw e;
      }
    },
  };

  return Object.create(urlAddressesRepository);
};
