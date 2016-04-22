
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');
var sbolToSparql = require('../sbolToSparql')
var SBOLDocument = require('sboljs');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SearchSBOLComponentSummaryCountEndpoint() {

    return function search(req, res, next) {

        var repo = getRepository(req)

        SBOLDocument.loadRDF(req.body.sbol, function(err, sbol) {
            
            if(err) {
                res.send(err);
                return;
            }
            
            var query = loadTemplate('./sparql/SearchSBOLComponentSummaryCount.sparql', {           
                criteria: sbolToSparql(sbol),
            });
    
            repo.sparql(query, function(err, type, result) {

                if(err) {
                    res.send(err);
                    return;
                }
                else if (result && result[0].count)
                {
                    res.send(result[0].count + '')
                }   
                else
                {
                    res.send("0"); 
                }                         
            });
            
        });
    }
}

module.exports = SearchSBOLComponentSummaryCountEndpoint;



