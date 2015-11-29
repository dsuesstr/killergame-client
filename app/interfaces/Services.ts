/// <reference path='../min.references.ts'/>

module Services {

    export interface IStrings {
        (key: string, ...args: any[]): string;
    }

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
        GetAllPlayers(listParams:Models.IListParams): angular.IPromise<Models.IPlayer[]>;
        GetAvailablePlayers(listParams:Models.IListParams): angular.IPromise<Models.IPlayer[]>;
        UpdateCurrentPlayer(player:Models.IPlayerUpdate): angular.IPromise<Models.IPlayer>;
        SetCurrentPlayer(player:Models.IPlayer);
        GetCurrentPlayer():Models.IPlayer;
        RemoveCurrentPlayer();

    }

    export interface ILoginProvider {
        Login(model:Models.ILogin):angular.IPromise<Models.IPlayer>;
        Register(model:Models.IRegister):angular.IPromise<Models.IPlayer>;
        IsLoggedIn():boolean;
        Logout();
    }

    export interface ILogger {
        Log(message:string, data:any, source:any, showToast:boolean);
        LogWarning(message:string, data:any, source:any, showToast:boolean);
        LogSuccess(message:string, data:any, source:any, showToast:boolean);
        LogError(message:string, data:any, source:any, showToast:boolean);
        GetLogFn(moduleId:any, fnName:string):any;
    }
}