
var loadTemplate = require('../loadTemplate')

var getRepository = require('./getRepository')

function UploadEndpoint(req, res, next) {

    console.log('endpoint: UploadEndpoint')

    var repo = getRepository(req)

    repo.post(req.body, req.headers['content-type'], (err, callback) => {

        if(err) {
            return next(err)
        }

        res.status(200).send('ok')
    })
}

module.exports = UploadEndpoint


