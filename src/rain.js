// Optional original rain-like noise. Independent from the licensed recordings.
export class RainLayer {
  constructor() { this.context = null; this.volume = 0; this.playing = false; }
  async unlock() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if(!Context) return false;
    try {
      if(!this.context) {
        this.context = new Context();
        const length = this.context.sampleRate * 8;
        const buffer = this.context.createBuffer(2, length, this.context.sampleRate);
        for(let channel=0;channel<2;channel++) {
          const samples=buffer.getChannelData(channel);
          for(let i=0;i<length;i++) samples[i]=(Math.random()*2-1)*.4;
        }
        const source=this.context.createBufferSource(); source.buffer=buffer; source.loop=true;
        const filter=this.context.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=1600;
        this.gain=this.context.createGain(); this.gain.gain.value=0;
        source.connect(filter).connect(this.gain).connect(this.context.destination); source.start();
      }
      await this.context.resume(); this.sync(); return true;
    } catch { return false; }
  }
  setVolume(value) { this.volume=Math.max(0,Math.min(1,Number(value))); this.sync(); }
  setPlaying(value) { this.playing=value; this.sync(); }
  sync() {
    if(!this.context || !this.gain) return;
    const now=this.context.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(this.playing ? this.volume : 0,now,.08);
  }
}
