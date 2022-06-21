const { customAlphabet } = require('nanoid');
const logging = require('../../common/logging');
const {
  URL_ADDRESS_NOT_FOUND_ERROR,
} = require('../../common/constants');

function init({
  urlAddressesRepository,
  runTransaction,
}) {
  const urlAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(urlAlphabet, 6);

  async function createUrlAddress(url, shortcode) {
    const address = await urlAddressesRepository.createUrlAddress({
      url,
      shortcode: shortcode || nanoid(),
    });
    return address.toCreateUrlAddressResponse();
  }

  async function getUrlAddress(shortcode) {
    return runTransaction(async (t) => {
      const urlAddress = await urlAddressesRepository.getUrlAddress({
        shortcode,
        transaction: t,
      });
      if (urlAddress == null) {
        throw new Error(URL_ADDRESS_NOT_FOUND_ERROR);
      }
      await urlAddressesRepository.updateUrlAddress({
        shortcode,
        transaction: t,
      });
      return urlAddress;
    });
  }

  async function getUrlAddressStats(shortcode) {
    const urlAddress = await urlAddressesRepository.getUrlAddress({
      shortcode,
    });
    if (urlAddress == null) {
      throw new Error(URL_ADDRESS_NOT_FOUND_ERROR);
    }
    return urlAddress.toUrlAddressStatsResponse();
  }

  return {
    createUrlAddress,
    getUrlAddress,
    getUrlAddressStats,
  };
}

module.exports.init = init;
