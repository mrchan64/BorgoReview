var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');

var app = express();
app.use(bodyParser.json());

var audiodata = require('./fileids.json');
var optiondata = require('./testsongs.json');

var audiodata2 = require('./fileids2.json');

function checkTestData() {
  var counter = 0;
  for(var i = 0; i<audiodata.names.length; i++){
    if(audiodata.genres[i]=="")continue;
    var a = -1, b = -1, c = -1
    a = optiondata.artistnames.indexOf(audiodata.singers[i]);
    b = optiondata.genres.indexOf(audiodata.genres[i]);
    if(audiodata.names[i] == "Tutti Frutti 2")
      c = optiondata.songnames.indexOf("Tutti Frutti");
    else if(audiodata.names[i] == "Hound Dog 2")
      c = optiondata.songnames.indexOf("Hound Dog");
    else
      c = optiondata.songnames.indexOf(audiodata.names[i]);
    if(a==-1 || b==-1 || c==-1){
      console.log("Check index "+i+" song: "+audiodata.names[i] + " | "+a+" "+b+" "+c);
      counter++
    }
  }
  console.log("Database has "+counter+" association problems.")
}

function checkTestData2() {
  if(!(audiodata2.links.length == audiodata2.names.length && audiodata2.names.length == audiodata2.singers.length)){
    console.log("Database 2 has some list length problems")
    return;
  }
  audiodata2.namechoices=[];
  audiodata2.singerchoices=[];
  for(var i = 0; i<audiodata2.links.length; i++){
    if(audiodata2.namechoices.indexOf(audiodata2.names[i])==-1)audiodata2.namechoices.push(audiodata2.names[i]);
    if(audiodata2.singerchoices.indexOf(audiodata2.singers[i])==-1)audiodata2.singerchoices.push(audiodata2.singers[i]);
  }
  audiodata2.namechoices.sort();
  audiodata2.singerchoices.sort();
}

//app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})
app.get('/unit2', function(req, res){
  res.sendFile(path.join(__dirname, 'index2.html'));
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

app.get('/runtest2.js', function(req, res){
  res.sendFile(path.join(__dirname, 'runtest2.js'));
})

app.get('/favicon.ico', function(req, res){
  res.sendFile(path.join(__dirname, 'blues-favicon.ico'));
})

app.post('/nextaudio', function(req, res){
  var correctsinger = -1;
  var correctsong = -1;
  var correctgenre = -1;
  var correctanswerid = -1;
  var filelink = "";

  var past5ids = req.body.past5ids;
  while(true){
    var randindex = Math.floor(Math.random()*audiodata.names.length);
    if(past5ids.indexOf(randindex)!=-1)continue;
    if(audiodata.genres[randindex]=="")continue;
    correctanswerid = randindex;
    correctsinger = optiondata.artistnames.indexOf(audiodata.singers[randindex]);
    correctgenre = optiondata.genres.indexOf(audiodata.genres[randindex]);
    filelink = audiodata.links[randindex];

    // temp fix for tf2 and hd2
    if(audiodata.names[randindex] == "Tutti Frutti 2")
      correctsong = optiondata.songnames.indexOf("Tutti Frutti");
    else if(audiodata.names[randindex] == "Hound Dog 2")
      correctsong = optiondata.songnames.indexOf("Hound Dog");
    else
      correctsong = optiondata.songnames.indexOf(audiodata.names[randindex]);
    break;
  }

  res.json({
    correctsinger,
    correctsong,
    correctgenre,
    correctanswerid,
    filelink,
    idlimit: process.env.idlimit || 5
  })
})

app.post('/nextaudio2', function(req, res){
  var correctsinger = -1;
  var correctsong = -1;
  var correctanswerid = -1;
  var filelink = "";

  var past5ids = req.body.past5ids;
  while(true){
    var randindex = Math.floor(Math.random()*audiodata2.names.length);
    if(past5ids.indexOf(randindex)!=-1)continue;
    correctanswerid = randindex;
    correctsinger = audiodata2.singerchoices.indexOf(audiodata2.singers[randindex]);
    correctsong = audiodata2.namechoices.indexOf(audiodata2.names[randindex]);
    filelink = audiodata2.links[randindex];
    break;
  }

  res.json({
    correctsinger,
    correctsong,
    correctanswerid,
    filelink,
    idlimit: process.env.idlimit || 5
  })
})

app.get('/allchoices', function(req, res){
  res.json(optiondata);
})

app.get('/allchoices2', function(req, res){
  var newop = {
    namechoices: audiodata2.namechoices,
    singerchoices: audiodata2.singerchoices
  }
  res.json(newop);
})

checkTestData();
checkTestData2();

var server = http.createServer(app);

var port = process.env.PORT || 3000;
server.listen(port);
console.log("Server started on "+port)