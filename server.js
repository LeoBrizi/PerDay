/*
main dell'applicazione, fa il set up del server
*/
const costanti = require("./config/costanti");
const querystring = require('querystring');
var express = require("express");
var app = express();
var request = require("request");

var pug = require('pug');
var bodyParser = require("body-parser");  //per parsare il body della post
var routes = require('./app/routes/listRoutes');   //importa routes, gestore delle chiamate http
var socket = require('socket.io');

var port = process.env.PORT || costanti.defaultPort;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

//LANCIO SERVER-------------------------------------------------------
var server = app.listen(port,function(){
    console.log("Server running on port "+port);
})

var io = socket(server);

routes(app,request,querystring); 

