const UrlAddressContainer = require('./UrlAddress');

module.exports.init = (sequelize) => ({
  urlAddress: UrlAddressContainer.init(sequelize),
});
