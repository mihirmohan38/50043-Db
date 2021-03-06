require('dotenv').config();

module.exports = {
    HOST: process.env.MYSQLDB,
    USER: 'root',
    PASSWORD: 'password',
    PORT: 3306,
    DB: 'BookReview',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
