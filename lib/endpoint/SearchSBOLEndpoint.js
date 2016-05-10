
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var config = require('config')

var federate = require('../federate')
var collateSBOL = require('../collateSBOL')

function SearchSBOLEndpoint(type) {

    return federate(search, collateSBOL)

    function search(req, callback) {

        var repo = getRepository(req)

        var query = loadTemplate('./sparql/SearchSBOL.sparql', {
            type: type,
            criteria: constructQuery(type, req.query.criteria)
        });

        if(req.query.limit !== undefined)
            query = query + ' LIMIT ' + parseInt(req.query.limit);

        console.log(query)

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



