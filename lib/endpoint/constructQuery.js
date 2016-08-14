
var sparql = require('../sparql');

var searchPredicates = {

        'name': {
            predicate: 'dcterms:title',
            type: 'string'
        },

        'description': {
            predicate: 'dcterms:description',
            type: 'string'
        },

        'role': {
            predicate: 'sbol2:role',
            type: 'uri'
        },

        'type': {
            predicate: 'a',
            type: 'uri'
        }
};

function constructQuery(type, criteria) {

    var searchPrefix='http://www.openrdf.org/contrib/lucenesail#';

    if(Array.isArray(criteria) !== true)
        return '';

    return criteria.map(function(opts) {

        var property = searchPredicates[opts.key];

        if(property === undefined)
            return '';

        if(property.type === 'uri') {

            return '?' + type + ' ' + property.predicate
                    + ' ' + sparql.escapeIRI(opts.value) + ' .';

        } else if(property.type === 'string') {

            return sparql.escape(
                '?' + type + ' <' + searchPrefix + 'matches> ?match .' +
                '?match <' + searchPrefix + 'property> ' + property.predicate + ' .' +
                '?match <' + searchPrefix + 'query> %L .',
                opts.value
            );

        }

    }).join(' ');
}

module.exports = constructQuery;

