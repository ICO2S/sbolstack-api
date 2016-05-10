
var SBOLDocument = require('sboljs');

var fork = require("child_process").fork;

var blockingThreshold = 1024 * 4;

function sbolRdfToXml(rdf, callback)
{
    if(rdf.length > blockingThreshold)
    {
        sbolRdfToXmlAsync(rdf, callback);
    }
    else
    {
        SBOLDocument.loadRDF(rdf, function(err, sbol) {
            if(err) {
                
                callback(err);

            } else {
                callback(null, sbol.serializeXML({
                    'xmlns:igem': 'http://parts.igem.org/',
                    'xmlns:ncbi': 'http://www.ncbi.nlm.nih.gov#',
                    'xmlns:rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
                    'xmlns:sybio' : 'http://www.sybio.ncl.ac.uk#', 
                    'xmlns:sbol1' : 'http://sbols.org/sbol.owl#',
                    'xmlns:synbiohub' : 'http://synbiohub.org#',                        
                    'xmlns:ecolikb': 'http://ecolikb.org#'
                }));
            }

        });
    }
}

function sbolRdfToXmlAsync(rdf, callback)
{
    var childProcess = fork(__dirname + "/sbolRdfToXmlWorker");

    childProcess.send({ rdf: rdf });

    childProcess.on('message', function(data) {

        console.log('received xml from worker process, length ' + data.xml.length);

        childProcess.send({ done: true });
    
        callback(null, data.xml);
    });

    childProcess.on('exit', function() {

        console.log('worker process exited');
    
    });
}

module.exports = sbolRdfToXml;



