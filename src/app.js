import {RadioPlayer} from './player.js';
import {tracks, nextIndex} from './playlist.js';
import {RainLayer} from './rain.js';
const $ = id => document.getElementById(id);
const storage = {
  get(key) { try { return localStorage.getItem(`moodboard:v1:${key}`); } catch { return null; } },
  set(key,value) { try { localStorage.setItem(`moodboard:v1:${key}`,value); return true; } catch { return false; } }
};
let index = 0;
const rain = new RainLayer();
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let motion = storage.get('motion') === null ? !reduced.matches : storage.get('motion') === 'true';
let saved = storage.get('favorite') === 'rainy-window';
function renderMotion() {
  $('scene').dataset.moving = String(motion && player.state === 'playing');
  $('motion').setAttribute('aria-pressed',String(motion));
  $('motion').textContent = `Motion ${motion ? 'on' : 'off'}`;
}
function renderFavorite() {
  $('favorite').setAttribute('aria-pressed',String(saved));
  $('favorite').innerHTML = `<span aria-hidden="true">${saved ? '♥' : '♡'}</span> ${saved ? 'Room saved' : 'Save this room'}`;
}
function renderTrack() {
  const track=tracks[index];
  $('station-link').textContent = `${track.name} · ${track.artist} ↗`;
  $('station-link').href = track.page;
  $('track-position').textContent = `${index+1} of ${tracks.length}`;
  for(const button of document.querySelectorAll('[data-track]')) {
    button.setAttribute('aria-pressed',String(Number(button.dataset.track)===index));
  }
  if('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({title:track.name,artist:track.artist,album:'Lofi Jazz Guitar'});
  }
}
const player = new RadioPlayer({onEnded:()=>selectTrack(nextIndex(index,tracks.length),true),onChange({state,message}) {
  const active = ['connecting','buffering','playing'].includes(state);
  $('play-label').textContent = state === 'error' ? 'Retry' : active ? 'Pause' : 'Listen';
  $('play-icon').textContent = active ? 'Ⅱ' : '▶';
  $('status').textContent = state === 'playing' ? `${tracks[index].duration} · Lofi Jazz Guitar` : message;
  rain.setPlaying(state === 'playing'); renderMotion();
  if('mediaSession' in navigator) navigator.mediaSession.playbackState = state === 'playing' ? 'playing' : 'paused';
}});
function listen() {
  if(rain.volume>0) void unlockRain();
  renderTrack();
  if(player.station===tracks[index]) void player.resume();
  else void player.play(tracks[index]);
}
function selectTrack(next,autoplay=player.wanted) {
  player.pause(); index=next; renderTrack();
  // Set the pending track without starting audio when browsing while paused.
  player.station=tracks[index]; player.position=0;
  $('status').textContent = `${tracks[index].duration} · Ready when you are.`;
  if(autoplay) listen();
}
async function unlockRain() {
  if(await rain.unlock()) return;
  rain.setVolume(0); $('rain-volume').value='0'; $('rain-value').textContent='Unavailable';
}
$('play').addEventListener('click', () => player.wanted ? player.pause() : listen());
$('next').addEventListener('click', () => selectTrack(nextIndex(index,tracks.length)));
for(const button of document.querySelectorAll('[data-track]')) button.addEventListener('click',()=>selectTrack(Number(button.dataset.track)));
$('volume').addEventListener('input', event => player.setVolume(event.target.value));
$('rain-volume').addEventListener('input',event=>{
  const value=Number(event.target.value); rain.setVolume(value);
  $('rain-value').textContent=value===0?'Off':`${Math.round(value*100)}%`;
  if(value>0) void unlockRain();
});
$('motion').addEventListener('click', () => { motion = !motion; storage.set('motion',String(motion)); renderMotion(); });
reduced.addEventListener('change', () => { if(reduced.matches) { motion = false; renderMotion(); } });
$('favorite').addEventListener('click', () => {
  const next = !saved;
  if(storage.set('favorite',next ? 'rainy-window' : '')) { saved = next; renderFavorite(); }
  else $('status').textContent = 'This browser could not save your room preference.';
});
$('about-open').addEventListener('click', () => $('about').showModal());
$('about-close').addEventListener('click', () => $('about').close());
if('mediaSession' in navigator) for(const [action,handler] of [['play',listen],['pause',()=>player.pause()],['stop',()=>player.pause()],['nexttrack',()=>selectTrack(nextIndex(index,tracks.length))]]) {
  try { navigator.mediaSession.setActionHandler(action,handler); } catch { /* Unsupported browser action. */ }
}
window.addEventListener('pagehide', () => player.pause());
renderTrack(); renderFavorite(); renderMotion();
