/// <reference path='../min.references.ts'/>

module Plugins {
    export interface IError {
        code:any;
        message:string;
    }

    export module NetworkConnection{
        export interface INetworkConnection{
            type:any;
        }
    }

    export module Globalization{
        export interface ILanguage{
            value:string;
        }

        export interface IGlobalization
        {
            getPreferredLanguage(success:(language:ILanguage)=>void, error:(error:IError)=>void);
        }
    }
}