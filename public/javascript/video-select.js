
// -------------------------------------------

// temp video stuff
function initVideo() {
  //var video-list;

//navigator.getUserMedia = navigator.getUserMedia ||
 // navigator.webkitGetUserMedia || navigator.mozGetUserMedia;







  var select = document.getElementById("select-video");

  // fill in the select box with the video options

  easyrtc.getVideoSourceList(function(list) {
    var i;
    for (i = 0; i < list.length; i++) {
     alert("Label=" + list[i].label + ", id= " + list[i].id);
      var opt = list[i].label;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
    }
  });
}

initVideo();



//function getSelectedVideo() {
//// get the selected value
//
//var selectedVideo = $( "#select-video option:selected" ).text();
//
//
//$( "select" )
//  .change(function () {
//    var str = "";
//    $( "select option:selected" ).each(function() {
//      str += $( this ).text() + " ";
//    });
//    $( "div" ).text( str );
//  })
//  .change();
//
//}

// ---------------------------------------------------------

// Sample grab a video still

//function grabScreenshot() {
//  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
//  var img = new Image();
//  img.src = canvas.toDataURL("image/png");
//  img.width = 120;
//  ssContainer.appendChild(img);
//}
















//'use strict';
//
//var videoElement = document.querySelector('video');
//var audioSelect = document.querySelector('select#audioSource');
//var videoSelect = document.querySelector('select#videoSource');
//
//navigator.getUserMedia = navigator.getUserMedia ||
//  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//
//function gotSources(sourceInfos) {
//  for (var i = 0; i !== sourceInfos.length; ++i) {
//    var sourceInfo = sourceInfos[i];
//    var option = document.createElement('option');
//    option.value = sourceInfo.id;
//    if (sourceInfo.kind === 'audio') {
//      option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
//      audioSelect.appendChild(option);
//    } else if (sourceInfo.kind === 'video') {
//      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
//      videoSelect.appendChild(option);
//    } else {
//      console.log('Some other kind of source: ', sourceInfo);
//    }
//  }
//}
//
//if (typeof MediaStreamTrack.getSources === 'undefined'){
//  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
//} else {
//  MediaStreamTrack.getSources(gotSources);
//}
//
//
//function successCallback(stream) {
//  window.stream = stream; // make stream available to console
//  videoElement.src = window.URL.createObjectURL(stream);
//  videoElement.play();
//}
//
//function errorCallback(error){
//  console.log('navigator.getUserMedia error: ', error);
//}
//
//function start(){
//  if (!!window.stream) {
//    videoElement.src = null;
//    window.stream.stop();
//  }
//  var audioSource = audioSelect.value;
//  var videoSource = videoSelect.value;
//  var constraints = {
//    audio: {
//      optional: [{sourceId: audioSource}]
//    },
//    video: {
//      optional: [{sourceId: videoSource}]
//    }
//  };
//  navigator.getUserMedia(constraints, successCallback, errorCallback);
//}
//
//audioSelect.onchange = start;
//videoSelect.onchange = start;
//
//start();//