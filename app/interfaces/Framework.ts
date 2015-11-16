/// <reference path='../min.references.ts'/>

module Framework{
    export interface IDispose{
        Dispose();
    }

    export interface IEvent extends IDispose {
        Name:string;
        Subscribe(handler:any):Function;
        Fire(...args: any[]);
    }

    export interface IEventFactory{
        (name?:string):IEvent;
    }

    export interface IRootScope extends angular.IRootScopeService {
        online:boolean;
    }
}