const client = require('./elasticclient');
const indexer = require('./indexer');
const cities = require('../data/cities.json');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const indexName = 'city-index';
try {
    indexer.indexCities(cities, indexName);
} catch (e) {
    console.log('Error when indexing data or index already exists', e);
}

const app = express();
app.use(bodyParser.json());
app.set('port', 3001);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.sendFile('template.html', {
        root: path.join(__dirname, 'views')
    });
});

app.get('/search', function (req, res) {
    let body = {
        size: 200,
        from: 0,
        query: {
            match: {
                name: req.query['q']
            }
        }
    }
    client.search({ index: indexName, body: body, type: 'cities_list' })
        .then(results => {
            res.send(results.hits.hits);
        })
        .catch(err => {
            console.log(err)
            res.send([]);
        });

});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
