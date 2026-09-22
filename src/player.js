// Adapted from rrradio's AudioPlayer patterns (MIT, Markus Steinbrecher).
// See docs/attribution.md. This smaller controller adds bounded recovery and
// isolates each connection so events from disposed streams cannot change UI.
export class RadioPlayer {
  constructor({createAudio = () => new Audio(), onChange = () => {}, timeout = 12000} = {}) {
    this.createAudio = createAudio; this.onChange = onChange; this.timeout = timeout;
    this.state = 'idle'; this.wanted = false; this.generation = 0; this.volume = .65;
    this.attempts = 0; this.audio = null; this.timer = null;
  }
  update(state, message = '') { this.state = state; this.onChange({state, message, station: this.station}); }
  clearTimer() { clearTimeout(this.timer); this.timer = null; }
  dispose() {
    this.generation++; this.clearTimer();
    if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); this.audio.load(); this.audio = null; }
  }
  play(station) { this.station = station; this.wanted = true; this.attempts = 0; return this.connect(); }
  async connect() {
    this.dispose();
    const token = this.generation;
    const audio = this.createAudio(); this.audio = audio;
    const current = () => token === this.generation && this.wanted;
    this.update('connecting', this.attempts ? 'Reconnecting…' : 'Tuning in…');
    audio.preload = 'none'; audio.loop = Boolean(this.station.loop); audio.volume = this.volume; audio.src = this.station.url;
    const deadline = () => { if (this.timer === null) this.timer = setTimeout(() => { if(current()) this.fail(); }, this.timeout); };
    audio.addEventListener('playing', () => { if(current() && !audio.paused) { this.clearTimer(); this.update('playing', this.station.loop ? 'Playing original ambient loop' : 'Live radio'); } });
    for(const event of ['waiting','stalled']) audio.addEventListener(event, () => { if(current()) { this.update('buffering','Buffering…'); deadline(); } });
    audio.addEventListener('pause', () => { if(current()) this.pause(); });
    audio.addEventListener('error', () => { if(current()) this.fail(); });
    audio.addEventListener('ended', () => { if(current()) this.fail(); });
    deadline();
    try { await audio.play(); }
    catch(error) {
      if(!current()) return;
      if(error.name === 'NotAllowedError' || error.name === 'AbortError') {
        this.pause(); this.update('paused','Press Listen to start the radio.');
      } else this.fail();
    }
  }
  fail() {
    if(!this.wanted) return;
    if(this.attempts < 1) { this.attempts++; void this.connect(); }
    else { this.wanted = false; this.dispose(); this.update('error', "This station isn't responding. Retry or try the other station."); }
  }
  pause() { this.wanted = false; this.dispose(); this.update('paused','A little quiet. Whenever you need it.'); }
  setVolume(value) { this.volume = Math.max(0,Math.min(1,Number(value))); if(this.audio) this.audio.volume = this.volume; }
}
