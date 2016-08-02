/**
 * User: _Jay
 * Desciption: chat
 * Dependent on: webrtc.class, ajax, es6
 * Datetime: 02 August 2016 (Tuesday) 15:56
 */
// import { Ajax } from './ajax.js'; 
// import { webrtc } from './webrct.class.js'

//   
const EVENT = {
	SDP: 'SDP',
	ICE: 'ICE'
}

class Device {

	constructor(number) {
		this.number = number;
		this.onChatList = [];
	}

	_emit(remoteNumber, peerID, event, data) {
		let _p = this;
		Ajax.post('/rtc/event', {
			from: _p.number,
			to: remoteNumber,
			id: peerID,
			event: event,
			data: data
		}, () => {}, () => console.error, true);
	}

	_on(event) {
		let _p = this;
		return new Promise((resolve, reject) => {
			setInterval(() => {
				Ajax.get('/rtc/' + _p.number + '/event/' + event, {}, (response) => {
					resolve(response);
				}, reject);
			}, 2000);
		});
	}

	monitor() {
		let _p = this;
		this._on(EVENT.SDP)
			.then((response) => {
				for (let i = 0, length = response.data.length; i < length; i++) {
					console.log('真是6');
					let data = response.data[i];
					let remoteSdp = JSON.parse(data.data);

					switch (remoteSdp.type) {
						case 'answer':
							console.log(remoteSdp);
							let chat = _p.onChatList.find(y => y.number == data.from);
							chat.handler.setRemoteDescription(remoteSdp);
							console.log('set remote sdp success');
							break;
						case 'offer':
							let answer = new Answer();
							answer.onIceCandidate()
								.then((candidate) => {
									_p._emit(data.from, answer.getID(), EVENT.ICE, JSON.stringify(candidate));
								});
							answer.onAddStream()
								.then((uri) => {
									document.getElementById('video').src = uri;
								})
							answer.createAnswer(remoteSdp)
								.then((sdp) => {
									_p._emit(data.from, answer.getID(), EVENT.SDP, JSON.stringify(sdp));
								}, (error) => console.error);

							_p.onChatList.push({
								number: data.from,
								handler: answer
							});

							break;
						default:
							break;
					}
				}

			});

		this._on(EVENT.ICE)
			.then((response) => {
				//第一层解除多人同时发送ice循环
				for (let i = 0, length = response.data.length; i < length; i++) {
					let data = response.data[i];
					//第二层解除一个通道有多个ice
					for (let j = 0, length = data.length; j < length; j++) {
						let iceData = data[j];
						let iceCandidate = JSON.parse(iceData.data);
						let chat = _p.onChatList.find(y => y.number == iceData.from);
						chat.handler.addRemoteIce(iceCandidate)
							.then(() => {
								console.log('add remote ice success');
							})
							.catch(console.error);
					}

				}
			});
	}

	/**
	 * 拨号
	 * @param  {[type]} number [description]
	 * @param  {[type]} stream [description]
	 * @return {[type]}        [description]
	 */
	call(number, stream) {
		if (this.onChatList.findIndex(y => y.number == number) < 0) {
			let _p = this;
			let offer = new Offer();

			offer.onIceCandidate()
				.then((candidate) => {
					_p._emit(number, offer.getID(), EVENT.ICE, JSON.stringify(candidate));
				});

			offer.createOffer(stream)
				.then((sdp) => {
					_p._emit(number, offer.getID(), EVENT.SDP, JSON.stringify(sdp));
				});

			this.onChatList.push({
				number: number,
				handler: offer
			});
		}
	}
}