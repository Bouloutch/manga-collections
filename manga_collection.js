var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var jsonfile = require('jsonfile');
var fs = require('fs');
var globalMangas = require('./globalMangas.js');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var app = express();

app.use(session({
    secret: "todosecret"
}));

app.use(express.static('views'));

//mangas
app.get('/mangas', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        res.render("mangas.ejs", {
            mangas: obj.mangas,
            collections: obj.collections,
            locations: obj.locations,
            // id2modif: modif
        });
    }});
})

app.post('/mangas/filter',urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var listMangasFiltered = globalMangas.filterMangasList2(obj.mangas,req.body.collection, req.body.location);
        res.render("mangas.ejs", {
            mangas: listMangasFiltered,
            collections: obj.collections,
            locations: obj.locations,
        });
    }});
})

app.post('/mangas/add', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.collections.forEach(function(element) {
            if(element.name == req.body.collection) {
                element.count++;
            }
        })
        obj.locations.forEach(function(element) {
            if(element.name == req.body.location) {
                element.count++;
            }
        })
        obj.mangas.push({id: obj.mangas.length ,tomeNumber: req.body.tomeNumber,name: req.body.manga, collection: req.body.collection, location: req.body.location}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data.json', json, 'utf8'); // write it back
        res.render("mangas.ejs", {
            mangas: obj.mangas,
            collections: obj.collections,
            locations: obj.locations,
        });
    }});
})

app.get('/mangas/modif/:id', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var element2modif = {};
        obj.mangas.forEach(function(element) {
            if (element.id == req.params.id) {
                element2modif = element;
            }
        })
        res.render("mangasModif.ejs", {
            mangas: obj.mangas,
            collections: obj.collections,
            locations: obj.locations,
            element2modif: element2modif
        });
    }});
})

app.post('/mangas/modif', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.mangas.forEach(function(element) {
                if(element.name == req.body.manga) {
                    element.collection = req.body.collection;
                    element.location = req.body.location;
                }
            });
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('data.json', json, 'utf8'); // write it back
            res.render("mangas.ejs", {
                mangas: obj.mangas,
                collections: obj.collections,
                locations: obj.locations,
                // id2modif: req.params.name
            });
    }});
})

//collections
app.get('/collections', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        res.render('collections.ejs', {
            collections: obj.collections
        });
    }});
})


app.post('/collections/add', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.collections.push({id:obj.collections.length ,name: req.body.collection, count: 0}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data.json', json, 'utf8'); // write it back
        res.render('collections.ejs', {
            collections: obj.collections
        });
    }});
    
})

app.post('/collections/mangas/add', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.collections.forEach(function(element) {
            if(element.name == req.body.collections) {
                element.count++;
                console.log(req.body.collections);
            }
        })
        obj.locations.forEach(function(element) {
            if(element.name == req.body.location) {
                element.count++;
                console.log(req.body.location);
            }
        })
        obj.mangas.push({id: obj.mangas.length ,tomeNumber: req.body.tomeNumber, name: req.body.manga, collection: req.body.collections, location: req.body.location}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data.json', json, 'utf8'); // write it back
        var filteredList = globalMangas.filterMangasList2(obj.mangas,req.body.collections,"");

        res.render('mangasByCollection.ejs', {
            mangas: filteredList,
            collections: req.body.collections,
            locations: obj.locations
        });
    }});
})

app.get('/collections/delete/:id', function (req, res) {
    req.session.collections.splice(req.params.id, 1);
    res.render('liste.ejs', {
        collections: req.session.collections
    });
})

app.get('/collections/filter/:name', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var filteredList = globalMangas.filterMangasList2(obj.mangas,req.params.name,"")
        res.render('mangasByCollection.ejs', {
            mangas: filteredList,
            collections: req.params.name,
            locations: obj.locations
        });
    }});
})


app.get('/locations', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        res.render('locations.ejs', {
            locations: obj.locations
        });
    }});
})


app.post('/locations/add', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.locations.push({id:obj.locations.length ,name: req.body.locations, count: 0}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data.json', json, 'utf8'); // write it back
        res.render('locations.ejs', {
            locations: obj.locations
        });
    }});
    
})

app.post('/locations/mangas/add', urlencodedParser, function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.locations.forEach(function(element) {
            if(element.name == req.body.locations) {
                element.count++;
                console.log(req.body.locations);
            }
        })
        obj.collections.forEach(function(element) {
            if(element.name == req.body.collection) {
                element.count++;
                console.log(req.body.collection);
            }
        })
        obj.mangas.push({id: obj.mangas.length ,tomeNumber: req.body.tomeNumber, name: req.body.manga, collection: req.body.collections, location: req.body.locations}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('data.json', json, 'utf8'); // write it back
        var filteredList = globalMangas.filterMangasList2(obj.mangas,"",req.body.locations);

        res.render('mangasByLocations.ejs', {
            mangas: filteredList,
            collections: obj.collections,
            locations: req.body.locations
        });
    }});
})

app.get('/locations/delete/:id', function (req, res) {
    req.session.collections.splice(req.params.id, 1);
    res.render('liste.ejs', {
        collections: req.session.collections
    });
})

app.get('/locations/filter/:name', function (req, res) {
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        var filteredList = globalMangas.filterMangasList2(obj.mangas,"",req.params.name)
        res.render('mangasByLocations.ejs', {
            mangas: filteredList,
            collections: obj.collections,
            locations: req.params.name
        });
    }});
})

app.listen(8080);