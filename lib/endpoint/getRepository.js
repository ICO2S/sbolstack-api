
var Repository = require('openrdf-sesame-js').Repository

var config = require('config')

function getRepository(req) {

    var triplestoreUrl = config.get('triplestore').url

    var store = req.params.store || config.get('triplestore').defaultStore

    var repoUrl = triplestoreUrl + '/repositories/' + store

    return new Repository({
        uri: repoUrl
    })
}

module.exports = getRepository

