const router = require('express').Router()
const logger = require('log4js').getLogger()
const oracleClient = require('./../../infrastructure/oracle/client')
const mongoClient = require('./../../infrastructure/mongodb/client')
const amqpClient = require('./../../infrastructure/rabbitmq/client')
const translation = require('./../../application/translation')

router.get('/process', (req, res) => {
    res.set('Content-Type', 'application/json')
    logger.info('start /offer/process')
    logger.info('executing query to get offers...')

    var startTranslate = Date.now()
    oracleClient.getColaborarOffers()
        .then(offers => {
            logger.info('result: %s rows', offers.rows.length)
            var startTranslate = Date.now()
            for (var $i = 0, len = offers.rows.length; $i < len; $i++) {
                let offer = offers.rows[$i]
                translation.traduzAll(offer).then(data => {
                    amqpClient.send([data])
                    mongoClient.saveOffer(data)
                })
            }
            logger.info('Done!')
            res.status(200).send({msg: 'Processo concluido em ' + (Date.now() - startTranslate) + 'ms'})
        }).catch(error => {
            logger.error(error)
            res.status(500).send({ message: error })
        })
})
module.exports = router
