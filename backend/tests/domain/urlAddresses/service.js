/* eslint-disable no-undef */
const chai = require('chai');
const sinon = require('sinon');
const moment = require('moment');
const chaiAsPromised = require('chai-as-promised');
const UrlAddress = require('../../../src/domain/urlAddresses/model');
const urlAddressesServiceContainer = require('../../../src/domain/urlAddresses/service');
const urlAddressesRepositoryContainer = require('../../../src/data/repositories/urlAddresses');
const urlAddressesDataStoreContainer = require('../../../src/data/repositories/urlAddresses/dataStore');

chai.use(chaiAsPromised);
const { expect } = chai;
const db = {
  schemas: {},
};
const urlAddressesDataStore = urlAddressesDataStoreContainer.init(db.schemas);
const urlAddressesRepository = urlAddressesRepositoryContainer.init({
  urlAddressesDataStore,
});
const urlAddressesService = urlAddressesServiceContainer.init({
  urlAddressesRepository,
  runTransaction: async () => ({}),
});

const urlAddress = new UrlAddress({
  id: 1,
  url: 'https://test.com',
  shortcode: 'test1',
  startDate: moment.utc().toISOString(),
  updatedAt: moment.utc().toISOString(),
  lastSeenDate: moment.utc().toISOString(),
  redirectCount: 1,
});

describe('urlAddress service test', () => {
  beforeEach(() => {
    sinon.stub(urlAddressesRepository, 'createUrlAddress');
    sinon.stub(urlAddressesRepository, 'getUrlAddress');
    sinon.stub(urlAddressesRepository, 'updateUrlAddress');
  });
  afterEach(() => {
    urlAddressesRepository.createUrlAddress.restore();
    urlAddressesRepository.getUrlAddress.restore();
    urlAddressesRepository.updateUrlAddress.restore();
  });

  describe('test createUrlAddress method', () => {
    it('should call the service method createUrlAddress and create new UrlAddress', async () => {
      urlAddressesRepository.createUrlAddress.resolves(urlAddress);
      const response = await urlAddressesService.createUrlAddress('https://test.com', 'test1');
      expect(response.shortcode).to.eql(urlAddress.shortcode);
    });
    it('should call the service method createUrlAddress and throw error', async () => {
      urlAddressesRepository.createUrlAddress.rejects(new Error('test error'));
      await expect(urlAddressesService.createUrlAddress('https://test.com', 'test1'))
        .to.eventually.be.rejectedWith('test error');
    });
  });

  describe('test getUrlAddressStats method', () => {
    it('should call the service method getUrlAddressStats and get UrlAddress stats', async () => {
      urlAddressesRepository.getUrlAddress.resolves(urlAddress);
      const response = await urlAddressesService.getUrlAddressStats('test1');
      expect(response.redirectCount).to.eql(urlAddress.redirectCount);
      expect(response.lastSeenDate).to.eql(urlAddress.lastSeenDate);
      expect(response.startDate).to.eql(urlAddress.startDate);
    });
    it('should call the service method createUrlAddress and throw error', async () => {
      urlAddressesRepository.createUrlAddress.rejects(new Error('Shortcode not found in the system'));
      await expect(urlAddressesService.getUrlAddressStats('https://test.com', 'test1'))
        .to.eventually.be.rejectedWith('Shortcode not found in the system');
    });
  });
});
