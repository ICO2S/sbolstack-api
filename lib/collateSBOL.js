
var async = require('async')

var SBOLDocument = require('sboljs')

function collateSBOL(documents, res) {

    res.header('content-type', 'application/rdf+xml')

    if(documents.length === 0) {

        /* no results?
         */

        return res.status(404).send('No results to collate')
    }

    //if(documents.length === 1) {

        /* only one result; no collation required
         */

        //return res.send(documents[0].body)
    //}

    var collatedSBOL = new SBOLDocument()

    console.log(documents.length)
    console.log(documents[0])

    async.eachSeries(documents, (document, next) => {

        var done = false

        collatedSBOL.loadRDF(document.body, (err) => {

            if(!done) {
                next(err)
                done = true
            }

        })

    }, (err) => {

        console.log(collatedSBOL.serializeXML({
            'xmlns:igem': 'http://parts.igem.org/',
            'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
            'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
            'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#',
            'xmlns:sbol1' : 'http://sbols.org/sbol.owl#',                        
            'xmlns:synbiohub' : 'http://synbiohub.org#',                        
            'xmlns:ecolikb': 'http://ecolikb.org#'
        }))


        res.send(collatedSBOL.serializeXML({
            'xmlns:igem': 'http://parts.igem.org/',
            'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
            'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
            'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#',
            'xmlns:sbol1' : 'http://sbols.org/sbol.owl#',                        
            'xmlns:synbiohub' : 'http://synbiohub.org#',                        
            'xmlns:ecolikb': 'http://ecolikb.org#'
        }))

    })

}

module.exports = collateSBOL

