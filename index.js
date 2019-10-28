var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express();
app.use(bodyParser.json());

var audiodata = require('./fileids.json');

//app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/singers', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/style.css', function(req, res){
  res.sendFile(path.join(__dirname, 'style.css'));
})

app.get('/runtest.js', function(req, res){
  res.sendFile(path.join(__dirname, 'runtest.js'));
})

app.post('/nextaudio', function(req, res){
  var optionlist = [];
  var correctanswer = -1;
  var correctanswerid = -1;
  var filelink = "";

  var past5ids = req.body.past5ids;
  var usedids = [];
  while(optionlist.length < 4){
    var randindex = Math.floor(Math.random()*audiodata.names.length);
    if(past5ids.indexOf(randindex)!=-1)continue;
    if(usedids.indexOf(randindex)!=-1)continue;
    usedids.push(randindex);
    optionlist.push(audiodata.names[randindex]);
  }
  correctanswer = Math.floor(Math.random()*4);
  correctanswerid = usedids[correctanswer];
  filelink = audiodata.links[correctanswerid];

  res.json({
    optionlist,
    correctanswer,
    correctanswerid,
    filelink
  })
})

app.post('/nextaudiosinger', function(req, res){
  var optionlist = [];
  var correctanswer = -1;
  var correctanswerid = -1;
  var filelink = "";

  var past5ids = req.body.past5ids;
  var usedids = [];

  var past5names = [];
  var usednames = [];

  for(var i = 0; i < 5; i++){
    past5names.push(audiodata.singers[past5ids[i]]);
  }
  while(optionlist.length < 4){
    var randindex = Math.floor(Math.random()*audiodata.singers.length);
    if(past5names.indexOf(audiodata.singers[randindex])!=-1)continue;
    if(usednames.indexOf(audiodata.singers[randindex])!=-1)continue;
    if(audiodata.singers[randindex].length==0)continue;
    usedids.push(randindex);
    optionlist.push(audiodata.singers[randindex]);
  }
  correctanswer = Math.floor(Math.random()*4);
  correctanswerid = usedids[correctanswer];
  filelink = audiodata.links[correctanswerid];

  res.json({
    optionlist,
    correctanswer,
    correctanswerid,
    filelink
  })
})

var server = http.createServer(app);

var port = process.env.PORT || 3000;
server.listen(port);
console.log("Server started on "+port)