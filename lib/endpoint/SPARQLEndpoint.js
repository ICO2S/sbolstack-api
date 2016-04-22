
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SPARQLEndpoint(req, res, next) {

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

            res.header('content-type', type)
            res.send(result)

        })

    } else {

        repo.sparql(query, function(err, type, result) {

            if(err)
                return next(err);

            res.header('content-type', type)
            res.send(result)

        })

    }
}

module.exports = SPARQLEndpoint


