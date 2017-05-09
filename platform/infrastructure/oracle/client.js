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
                conn.execute(query.offers, {}, { outFormat: oracledb.OBJECT, maxRows: 10 }, (err, data) => {
                    if (err) {
                        reject(err.message)
                        return
                    }
                    resolve(data)
                    conn.release((err) => {
                        if (err)
                            logger.error(err.message)
                        else
                            logger.info('connection released')
                    })
                })
            })
        })
    }
}
module.exports = OracleClient
