
var config = require('config')

function defaultLocals() {

    return {
        nav: [
            {
                name: 'index',
                title: 'Status',
                href: '/'
            },
            {
                name: 'sparql',
                title: 'SPARQL',
                href: '/gui/sparql'
            }
        ]
    }

}

module.exports = defaultLocals

