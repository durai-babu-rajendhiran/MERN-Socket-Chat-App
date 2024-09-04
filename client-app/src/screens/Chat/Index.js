import React,{useEffect} from 'react'
import { BASE_URL} from '../../utils/ApiRoute';
import io from 'socket.io-client';
const socket = io(BASE_URL);
const Index = () => {
    useEffect(() => {
        socket.on('msg_id', (objectMSG) => {
          alert(JSON.stringify(objectMSG))
        });
      },[]);
    
    const BtnTEST =()=>{
      socket.emit('sendMSG', {id:"msg_id",data:"any data like array object"}); 
      alert("show THe Alert")
    }
    return (
        <div>
            Chat Page
        </div>
    )
}

export default Index
