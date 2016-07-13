
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var config = require('config')

var federate = require('../federate')
var collateSBOL = require('../collateSBOL')

function SearchSBOLEndpoint(type) {

    return federate(search, collateSBOL)

    function search(req, callback) {

        console.log('endpoint: SearchSBOLEndpoint')

        var repo = getRepository(req)

        var params

        if(req.body) {
            params = req.body
        } else {
            params = req.query
        }

        var offset = ''
        var limit = ''

        if(params.offset !== undefined && params.offset !== null)
            offset = ' OFFSET ' + parseInt(params.offset);

        if(params.limit !== undefined && params.limit !== null)
            limit = ' LIMIT ' + parseInt(params.limit);

        var query = loadTemplate('./sparql/SearchSBOL.sparql', {
            type: type,
            criteria: constructQuery(type, params.criteria),
            offset: offset,
            limit: limit
        });

        repo.sparql(query, 'application/rdf+xml', function(err, type, rdf) {

            if(err)
                return callback(err)

            callback(null, 200, {
                mimeType: type,
                body: rdf
            })
        });
    };
}

module.exports = SearchSBOLEndpoint;



