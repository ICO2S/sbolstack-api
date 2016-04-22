
var sbolRdfToXml = require('../sbolRdfToXml');
var constructQuery = require('./constructQuery');

var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function SearchMetadataCountEndpoint(type) {

    return function search(req, res, next) {

        var repo = getRepository(req)

        var query = loadTemplate('./sparql/SearchMetadataCount.sparql', {
            type: type,
            criteria: constructQuery(type, req.query.criteria)
        });

        repo.sparql(query, function(err, type, result) {

            console.log(result)
            if(err) {
                res.send(err);
                return;
            }
            else if (result && result.length > 0 && result[0].count)
            {
                res.send(result[0].count + '')
            }   
            else
            {
                res.send("0"); 
            }                         
        });
    };
}

module.exports = SearchMetadataCountEndpoint;



