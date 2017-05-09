const amqp = require('amqplib/callback_api')
const logger = require('log4js').getLogger()
const config = require('./../../configs/app')

const AmqpClient = {
    send: (msgs) => {
        amqp.connect(config.amqp, function(err, conn) {
            if (err) {
                logger.error('Amqp.send:', err)
                throw err
            }
            conn.createChannel(function(err, ch) {
                for (var $i in msgs) {
                    var msg = msgs[$i]
                    ch.sendToQueue('fila_teste', new Buffer(JSON.stringify(msg)))
                }
            })
        })
    }
}
module.exports = AmqpClient
