/**
 * User: _Jay
 * Desciption: anchor of webrtc
 * Dependent on: adapter.js
 * Datetime: 31 July 2016 (Sunday) 19:44
 */

var Anchor = function(roomNumber) {
	this.roomNumber = roomNumber;
};

/**
 * capture and write into video DOM by it's id.
 * @param  {[type]}  elementID [description]
 * @param  {Boolean} isVideo   [description]
 * @param  {Boolean} isAudio   [description]
 * @return {[type]}            [description]
 */
Anchor.prototype.capture = function(elementID, isVideo, isAudio) {
	getUserMedia.call(navigator, {
		video: isVideo === undefined ? true : isVideo,
		audio: isAudio === undefined ? true : isAudio
	}, function getUserMediaDone(localMediaStream) {
		var video = document.getElementById(elementID);
		video.src = window.URL.createObjectURL(localMediaStream);
		video.onloadedmetadata = function(e) {
			console.log("Label: " + localMediaStream.label);
			console.log("AudioTracks", localMediaStream.getAudioTracks());
			console.log("VideoTracks", localMediaStream.getVideoTracks());
		};
	}, function getUserMediaError(e) {
		console.error('Rejected!', e);
	});
};