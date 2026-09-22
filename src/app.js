import {RadioPlayer} from './player.js';
const $ = id => document.getElementById(id);
const stations = [
  {name:'Window Light',url:new URL('../audio/window-light.wav',import.meta.url).href,loop:true,page:'https://github.com/onlyanqi/moodboard-radio#original-audio'},
  {name:'Soft Rain',url:new URL('../audio/soft-rain.wav',import.meta.url).href,loop:true,page:'https://github.com/onlyanqi/moodboard-radio#original-audio'}
];
const storage = {
  get(key) { try { return localStorage.getItem(`moodboard:v1:${key}`); } catch { return null; } },
  set(key,value) { try { localStorage.setItem(`moodboard:v1:${key}`,value); return true; } catch { return false; } }
};
let index = 0;
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
function renderStation() {
  $('station-link').textContent = `${stations[index].name} · Original loop ↗`;
  $('station-link').href = stations[index].page;
  $('alternative').textContent = `Try ${stations[1-index].name} ↗`;
}
const player = new RadioPlayer({onChange({state,message}) {
  const active = ['connecting','buffering','playing'].includes(state);
  $('play-label').textContent = state === 'error' ? 'Retry' : active ? 'Pause' : 'Listen';
  $('play-icon').textContent = active ? 'Ⅱ' : '▶';
  $('status').textContent = message;
  renderMotion();
  if('mediaSession' in navigator) navigator.mediaSession.playbackState = state === 'playing' ? 'playing' : 'paused';
}});
function listen() {
  void player.play(stations[index]);
  if('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({title:stations[index].name,artist:'Moodboard Radio',album:'Rainy Window · Moodboard Radio'});
  }
}
$('play').addEventListener('click', () => player.wanted ? player.pause() : listen());
$('alternative').addEventListener('click', () => { index = 1-index; renderStation(); listen(); });
$('volume').addEventListener('input', event => player.setVolume(event.target.value));
$('motion').addEventListener('click', () => { motion = !motion; storage.set('motion',String(motion)); renderMotion(); });
reduced.addEventListener('change', () => { if(reduced.matches) { motion = false; renderMotion(); } });
$('favorite').addEventListener('click', () => {
  const next = !saved;
  if(storage.set('favorite',next ? 'rainy-window' : '')) { saved = next; renderFavorite(); }
  else $('status').textContent = 'This browser could not save your room preference.';
});
$('about-open').addEventListener('click', () => $('about').showModal());
$('about-close').addEventListener('click', () => $('about').close());
if('mediaSession' in navigator) for(const [action,handler] of [['play',listen],['pause',()=>player.pause()],['stop',()=>player.pause()]]) {
  try { navigator.mediaSession.setActionHandler(action,handler); } catch { /* Unsupported browser action. */ }
}
window.addEventListener('pagehide', () => player.pause());
renderStation(); renderFavorite(); renderMotion();
