export const rooms = [
 {id:'rainy-window',name:'Rainy Window',intention:'Focus',description:'A little rain. A little room to think.',caption:"Somewhere it's always a little rainy.",playlist:'A little guitar, a little daydream.',order:[0,1,2]},
 {id:'golden-hour',name:'Golden Hour',intention:'Pause',description:'Let the afternoon take its time.',caption:'Nothing urgent on the horizon.',playlist:'A warm guitar break by the water.',order:[2,0,1]},
 {id:'night-train',name:'Night Train',intention:'Unwind',description:'Nothing to catch. Just somewhere to go.',caption:'Let the city slip quietly by.',playlist:'A little company for the way home.',order:[1,2,0]}
];
export function findRoom(id) { return rooms.find(room=>room.id===id) || rooms[0]; }
