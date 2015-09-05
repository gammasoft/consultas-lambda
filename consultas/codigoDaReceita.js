var gammautils = require('gammautils'),
    getSearchString = gammautils.string.getSearchString,
    Sequelize = require('sequelize');

module.exports = function (sequelize) {
    var CodigoDaReceita = sequelize.define('CodigoDaReceita', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        descricao: {
            type: Sequelize.STRING
        },
        descricaoParaBusca: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'codigosDasReceitas',
        freezeTableName: true
    });

    return function consultar(parametros) {
        var attributes = ['id', 'descricao'];

        if(parametros.id) {
            return CodigoDaReceita.findById(parametros.id, {
                attributes: attributes
            });
        }

        return CodigoDaReceita.findAll({
            where: {
                descricaoParaBusca: {
                    like: '%' + getSearchString(parametros.descricao) + '%'
                }
            },
            limit: parametros.limit,
            offset: parametros.offset,
            attributes: attributes
        });
    }
}
