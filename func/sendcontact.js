import {Platform} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {requestNotifications,request,PERMISSIONS} from 'react-native-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import Contacts from 'react-native-contacts';
import {URL} from '../config';

function fn(str){
  var res;
  res = str.replace(/[^0-9]/g,"");
  return res;
}

export async function sendcontact(setfollow) {
  if(Platform.OS=='ios'){
    var contactsStatus = await request(PERMISSIONS.IOS.CONTACTS);
  }else{
    var contactsStatus = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
  }
  if(contactsStatus!='granted'){
    return;
  }
  const _id = await AsyncStorage.getItem('_id');
  console.log('1')
  await Contacts.getAll(async (err, contacts) => {
    if (err === 'denied'){
      // error
      console.log('denied')
    } else {
      // await AsyncStorage.setItem('contacts', JSON.stringify([]));
      var contacts_arr=[];
      contacts.map(emP=>{
        emP.phoneNumbers.map(emS=>{
          if(emS.label=='mobile'){
            contacts_arr.push('+82'+fn(emS.number));
          }
        })
      });
      console.log(contacts);
      var contacts_unique=contacts_arr.reduce((unique, item) =>
        unique.includes(item) ? unique : [...unique, item], []);
      console.log('1111@@@@@');
      var contacts_storage = await AsyncStorage.getItem('contacts')||'[]';
      console.log('2222@@@@@')
      contacts_storage=JSON.parse(contacts_storage);

      var contacts_send=[];
      console.log('contacts_storage')
      console.log(contacts_storage);
      contacts_unique.map(em=>{
        if(contacts_storage.indexOf(em)===-1){
          contacts_send.push(em);
        }
      });
      console.log('2')
      let data={
        _id,
        contacts:contacts_send
      };
      const obj = {
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      await fetch(`${URL}/setcontacts`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.status==100){
          await AsyncStorage.setItem('contacts', JSON.stringify(contacts_unique));
        //  await AsyncStorage.setItem('contacts', JSON.stringify([]));
          setfollow(responseJson.follow)
        }else if(responseJson.status==101){

        }else{
        }
      })
      .catch((error) => {
        console.error(error);
      }); 
      }
    });
    console.log('4');
    return 3
}
