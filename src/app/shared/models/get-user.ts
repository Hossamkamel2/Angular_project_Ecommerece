import { Gender } from "../enums/gender";

export class GetUser {
    public  _id:number ;
    public email:string;
    public username:string;
    public profileImgUrl:string;
    public gender:Gender
}