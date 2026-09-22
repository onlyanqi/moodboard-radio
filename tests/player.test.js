import test from 'node:test';
import assert from 'node:assert/strict';
import {RadioPlayer} from '../src/player.js';
class AudioDouble extends EventTarget {
  paused = true;
  play() { this.paused = false; return new Promise((resolve,reject) => {this.resolve=resolve;this.reject=reject;}); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
  removeAttribute() {} load() {}
  emit(name) { this.dispatchEvent(new Event(name)); }
}
function setup(timeout=1000) {
  const audios=[];const states=[];
  const player=new RadioPlayer({createAudio:()=>{const a=new AudioDouble();audios.push(a);return a;},onChange:s=>states.push(s),timeout});
  return {player,audios,states};
}
const station={name:'Test',url:'https://example.com/stream'};
test('pause while connecting ignores late completion and events',async()=>{
 const {player,audios}=setup();const pending=player.play(station);player.pause();audios[0].resolve();await pending;audios[0].emit('playing');assert.equal(player.state,'paused');assert.equal(audios[0].paused,true);
});
test('switch cancels previous stream and ignores stale rejection',async()=>{
 const {player,audios}=setup();const old=player.play(station);player.play({...station,name:'New'});audios[0].reject(new Error('late failure'));await old;audios[0].emit('error');audios[1].emit('playing');assert.equal(player.state,'playing');assert.equal(player.station.name,'New');assert.equal(audios.length,2);assert.equal(audios[0].paused,true);player.pause();
});
test('a failing stream retries once, then becomes recoverable error',()=>{
 const {player,audios}=setup();player.play(station);audios[0].emit('error');assert.equal(audios.length,2);audios[1].emit('error');assert.equal(player.state,'error');assert.equal(player.wanted,false);assert.equal(player.audio,null);player.play(station);assert.equal(audios.length,3);player.pause();
});
test('connection timeout is bounded and pause clears retry',async()=>{
 const {player,audios}=setup(10);player.play(station);await new Promise(r=>setTimeout(r,40));assert.equal(player.state,'error');assert.equal(audios.length,2);player.pause();
});
test('autoplay rejection pauses rather than retrying',async()=>{
 const {player,audios}=setup();const pending=player.play(station);audios[0].reject(Object.assign(new Error(),{name:'NotAllowedError'}));await pending;assert.equal(player.state,'paused');assert.equal(audios.length,1);
});
test('buffering returns to playing and volume persists across stations',()=>{
 const {player,audios}=setup();player.setVolume(.2);player.play(station);audios[0].emit('playing');audios[0].emit('waiting');assert.equal(player.state,'buffering');audios[0].emit('playing');assert.equal(player.state,'playing');player.play(station);assert.equal(audios[1].volume,.2);player.pause();
});
test('finite track completion advances exactly once and ignores stale end events',()=>{
 const audios=[];let completed=0;
 const player=new RadioPlayer({createAudio:()=>{const a=new AudioDouble();audios.push(a);return a;},onEnded:()=>{completed++;player.play({...station,finite:true});}});
 player.play({...station,finite:true});audios[0].ended=true;audios[0].emit('pause');audios[0].emit('ended');audios[0].emit('ended');assert.equal(completed,1);assert.equal(audios.length,2);assert.equal(player.state,'connecting');player.pause();
});
test('finite pause/resume restores position; a new track starts at zero',()=>{
 const {player,audios}=setup();player.play({...station,finite:true});audios[0].currentTime=42;player.pause();player.resume();audios[1].duration=153;audios[1].emit('loadedmetadata');assert.equal(audios[1].currentTime,42);player.play({...station,finite:true,name:'Other'});assert.equal(player.position,0);player.pause();
});
test('finite connection recovery keeps playback position',()=>{
 const {player,audios}=setup();player.play({...station,finite:true});audios[0].currentTime=30;audios[0].emit('error');audios[1].duration=153;audios[1].emit('loadedmetadata');assert.equal(audios[1].currentTime,30);player.pause();
});
