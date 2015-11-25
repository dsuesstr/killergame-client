/// <reference path='../min.references.ts'/>

module Services {

    export interface IApiSettingsProvider {
        GetApiParameters():any;
        GetSecureApiParameters():any;
        HasToken():boolean;
        RemoveToken();
        SetToken(token:string);
    }

    export interface IConverter {
        ConvertApiPlayer(apiPlayer:any):Models.IPlayer;
    }

    export interface IOpenLink {
        (url: string);
    }

    export interface INavigation {
        Login();
        Lobby();
        Player(player:Models.IPlayer);
    }

    export interface ILocalStorage {
        get(key: string): any;
        save(key: string, data: any): void;
        remove(key: string): void;
        clearAll(): void;
    }

    export interface IUrls {
        Register():string;
        Login():string;
        Players():string;
    }

    export interface IPlayerProvider {
        GetPlayer(playerId:string): angular.IPromise<Models.IPlayer>;
        GetAllPlayers(startIndex:number, limit:number, sortColumn:string, sortDirection:string): angular.IPromise<Models.IPlayer[]>;
        GetAvailablePlayers(startIndex:number, limit:number, sortColumn:string, sortDirection:string): angular.IPromise<Models.IPlayer[]>;
    }

    export interface ILoginProvider {
        Login(model:Models.ILogin):angular.IPromise<string>;
        Register(model:Models.IRegister):angular.IPromise<string>;
        IsLoggedIn():boolean;
        Logout();
    }
}