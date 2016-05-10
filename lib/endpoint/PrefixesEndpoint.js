
var loadTemplate = require('../loadTemplate')

var config = require('config')

var federate = require('../federate')
var collateObjects = require('../collateObjects')

function PrefixesEndpoint(req, callback) {

    callback(null, 200, JSON.stringify(config.get('prefixes')))
}

module.exports = federate(PrefixesEndpoint, collateObjects)


