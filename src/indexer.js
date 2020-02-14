const client = require('./elasticclient');

function createIndex(name) {
    client.indices.create({
        index: name
    }, function (error, response, status) {
        if (error) {
            console.log(error);
        } else {
            console.log(`successfully created the index: ${name}`, response);
        }
    });
}

function loadDataToIndex(data, indexName) {
    var bulk = []

    data.forEach(city => {
        bulk.push({
            index: {
                _index: indexName,
                _type: "cities_list"
            }
        });
        bulk.push(city);
    });

    client.bulk({ body: bulk }, function (err, response) {
        if (err) {
            console.log("Failed to load data into index", err)
        } else {
            console.log("Successfully imported data into index");
        }
    });
}

function indexCities(cities, indexName) {
    const index = indexName ? indexName : "city-index";
    createIndex(index);
    loadDataToIndex(cities, index);
}

module.exports = {
    indexCities: indexCities
};
