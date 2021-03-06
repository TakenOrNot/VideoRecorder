"use strict";

!function() {

    function init () {
        console.log('init Video Recorder');
        //initEvents ();
        initStyle ();
        //initHtml ();
        //initRecorder ();
        window.rectimecounterbound = false;
        
    }

    //function initEvents () {
    //    SWAM.on ( 'keydown', onKeydown );

    //}
    
    
    SWAM.on ( 'gameLoaded', init );
    
    function createSettingsProvider()
    {
        // This is the handler that will be executed when new settings are applied
        function onApply(values)
        {
            console.log ("New VideoRec settings applied: ", values);
            settings = values;
            window.vcodec = settings.vcodec;
            window.vquality = settings.vquality;
         
        }

        // Default values for the settings
        let settings = {
            vcodec: "vp9",
            vquality: "2500000"
            
        };

        let sp = new SettingsProvider(settings, onApply);
    
        let section = sp.addSection("Video settings");
        section.addValuesField("vcodec", "Codec",
        {
            "vp8": "VP8",
            "vp9": "VP9",
        });
        section.addValuesField("vquality", "Video quality",
        {
            "1500000": "very low",
            "2000000": "low",
            "2500000": "medium",
            "3000000": "high"
        });

        
        
        // we return our SettingsProvider instance
        return sp;
    }
    
    
    $('body').append ("<div id='reccontainer' style='position: absolute; width: 250px;height: 25px;padding: 5px;background: rgba(0,0,0,0.5);color: #EEE;font-size: 15px; right: 250px;'> <button id='play' style='display:none;'>Play</button><button id='download'>Download</button><video id='recorded' playsinline='' style='width: 258px;border: 1px inset rgba(0,0,0,0.9);top: 35px; left: 0%; position: absolute; display:none;'></video><div id='closerec' style='position: absolute;right: 8px;top: 8px;opacity: .8;cursor: pointer;'>✕</div></div><button id='rec' style='color: transparent;border-radius: 5px; width: 30px;overflow: hidden;height: 30px;background: radial-gradient(ellipse closest-side, rgb(214, 81, 81) 12%, rgb(113, 0, 0) 40%, rgb(109, 109, 109) 51%, rgb(84, 84, 84) 100%);cursor: pointer;top: 2px;right: 282px;position: absolute;'>Start Recording</button><div id='rectime' style='display: inline;text-align: right;float: right;margin-right: 35px;color: #c70000;font-size: 12px;position: absolute;right: 285px;top: 10px;cursor: pointer;'></div>");
    
    $("#closerec").click(function (){
        //$("#reccontainer").css({display: "none"});
        $("#reccontainer").addClass('closehide');
        $("#reccontainer").removeClass('visible');
    });
    
    $("#rectime").click(function (){
        $("#reccontainer").removeClass('closehide');
        $("#reccontainer").addClass('visible');
    
    });
        
    function initStyle () {

        const recStyle = `
                    <style id='recStyle'>
                        .spectatorMode > #reccontainer {
                            display: block;
                        }

                        #reccontainer {
                            display: none;
                        }

                        #reccontainer.closehide {
                            display: none;
                        }
                        #reccontainer.visible {
                            display: block;
                        }

 
                        .recindicator {
                            -webkit-animation: recblink .5s ease-in-out alternate;
                            background: radial-gradient(ellipse closest-side, rgba(255, 0, 0, 0.75) 33%, rgba(255,17,119,0) 100%);
                            
                            animation-iteration-count: infinite;
                        }
                        
                        @-webkit-keyframes recblink {
                              from {

                                radial-gradient(ellipse closest-side, rgb(214, 81, 81) 12%, rgb(113, 0, 0) 40%, rgb(109, 109, 109) 51%, rgb(84, 84, 84) 100%); 
                              }
                              to {

                                background: radial-gradient(ellipse closest-side, rgba(255, 0, 0, 1) 45%, rgba(255, 0, 0, 1) 33%, rgb(84, 84, 84) 100%); 
                              }
                            }
                    </style>
                `
        $('head').append ( recStyle );
    }
    
    SWAM.on ( 'gamePrep', function loadRecorder () {
    
        console.log('load Recorder');
        window.streambound = false;
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


        var stream = '';

        //const stream = canvas.captureStream(); // frames per second
        //console.log('Started stream capture from canvas element: ', stream);

        function handleSourceOpen(event) {
          console.log('MediaSource opened');
          //sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
          sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="' + window.vcodec + '"');
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
            //$('#recindicator').css({display: "block"});
            $('#rec').addClass('recindicator');
          } else {
            stopRecording();
            recordButton.textContent = 'Start Recording';
            playButton.disabled = false;
            downloadButton.disabled = false;
            //$('#recindicator').css({display: "none"});
            $('#rec').removeClass('recindicator');
            $("#reccontainer").removeClass('closehide');  
          }
        }

        // The nested try blocks will be simplified when Chrome 47 moves to Stable
        function startRecording() {
            if (!streambound){
                window.streambound = true;
                //const stream = canvas.captureStream(); // frames per second
                stream = canvas.captureStream();
                console.log('Started stream capture from canvas element: ', stream);   
            }
            else {
                console.log('captureStream already running');
            }
          //let options = {mimeType: 'video/webm'};
          //let options = {mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond : window.vquality};
          //let options = {mimeType: 'video/webm; codecs=' + window.vcodec};    
          let options = {mimeType: 'video/webm; codecs=' + window.vcodec, videoBitsPerSecond : window.vquality};    
          //if (window.vquality != "null"){
                //console.log('quality set');
                //options = {mimeType: 'video/webm; codecs=' + window.vcodec, videoBitsPerSecond : window.vquality};  
          //}
         
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
            
            // start counting recording time
                        if (!rectimecounterbound){
                            window.rectimecounterinterval = setInterval(rectimecounter, 1000);
                            // var idletimeelapsed = 0;
                            window.rectimeelapsed = 1;
                            window.rectimecounterbound = true;
                            function rectimecounter() {
                                //cddisplay = ((cdtotaltime/1000) - window.idletimeelapsed);
                                //var rectime = window.rectimeelapsed;
                                var rectime = new Date(1000 * window.rectimeelapsed).toISOString().substr(11, 8).replace('00:','');
                                $("#rectime").html(rectime);
                                
                                // if (rectime <= 0){
                                //     if (stayalive == true) {
                                //         stayalivefn();
                                //         window.rectimeelapsed = 0;
                                //     }
                                // }
                                // else {
                                window.rectimeelapsed++
                                // }
                            }
                        }    
            
        }

        function stopRecording() {
          mediaRecorder.stop();
            // test :    
          stream.getTracks().forEach(track => track.stop());  
          window.streambound = false;
            
          console.log('Recorded Blobs: ', recordedBlobs);
          video.controls = true;
          window.rectimecounterbound = false;
          clearInterval(window.rectimecounterinterval);
            $("#recorded").css({display: "block"}); 
            //$("#reccontainer").css({display: "block"});
            $("#reccontainer").addClass('visible');
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
        
        
        function initEvents () {
            SWAM.on ( 'keydown', onKeydown );

        }
        initEvents();
        
        function onKeydown ( event ) {

        
            if ( event.originalEvent.key === '0' ) { 

                event.stopImmediatePropagation ();

                toggleRecording();


            }

        
    }
        
    });
    
SWAM.on ( 'spectate', function () {
    $("#reccontainer").removeClass('closehide');
    //$("#reccontainer").removeClass('visible');
});

    
// Register
	SWAM.registerExtension({
		name: 'Video Recorder for StarMash',
		id: 'SWAM.Video',
		description: 'Records video of the game. Record toggle shortcut key : 0)',
		author: 'xplay, thanks to Bombita and Yutru',
		version: '0.1',
        settingsProvider: createSettingsProvider(),
        //dependencies: [
            //"https://cdn.rawgit.com/spite/ccapture.js/0bb38d6f/build/CCapture.all.min.js"
        //]        
	});
}();