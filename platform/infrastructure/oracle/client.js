const query = require('./query')
var oracledb = require('oracledb')
const logger = require('log4js').getLogger()
const config = require('./../../configs/app')

const OracleClient = {
    getColaborarOffers: () => {
        return new Promise((resolve, reject) => {
            oracledb.getConnection(config.oracleConnAttr, (err, conn) => {
                if (err) {
                    reject(err.message)
                    return
                }
                var stream = conn.queryStream(query.offers, {}, { outFormat: oracledb.OBJECT, maxRows: 100 })
                stream.on('error', (err) => reject(err.message))
                stream.on('end', () => {
                    console.log('stream.on.end')
                    conn.release((err) => {
                        if (err)
                            logger.error(err.message)
                        else
                            logger.info('connection released')
                    })
                })
                resolve(stream)
            })
        })
    }
}
module.exports = OracleClient
