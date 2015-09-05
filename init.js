'use strict';

var Sequelize = require('sequelize'),

    fs = require('fs'),
    path = require('path'),

    env = process.env,
    DATABASE = env.DATABASE,
    USER = env.USER,
    PASSWORD = env.PASSWORD,
    HOST = env.HOST,
    DIALECT = env.DIALECT;

function inicializarSequelize() {
    return new Sequelize(DATABASE, USER, PASSWORD, {
        host: HOST,
        dialect: DIALECT,
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
        define: {
            createdAt: false,
            updatedAt: false
        }
    });
}

function inicializarConsultas(sequelize) {
    var diretorio = path.join(__dirname, './consultas'),
        consultas = {};

    fs.readdirSync(diretorio).forEach(function(arquivoDaConsulta) {
        var nomeDaConsulta = path.basename(arquivoDaConsulta, '.js'),
            caminhoDaConsulta = path.join(diretorio, arquivoDaConsulta),
            inicializarConsulta = require(caminhoDaConsulta);

        consultas[nomeDaConsulta] = inicializarConsulta(sequelize);
    });

    return consultas;
}

module.exports = function init() {
    var sequelize = inicializarSequelize();

    return {
        sequelize: sequelize,
        consultas: inicializarConsultas(sequelize)
    };
};
