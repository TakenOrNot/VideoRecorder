"use strict";

!function() {

    function init () {
        console.log('init Video Recorder');
        initEvents ();
        initStyle ();
        //initHtml ();
        //initRecorder ();
        
    }

    function initEvents () {
        SWAM.on ( 'keydown', onKeydown );

    }
    
    var checkspecdelay = 2000;
    
    SWAM.on ( 'gameLoaded', init );
    
    
    
    $('body').append ("<div id='reccontainer' style='position: absolute; width: 250px;height: 25px;padding: 5px;background: rgba(0,0,0,0.5);border-radius: 0px 0px 5px 5px;color: #EEE;font-size: 15px;display:none; right: 250px;'> <button id='rec' style='color: transparent;background: darkred;border-radius: 5px; width: 30px;overflow: hidden;height: 30px;background: radial-gradient(ellipse closest-side, rgb(214, 81, 81) 12%, rgb(113, 0, 0) 40%, rgb(109, 109, 109) 51%, rgb(84, 84, 84) 100%);cursor: pointer;top: 2px;right: 2px;position: absolute;'>Start Recording</button><button id='play'>Play</button><button id='download'>Download</button><video id='recorded' playsinline='' loop='' style='width: 100%;top: 30px; left: 0%; height: 300%;position: absolute;'></video></div><div id='recindicator' style='position: absolute; top: 9px; right: 259px; width: 15px; display: none; -webkit-animation: recblink .5s ease-in-out alternate; background: radial-gradient(ellipse closest-side, rgba(255, 0, 0, 0.75) 33%, rgba(255,17,119,0) 100%); opacity: 0; animation-iteration-count:infinite;'>&nbsp;</div>");
    
    function initStyle () {

        const recStyle = `
                    <style id='recStyle'>
                        @-webkit-keyframes recblink {
                          from {
                            opacity: 0;
                          }
                          to {
                            opacity: 1;
                          }
                        }
                    </style>
                `
        $('head').append ( recStyle );
    }
    
    SWAM.on ( 'gamePrep', function loadRecorder () {
    
        console.log('load Recorder');
        
        // Taken from 
        // https://webrtc.github.io/samples/src/content/capture/canvas-video/
        // https://github.com/webrtc/samples/tree/gh-pages/src/content/capture/canvas-video
        
        const mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
        let mediaRecorder;
        let recordedBlobs;
        let sourceBuffer;

        const canvas = document.querySelector('canvas');
        const video = document.querySelector('video');

        //const recordButton = $('#rec');
        const recordButton = document.querySelector('button#rec');
        //const playButton = $('#play');
        const playButton = document.querySelector('button#play');
        //const downloadButton = $('#download');
        const downloadButton = document.querySelector('button#download');
        recordButton.onclick = toggleRecording;
        playButton.onclick = play;
        downloadButton.onclick = download;

        // Start the GL teapot on the canvas
        //main();



        const stream = canvas.captureStream(); // frames per second
        console.log('Started stream capture from canvas element: ', stream);

        function handleSourceOpen(event) {
          console.log('MediaSource opened');
          sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
          console.log('Source buffer: ', sourceBuffer);
        }

        function handleDataAvailable(event) {
          if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
          }
        }

        function handleStop(event) {
          console.log('Recorder stopped: ', event);
          const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
          video.src = window.URL.createObjectURL(superBuffer);
        }

        function toggleRecording() {
          if (recordButton.textContent === 'Start Recording') {
            startRecording();
            $('#recindicator').css({display: "block"});
          } else {
            stopRecording();
            recordButton.textContent = 'Start Recording';
            playButton.disabled = false;
            downloadButton.disabled = false;
            $('#recindicator').css({display: "none"});
          }
        }

        // The nested try blocks will be simplified when Chrome 47 moves to Stable
        function startRecording() {
          let options = {mimeType: 'video/webm'};
          recordedBlobs = [];
          try {
            mediaRecorder = new MediaRecorder(stream, options);
          } catch (e0) {
            console.log('Unable to create MediaRecorder with options Object: ', e0);
            try {
              options = {mimeType: 'video/webm,codecs=vp9'};
              mediaRecorder = new MediaRecorder(stream, options);
            } catch (e1) {
              console.log('Unable to create MediaRecorder with options Object: ', e1);
              try {
                options = 'video/vp8'; // Chrome 47
                mediaRecorder = new MediaRecorder(stream, options);
              } catch (e2) {
                alert('MediaRecorder is not supported by this browser.\n\n' +
                  'Try Firefox 29 or later, or Chrome 47 or later, ' +
                  'with Enable experimental Web Platform features enabled from chrome://flags.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
              }
            }
          }
          console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
          recordButton.textContent = 'Stop Recording';
          playButton.disabled = true;
          downloadButton.disabled = true;
          mediaRecorder.onstop = handleStop;
          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.start(100); // collect 100ms of data
          console.log('MediaRecorder started', mediaRecorder);
        }

        function stopRecording() {
          mediaRecorder.stop();
          console.log('Recorded Blobs: ', recordedBlobs);
          video.controls = true;
        }

        function play() {
          video.play();
        }

        function download() {
          const blob = new Blob(recordedBlobs, {type: 'video/webm'});
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'test.webm';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        }
        
    });
    
    
        $('#selectaircraft-1').click(function (){

            $("#reccontainer").css({display: "none"});

        }); 
        $('#selectaircraft-2').click(function (){

            $("#reccontainer").css({display: "none"});

        });     
        $('#selectaircraft-3').click(function (){

            $("#reccontainer").css({display: "none"});

        });
        $('#selectaircraft-4').click(function (){

            $("#reccontainer").css({display: "none"});

        });
        $('#selectaircraft-5').click(function (){

            $("#reccontainer").css({display: "none"});

        }); 

        
    
    SWAM.on("playerRespawned", function(data){
            let respawnedid = data['id'];
            if (respawnedid == Players.getMe().id){
 
                $("#reccontainer").css({display: "none"});
  
            }
    });
    
    SWAM.on ( 'gamePrep', function (){

        $("#reccontainer").css({display: "none"});
    });
    
    
    
    function onKeydown ( event ) {
        
        if ( event.originalEvent.key === 'v' ) { //note: This is not reliable to know if player is actually spectating

            event.stopImmediatePropagation ();
            
            // game.spectatingID is not reliable, as it is null at first when spectating, until we spectate another player      
            checkspecdelay = 2000;
            checkspec(checkspecdelay)
               
            
        }

        
    }
    
    function onMatchStarted () {
        checkspecdelay = 10000;
        checkspec(checkspecdelay)
    }
    
    function checkspec(checkspecdelay){
        window.setTimeout(function () {
                    if( $('#btnFreeSpectator').css('display') == 'block' ) {
                        console.log("v key pressed, show rec");
                        $("#reccontainer").css({display: "block"});
                        
                    }
                },checkspecdelay); 
    }
    
	// Register
	SWAM.registerExtension({
		name: 'Video Recorder for StarMash',
		id: 'SWAM.Video',
		description: 'Records video of the game.',
		author: 'xplay, thanks to Bombita and Yutru',
		version: '0.1',
        //settingsProvider: createSettingsProvider(),
        //dependencies: [
            //"https://cdn.rawgit.com/spite/ccapture.js/0bb38d6f/build/CCapture.all.min.js"
        //]        
	});
}();