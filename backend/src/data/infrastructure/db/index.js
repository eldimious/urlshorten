/* eslint-disable prefer-object-spread */
const Sequelize = require('sequelize');
const { PRODUCTION_ENV } = require('../../../common/constants');
const schemasContainer = require('./schemas');

module.exports.init = function init(config) {
  if (!config.databaseUri) {
    throw new Error('Missing databaseUri on configuration file');
  }
  const defaultOptions = {
    dialect: 'postgres',
    operatorsAliases: false,
    logging: true,
    timezone: '+00:00',
    dialectOptions: process.env.NODE_ENV !== PRODUCTION_ENV
      ? {}
      : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    define: {
      freezeTableName: true,
    },
  };

  const sequelize = new Sequelize(config.databaseUri, { ...defaultOptions, ...config.settings });

  const db = {
    schemas: schemasContainer.init(sequelize),
    async connect() {
      return sequelize.authenticate();
    },
    async disconnect() {
      await sequelize.close();
      return sequelize.connectionManager.close();
    },
    sync: (force = false, alter = false) => {
      sequelize.sync({
        force,
        alter,
      });
    },
    async createTransaction() {
      return sequelize.transaction();
    },
    runTransaction: sequelize.transaction.bind(sequelize),
  };
  return db;
};
