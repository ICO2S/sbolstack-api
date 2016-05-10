
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateRDF = require('../collateRDF')

function SPARQLEndpoint(req, callback) {

    var repo = getRepository(req)

    var query
   
    if(req.method === 'POST')
        query = req.body.query
    else
        query = req.query.query

    var accept = req.get('accept')

    if(accept) {

        repo.sparql(query, accept, function(err, type, result) {

            if(err)
                return next(err);

            callback(200, {
                mimeType: type,
                body: result
            })

        })

    } else {

        repo.sparql(query, function(err, type, result) {

            if(err)
                return next(err);

            callback(200, {
                mimeType: type,
                body: result
            })

        })

    }
}

module.exports = federate(SPARQLEndpoint, collateRDF)


