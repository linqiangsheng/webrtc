/**
 * User: _Jay
 * Desciption: capture of webrtc
 * Dependent on: adapter.js, es6
 * Datetime: 31 July 2016 (Sunday) 19:44
 */

/**
 * capture 对象
 */
class Capture {
	constructor() {
		this.stream = null;
		this.uri = null;
		this.successCallback = null;
		this.failCallback = null;
	}

	getStream() {
		return this.stream;
	}

	getUri() {
		return this.uri;
	}

	/**
	 * 开始采集
	 * @param  {Boolean} options.isVideo      [description]
	 * @param  {Boolean} options.isAudio      [description]
	 * @param  {Number}  options.maxWidth     [description]
	 * @param  {Number}  options.maxHeight    [description]
	 * @param  {Number}  options.minFrameRate [description]
	 * @param  {[type]}  options.maxFrameRate [description]
	 * @return {[type]}                       [description]
	 */
	capture({
		isVideo = true,
		isAudio = true,
		maxWidth = 1024,
		maxHeight = 720,
		minFrameRate = 2, //最小帧率
		maxFrameRate = 60 //最大帧率
	} = {}) {
		let _p = this;
		let videoOptions = isVideo ? {
			mandatory: {
				minAspectRatio: 1.333,
				maxAspectRatio: 1.334,
				maxFrameRate: maxFrameRate
			},
			optional: [{
				minFrameRate: minFrameRate
			}, {
				maxFrameRate: maxFrameRate
			}, {
				minWidth: 320
			}, {
				minHeigth: 250
			}, {
				maxWidth: maxWidth
			}, {
				maxHeigth: maxHeight
			}]
		} : false;

		return new Promise((resolve, reject) => {
			getUserMedia({
				audio: isAudio,
				video: videoOptions
			}, function(stream) {
				_p.uri = URL.createObjectURL(stream);
				_p.stream = stream;
				resolve({uri: _p.uri, stream: _p.stream});
			}, reject);
		});
	}
	isCaptured() {
		return this.uri != null;
	}
}