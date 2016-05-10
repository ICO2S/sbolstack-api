
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SearchMetadataCountEndpoint(type) {

    return federate(search, collateCounts)

    function search(req, callback) {

        var repo = getRepository(req)

        var query = loadTemplate('./sparql/SearchMetadataCount.sparql', {
            type: type,
            criteria: constructQuery(type, req.query.criteria)
        });

        repo.sparql(query, function(err, type, result) {

            console.log(result)

            if(err) {
                callback(err)
                return
            }

            else if (result && result.length > 0 && result[0].count)
            {
                callback(null, 200, {
                    mimeType: 'text/plain',
                    body: result[0].count + ''
                })
            }   
            else
            {
                callback(null, 200, {
                    mimeType: 'text/plain',
                    body: '0'
                })
            }
        });
    };
}

module.exports = SearchMetadataCountEndpoint;



