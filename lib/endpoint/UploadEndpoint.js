
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function UploadEndpoint(req, res, next) {

    var repo = getRepository(req)

    repo.post(req.body, 'application/rdf+xml', (err, callback) => {

        if(err) {
            return next(err)
        }

        res.status(200).send('ok')
    })
}

module.exports = UploadEndpoint


