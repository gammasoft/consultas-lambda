'use strict';

var init = require('./init'),
    auth = require('./auth'),
    app = init();

function tratarParametros(parametros) {
    if(parametros.limit) {
        if(parseInt(parametros.limit, 10) > 100) {
            parametros.limit = 100;
        }
    } else {
        parametros.limit = 10;
    }

    if(!parametros.offset) {
        parametros.offset = 0;
    }

    return parametros;
}

function handler(event, context) {
    var consulta = app.consultas[event.consulta],
        parametros = tratarParametros(event.parametros),
        resultado;

    if(!consulta) {
        return context.fail('404: Consulta não encontrada');
    }

    consulta(parametros)
    .then(function(resultados) {
        if(!resultados) {
            return context.fail('404: Recurso não encontrada');
        }

        context.succeed(resultados);
    })
    .catch(function(err) {
        console.log(err);

        if(err.name === 'SequelizeValidationError') {
            return context.fail('400: Solicitação imprópria');
        }

        context.fail('500: Erro interno do servidor');
    });
}

module.exports.handler = auth(handler);
