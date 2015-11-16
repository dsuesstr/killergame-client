/// <reference path='../min.references.ts'/>

module Services {


    export interface IOpenLink {
        (url: string);
    }

    export interface IStrings {
        (key: string, ...args: any[]): string;
    }

    export interface INavigation {
        Home();
    }

    export interface ILocalStorage {
        get(key: string): any;
        save(key: string, data: any): void;
        remove(key: string): void;
        clearAll(): void;
    }

}