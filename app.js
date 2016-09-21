var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
