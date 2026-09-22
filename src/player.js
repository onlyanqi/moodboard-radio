// Adapted from rrradio's AudioPlayer patterns (MIT, Markus Steinbrecher).
// See docs/attribution.md. Only the current connection may update the UI.
export class RadioPlayer {
  constructor({createAudio = () => new Audio(), onChange = () => {}, onEnded = () => {}, timeout = 12000} = {}) {
    this.createAudio = createAudio; this.onChange = onChange; this.onEnded = onEnded; this.timeout = timeout;
    this.state = 'idle'; this.wanted = false; this.generation = 0; this.volume = .65;
    this.attempts = 0; this.audio = null; this.timer = null; this.position = 0;
  }
  update(state, message = '') { this.state = state; this.onChange({state, message, station: this.station}); }
  clearTimer() { clearTimeout(this.timer); this.timer = null; }
  dispose() {
    this.generation++; this.clearTimer();
    if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); this.audio = null; }
  }
  play(station) { this.station = station; this.position = 0; return this.resume(); }
  resume() {
    if (!this.station) return;
    this.wanted = true; this.attempts = 0; return this.connect();
  }
  async connect() {
    this.dispose();
    const token = this.generation;
    const audio = this.createAudio(); this.audio = audio;
    const current = () => token === this.generation && this.wanted;
    this.update('connecting', this.attempts ? 'Trying again…' : 'Loading your track…');
    audio.preload = 'none'; audio.loop = Boolean(this.station.loop); audio.volume = this.volume; audio.src = this.station.url;
    const deadline = () => { if (this.timer === null) this.timer = setTimeout(() => { if(current()) this.fail(); }, this.timeout); };
    audio.addEventListener('loadedmetadata', () => {
      if(current() && this.station.finite && this.position > 0 && Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(this.position, Math.max(0, audio.duration - .1));
      }
    });
    audio.addEventListener('playing', () => { if(current() && !audio.paused) { this.clearTimer(); this.update('playing', this.station.finite ? 'Playing' : 'Live radio'); } });
    for(const event of ['waiting','stalled']) audio.addEventListener(event, () => { if(current()) { this.update('buffering','Buffering…'); deadline(); } });
    audio.addEventListener('pause', () => { if(current() && !audio.ended) this.pause(); });
    audio.addEventListener('error', () => { if(current()) this.fail(); });
    audio.addEventListener('ended', () => {
      if(!current()) return;
      if(!this.station.finite) { this.fail(); return; }
      this.wanted = false; this.position = 0; this.dispose(); this.update('ended'); this.onEnded();
    });
    deadline();
    try { await audio.play(); }
    catch(error) {
      if(!current()) return;
      if(error.name === 'NotAllowedError' || error.name === 'AbortError') {
        this.pause(); this.update('paused','Press Listen to start the music.');
      } else this.fail();
    }
  }
  fail() {
    if(!this.wanted) return;
    if(this.station.finite && Number.isFinite(this.audio?.currentTime)) this.position = this.audio.currentTime;
    if(this.attempts < 1) { this.attempts++; void this.connect(); }
    else { this.wanted = false; this.dispose(); this.update('error', "This track couldn't load. Retry or choose Next track."); }
  }
  pause() {
    if(this.station?.finite && Number.isFinite(this.audio?.currentTime)) this.position = this.audio.currentTime;
    this.wanted = false; this.dispose(); this.update('paused','A little quiet. Whenever you need it.');
  }
  setVolume(value) {
    const number = Number(value);
    if(!Number.isFinite(number)) return;
    this.volume = Math.max(0,Math.min(1,number)); if(this.audio) this.audio.volume = this.volume;
  }
}
