
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');
var sbolToSparql = require('../sbolToSparql')
var SBOLDocument = require('sboljs');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateSBOL = require('../collateSBOL')

function SearchSBOLComponentSummaryEndpoint() {

    return federate(search, collateSBOL)

    function search(req, callback) {

        console.log('endpoint: SearchSBOLComponentSummaryEndpoint')

        var repo = getRepository(req)
        
        SBOLDocument.loadRDF(req.body.sbol, function(err, sbol) {
            
            if(err) {
                callback(err)
                return
            }

            var query = loadTemplate('./sparql/SearchSBOLComponentSummary.sparql', {           
                criteria: sbolToSparql(sbol),
                limit: parseInt(req.body.limit),
                offset: parseInt(req.body.offset)
            });
    
            repo.sparql(query, 'application/rdf+xml', function(err, type, rdf) {

                if(err)
                    return callback(err);

                callback(null, 200, {
                    mimeType: type,
                    body: rdf
                })
            })
            
        })
    }
}

module.exports = SearchSBOLComponentSummaryEndpoint;



