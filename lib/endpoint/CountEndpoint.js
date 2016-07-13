
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

var federate = require('../federate')
var collateCounts = require('../collateCounts')

function CountEndpoint(type) {

    var query = loadTemplate('./sparql/Count.sparql', {
        type: type
    })

    function count(req, callback) {

        console.log('endpoint: CountEndpoint')

        var repo = getRepository(req)

        repo.sparql(query, function(err, type, result) {

            if(err) {

                callback(err)

            } else {

                callback(null, 200, {
                    mimeType: 'text/plain',
                    body: result[0].count.toString()
                })

            }
        });

    }

    return federate(count, collateCounts)
}

module.exports = CountEndpoint;


