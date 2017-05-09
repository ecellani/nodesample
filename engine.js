const Engine = {
    start: () => {
        const app = require('express')()
        const bodyParser = require('body-parser')
        const logger = require('log4js').getLogger()
        const config = require('./platform/configs/app')

        require('./platform/infrastructure/mongodb/client').connect(config.mongodb)

        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Methods", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
        app.listen(config.port, () => logger.info('Application server running at (port:%s)...', config.port))
        app.use('/api/offer', require('./platform/application/router/offer-router'))
    }
}
module.exports = Engine;
Engine.start()
