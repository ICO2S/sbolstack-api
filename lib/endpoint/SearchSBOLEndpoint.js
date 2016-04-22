
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var config = require('config')

function SearchSBOLEndpoint(type) {

    return function search(req, res, next) {

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
                return next(err);

            sbolRdfToXml(rdf, function(err, xml) {

                if(err)
                    return next(err);

                res.header('Content-Type', 'application/rdf+xml');
                res.send(xml);

            });

        });
    };
}

module.exports = SearchSBOLEndpoint;



