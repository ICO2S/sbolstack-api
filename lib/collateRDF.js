
var async = require('async')

function collateRDF(results, res) {

    for(var i = 0; i < results.length; ++ i) {

        if(results[i].mimeType !== 'application/rdf+xml') {

            res.status(500).send('result collation is only supported for xml serializations')

        }
    }

    async.map(results, (result, next) => {

        var parser = new RdfXmlParser();

        parser.parse(result.body, function(err, graph) {

            if(err)
                return next(err)

            next(null, graph)
        })

    }, (err, graphs) => {

        var mergedGraph = graphs[0]

        for(var i = 0; i < graphs.length; ++ i) {

            mergedGraph.addAll(graphs[i])

        }

        res.header('content-type', 'application/rdf+xml')
        //res.send(JSON.stringify(collatedObject))
        //k now we need to serialize and send it back
    })

}

module.exports = collateRDF



