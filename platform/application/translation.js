const logger = require('log4js').getLogger()
const mongoClient = require('./../infrastructure/mongodb/client')

const Translation = {
    traduzAreaConhecimento: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaAreaConhecimento', { deDsAreaConhecimento: offer.DSAREACONHECIMENTO })
                .then(data => resolve(data && data.length > 0 ? data[0].toJSON().paraDsAreaConhecimento : null))
                .catch(error => {
                    logger.error('traduzAreaConhecimento:', error)
                    reject(error)
                })
        })
    },
    traduzCurso: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaCurso', { deDsCurso: offer.DSCURSO })
                .then(data => resolve(data && data.length > 0 ? data[0].toJSON().paraDsCurso : null))
                .catch(error => {
                    logger.error('traduzCurso:', error)
                    reject(error)
                })
        })
    },
    traduzDiaDaSemana: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaDiaDaSemana', { deDsDiaDaSemana: offer.DSDIADASEMANA })
                .then(data => resolve(data && data.length > 0 ? data[0].toJSON().paraDsDiaDaSemana : null))
                .catch(error => {
                    logger.error('traduzDiaDaSemana:', error)
                    reject(error)
                })
        })
    },
    traduzModalidade: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaModalidade', { deDsModalidade: offer.DSMODALIDADE })
                .then(data => resolve(data && data.length > 0 ? data[0].toJSON().paraDsModalidade : null))
                .catch(error => {
                    logger.error('traduzModalidade:', error)
                    reject(error)
                })
        })
    },
    traduzTurno: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaTurno', { deDsTurno: offer.DSTURNO })
                .then(data => resolve(data && data.length > 0 ? data[0].toJSON().paraDsTurno : null))
                .catch(error => {
                    logger.error('traduzTurno:', error)
                    reject(error)
                })
        })
    },
    traduzUnidadeMarca: (offer) => {
        return new Promise((resolve, reject) => {
            mongoClient.search('deParaUnidadeMarca', { idUnidade: offer.IDUNIDADE, idSistema: offer.CDSISTEMAORIGEM })
                .then(data => {
                    let result = data && data.length > 0 ? data[0].toJSON() : null
                    resolve(result ? { paraDsUnidade: result.paraDsUnidade, paraDsMarca: result.paraDsMarca } : null)
                }).catch(error => {
                    logger.error('traduzUnidadeMarca:', error)
                    reject(error)
                })
        })
    },
    traduzAll: (offer) => {
        return new Promise((resolve, reject) => {
            var promises = [Translation.traduzAreaConhecimento(offer)
                            , Translation.traduzCurso(offer)
                            , Translation.traduzDiaDaSemana(offer)
                            , Translation.traduzModalidade(offer)
                            , Translation.traduzTurno(offer)
                            , Translation.traduzUnidadeMarca(offer)]
            Promise.all(promises).then(data => {
                offer.dsAreaConhecimentoTraduzido = data[0]
                offer.dsCursoTraduzido = data[1]
                offer.dsDiaDaSemanaTraduzido = data[2]
                offer.dsModalidadeTraduzido = data[3]
                offer.dsTurnoTraduzido = data[4]
                offer.dsUnidade = data[5] ? data[5].paraDsUnidade : null
                offer.dsMarca = data[5] ? data[5].paraDsMarca : null
                resolve(offer)
            }).catch(error => {
                logger.error('traduzAll:', error)
                reject(error)
            })
        })
    }
}
module.exports = Translation
