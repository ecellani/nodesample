const amqp = require('amqplib/callback_api')
const logger = require('log4js').getLogger()
const config = require('./../../configs/app')

const AmqpClient = {
    createChannel: () => {
        return new Promise((resolve, reject) => {
            amqp.connect(config.amqp, (err, conn) => {
                if (err) {
                    reject(err)
                    return
                }
                conn.createChannel((err, ch) => {
                    if (err)
                        reject(err)
                    else
                        resolve(ch)
                })
            })
        })
    },
    send: (ch, msg) => {
        ch.sendToQueue('fila_teste', new Buffer(JSON.stringify(msg)))
    }
}
module.exports = AmqpClient
