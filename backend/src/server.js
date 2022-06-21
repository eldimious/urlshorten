const {
  httpPort,
  database: { uri: databaseUri },
} = require('./configuration');
const logging = require('./common/logging');
const dbContainer = require('./data/infrastructure/db');
const urlAddressesRepositoryContainer = require('./data/repositories/urlAddresses');
const urlAddressesDataStoreContainer = require('./data/repositories/urlAddresses/dataStore');
const urlAddressesServiceContainer = require('./domain/urlAddresses/service');
const appContainer = require('./presentation/http/app');

const db = dbContainer.init({ databaseUri });
const urlAddressesRepository = urlAddressesRepositoryContainer.init({
  urlAddressesDataStore: urlAddressesDataStoreContainer.init(db.schemas),
});
const urlAddressesService = urlAddressesServiceContainer.init({
  urlAddressesRepository,
  runTransaction: db.runTransaction,
});
const app = appContainer.init({
  urlAddressesService,
});

const port = process.env.PORT || httpPort;
let server;

(async () => {
  try {
    await db.connect();
    await db.sync();
    logging.info('Connection to database established');
    server = app.listen(port, () => {
      logging.info(`Listening on *:${port}`);
    });
  } catch (error) {
    logging.error('Connection to database error', error);
    await db.disconnect();
    await server.close();
  }
})();
