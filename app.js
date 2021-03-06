var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect')

var log4js = require('./util/log');
var logger = log4js.logger('app');
var routes = require('./routes/index');
var users = require('./routes/users');
var blog = require('./routes/blog');
var photo = require('./routes/photo');
var broadcast = require('./routes/broadcast');
var friends = require('./routes/friends');
var feed = require('./routes/feed');
var review = require('./routes/review')
var message = require('./routes/message');
var short_messages = require('./routes/short_messages')
var filter = require('./util/filter');

var app = express();

app.set('port', process.env.PORT || 80);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

log4js.use(app);
app.use(favicon());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(connect.session({secret: 'douer'}))
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
// app.use(function(req, res, next) {
//     res.on('header', function () {
//         logger.info('Headers going to  be written.');
//     });
//     next()
// });
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.get(/^(?!.*logout|.*register)/, filter.check_cookie);
app.get(/^(?!.*login|.*register|.*signup)/, filter.authorize);
app.use('/:id/*', filter.get_user_profile);
// app.use('/', routes);
app.use('/', users);
app.use('/:id', blog);
app.use('/:id', photo);
app.use('/:id', broadcast);
app.use('/:id', friends);
app.use('/:id', feed);
app.use('/:id', review);
app.use('/:id', message);
app.use('/:id', short_messages)

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//log4js

// log4js.configure({
//     appenders: [
//         {type: 'console'},
//         {type       : 'file',
//          filename   : 'logs/access.log',
//          maxLogSize : 1024,
//          backup     : 4,
//          category   : 'normal'
//         }
//     ],
//     replaceConsole: true
// });

// app.use(function (name) {
//     var logger = log4js.getLogger(name);
//     logger.setLevel('DEBUG');
//     return logger;
// })
// app.use(log4js.connectLogger(this.logger('normal'), {level: 'auto', format: ':method :url'}));

app.listen(app.get('port'));
module.exports = app;

logger.info('douer service start...')
