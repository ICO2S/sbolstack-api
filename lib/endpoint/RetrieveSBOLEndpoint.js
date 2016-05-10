
var sbolRdfToXml = require('../sbolRdfToXml');
var SBOLDocument = require('sboljs');

var sparql = require('../sparql')

var resolveBatch = 3

var getRepository = require('./getRepository')

var config = require('config')

function SBOLEndpoint(type) {

    /*CONSTRUCT {
  <http://parts.igem.org/Part:BBa_S04352> ?p1 ?o1 .
  <http://parts.igem.org/Part:BBa_S04352#component2294478> ?p2 ?o2 .
} WHERE {
  <http://parts.igem.org/Part:BBa_S04352> ?p1 ?o1 .
   <http://parts.igem.org/Part:BBa_S04352#component2294478> ?p2 ?o2 .
}*/

    return federate(endpoint, collateSBOL)

    function endpoint(req, callback) {

        var repo = getRepository(req)

        var uri

        if(req.params.prefix) {

            var prefixes = config.get('prefixes')

            var baseUri = prefixes[req.params.prefix]

            if(!baseUri) {
                return callback(new Error('unknown prefix: ' + req.params.prefix))
            }

            uri = baseUri + req.params.uri

        } else {

            uri = req.params.uri

        }

        var sbol = new SBOLDocument();

        sbol._resolving = {};

        var complete = false

        retrieveSBOL(repo, sbol, [ uri ], function done(err) {

            if(err)
                return callback(new Error('retrieveSBOL error ' + err))

            completePartialDocument(repo, sbol, () => {

                if(!complete) {

                    complete = true

                    var object = sbol.lookupURI(uri)

                    if(object.uri === undefined) {

                        return callback(null, 404, 'not found')

                    } else {

                        res.header('Content-Type', 'application/rdf+xml');

                        return callback(null, 200, sbol.serializeXML({
                            'xmlns:igem': 'http://parts.igem.org/',
                            'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
                            'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
                            'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#',
                            'xmlns:sbol1' : 'http://sbols.org/sbol.owl#',                        
                            'xmlns:synbiohub' : 'http://synbiohub.org#',                        
                        }))

                    }
                }
            })
        })
    }
}

function completePartialDocument(repo, sbol, next) {

    console.log(sbol.unresolvedURIs.length + ' uris left');

    if(sbol.unresolvedURIs.length === 0) {

        next();

    } else {
 
        var toResolve = sbol.unresolvedURIs.filter((uri) => !sbol._resolving[uri])

        toResolve = toResolve.slice(0, resolveBatch)

        console.log(toResolve.length)

        retrieveSBOL(repo, sbol, toResolve, () => {
            completePartialDocument(repo, sbol, next)
        })
    }
}

function retrieveSBOL(repo, sbol, uris, next) {

    console.log(uris)

    var query = sparqlDescribeSubjects(uris)
    
    console.log(query)

    Object.assign(sbol._resolving, uris)

    repo.sparql(query, 'application/rdf+xml', function(err, type, rdf) {

        console.log('got results with err ' + err);

        if(err) {

            return next(err)
        }
        
        sbol.loadRDF(rdf, next)
    })
}

function sparqlDescribeSubjects(uris) {

    var triples = uris.map((uri, n) =>
        sparql.escapeIRI(uri) + ' ?p' + n + ' ?o' + n + ' .'
    )

    return [
        'CONSTRUCT {'
    ].concat(triples).concat([
        '} WHERE {'
    ]).concat(triples).concat([
        '}'
    ]).join('\n')
}

module.exports = SBOLEndpoint;


