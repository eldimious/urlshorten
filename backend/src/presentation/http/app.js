const http = require('http');
const express = require('express');
const cors = require('cors');
const compress = require('compression')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const errorHandler = require('./router/errors/routes');
const urlAddressesRoutes = require('./router/urlAddresses/routes');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(compress);
app.use(cors());

module.exports.init = (services) => {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/shorten', urlAddressesRoutes.init(services));
  app.use(errorHandler);
  const httpServer = http.createServer(app);
  return httpServer;
};
