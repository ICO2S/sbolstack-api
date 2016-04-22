
var config = require('config')
var basicAuth = require('basic-auth')

function auth(permission) {

    function checkAuth(req, res, next) {

        var users = config.get('users')
        var anonymousPermissions = config.get('anonymousPermissions')

        if(anonymousPermissions.indexOf(permission) !== -1) {
            return next()
        }
        
        var user = basicAuth(req)

        var configUser

        if(user) {

            configUser = users.find(function(configUser) {

                return configUser.name === user.name &&
                            configUser.password === user.pass

            })

        }

        if(!configUser) {

            res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
            return res.send(401)

        } else {

            if(configUser.permissions.indexOf(permission) === -1) {

                return res.send(403)

            } else {

                return next()

            }

        }
    }

    return checkAuth
}

module.exports = {
    users: [],
    create: auth('create'),
    upload: auth('upload'),
    retrieve: auth('retrieve'),
    sparql: auth('sparql')
}

