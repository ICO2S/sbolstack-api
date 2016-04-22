
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function CountEndpoint(type) {

    var query = loadTemplate('./sparql/Count.sparql', {
        type: type
    })

    return function count(req, res, next) {

        var repo = getRepository(req)

        repo.sparql(query, function(err, type, result) {

            if(err)
                return next(err);

            res.send(result[0].count.toString())

        });

    };
}

module.exports = CountEndpoint;


