
var getRepository = require('./getRepository')

var loadTemplate = require('../loadTemplate')

function MetadataEndpoint(req, res, next) {

    var repo = getRepository(req)

    var uri

    /* TODO duplicated code
     */
    if(req.params.prefix) {

        var prefixes = config.get('prefixes')

        var baseUri = prefixes[req.params.prefix]

        if(!baseUri) {
            return next(new Error('unknown prefix: ' + req.params.prefix))
        }

        uri = baseUri + req.params.uri

    } else {

        uri = req.params.uri

    }

    var query = loadTemplate('./sparql/GetMetadata.sparql', {
        uri: uri
    });

    repo.sparql(query, function(err, type, sparqlResults) {

        if(err)
            return next(err);

        var results = sparqlResults.map(function(result) {
            return {
                name: result['name'],
                description: result['description']
            };
        });

        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    })

}

module.exports = MetadataEndpoint

