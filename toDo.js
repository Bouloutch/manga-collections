var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var app = express();

app.use(session({
    secret: "todosecret"
}));

app.get('/liste', function (req, res) {
    req.session.taches = [];
    res.render('liste.ejs', {taches: req.session.taches});
})

app.post('/liste/ajouter', urlencodedParser, function (req, res) {
    req.session.taches.push(req.body.todo);
    res.render('liste.ejs', {taches: req.session.taches});
    // res.redirect('/liste');
})

app.get('/liste/supprimer/:id', function (req, res) {
    req.session.taches.splice(req.params.id,1);
    res.render('liste.ejs', {taches: req.session.taches});

})
app.listen(8080);