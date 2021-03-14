const logger = require('../util/logger');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
  const db = config.get('db');
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  mongoose
    .connect(db, options)
    .then(() => logger.info(`Connected to ${db} ...`));
};
