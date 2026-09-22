import {mkdir,copyFile,cp} from 'node:fs/promises';
import {tracks} from '../src/playlist.js';
await mkdir('dist/audio',{recursive:true});
for(const file of ['index.html','styles.css','favicon.svg']) await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
// Only ship the selected, licensed playlist, never old prototype audio.
for(const track of tracks) await copyFile(new URL(track.url),`dist/audio/${track.slug}.mp3`);
