
var SBOLDocument = require('sboljs');

const getRdfSerializeAttribs = require('./getRdfSerializeAttribs')

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

        var xml = sbol.serializeXML(getRdfSerializeAttribs())

        console.log('worker process: posting back XML length ' + xml.length);

        process.send({ xml: xml });
    });
});



