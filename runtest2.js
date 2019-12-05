var correctData = {};
var optiondata = {};

var past5ids = [];

var musicplayer = $('#musicplayer')[0];

var numtotal = 0;
var numcorrect = 0;

var maxids = -1;

var answersubmitted = true;

function getNextTest(){
  if(!answersubmitted)return;
  var url = '/nextaudio2';
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({'past5ids': past5ids}),
    contentType: 'application/json',
    dataType:'json',
    success: (data)=>{
      if(data.correctsinger == -1 || data.correctsong == -1) console.log("Something in the return data could not be found???");
      $('#artistdrop').removeClass('correct wrong');
      $('#songdrop').removeClass('correct wrong');
      $('#corrartist').html('');
      $('#corrsong').html('');
      $('#corrartist').removeClass('correct wrong');
      $('#corrsong').removeClass('correct wrong');
      correctData.correctsinger = data.correctsinger;
      correctData.correctsong = data.correctsong;
      past5ids.push(data.correctanswerid);
      if(past5ids.length > data.idlimit) past5ids.shift();
      maxids = data.idlimit;

      $('#score').html('Score: '+numcorrect+' / '+numtotal);
      numtotal+=2;
      $('#sourcefile').attr("src", data.filelink)
      musicplayer.load();
      musicplayer.pause();
      if($('#skip10').is(":checked")) musicplayer.currentTime = 10;
      else musicplayer.currentTime = 0;
      if($('#play2x').is(":checked")) musicplayer.playbackRate=2;
      else musicplayer.playbackRate=1;
      musicplayer.oncanplay = ()=>{
        musicplayer.play();
        if(!musicplayer.paused)$('#playbutt').attr('value', 'Pause');
      }
      $('#checksong').attr('value', 'Check Answer')
    },
    error: (error)=>{
      console.log("error loading next test")
    }
  });
}

function checkSong(){
  if(answersubmitted){
    getNextTest();
    answersubmitted = false;
  }else{
    $('#corrartist').html((correctData.correctsinger+1)+'. '+optiondata.singerchoices[correctData.correctsinger]);
    if($('#artistdrop').val()==correctData.correctsinger){
      numcorrect++;
      $('#artistdrop').addClass('correct');
      $('#corrartist').addClass('correct');
    }else{
      $('#artistdrop').addClass('wrong');
      $('#corrartist').addClass('wrong');
    }

    $('#corrsong').html((correctData.correctsong+1)+'. '+optiondata.namechoices[correctData.correctsong]);
    if($('#songdrop').val()==correctData.correctsong){
      numcorrect++;
      $('#songdrop').addClass('correct');
      $('#corrsong').addClass('correct');
    }else{
      $('#songdrop').addClass('wrong');
      $('#corrsong').addClass('wrong');
    }

    $('#checksong').attr('value', 'Next Song')
    answersubmitted = true;
  }
}

function togglePlay(){
  if(musicplayer.paused){
    musicplayer.play();
    $('#playbutt').attr('value', 'Pause')
  }else{
    musicplayer.pause();
    $('#playbutt').attr('value', 'Play')
  }
}

function restart(){
  musicplayer.currentTime = 0;
  musicplayer.play();
}

function play2xtoggled(){
  if($('#play2x').is(":checked")) musicplayer.playbackRate=2;
  else musicplayer.playbackRate=1;
}

var night = false;

function toggleNightMode() {
  if(night){
    $('*').removeClass('night');
    document.cookie = 'nightmode=false';
  }else{
    $('*').addClass('night');
    document.cookie = 'nightmode=true';
  }
  night = !night;
}

if(document.cookie.indexOf('nightmode=true')!=-1){
  toggleNightMode();
  $('#nightmode').prop('checked', 'true')
}

function resize(){
  if($(window).width() < 750){
    $('#testcol').removeClass('one-half')
    $('#optcol').removeClass('one-half').addClass('resizefix')
  }else{
    $('#testcol').addClass('one-half')
    $('#optcol').addClass('one-half').removeClass('resizefix')
  }
}
resize();
$(window).resize(resize);

// populate options
$.get("allchoices2", (data)=>{
  optiondata = data;
  var artists = $('#artistdrop')
  artists.find('option').remove();
  data.singerchoices.forEach((name, ind)=>{
    artists.append($('<option/>').attr('value', ind).text((ind+1)+". "+name))
  })
  var songs = $('#songdrop')
  songs.find('option').remove();
  data.namechoices.forEach((name, ind)=>{
    songs.append($('<option/>').attr('value', ind).text((ind+1)+". "+name))
  })
})

checkSong();