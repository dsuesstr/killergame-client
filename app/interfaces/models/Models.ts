/// <reference path='../../min.references.ts'/>

module Models {
    export interface IPlayer {
        playerId:string;
        username:string;
        name:string;
        email:string;
        score:number;
    }

    export interface IPlayerUpdate {
        name:string;
        email:string;
        password_1:string;
        password_2:string;
    }

    export interface ILogin {
        username:string;
        password:string;
    }

    export interface IRegister {
        username:string;
        password_1:string;
        password_2:string;
        email:string;
        name:string;
    }

    export interface IError {
        text:string;
        key:string;
    }

    export interface IAccountResponse {
        token:string;
        player:IPlayer;
    }

    export interface IListParams {
        Limit:number;
        Offset:number;
        SortColumn:string;
        SortDirection:string;
    }
}