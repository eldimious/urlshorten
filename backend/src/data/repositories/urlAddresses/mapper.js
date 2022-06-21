const UrlAddress = require('../../../domain/urlAddresses/model');

const toDomainModel = function toDomainModel(databaseDoc) {
  return new UrlAddress({
    id: databaseDoc.id,
    url: databaseDoc.url,
    shortcode: databaseDoc.shortcode,
    startDate: databaseDoc.start_date,
    updatedAt: databaseDoc.updated_at,
    lastSeenDate: databaseDoc.last_seen_date,
    redirectCount: databaseDoc.redirect_count,
  });
};

module.exports = {
  toDomainModel,
};
