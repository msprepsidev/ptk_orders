require("dotenv").config()
const winston = require('winston');
require('winston-mongodb');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.MongoDB({
            level: 'info',
            db: process.env.MONGO_URL_LOGGER,
            collection: 'logs',
            tryReconnect: true,
            options: { useUnifiedTopology: true }
        })
    ]
});

module.exports = logger;
