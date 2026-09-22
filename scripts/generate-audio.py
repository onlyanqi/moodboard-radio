"""Original, deterministic 24-second ambient loops. No samples or external media.
Run from repository root with Python 3. Produces mono 22.05 kHz PCM WAV.
Every oscillator completes an integer number of cycles for a seamless loop.
"""
import math, random, wave, struct
from pathlib import Path
rate=22050; duration=24; count=rate*duration
Path('audio').mkdir(exist_ok=True)
def save(name, samples):
 with wave.open('audio/'+name+'.wav','wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate)
  f.writeframes(struct.pack('<'+str(len(samples))+'h',*samples))
# A gentle major-nine chord, slowly breathing with phase-offset envelopes.
frequencies=[130.8128,195.9977,246.9417,293.6648,329.6276]
frequencies=[round(f*duration)/duration for f in frequencies]
rng=random.Random(21); noise=0; tones=[]; rain=[]
# Smooth noise loop; fade at both ends keeps the seam free of discontinuities.
for i in range(count):
 t=i/rate
 value=sum(math.sin(2*math.pi*f*t+j*.9)*(.65+.35*math.cos(2*math.pi*t/duration+j)) for j,f in enumerate(frequencies))/len(frequencies)
 tones.append(round(value*7200))
 noise=.96*noise+.04*rng.uniform(-1,1)
 fade=min(1,t/2,(duration-t)/2)
 rain.append(round((noise*16000+value*1800)*fade))
save('window-light',tones);save('soft-rain',rain)
