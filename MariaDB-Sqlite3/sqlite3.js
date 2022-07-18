const knex = require('knex')
const path = require('path')

const configSqlite = {
    client: 'sqlite3',
    connection: {
        filename: (path.join(__dirname,'../db/db.sqlite'))
    },
    useNullAsDefault: true
}

const database = knex(configSqlite)

module.exports = database