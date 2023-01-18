import {URL} from '../config';
export async function commentinit(socket){
  socket.on('VCHAT', (data => {
    alert('aaa');
  }).bind(this));
}
