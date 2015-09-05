'use strict';

var gammautils = require('gammautils'),
    decipher = gammautils.crypto.decipher,
    every = gammautils.array.every,

    env = process.env,
    SEGREDO = env.SEGREDO,
    ALGORITMO = env.ALGORITMO;

function decifrarToken(token) {
    token =  token || '';
    token = new Buffer(token, 'base64').toString('ascii');
    token = token.split(':');
    token = token[1];

    try {
        return decipher(token, SEGREDO, ALGORITMO);
    } catch(err) {
        return '';
    }
}

function verificarCredenciais(credenciais) {
    credenciais = credenciais.split('|');

    return every([
        credenciais.length === 3,
        // new Date(credenciais[1]) >= new Date()
    ]);
}

function auth(next) {
    return function (event, context) {
        var credenciais = decifrarToken(event.token);

        if(!verificarCredenciais(credenciais)) {
            return context.fail('403: Erro de autenticação');
        }

        next(event, context);
    }
}

module.exports = auth;
