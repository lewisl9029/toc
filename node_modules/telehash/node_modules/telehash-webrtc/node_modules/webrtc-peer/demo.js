// this uses forms in demo.html

//var rtc = require("webrtc-peer");
var rtc = require("./index.js");

var signals = document.forms[0][0];
document.forms[0][1].onclick = sigout;
document.forms[0][2].onclick = sigin;

var handler;
var parts = [];
function signal(sig)
{
  parts.push(sig);
  signals.value = JSON.stringify(parts);
}

function connected()
{
  handler.send("WebRTC Peer Data Connected!");
}

function message(msg)
{
  signals.value = msg;
}

function pch(arg)
{
  if(handler) return;
  handler = new rtc.peer(arg);
  handler.DEBUG = true;
  handler.onsignal = signal;  
  handler.onconnection = connected;
  handler.onmessage = message;
  console.log("new handler",handler);
}

function sigout()
{
  pch({initiate:true, _self:"me", _peer:"you"});
  event.preventDefault();
}

function sigin()
{
  pch({_self:"me", _peer:"you"});
  var parts = JSON.parse(signals.value);
  parts.forEach(function(part){
    handler.signal(part);
  });
  event.preventDefault();
}
