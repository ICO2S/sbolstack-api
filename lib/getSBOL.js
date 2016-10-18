
var SBOLDocument = require('sboljs')

var sparql = require('./sparql')

var config = require('config')

var resolveBatch = config.get('resolveBatch')

function getSBOL(sbol, graphName, URIs, callback) {

    sbol._resolving = {};

    var complete = false;

    URIs.forEach((uri) => sbol.lookupURI(uri))

    completePartialDocument(graphName, sbol, () => {

        if(!complete) {

            complete = true

            callback(null, sbol)
        }
    })
}

module.exports = getSBOL

function completePartialDocument(graphName, sbol, next) {

    console.log(sbol.unresolvedURIs.length + ' uris left');

    if(sbol.unresolvedURIs.length === 0) {

        next();

    } else {
 
        var toResolve = sbol.unresolvedURIs.filter((uri) => !sbol._resolving[uri])

        toResolve = toResolve.slice(0, resolveBatch)

        console.log(toResolve.length)

        retrieveSBOL(graphName, sbol, toResolve, () => {

            for(var i = 0; i < toResolve.length; ++ i) {

                if(sbol.unresolvedURIs.indexOf(toResolve[i]) !== -1) {

                    next(new Error('Could not resolve URI: ' + toResolve[i]))
                    return

                }

            }

            completePartialDocument(graphName, sbol, next)

        })
    }
}

function retrieveSBOL(graphName, sbol, uris, next) {

    console.log(uris)

    var query = sparqlDescribeSubjects(uris)
    
    console.log(query)

    Object.assign(sbol._resolving, uris)

    sparql.query(query, graphName, 'application/rdf+xml', function(err, type, rdf) {

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



