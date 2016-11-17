
var sparql = require('./sparql');

var config = require('config')

var CountEndpoint = require('./endpoint/CountEndpoint');
var RetrieveSBOLEndpoint = require('./endpoint/RetrieveSBOLEndpoint');
var SearchSBOLEndpoint = require('./endpoint/SearchSBOLEndpoint');
var SearchMetadataEndpoint = require('./endpoint/SearchMetadataEndpoint');
var SearchMetadataCountEndpoint = require('./endpoint/SearchMetadataCountEndpoint');
var SearchSBOLComponentSummaryEndpoint = require('./endpoint/SearchSBOLComponentSummaryEndpoint');
var SearchSBOLComponentSummaryCountEndpoint = require('./endpoint/SearchSBOLComponentSummaryCountEndpoint');
var SPARQLEndpoint = require('./endpoint/SPARQLEndpoint')
var PrefixesEndpoint = require('./endpoint/PrefixesEndpoint')
var MetadataEndpoint = require('./endpoint/MetadataEndpoint')
var UploadEndpoint = require('./endpoint/UploadEndpoint')
var ComponentInteractionsEndpoint = require('./endpoint/ComponentInteractionsEndpoint');

var auth = require('./auth')

module.exports = function App() {

    var express = require('express');
    var bodyParser = require('body-parser');
    var cors = require('cors');
    var fs = require('fs')

    var morgan = require('morgan');

    var app = express();

    app.use(morgan('combined'));
    app.use(cors());

    app.use(express.static('public'))

    app.get([
        '/sparql',
        '/store/:store/sparql'
    ], auth.sparql, SPARQLEndpoint)

    app.post([
        '/sparql',
        '/store/:store/sparql'
    ], auth.sparql, bodyParser.urlencoded(), SPARQLEndpoint)

    app.get([
        '/prefixes',
    ], PrefixesEndpoint)

    app.get([
        '/component/count',
        '/store/:store/component/count'
    ], auth.retrieve, CountEndpoint('ComponentDefinition'))

    app.get([
        '/component/search/sbol',
        '/store/:store/component/search/sbol'
    ], auth.retrieve, SearchSBOLEndpoint('ComponentDefinition'));

    app.get([
        '/component/search/metadata',
        '/store/:store/component/search/metadata'
    ], auth.retrieve, SearchMetadataEndpoint('ComponentDefinition'));

    app.get([
        '/component/search/metadata/count',
        '/store/:store/component/search/metadata/count'
    ], auth.retrieve, SearchMetadataCountEndpoint('ComponentDefinition'));

    app.post([
        '/component/search/sbol',
        '/store/:store/component/search/sbol'
    ], auth.retrieve, bodyParser.json(), SearchSBOLEndpoint('ComponentDefinition'));

    app.post([
        '/component/search/metadata',
        '/store/:store/component/search/metadata'
    ], auth.retrieve, bodyParser.json(), SearchMetadataEndpoint('ComponentDefinition'));

    app.post([
        '/component/search/metadata/count',
        '/store/:store/component/search/metadata/count'
    ], auth.retrieve, bodyParser.json(), SearchMetadataCountEndpoint('ComponentDefinition'));

    app.get([
        '/component/:uri/sbol',
        '/store/:store/component/:uri/sbol'
    ], auth.retrieve, RetrieveSBOLEndpoint('ComponentDefinition'));

    app.get([
        '/component/:uri/interactions',
        '/store/:store/component/:uri/interactions'
    ], auth.retrieve, ComponentInteractionsEndpoint('ComponentDefinition'));

    app.get([
        '/component/:uri/metadata',
        '/store/:store/component/:uri/metadata'
    ], auth.retrieve, MetadataEndpoint)

    app.get([
        '/component/:prefix/:uri/sbol',
        '/store/:store/component/:prefix/:uri/sbol'
    ], auth.retrieve, RetrieveSBOLEndpoint('ComponentDefinition'));

    app.get([
        '/component/:prefix/:uri/interactions',
        '/store/:store/component/:prefix/:uri/interactions'
    ], auth.retrieve, ComponentInteractionsEndpoint('ComponentDefinition'))

    app.post([
        '/component/search/template',
        '/store/:store/component/search/template'
    ], auth.retrieve, bodyParser.urlencoded(), SearchSBOLComponentSummaryEndpoint());    

    app.post([
        '/component/count/template',
        '/store/:store/component/count/template'
    ], auth.retrieve, bodyParser.urlencoded(), SearchSBOLComponentSummaryCountEndpoint());    

    app.get([
        '/module/count',
        '/store/:store/module/count'
    ], auth.retrieve, CountEndpoint('ModuleDefinition'));

    app.get([
        '/module/search/sbol',
        '/store/:store/module/search/sbol'
    ], auth.retrieve, SearchSBOLEndpoint('ModuleDefinition'));

    app.get([
        '/module/search/metadata',
        '/store/:store/module/search/metadata'
    ], auth.retrieve, SearchMetadataEndpoint('ModuleDefinition'));

    app.get([
        '/module/:uri/sbol',
        '/store/:store/module/:uri/sbol'
    ], auth.retrieve, RetrieveSBOLEndpoint('ModuleDefinition'));

    app.get([
        '/sequence/count',
        '/store/:store/sequence/count'
    ], auth.retrieve, CountEndpoint('Sequence'));

    app.get([
        '/sequence/search/sbol',
        '/store/:store/sequence/search/sbol'
    ], auth.retrieve, SearchSBOLEndpoint('Sequence'));

    app.get([
        '/sequence/search/metadata',
        '/store/:store/sequence/search/metadata'
    ], auth.retrieve, SearchMetadataEndpoint('Sequence'));

    app.get([
        '/sequence/:uri/sbol',
        '/store/:store/sequence/:uri/sbol'
    ], auth.retrieve, RetrieveSBOLEndpoint('Sequence'));

    app.get([
        '/collection/count',
        '/store/:store/collection/count'
    ], auth.retrieve, CountEndpoint('Collection'));

    app.get([
        '/collection/:uri/sbol',
        '/store/:store/collection/:uri/sbol'
    ], auth.retrieve, RetrieveSBOLEndpoint('Collection'));

    app.post([
        '/collection/search/sbol',
        '/store/:store/collection/search/sbol'
    ], auth.retrieve, SearchSBOLEndpoint('Collection'));

    app.post([
        '/collection/search/metadata',
        '/store/:store/collection/search/metadata'
    ], auth.retrieve, SearchMetadataEndpoint('Collection'));

    app.post([
        '/',
        '/store/:store'
    ], auth.upload, bodyParser.text({
        type: '*/*',
        limit: config.get('uploadLimit')
    }), UploadEndpoint)


    var guiIndex = require('./gui/index'),
        guiSparql = require('./gui/sparql')

    app.get('/', guiIndex)
    app.get('/gui/sparql', guiSparql)

    return app;

}

