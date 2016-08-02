/**
 * User: _Jay
 * Desciption: class of webrtc
 * Dependent on: es6
 * Datetime: 02 August 2016 (Tuesday) 09:25
 */

const RES_SUCCESS = 1,
	RES_FAIL = 0,
	SERVERS = null;


class WebRTCBasic {
	constructor(servers = SERVERS) {
		//中转服务器列表
		this.servers = servers;
		//当前对象唯一id
		this.id = Math.random() + (new Date()).getTime();

		this.peerConnection = new RTCPeerConnection(this.servers);
		this.peerConnection.oniceconnectionstatechange = function() {
			var state = this.iceConnectionState;
			console.info('IceConnection\'s State Change to -> ' + state);
			switch (state) {
				case 'disconnected':
					break;
				case 'connected':
					break;
				case 'closed':
					break;
				default:
					break;
			}
		};
	}

	/**
	 * [getId description]
	 * @return {[type]} [description]
	 */
	getID() {
		return this.id;
	}

	error(error) {
		console.error(error);
	}

	/**
	 * on ice candidate checked.
	 * @return {[type]} [description]
	 */
	onIceCandidate() {
		let _p = this;
		return new Promise((resolve, reject) => {
			_p.peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					resolve(event.candidate);
				}
			}
		});
	}

	setRemoteDescription(description) {
		let _sdp = new RTCSessionDescription();
		_sdp.sdp = description.sdp;
		_sdp.type = description.type;
		return this.peerConnection.setRemoteDescription(_sdp);
	}

	addRemoteIce(ice) {
		return this.peerConnection.addIceCandidate(new RTCIceCandidate(ice));
	}

	hangup(peerConnection = this.peerConnection, ...channels) {
		let _p = this,
			isClosed = true;

		try {
			peerConnection.getRemoteStreams().forEach(function(stream) {
				//关闭数据流
				_p.peerConnection.removeStream(stream);
			});
			peerConnection.getLocalStreams().forEach(function(stream) {
				//关闭数据流
				_p.peerConnection.removeStream(stream);
			});
		} catch (e) {
			_p.error(e);
			isClosed = false;
		}
		try {
			peerConnection.close();
		} catch (e) {
			_p.error(e);
			isClosed = false;
		}
		for (let i = 0, length = channels.length; i < length; i++) {
			try {
				channels[i] != null && channels[i].close();
				channels[i] = null;
			} catch (e) {
				_p.error(e);
				isClosed = false;
			}
		}

		peerConnection = null;
		return new Promise((resolve, reject) => {
			isClosed ? resolve() : reject();
		});
	}
}



class Offer extends WebRTCBasic {
	constructor(servers) {
		super(servers);
		this.sendChannel = null;
	}

	createOffer(stream) {
		var _p = this;
		stream && this.peerConnection.addStream(stream);
		return this.peerConnection.createOffer()
			.then((offer) => {
				return new Promise((resolve, reject) => {
					_p.peerConnection.setLocalDescription(offer, () => {
						resolve(offer);
					}, reject);
				});
			})
			.catch(_p.error);
	}

	/**
	 * 重写基础类的挂断函数
	 * @return {[type]} [description]
	 */
	hangup() {
		return super.hangup(this.peerConnection, this.sendChannel);
	}

}

class Answer extends WebRTCBasic {
	constructor(servers) {
		super(servers);
	}

	createAnswer(remoteDescription) {
		let _p = this;
		return this.setRemoteDescription(remoteDescription)
			.then(() => {
				return _p.peerConnection.createAnswer()
					.then((answer) => {
						return new Promise((resolve, reject) => {
							this.peerConnection.setLocalDescription(answer, () => {
								resolve(answer);
							}, reject);
						});
					})
					.catch(_p.error);
			})
			.catch(this.error);
	}

	onAddStream() {
		var _p = this;
		return new Promise((resolve, reject) => {
			_p.peerConnection.onaddstream = function(event) {
				resolve(URL.createObjectURL(event.stream));
			};
		});
	}

	answer() {

	}

	reject() {

	}

	hangup() {}
}