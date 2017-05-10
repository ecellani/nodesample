const fork = require('child_process').fork
const router = require('express').Router()
const logger = require('log4js').getLogger()
const oracleClient = require('./../../infrastructure/oracle/client')

router.get('/process', (req, res) => {
    res.set('Content-Type', 'application/json')
    logger.info('start /offer/process')
    logger.info('executing query to get offers...')

    var process = 0
    const offerProcesses = [
        fork(__dirname + '/offer-process.js'), fork(__dirname + '/offer-process.js'),
        fork(__dirname + '/offer-process.js'), fork(__dirname + '/offer-process.js')
    ]

    oracleClient.getColaborarOffers()
        .then(stream => {
            stream.on('data', (offer) => {
                offerProcesses[process++].send(offer)
                if (process >= offerProcesses.length) process = 0
            })
        }).catch(error => {
            logger.error(error)
            res.status(500).send({ message: error })
        })
})
module.exports = router
