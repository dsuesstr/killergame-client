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
        ConvertApiPlayer(apiPlayer:any):Models.Messages.IPlayer;
    }

    export interface IOpenLink {
        (url: string);
    }

    export interface INavigation {
        Login();
        Lobby();
        Player(player:Models.Messages.IPlayer);
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
        Games():string;
        GamesChallengee():string;
        GamesChallenger():string;
        GamesAccepted():string;
    }

    export interface IGameProvider {
        GetGames():angular.IPromise<Models.Messages.IGame[]>;
        GetChallengerGames():angular.IPromise<Models.Messages.IGame[]>;
        GetChallengeeGames():angular.IPromise<Models.Messages.IGame[]>;
        GetAcceptedGames():angular.IPromise<Models.Messages.IGame[]>;
        CreateGame(model:Models.Messages.ICreateGame):angular.IPromise<Models.Messages.IGame>;
        DeleteGame(game:Models.Messages.IGame):angular.IPromise;
    }

    export interface IPlayerProvider {
        GetPlayer(playerId:string): angular.IPromise<Models.Messages.IPlayer>;
        GetAllPlayers(listParams:Models.IListParams): angular.IPromise<Models.Messages.IPlayer[]>;
        GetAvailablePlayers(listParams:Models.IListParams): angular.IPromise<Models.Messages.IPlayer[]>;
        UpdateCurrentPlayer(player:Models.Messages.IPlayerUpdate): angular.IPromise<Models.Messages.IPlayer>;
        SetCurrentPlayer(player:Models.Messages.IPlayer);
        GetCurrentPlayer():Models.Messages.IPlayer;
        RemoveCurrentPlayer();

    }

    export interface ILoginProvider {
        Login(model:Models.Messages.ILogin):angular.IPromise<Models.Messages.IPlayer>;
        Register(model:Models.Messages.IRegister):angular.IPromise<Models.Messages.IPlayer>;
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