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
    var emitList = reqBody.emitlist;
    var listenList = reqBody.listenlist;
    if(emitList){
      for(var event of emitList)
        addEmitter(event,ip);
    }
    if(listenList){
     for(var event of listenList)
        addListener(event,ip); 
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

//helpers
function addEmitter(eventName,emitter){
  if(eventDict[eventName]){
    if(eventDict[eventName].emitters.includes(emitter))
      return true;
    eventDict[eventName].emitters.push(emitter);
    return true;
  }
  else{
    eventDict[eventName] = {
      emitters:[emitter],
      listeners:[]
    }
  }
}
function addListener(eventName,listener){
  if(eventDict[eventName]){
    if(eventDict[eventName].listeners.includes(listener))
      return true;
    eventDict[eventName].listeners.push(listener);
    return true;
  }
  else{
    eventDict[eventName] = {
      emitters:[],
      listeners:[listener]
    }
  }
}
