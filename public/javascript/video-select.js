
// -------------------------------------------

// Get the list of available video sources

function initVideoSelect() {

  navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  var select = document.getElementById("select-video");

  // fill in the select box with the video options

  easyrtc.getVideoSourceList(function(list) {
    var i;
    for (i = 0; i < list.length; i++) {
     //alert("Facing=", list[i].facing, "Label=", list[i].label , "id= ", list[i].id);
      var opt = list[i].facing;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);
    }
  });
}

//initVideoSelect();

/// setVideoObjectSrc( vObj, stream)   takes a blob URL

//called after initMediaSource

//call befor easyrtc.enableVideo

// initMediaSource(successCallback, errorCallback, streamName)

// easyrtc.getLocalStream()



// Grab the selected value

//$("#select-video").change(function() {
//  var selectedValue = $(this).find(":selected").val();
//  //alert("the value you selected: " + selectedValue);
//
//  var constraints = {
//    video: {
//      optional: [{
//        sourceId: selectedValue
//      }]
//    }
//  };


// navigator.getUserMedia(constraints, successCallback, errorCallback);

// easyrtc.setVideoSource(selectedValue);
// easyrtc.setVideoObjectSrc(document.getElementById("box0"), selectedValue);


// //easyrtc.initMediaSource(
// //  function(stream) {
// //    createLocalVideo(stream, selectedValue);
// //  })

// easyrtc.initMediaSource(
//        function(mediastream){
//            easyrtc.setVideoObjectSrc( document.getElementById("box0"), mediastream);
//        },
//        function(errorCode, errorText){
//             easyrtc.showError(errorCode, errorText);
//        });
//

//;



//unction createLocalVideo(stream, streamName) {
//ar v = $( "#box0" );
//   addMediaStreamToDiv(v, stream, streamName);
//


//unction addMediaStreamToDiv(divId, stream)
//
//   var video = $( "#box0" );
//   //alert("video at addmedia:", video);
//      video.autoplay = true;
//   video.muted = false;
//   easyrtc.setVideoObjectSrc(video, stream);
//

//unction successCallback(stream) {
// var videoElement = $( '#box0' );
// console.log("videoElement:", videoElement);
// window.stream = stream; // make stream available to console
// videoElement.src = window.URL.createObjectURL(stream);
// videoElement.play();
//

//unction errorCallback(error){
// console.log('navigator.getUserMedia error: ', error);
//

//function addSrcButton(buttonLabel, videoId) {
//    var button = createLabelledButton(buttonLabel);
//    button.onclick = function() {
//        easyrtc.setVideoSource(videoId);
//        easyrtc.initMediaSource(
//                function(stream) {
//                    createLocalVideo(stream, buttonLabel)
//                },
//                function(errCode, errText) {
//                    easyrtc.showError(errCode, errText);
//                }, buttonLabel);
//    };
//}





//function getSelectedVideo() {
// get the selected value

//var selectedVideo = $( "#select-video option:selected" ).text();

//alert("Your Video is:", selectedVideo);

//( "select" )
// .change(function () {
//   var str = "";
//   $( "select option:selected" ).each(function() {
//     str += $( this ).text() + " ";
//   });
//   $( "div" ).text( str );
// })
// .change();

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