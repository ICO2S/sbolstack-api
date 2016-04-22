
var SesameFrontend = require('openrdf-sesame-js').SesameFrontend

var uuid = require('node-uuid')

var config = require('config')

var loadTemplate = require('../loadTemplate')

function CreateStoreEndpoint(req, res, next) {

    var storeTitle = req.body.title || ''

    var triplestoreUrl = config.get('triplestore').url
    var triplestore = new SesameFrontend(triplestoreUrl)

    var id
   
    if(req.body.storeName)
        id = req.body.storeName
    else
        id = uuid.v1()

    var repoUrl = triplestoreUrl + '/repositories/' + id

    triplestore.getRepositories((err, repos) => {

        if(err) {
            console.log('body: ' + response.body)
            return next(err)
        }

        console.log(repos)

        repos.forEach((repo) => {

            if(repo.id === 'SYSTEM') {

                var ttl = loadTemplate('./turtle/lucene4.trig', {
                    id: id,
                    title: storeTitle
                })

                repo.post(ttl, 'application/trig', (err, response) => {

                    if(err) {
                        console.log('body: ' + response.body)
                        return next(err)
                    }

                    res.send(repoUrl)
                })
            }

        })

    })
}

module.exports = CreateStoreEndpoint


