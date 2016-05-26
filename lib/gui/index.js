
var pug = require('pug')

var extend = require('xtend')

var defaultLocals = require('./defaultLocals')

var config = require('config')

function guiIndex(req, res) {

    res.send(pug.renderFile('template/index.jade', extend(defaultLocals(), {
        currentPage: 'index',
        status: {
            triplestore: config.get('triplestore').url,
        }
    })))

}

module.exports = guiIndex

