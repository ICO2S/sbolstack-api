
var collateMetadata = require('../collateMetadata')

var loadTemplate = require('../loadTemplate')
var sparql = require('../sparql')

var federate = require('../federate')

function RootCollectionMetadataEndpoint(req, callback) {

    var query = loadTemplate('./sparql/RootCollectionMetadata.sparql', { });

    sparql.queryJson(query, req.params.store, function(err, sparqlResults) {

        if(err)
            return callback(err);

        var results = sparqlResults.map(function(result) {
            return {
                uri: result['Collection'],
                name: result['name'] || '',
                description: result['description'] || '',
                displayId: result['displayId'] || '',
                version: result['version'] || ''
            };
        });

        callback(null, 200, {
            mimeType: 'application/json',
            body: JSON.stringify(results)
        })
    })



}

module.exports = federate(RootCollectionMetadataEndpoint, collateMetadata)
