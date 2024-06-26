var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var oldChatsRouter = require('./routes/oldChats');
var loadChatRouter = require('./routes/loadChat');
var addPersonRouter = require('./routes/addPerson');
var getWaitingChatsRouter = require('./routes/getWaitingChats');
var acceptChatInvitation = require("./routes/acceptChatInvitation")
var declineChatInvitation = require("./routes/declineChatInvitation");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/chat',chatRouter);
app.use('/signup',signupRouter);
app.use('/login',loginRouter);
app.use('/oldChats',oldChatsRouter);
app.use('/loadChat',loadChatRouter);
app.use('/addPerson',addPersonRouter);
app.use('/getWaitingChats',getWaitingChatsRouter);
app.use("/acceptChatInvitation",acceptChatInvitation);
app.use("/declineChatInvitation", declineChatInvitation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
