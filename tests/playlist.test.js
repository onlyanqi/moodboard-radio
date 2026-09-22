import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tracks,nextIndex} from '../src/playlist.js';
test('playlist wraps and every shipped track has matching attribution and integrity',async()=>{
 const sources=JSON.parse(await readFile(new URL('../docs/music-sources.json',import.meta.url)));
 assert.equal(nextIndex(2,tracks.length),0);
 for(const track of tracks){
   const source=sources.find(s=>s.title===track.name);assert.ok(source);assert.equal(source.license,track.license);
   const audio=await readFile(new URL(track.url));assert.ok(audio.length>100000);
   assert.equal(createHash('sha256').update(audio).digest('hex'),source.sha256);
 }
});
