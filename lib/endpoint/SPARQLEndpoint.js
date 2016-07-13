
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateSPARQLResults = require('../collateSPARQLResults')

function SPARQLEndpoint(req, callback) {

    console.log('endpoint: SPARQLEndpoint')

    var repo = getRepository(req)

    var query
   
    if(req.method === 'POST')
        query = req.body.query
    else
        query = req.query.query

    var accept = req.get('accept')

    console.log('accepting ' + accept)

    if(accept) {

        repo.sparql(query, accept, function(err, type, result) {

            if(err)
                return callback(err);

            callback(null, 200, {
                mimeType: type,
                body: result
            })

        })

    } else {

        repo.sparql(query, function(err, type, result) {

            if(err)
                return callback(err);

            callback(null, 200, {
                mimeType: type,
                body: JSON.stringify(result)
            })

        })

    }
}

module.exports = federate(SPARQLEndpoint, collateSPARQLResults)


