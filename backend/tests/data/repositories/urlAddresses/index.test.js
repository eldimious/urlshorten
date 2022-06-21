/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const moment = require('moment');
const urlAddressesRepositoryContainer = require('../../../../src/data/repositories/urlAddresses');
const urlAddressesDataStoreContainer = require('../../../../src/data/repositories/urlAddresses/dataStore');

const db = {
  schemas: {},
};

const urlAddress = {
  id: 1,
  url: 'https://test.com',
  shortcode: 'test1',
  start_date: moment.utc().toISOString(),
  updated_at: moment.utc().toISOString(),
  last_seen_date: moment.utc().toISOString(),
  redirect_count: 1,
};

const urlAddressesDataStore = urlAddressesDataStoreContainer.init(db.schemas);
const urlAddressesRepository = urlAddressesRepositoryContainer.init({
  urlAddressesDataStore,
});

describe('post repository test', () => {
  beforeEach(() => {
    sinon.stub(urlAddressesDataStore, 'createUrlAddress');
    sinon.stub(urlAddressesDataStore, 'updateUrlAddress');
    sinon.stub(urlAddressesDataStore, 'getUrlAddress');
  });

  afterEach(() => {
    urlAddressesDataStore.createUrlAddress.restore();
    urlAddressesDataStore.updateUrlAddress.restore();
    urlAddressesDataStore.getUrlAddress.restore();
  });

  describe('createUrlAddress method', () => {
    it('should return new UrlAddress', async () => {
      urlAddressesDataStore.createUrlAddress.resolves(urlAddress);
      const response = await urlAddressesRepository.createUrlAddress({
        url: 'https://test.com',
      });
      expect(response.url).to.eql(urlAddress.url);
      expect(response.shortcode).to.eql(urlAddress.shortcode);
      expect(response.redirectCount).to.eql(urlAddress.redirect_count);
      expect(response.lastSeenDate).to.eql(urlAddress.last_seen_date);
      expect(response.startDate).to.eql(urlAddress.start_date);
    });
  });

  describe('updateUrlAddress method', () => {
    it('should return updated UrlAddress', async () => {
      urlAddressesDataStore.updateUrlAddress.resolves(urlAddress);
      const response = await urlAddressesRepository.updateUrlAddress({
        url: 'https://test.com',
      });
      expect(response.url).to.eql(urlAddress.url);
      expect(response.shortcode).to.eql(urlAddress.shortcode);
      expect(response.redirectCount).to.eql(urlAddress.redirect_count);
      expect(response.lastSeenDate).to.eql(urlAddress.last_seen_date);
      expect(response.startDate).to.eql(urlAddress.start_date);
    });
  });

  describe('getUrlAddress method', () => {
    it('should return specific UrlAddress', async () => {
      urlAddressesDataStore.getUrlAddress.resolves(urlAddress);
      const response = await urlAddressesRepository.getUrlAddress({
        url: 'https://test.com',
      });
      expect(response.url).to.eql(urlAddress.url);
      expect(response.shortcode).to.eql(urlAddress.shortcode);
      expect(response.redirectCount).to.eql(urlAddress.redirect_count);
      expect(response.lastSeenDate).to.eql(urlAddress.last_seen_date);
      expect(response.startDate).to.eql(urlAddress.start_date);
    });
  });
});
