
var config = require('config')
var sparql = require('./lib/sparql');
var SesameFrontend = require('openrdf-sesame-js').SesameFrontend

var triplestoreUrl = config.get('triplestore').url
var triplestore = new SesameFrontend(triplestoreUrl)

var storeName = config.get('triplestore').defaultStore

var createStore = require('./lib/createStore')

triplestore.getRepositories(function(err, repos) {

    if(err) {

        console.log('Error connecting to triplestore: ' + triplestoreUrl)

        return
    }

    var matchingStores = repos.filter((repo) => repo.id === storeName)

    if(matchingStores.length !== 1) {

        console.log('Store matching ID ' + storeName + ' not found')
        console.log('Available stores: ' + repos.map((repo) => repo.id).join(', '))
        console.log('Attempting to create store...')

        createStore(storeName, 'SBOLStackDefaultStore', (err, url) => {

            if(err) {

                console.log('Error creating default store')

            } else {

                run()

            }

        })

    } else {

        run()

    }

})

function run() {

    var App = require('./lib/app');

    var app = App();

    app.listen(config.get('port'));

}


