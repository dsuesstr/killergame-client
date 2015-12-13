/// <reference path='../min.references.ts'/>

module Services {
    export interface IStrings {
        (key: string, ...args:any[]):string;
    }

    //change to IApiSettingsHandler
    export interface IApiSettingsHandler {
        GetApiParameters():any;
        GetSecureApiParameters():any;
        HasToken():boolean;
        RemoveToken();
        SetToken(token:string);
        VerifyParams(params:any):boolean;
        CheckResponse(error:Models.Messages.IError):boolean;
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
        Game(game:Models.Messages.IGame);
        Player(player:Models.Messages.IPlayer);
    }

    export interface ILocalStorage {
        Get(key: string): any;
        Save(key: string, data: any): void;
        Remove(key: string): void;
        ClearAll(): void;
    }

    export interface IUrls {
        Register():string;
        Login():string;
        Players():string;
        Games():string;
        GamesChallengee():string;
        GamesChallenger():string;
        GamesAccepted():string;
        GamesFinished():string;
    }

    export interface IGameHandler {
        CreateGame(model:Models.Messages.ICreateGame):angular.IPromise<Models.Messages.IGame>;
        MakeMove(gameId:string, stone:Models.Stone):angular.IPromise<Models.Messages.IGame>;
        Forfeit(gameId:string):angular.IPromise<Models.Messages.IGame>;
        DeleteGame(gameId:string):angular.IPromise<void>;
        AcceptGame(gameId:string):angular.IPromise<Models.Messages.IGame>;
        GetField(fieldString:string):Array<Array<Models.Stone>>;
        GetLastMove(oldField:Array<Array<Models.Stone>>, newField:Array<Array<Models.Stone>>):Models.Stone;
    }

    export interface IGameProvider {
        GetGame(gameId:string):angular.IPromise<Models.Messages.IGame>;
        GetGames():angular.IPromise<Models.Messages.IGame[]>;
        GetChallengerGames():angular.IPromise<Models.Messages.IGame[]>;
        GetChallengeeGames():angular.IPromise<Models.Messages.IGame[]>;
        GetAcceptedGames():angular.IPromise<Models.Messages.IGame[]>;
        GetFinishedGames(playerId:string):angular.IPromise<Models.Messages.IGame[]>;
    }

    //TODO: Move from IPlayerProvider
    export interface IPlayerHandler {
        UpdateCurrentPlayer(player:Models.Messages.IPlayerUpdate): angular.IPromise<Models.Messages.IPlayer>;
        SetCurrentPlayer(player:Models.Messages.IPlayer);
        RemoveCurrentPlayer();
    }

    export interface IPlayerProvider {
        GetPlayer(playerId:string): angular.IPromise<Models.Messages.IPlayer>;
        GetAllPlayers(listParams:Models.ListParams): angular.IPromise<Models.Messages.IPlayer[]>;
        GetAvailablePlayers(listParams:Models.ListParams): angular.IPromise<Models.Messages.IPlayer[]>;
        UpdateCurrentPlayer(player:Models.Messages.IPlayerUpdate): angular.IPromise<Models.Messages.IPlayer>;
        SetCurrentPlayer(player:Models.Messages.IPlayer);
        GetCurrentPlayer():Models.Messages.IPlayer;
        RemoveCurrentPlayer();
    }


    //TODO: change to IAccountHandler
    export interface IAccountHandler {
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
        LogApiError(error:Models.Messages.IError, source:any, showToast:boolean);
        GetLogFn(moduleId:any, fnName:string):any;
    }
}