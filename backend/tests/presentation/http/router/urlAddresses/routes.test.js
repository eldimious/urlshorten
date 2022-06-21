/* eslint-disable no-undef */
require('dotenv').config();
const moment = require('moment');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const UrlAddress = require('../../../../../src/domain/urlAddresses/model');
const urlAddressesDataStoreContainer = require('../../../../../src/data/repositories/urlAddresses/dataStore');
const urlAddressesRepositoryContainer = require('../../../../../src/data/repositories/urlAddresses');
const urlAddressesServiceContainer = require('../../../../../src/domain/urlAddresses/service');
const appContainer = require('../../../../../src/presentation/http/app');
const {
  SHORTCODE_IN_USE_ERROR_MSG,
  URL_ADDRESS_IN_USE_ERROR_MSG,
  URL_ADDRESS_NOT_FOUND_ERROR,
} = require('../../../../../src/common/constants');

const db = sinon.stub();
const runTransaction = async () => ({});
const urlAddressesDataStore = urlAddressesDataStoreContainer.init(db);
const urlAddressesRepository = urlAddressesRepositoryContainer.init({ urlAddressesDataStore });
const urlAddressesService = urlAddressesServiceContainer.init({
  urlAddressesRepository,
});
const app = appContainer.init({
  urlAddressesService,
  runTransaction,
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

describe('shorten routes test', () => {
  describe('POST /shorten', () => {
    beforeEach((done) => {
      sinon.stub(urlAddressesService, 'createUrlAddress');
      return done();
    });
    afterEach(() => {
      urlAddressesService.createUrlAddress.restore();
    });
    it('should return 200 with create urlAddress response', async () => {
      urlAddressesService.createUrlAddress.resolves(urlAddress.toCreateUrlAddressResponse());
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test.com',
        });
      expect(res.statusCode).to.to.eql(201);
      expect(res.body.shortcode).to.to.eql(urlAddress.shortcode);
    });
    it('should return 200 with create urlAddress with shortcode response', async () => {
      urlAddressesService.createUrlAddress.resolves(urlAddress.toCreateUrlAddressResponse());
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test.com',
          shortcode: 'test1',
        });
      expect(res.statusCode).to.to.eql(201);
      expect(res.body.shortcode).to.to.eql(urlAddress.shortcode);
    });
    it('should return 409 when shortcode already exists', async () => {
      urlAddressesService.createUrlAddress.rejects(new Error(SHORTCODE_IN_USE_ERROR_MSG));
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test.com',
        });
      expect(res.statusCode).to.to.eql(409);
    });
    it('should return 409 when url already exists', async () => {
      urlAddressesService.createUrlAddress.rejects(new Error(URL_ADDRESS_IN_USE_ERROR_MSG));
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test.com',
        });
      expect(res.statusCode).to.to.eql(409);
    });
    it('should return 422 because wrong shortcode format', async () => {
      urlAddressesService.createUrlAddress.resolves(urlAddress.toCreateUrlAddressResponse());
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test.com',
          shortcode: 'tes',
        });
      expect(res.statusCode).to.to.eql(422);
    });
    it('should return 400 because wrong url format', async () => {
      urlAddressesService.createUrlAddress.resolves(urlAddress.toCreateUrlAddressResponse());
      const res = await request(app)
        .post('/shorten')
        .send({
          url: 'https://test',
          shortcode: 'tes',
        });
      expect(res.statusCode).to.to.eql(400);
    });
  });

  describe('GET /shorten/:shortcode', () => {
    beforeEach((done) => {
      sinon.stub(urlAddressesService, 'getUrlAddress');
      return done();
    });
    afterEach(() => {
      urlAddressesService.getUrlAddress.restore();
    });
    it('should return 200 with stats response', async () => {
      urlAddressesService.getUrlAddress.resolves(urlAddress.toUrlAddressStatsResponse());
      const res = await request(app)
        .get('/shorten/test1');
      expect(res.statusCode).to.to.eql(302);
    });
    it('should return 404 because of missing shortcode', async () => {
      urlAddressesService.getUrlAddress.rejects(new Error(URL_ADDRESS_NOT_FOUND_ERROR));
      const res = await request(app)
        .get('/shorten/test1');
      expect(res.statusCode).to.to.eql(404);
      expect(res.body.ERROR).to.to.eql(URL_ADDRESS_NOT_FOUND_ERROR);
    });
  });

  describe('GET /shorten/:shortcode/stats', () => {
    beforeEach((done) => {
      sinon.stub(urlAddressesService, 'getUrlAddressStats');
      return done();
    });
    afterEach(() => {
      urlAddressesService.getUrlAddressStats.restore();
    });
    it('should return 200 with stats response', async () => {
      urlAddressesService.getUrlAddressStats.resolves(urlAddress.toUrlAddressStatsResponse());
      const res = await request(app)
        .get('/shorten/test1/stats');
      expect(res.statusCode).to.to.eql(200);
      expect(res.body.startDate).to.to.eql(urlAddress.startDate);
      expect(res.body.redirectCount).to.to.eql(urlAddress.redirectCount);
      expect(res.body.lastSeenDate).to.to.eql(urlAddress.lastSeenDate);
    });
    it('should return 404 because of missing shortcode', async () => {
      urlAddressesService.getUrlAddressStats.rejects(new Error(URL_ADDRESS_NOT_FOUND_ERROR));
      const res = await request(app)
        .get('/shorten/test1/stats');
      expect(res.statusCode).to.to.eql(404);
      expect(res.body.ERROR).to.to.eql(URL_ADDRESS_NOT_FOUND_ERROR);
    });
  });
});
