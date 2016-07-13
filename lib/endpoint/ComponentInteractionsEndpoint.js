
var SBOLDocument = require('sboljs')

var getSBOL = require('../getSBOL')

var sbolRdfToXml = require('../sbolRdfToXml')

var getRepository = require('./getRepository')

var config = require('config')

var federate = require('../federate')
var collateSBOL = require('../collateSBOL')

var loadTemplate = require('../loadTemplate')

function ComponentInteractionsEndpoint(type) {

    return federate(endpoint, collateSBOL)

    function endpoint(req, callback) {

        console.log('endpoint: ComponentInteractionsEndpoint')

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

        var sbol = new SBOLDocument()

        var query = loadTemplate('./sparql/ComponentInteractions.sparql', {           
            uri: uri
        });

        console.log(query)

        repo.sparql(query, function(err, type, results) {

            if(err)
                return callback(err);

            console.log(results)

            var interactionURIs = []
           
            results.forEach((result) => {

                interactionURIs.push(result.module)
                interactionURIs.push(result.interaction)

            })

            getSBOL(sbol, repo, interactionURIs, (err, sbol) => {

                if(err)
                    return callback(err)

                callback(null, 200, {
                    mimeType: 'application/rdf+xml',
                    body: sbol.serializeXML({
                        'xmlns:igem': 'http://parts.igem.org/',
                        'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
                        'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
                        'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#',
                        'xmlns:sbol1' : 'http://sbols.org/sbol.owl#',                        
                        'xmlns:synbiohub' : 'http://synbiohub.org#',                        
                    })
                })
            })
        })

    }
}

module.exports = ComponentInteractionsEndpoint


