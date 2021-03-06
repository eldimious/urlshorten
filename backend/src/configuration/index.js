require('dotenv').config();

const config = {
  database: {
    uri: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
  },
  httpPort: process.env.PORT || 8080,
};
module.exports = config;
