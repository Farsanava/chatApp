import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import Swal from "sweetalert2";
import swal from "sweetalert";
import {Observable} from 'rxjs/Observable';




@Injectable()


export class ChatService{

    private socket = io('http://localhost:3000');

    joinRoom(data)
    {
        this.socket.emit('join',data);
    }

    newUserJoined()
    {
        let observable = new Observable<{user:String, message:String}>(observer=>{         
            this.socket.on('new user joined', (data)=>{
                console.log(data.user);
                
                Swal.fire({
                    title: `${data.user} is requested to Join`,
                    showConfirmButton:true,
                    confirmButtonText:"proceed",
                  }).then(datas=> {
                    observer.next(data);
                  })
                     
            });
            return () => {this.socket.disconnect();}
        });


        return observable;
       
    }

    leaveRoom(data){
        this.socket.emit('leave',data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('left room', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    sendMessage(data)
    {
        this.socket.emit('message',data);
    }

    newMessageReceived(){
        let observable = new Observable<{user:String, message:String}>(observer=>{
            this.socket.on('new message', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });

        return observable;
    }
}