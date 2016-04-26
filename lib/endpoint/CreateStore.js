

var createStore = require('../createStore')

function CreateStoreEndpoint(req, res, next) {

    createStore(req.body.storeName, req.body.title, (err, url) => {

        if(err) {

            res.status(500).send(err)

        } else {

            res.send(url)

        }
    })
}

module.exports = CreateStoreEndpoint


