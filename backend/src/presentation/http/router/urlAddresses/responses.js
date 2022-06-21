/* eslint-disable max-classes-per-file */
class UrlAddressStatsResponse {
  constructor({
    startDate,
    lastSeenDate,
    redirectCount,
  } = {}) {
    this.startDate = startDate;
    this.lastSeenDate = lastSeenDate;
    this.redirectCount = redirectCount;
  }
}

class CreateUrlAddressResponse {
  constructor({
    shortcode,
  } = {}) {
    this.shortcode = shortcode;
  }
}

module.exports = {
  UrlAddressStatsResponse,
  CreateUrlAddressResponse,
};
