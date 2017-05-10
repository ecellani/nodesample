const mongoose = require('mongoose')
const Schema = mongoose.Schema
const logger = require('log4js').getLogger()
const mixSchema = new Schema({ type: Schema.Types.Mixed }, { strict: false })

const MongoClient = {
    connect: (uri) => {
        MongoClient.connectPromise(uri).then()
    },
    connectPromise: (uri) => {
        return new Promise((resolve, reject) => {
            var mongoose = require('mongoose')
            mongoose.connect(uri)
            mongoose.connection.on('connected', () => {
                logger.debug('Mongoose default connection open...')
                resolve()
            })
            mongoose.connection.on('error', (err) => {
                logger.debug('Mongoose default connection error:', err)
                reject()
            })
            mongoose.connection.on('disconnected', () => logger.debug('Mongoose default connection disconnected'))
            process.on('SIGINT', () => {
                mongoose.connection.close(() => {
                    logger.debug('Mongoose default connection disconnected through app termination')
                    process.exit(0)
                })
            })
        })
    },
    saveOffer: (data) => {
        let offerSchema = new Schema({ type: Schema.Types.Mixed }, { strict: false })
        let offer = mongoose.model('teste', mixSchema)
        new offer(data).save()
    },
    search: (collection, query) => {
        return new Promise((resolve, reject) => {
            let model = mongoose.model(collection, mixSchema, collection)
            model.find(query,
                (err, result) => {
                    if (err) {
                        logger.error('search:', err)
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
        })
    }
}
module.exports = MongoClient
