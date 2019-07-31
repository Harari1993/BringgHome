var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Task = require('./api/models/bringgExeModel'), //created model loading here
    bodyParser = require('body-parser');

mongoose.Promise =  global.Promise;
mongoose.connect('mongodb://localhost/Orderdb');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/bringgExeRoutes');
routes(app);

app.listen(port);

console.log('Bringg Exe RESTful API server started on: ' + port);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});