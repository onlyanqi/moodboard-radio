const album = 'https://holiznacc0.bandcamp.com/album/lofi-jazz-guitar';
export const tracks = [
  {name:'Keeping Cool',slug:'keeping-cool',duration:'2:33'},
  {name:'Come Again',slug:'come-again',duration:'3:03'},
  {name:'Poor But Happy',slug:'poor-but-happy',duration:'2:08'}
].map(track => ({...track, artist:'HoliznaCC0', album, finite:true,
  url:new URL(`../audio/${track.slug}.mp3`,import.meta.url).href,
  page:`https://holiznacc0.bandcamp.com/track/${track.slug}`,
  license:'https://creativecommons.org/licenses/by/4.0/'
}));
export function nextIndex(index, length) { return (index + 1) % length; }
