var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var eventDict = {
    'my.sample.package.SAMPLE_EVENT1':{
        emitters:["localhost:1212"],
        listeners:["localhost:2121","localhost:3121"]
    },
    'my.sample.package.SAMPLE_EVENT2':{
        emitters:["localhost:1212"],
        listeners:["localhost:2121","localhost:3121"]
    },
    'my.sample.package.SAMPLE_EVENT3':{
        emitters:["localhost:1212"],
        listeners:["localhost:2121","localhost:3121"]
    }
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/emitters/:evid', function (req, res) {
    if(eventDict[req.params.evid])
        res.send(eventDict[req.params.evid].emitters);
    else
        res.send([]);
});

app.post('/register',function(req,res){
    var reqBody = req.body;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var eventName = reqBody.event;
    if(reqBody.event){
      if(eventName){
        eventDict[eventName].emitters.push(ip);
      }
      else{
        eventDict[eventName].emitters = [ip];
        eventDict[eventName].listeners = [];
      }
      res.status(204).send();
    }
    else{
      res.status(400).send();
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});