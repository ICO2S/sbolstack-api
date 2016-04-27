
var SesameFrontend = require('openrdf-sesame-js').SesameFrontend

var loadTemplate = require('./loadTemplate')

var config = require('config')

function createStore(storeName, storeTitle, callback) {

    var triplestoreUrl = config.get('triplestore').url
    var triplestore = new SesameFrontend(triplestoreUrl)

    var id
   
    if(storeName)
        id = storeName
    else
        id = uuid.v1()

    var repoUrl = triplestoreUrl + '/repositories/' + id

    triplestore.getRepositories((err, repos) => {

        if(err) {
            console.log('body: ' + response.body)
            callback(err)
        }

        console.log(repos)

        repos.forEach((repo) => {

            if(repo.id === 'SYSTEM') {

                var ttl = loadTemplate('./turtle/lucene.trig', {
                    id: id,
                    title: storeTitle
                })

                repo.post(ttl, 'application/trig', (err, response) => {

                    if(err) {
                        console.log('body: ' + response.body)
                        callback(err)
                    }

                    callback(null, repoUrl)
                })
            }

        })

    })

}

module.exports = createStore


