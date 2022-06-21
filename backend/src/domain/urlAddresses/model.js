const {
  UrlAddressStatsResponse,
  CreateUrlAddressResponse,
} = require('../../presentation/http/router/urlAddresses/responses');

class UrlAddress {
  constructor({
    id,
    url,
    shortcode,
    startDate,
    updatedAt,
    lastSeenDate,
    redirectCount,
  } = {}) {
    this.id = id;
    this.url = url;
    this.shortcode = shortcode;
    this.startDate = startDate;
    this.updatedAt = updatedAt;
    this.lastSeenDate = lastSeenDate;
    this.redirectCount = redirectCount;
  }

  toUrlAddressStatsResponse() {
    return new UrlAddressStatsResponse({
      startDate: this.startDate,
      lastSeenDate: this.lastSeenDate,
      redirectCount: this.redirectCount,
    });
  }

  toCreateUrlAddressResponse() {
    return new CreateUrlAddressResponse({
      shortcode: this.shortcode,
    });
  }
}

module.exports = UrlAddress;
