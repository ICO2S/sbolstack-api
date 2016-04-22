
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');
var sbolToSparql = require('../sbolToSparql')
var SBOLDocument = require('sboljs');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SearchSBOLComponentSummaryEndpoint() {

    return function search(req, res, next) {

        var repo = getRepository(req)
        
        SBOLDocument.loadRDF(req.body.sbol, function(err, sbol) {
            
            if(err) {
                res.send(err);
                return;
            }

            var query = loadTemplate('./sparql/SearchSBOLComponentSummary.sparql', {           
                criteria: sbolToSparql(sbol),
                limit: parseInt(req.body.limit),
                offset: parseInt(req.body.offset)
            });
    
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
            
        });
    }
}

module.exports = SearchSBOLComponentSummaryEndpoint;



