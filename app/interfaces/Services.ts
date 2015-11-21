/// <reference path='../min.references.ts'/>

module Services {


    export interface IOpenLink {
        (url: string);
    }

    export interface IStrings {
        (key: string, ...args: any[]): string;
    }

    export interface INavigation {
        Login();
        Lobby();
        Player(userId:string);
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

    export interface ILoginProvider {
        Login(model:Models.ILogin):angular.IPromise<string>;
        Register(model:Models.IRegister):angular.IPromise<string>;
    }
}