// everything that's exported
exports.peer = PeerConnectionHandler;
exports.iceServers = [
  {url: 'stun:23.21.150.121'},
  {url: 'stun:stun.services.mozilla.com'},
  {url: 'stun:stun.l.google.com:19302'},
  {url: 'stun:stun.anyfirewall.com:3478'}
];

// PeerConnectionHandler extracted from code in https://github.com/natevw/PeerPouch
var RTCPeerConnection = window.mozRTCPeerConnection || window.RTCPeerConnection || window.webkitRTCPeerConnection,
  RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription || window.webkitRTCSessionDescription,
  RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate || window.webkitRTCIceCandidate;

exports.hasWebRTC = RTCPeerConnection ? true : false;

function PeerConnectionHandler(opts) {
  if(!opts) opts = {};
  opts.reliable = true;
  var cfg = {
    "iceServers": exports.iceServers
  },
    con = (opts.reliable) ? {} : {
      'optional': [{
        'RtpDataChannels': true
      }]
    };

  this._rtc = new RTCPeerConnection(cfg, con);

  this.LOG_SELF = opts._self;
  this.LOG_PEER = opts._peer;
  this._channel = null;

  this.onsignal = null; // caller MUST provide this
  this.onmessage = null; // caller SHOULD provide this
  this.onconnection = null; // …and maybe this

  var handler = this,
    rtc = this._rtc;
  if (opts.initiate) this._setupChannel();
  else rtc.ondatachannel = this._setupChannel.bind(this);
  rtc.onnegotiationneeded = function(evt) {
    if (handler.DEBUG) console.log(handler.LOG_SELF, "saw negotiation trigger and will create an offer");
    rtc.createOffer(function(offerDesc) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "created offer, sending to", handler.LOG_PEER);
      rtc.setLocalDescription(offerDesc, function() {
        console.log("DONE")
      });
      handler._sendSignal(offerDesc);
    }, function(e) {
      console.warn(handler.LOG_SELF, "failed to create offer", e);
    });
  };
  rtc.onicecandidate = function(evt) {
    if (evt.candidate) handler._sendSignal({
      candidate: evt.candidate
    });
  };
  // debugging
  rtc.onicechange = function(evt) {
    if (handler.DEBUG) console.log(handler.LOG_SELF, "ICE change", rtc.iceGatheringState, rtc.iceConnectionState);
  };
  rtc.onstatechange = function(evt) {
    if (handler.DEBUG) console.log(handler.LOG_SELF, "State change", rtc.signalingState, rtc.readyState)
  };
}

PeerConnectionHandler.prototype._sendSignal = function(data) {
  if (!this.onsignal) throw Error("Need to send message but `onsignal` handler is not set.");
  this.onsignal(data);
};

PeerConnectionHandler.prototype.signal = function(data) {
  var handler = this,
    rtc = this._rtc;
  if (handler.DEBUG) console.log(this.LOG_SELF, "got data", data, "from", this.LOG_PEER);
  if (data.sdp) rtc.setRemoteDescription(new RTCSessionDescription(data), function() {
    var needsAnswer = (rtc.remoteDescription.type == 'offer');
    if (handler.DEBUG) console.log(handler.LOG_SELF, "set offer, now creating answer:", needsAnswer);
    if (needsAnswer) rtc.createAnswer(function(answerDesc) {
      if (handler.DEBUG) console.log(handler.LOG_SELF, "got anwer, sending back to", handler.LOG_PEER);
      rtc.setLocalDescription(answerDesc);
      handler._sendSignal(answerDesc);
    }, function(e) {
      console.warn(handler.LOG_SELF, "couldn't create answer", e);
    });
  }, function(e) {
    console.warn(handler.LOG_SELF, "couldn't set remote description", e)
  });
  else if (data.candidate) try {
    rtc.addIceCandidate(new RTCIceCandidate(data.candidate));
  } catch (e) {
    console.error("Couldn't add candidate", e);
  }
};

PeerConnectionHandler.prototype.send = function(data) {
  if (!this._channel || this._channel.readyState !== 'open') return handler.DEBUG && console.log("dropping data, no open channel");
  this._channel.send(data);
};

PeerConnectionHandler.prototype._setupChannel = function(evt) {
  var handler = this,
    rtc = this._rtc;
  if (evt)
    if (handler.DEBUG) console.log(this.LOG_SELF, "received data channel", evt.channel.readyState);
  this._channel = (evt) ? evt.channel : rtc.createDataChannel('telehash');
  // NOTE: in Chrome (M32) `this._channel.binaryType === 'arraybuffer'` instead of blob
  this._channel.onopen = function(evt) {
    if (handler.DEBUG) console.log(handler.LOG_SELF, "DATA CHANNEL IS OPEN", handler._channel);
    if (handler.onconnection) handler.onconnection(handler._channel); // BOOM!
  };
  this._channel.onmessage = function(evt) {
    if (handler.DEBUG) console.log(handler.LOG_SELF, "received message!", evt);
    if (handler.onmessage) handler.onmessage(evt.data);
  };
  if (window.mozRTCPeerConnection) setTimeout(function() {
    rtc.onnegotiationneeded(); // FF doesn't trigger this for us like Chrome does
  }, 0);
  window.dbgChannel = this._channel;
};

