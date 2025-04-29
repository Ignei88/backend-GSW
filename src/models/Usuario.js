const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sistema_gestion_tienda', 'usuario', 'contraseña', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        freezeTableName: true,
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = sequelize;