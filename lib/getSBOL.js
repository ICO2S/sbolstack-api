
var SBOLDocument = require('sboljs')

var sparql = require('./sparql')

var config = require('config')

var resolveBatch = config.get('resolveBatch')

var request = require('request')

var async = require('async');

function getSBOL(sbol, type, graphName, URIs, callback) {

    sbol._resolving = {};
    sbol._rootUri = URIs[0]

    var complete = false;

    URIs.forEach((uri) => sbol.lookupURI(uri))

    async.series([
	function getLocalParts(next) {
	    completePartialDocument(graphName, sbol, type, (err) => {

		if(err) {
		    next(err)

		} else {

		    if(!complete) {

			complete = true

			next() //callback(null, sbol)
		    }

		}
	    })
	},

	function fetchNonLocalSBOL(next) {
	    async.each(sbol.unresolvedURIs, (uri, nextUri) => {
		request({
		    method: 'GET',	
		    uri: uri + '/id.xml',	
		    'content-type': 'application/rdf+xml',
		}, function(err, response, body) {	
		    if(err || response.statusCode >= 300) {	
		    } else {
			sbol.loadRDF(body, nextUri)
		    }
		})
	    }, next)
		}
    ], function done(err) {
	if (err)
	    callback(err)
	else {

	    callback(null,sbol)
	}
    })
}



module.exports = getSBOL

function completePartialDocument(graphName, sbol, type, next) {

    if(sbol.unresolvedURIs.length === 0) {
        next();

    } else {
 
        var toResolve = sbol.unresolvedURIs.filter((uri) => !sbol._resolving[uri])
        toResolve = toResolve.slice(0, resolveBatch)

        retrieveSBOL(graphName, sbol, type, toResolve, () => {

	    var done = 1
	    for(var i = 0; i < sbol.unresolvedURIs.length; ++ i) {
		if (toResolve.indexOf(sbol.unresolvedURIs[i]) === -1) {
		    done = 0
		}
	    }
	    if (done === 1) {
		next()
		return
	    }
            completePartialDocument(graphName, sbol, type, next)

        })
    }
}

function retrieveSBOL(graphName, sbol, type, uris, next) {

    var query = sparqlDescribeSubjects(sbol, type, uris)
    Object.assign(sbol._resolving, uris)

    sparql.query(query, graphName, 'application/rdf+xml', function(err, type, rdf) {

        if(err) {
            return next(err)
        }
        sbol.loadRDF(rdf, next)
    })
}

function sparqlDescribeSubjects(sbol, type, uris) {

    /*
    var triples = uris.map((uri, n) =>
        sparql.escapeIRI(uri) + ' ?p' + n + ' ?o' + n + ' .'
    )

    return [
        'CONSTRUCT {'
    ].concat(triples).concat([
        '} WHERE {'
    ]).concat(triples).concat([
        '}'
    ]).join('\n')*/

   var query = [
       'CONSTRUCT { ?s ?p ?o } WHERE {'
   ]

   var isFirst = true

   uris.forEach((uri) => {

       if(isFirst)
           isFirst = false
       else
           query.push('UNION')

       query.push(
           '{',
           '?s ?p ?o .'
        )

        if(uri === sbol._rootUri) {
	    if (type === "TopLevel") {
		query.push('?s a ?t .')
		// TODO: the generic top level will not work
		query.push('FILTER(?t = <http://sbols.org/v2#ComponentDefinition>' + ' ||' + 
			   ' ?t = <http://sbols.org/v2#ModuleDefinition>' + ' ||' + 
			   ' ?t = <http://sbols.org/v2#Model>' + ' ||' + 
			   ' ?t = <http://sbols.org/v2#Collection>' + ' ||' + 
			   ' ?t = <http://sbols.org/v2#Sequence>' + ' ||' + 
			   ' ?t = <http://sbols.org/v2#GenericTopLevel>)')
	    } else if (type != 'GenericTopLevel') {
		query.push('?s a <http://sbols.org/v2#' + type + '> .')
	    }
        }

        query.push(
           'FILTER(?s = ' + sparql.escapeIRI(uri) + ')',
           '}'
        )
   })

   query.push('}')

   return query.join('\n')
}



