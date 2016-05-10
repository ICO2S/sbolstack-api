
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateMetadata = require('../collateMetadata')

function SearchMetadataEndpoint(type) {

    return federate(search, collateMetadata)

    function search(req, callback) {

        var repo = getRepository(req)

        var query = loadTemplate('./sparql/SearchMetadata.sparql', {
            type: type,
            criteria: constructQuery(type, req.query.criteria)
        });

        if(req.query.limit !== undefined)
            query = query + ' LIMIT ' + parseInt(req.query.limit);

        if(req.query.offset !== undefined)
            query = query + ' OFFSET ' + parseInt(req.query.offset);

        repo.sparql(query, function(err, type, sparqlResults) {

            if(err)
                return callback(err);

            var results = sparqlResults.map(function(result) {
                return {
                    uri: result['ComponentDefinition'],
                    name: result['name'],
                    description: result['description'] || ''
                };
            });

            callback(null, 200, {
                mimeType: 'application/json',
                body: JSON.stringify(results)
            })
        });
    };
}

module.exports = SearchMetadataEndpoint;



