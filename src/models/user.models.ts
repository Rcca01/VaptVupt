export class User{

    public id:string;

    constructor(
        public email: string,
        public nome:string,
        public username:string,
        public photo:string,
        public onesignal:string,
        public tokenonesignal:string
    ){}

}