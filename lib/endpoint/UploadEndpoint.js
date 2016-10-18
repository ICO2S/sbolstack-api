
var loadTemplate = require('../loadTemplate')

var sparql = require('../sparql')

function UploadEndpoint(req, res, next) {

    console.log('endpoint: UploadEndpoint')

    sparql.upload(req.params.store, req.body, req.headers['content-type'], (err, callback) => {

        if(err) {
            return next(err)
        }

        res.status(200).send('ok')
    })
}

module.exports = UploadEndpoint


