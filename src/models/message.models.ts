import { firestore } from "firebase";

export class Message{
    public id:string;
    
    constructor(
        public uid:string,
        public text:string,
        public tipo:string,
        public timestamp:any
    ){}
}