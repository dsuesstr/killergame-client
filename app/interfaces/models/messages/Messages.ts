module Models {
    export module Messages {

        export interface ICoordinates {
            x:number;
            y:number;
        }

        export interface IGame {
            player1:string;
            player2:string;
            field:string;
            moveCount:number;
            setCoord:any;
            result:string;
            status:string;
            activePlayer:string;
            fieldHeight:number;
            fieldWidth:number;
            gameId:string;
            canAccept:boolean;
            canStart:boolean;
        }

        export interface ICreateGame {
            player2:string;
            fieldWidth:number;
            fieldHeight:number;
        }

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

        //TODO: Rename to IAccount
        export interface IAccountResponse {
            token:string;
            player:IPlayer;
        }
    }
}