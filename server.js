
const config = require('config')

const App = require('./lib/app')

const app = App();

app.listen(config.get('port'))


