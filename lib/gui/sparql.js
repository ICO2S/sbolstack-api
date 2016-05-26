
var pug = require('pug')

var extend = require('xtend')

var defaultLocals = require('./defaultLocals')

var config = require('config')

var async = require('async')

var SesameFrontend = require('openrdf-sesame-js').SesameFrontend

function guiSparql(req, res) {

    var triplestoreUrl = config.get('triplestore').url
    var triplestore = new SesameFrontend(triplestoreUrl)

    var endpoints

    triplestore.getRepositories(function(err, repos) {

        if(err) {
            res.status(500).send('Error connecting to triplestore: ' + triplestoreUrl)
            return
        }

        endpoints = repos.filter((repo) => {

            return repo.id !== 'SYSTEM'

        }).map((repo) => {

            var uri = repo.id === config.get('triplestore').defaultStore ?
                '/sparql' : 
                '/store/' + repo.id + '/sparql'

            return {
                name: repo.id,
                uri: uri,
                modes: [ 'sparql11' ],
                queries: []
            }
        })

        renderPage()
    })

    function renderPage() {

        var sampleQuery1 = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX frbr: <http://purl.org/vocab/frbr/core#>\nPREFIX dct: <http://purl.org/dc/terms/>\n\nSELECT ?work ?date ?title WHERE {\n\t?work a frbr:Work .\n\t?work dct:title ?title .\n\t?work dct:created ?date .\n\tFILTER (?date >= '2010-10-15'^^xsd:date)\n}\nORDER BY desc(?date)\nLIMIT 100";

        var sampleQuery2 = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nCONSTRUCT {?s ?p ?o}\nWHERE {\n\tGRAPH <http://www.legislation.gov.uk/id/uksi/2010/2581>\n\t{?s ?p ?o}\n}";

        var sampleQuery3 = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX gzt: <http://www.gazettes-online.co.uk/ontology#>\n\nSELECT ?n WHERE {\n\t?n a gzt:Notice .\n\t?n gzt:hasPublicationDate ?d .\n\tFILTER (?d >= '2010-09-01'^^xsd:date)\n}\nORDER BY ?d\nLIMIT 100";

        var prefixes = config.get('prefixes')

        var namespaces = Object.keys(prefixes).map((prefixName) => {

            return {
                name: prefixName,
                prefix: prefixName,
                uri: prefixes[prefixName]
            }

        })

        var flintConfig = {
            namespaces: namespaces,
            endpoints: endpoints,
            interface: {
                toolbar: true,
                menu: true
            },
            "defaultEndpointParameters" : {
                "queryParameters" : {
                    "format" : "output",
                    "query" : "query",
                    "update" : "update"
                },
                "selectFormats" : [ {
                    "name" : "SPARQL-XML",
                    "format" : "sparql",
                    "type" : "application/sparql-results+xml"
                }, {
                    "name" : "JSON",
                    "format" : "json",
                    "type" : "application/sparql-results+json"
                } ],
                "constructFormats" : [ {
                    "name" : "RDF/XML",
                    "format" : "rdfxml",
                    "type" : "application/rdf+xml"
                }, {
                    "name" : "Turtle",
                    "format" : "turtle",
                    "type" : "application/turtle"
                } ]
            },
            defaultModes: [ {
                "name" : "SPARQL 1.1 Query",
                "mode" : "sparql11query"
            }]
        }

        res.send(pug.renderFile('template/sparql.jade', extend(defaultLocals(), {
            currentPage: 'sparql',
            flintConfig: flintConfig
        })))
    }
}


module.exports = guiSparql

