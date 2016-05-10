
var config = require('config')

var async = require('async')

var request = require('request')

function FederationMiddleware(endpoint, collate) {

    var otherStacks = config.get('otherStacks')

    return function federate(req, res) {

        endpoint(req, onLocalResponse)

        var responses = []
        
        function onLocalResponse(err, statusCode, response) {

            if(err) {

                res.status(500).send(err.stack)
                return

            }

            if(statusCode >= 300) {

                if(statusCode !== 404) {

                    return res.status(statusCode).send(response)

                }

            }

            responses.push(localResponse)

            async.each(otherStacks, onRemoteResponse, onFederationComplete)
        }

        function onRemoteResponse(err, otherStackUrl, next) {

            if(err) {

                res.status(500).send(err.stack)
                return

            }

            request({

                method: req.method,
                uri: otherStackUrl + req.url

            }, (err, remoteResponse) => {

                if(remoteResponse.statusCode > 300) {

                    if(remoteResponse.statusCode === 404) {
                        next()
                    } else {
                        res.status(remoteResponse.statusCode).send(remoteResponse)
                    }

                } else {

                    responses.push(response)
                    next()

                }
            })

        }

        function onFederationComplete(err) {

            if(err) {
                return res.status(500).send(err)
            }

            collate(responses, res)

        }
    }
}

module.exorts = FederationMiddleware

