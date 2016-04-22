
var loadTemplate = require('../loadTemplate')

var config = require('config')

function PrefixesEndpoint(req, res, next) {

    res.header('content-type', 'application/json')
    res.send(config.get('prefixes'))
}

module.exports = PrefixesEndpoint


