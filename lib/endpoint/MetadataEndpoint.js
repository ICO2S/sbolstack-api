
var getRepository = require('./getRepository')

var loadTemplate = require('../loadTemplate')

var federate = require('../federate')
var collateObjects = require('../collateObjects')

function GetMetadata(req, callback) {

    console.log('endpoint: GetMetadata')

    var repo = getRepository(req)

    var uri

    /* TODO duplicated code
     */
    if(req.params.prefix) {

        var prefixes = config.get('prefixes')

        var baseUri = prefixes[req.params.prefix]

        if(!baseUri) {
            return callback(new Error('unknown prefix: ' + req.params.prefix))
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
            return callback(err);

        var results = sparqlResults.map(function(result) {
            return {
                name: result['name'],
                description: result['description']
            };
        });

        callback(null, 200, {
            mimeType: type,
            body: JSON.stringify(results)
        })
    })

}

module.exports = federate(GetMetadata, collateObjects)

