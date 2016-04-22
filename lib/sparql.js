
module.exports = {

    escape: require('pg-escape'),

    /* TODO
     */
    escapeIRI: function escapeSparqlIRI(uri) {

        return '<' + uri + '>';

    }

}


