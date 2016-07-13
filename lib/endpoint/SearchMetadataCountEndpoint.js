
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateCounts = require('../collateCounts')

function SearchMetadataCountEndpoint(type) {

    return federate(search, collateCounts)

    function search(req, callback) {

        console.log('endpoint: SearchMetadataCountEndpoint')

        var repo = getRepository(req)

        var params

        if(req.body) {
            params = req.body
        } else {
            params = req.query
        }

        var query = loadTemplate('./sparql/SearchMetadataCount.sparql', {
            type: type,
            criteria: constructQuery(type, params.criteria)
        });

        repo.sparql(query, function(err, type, result) {

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



