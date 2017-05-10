const logger = require('log4js').getLogger()
const config = require('./../../configs/app')
const translation = require('./../../application/translation')
const mongoClient = require('./../../infrastructure/mongodb/client')
const amqpClient = require('./../../infrastructure/rabbitmq/client')

var ready = false
var channel = null

function init() {
    return new Promise((resolve, reject) => {
        if (ready) {
            ready = true
            resolve()
        } else {
            Promise.all([amqpClient.createChannel(), mongoClient.connectPromise(config.mongodb)])
                .then(data => {
                        channel = data[0];
                        ready = true
                        logger.debug('Ready!')
                        resolve()
                }).catch(err => {
                    logger.error(err)
                })
        }
    })
}

function sendOffer(ch, offer) {
    amqpClient.send(ch, offer)
    mongoClient.saveOffer(offer)
    // translation.traduzAll(offer).then(data => {
    //     amqpClient.send(ch, data)
    //     mongoClient.saveOffer(data)
    // })
}

init().then(() => logger.debug('started!'))
process.on('message', function(message) {
    init().then(() => sendOffer(channel, message) )
})
