
var SBOLDocument = require('sboljs');

console.log('worker process initialize');

process.on('message', function(data) {

    if(data.done) {
        process.exit(0);
        return;
    }

    console.log('worker process: received message, loading RDF');

    var rdf = data.rdf;

    SBOLDocument.loadRDF(rdf, function(err, sbol) {

        console.log('worker process: RDF loaded with err ' + err);

        var xml = sbol.serializeXML({
            'xmlns:igem': 'http://parts.igem.org/',
            'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
            'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
            'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#',
            'xmlns:sbol1' : 'http://sbols.org/sbol.owl#'    
        });

        console.log('worker process: posting back XML length ' + xml.length);

        process.send({ xml: xml });
    });
});



