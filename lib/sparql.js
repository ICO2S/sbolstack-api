
const config = require('config')
const request = require('request')

const sparqlResultsToArray = require('./sparql-results-to-array')

const Timer = require('./execution-timer')

function escapeSparqlIRI(uri) {

    return '<' + uri + '>';

}

function query(sparql, graphName, accept, callback) {

    const triplestoreConfig = config.get('triplestore')

    const graphUri = graphName ?
            triplestoreConfig.graphPrefix + graphName :
            triplestoreConfig.defaultGraph

    request({

        method: 'get',
        url: triplestoreConfig.sparqlEndpoint,
        qs: {
            query: sparql,
            'default-graph-uri': graphUri
        },
        headers: {
            accept: accept
        }

    }, (err, res, body) => {

        if(err) {
            callback(err)
            return
        }

        if(res.statusCode >= 300) {
            callback(new Error(body))
            return
        }

        callback(null, res.headers['content-type'], body)
    })

}

function queryJson(sparql, graphName, callback) {

    console.log(sparql)

    const timer = Timer('sparql query')

    query(sparql, graphName, 'application/sparql-results+json', (err, type, results) => {

        timer()

        if(err) {
            callback(err)
            return
        }

        results = JSON.parse(results)

        callback(null, sparqlResultsToArray(results))


    })

}

function upload(graphName, data, type, callback) {

    const triplestoreConfig = config.get('triplestore')

    const graphUri = graphName ?
            triplestoreConfig.graphPrefix + graphName :
            triplestoreConfig.defaultGraph

    request({

        method: 'POST',
        url: triplestoreConfig.graphStoreEndpoint,
        qs: {
            'graph-uri': graphUri,
        },
        auth:  {
            user: triplestoreConfig.username,
            pass: triplestoreConfig.password,
            sendImmediately: false
        },
        headers: {
            'content-type': type
        },
        body: data

    }, (err, res, body) => {

        if(err) {
            return callback(err)
        }

        if(res.statusCode >= 300) {
            return callback(new Error(body))
        }

        callback(null, body)
    })

}

module.exports = {

    escape: require('pg-escape'),
    escapeIRI: escapeSparqlIRI,
    query: query,
    queryJson: queryJson,
    upload: upload,
}


