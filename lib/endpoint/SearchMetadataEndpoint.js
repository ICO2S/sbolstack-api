
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SearchMetadataEndpoint(type) {

    return function search(req, res, next) {

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
                return next(err);

            var results = sparqlResults.map(function(result) {
                return {
                    uri: result['ComponentDefinition'],
                    name: result['name'],
                    description: result['description'] || ''
                };
            });

            res.header('Content-Type', 'application/json');
            res.send(results);
        });
    };
}

module.exports = SearchMetadataEndpoint;



