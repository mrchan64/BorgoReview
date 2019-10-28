var optstore = [];
optstore[0] = $('#opt0');
optstore[1] = $('#opt1');
optstore[2] = $('#opt2');
optstore[3] = $('#opt3');

var correctoption = -1;

var past5ids = [];

var musicplayer = $('#musicplayer')[0];

var numtotal = 0;
var numcorrect = 0;

var isartist = window.location.href.indexOf('singers') != -1;

if(isartist) $('#testtype').attr("value", "Test Song Names Instead");

function getNextTest(){
  var url = isartist ? '/nextaudiosinger' : '/nextaudio';
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({'past5ids': past5ids}),
    contentType: 'application/json',
    dataType:'json',
    success: (data)=>{
      optstore[0].removeClass("wrong-butt selected right-butt disable-butt")
      optstore[1].removeClass("wrong-butt selected right-butt disable-butt")
      optstore[2].removeClass("wrong-butt selected right-butt disable-butt")
      optstore[3].removeClass("wrong-butt selected right-butt disable-butt")
      optstore[0].attr("value", data.optionlist[0])
      optstore[1].attr("value", data.optionlist[1])
      optstore[2].attr("value", data.optionlist[2])
      optstore[3].attr("value", data.optionlist[3])
      past5ids.push(data.correctanswerid);
      correctoption = data.correctanswer;
      $('#score').html('Score: '+numcorrect+' / '+numtotal);
      numtotal++;
      if(past5ids.length > 5) past5ids.shift();
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
    },
    error: (error)=>{
      console.log("error loading next test")
    }
  });
}

function optsel(num){
  for(var i = 0; i<4; i++){
    if(i==correctoption){
      optstore[i].addClass("right-butt disable-butt")
    }else{
      optstore[i].addClass("wrong-butt disable-butt")
    }
    if(i==num){
      optstore[i].addClass("selected")
    }
  }
  if(num==correctoption){
    numcorrect++;
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

getNextTest();

if(document.cookie.indexOf('nightmode=true')!=-1){
  toggleNightMode();
  $('#nightmode').prop('checked', 'true')
}

function toggleTestType() {
  if(isartist) window.location = "/";
  else window.location = "/singers"
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