/// <reference path='../min.references.ts'/>

module Models {
    export class Player implements IPlayer {
        PlayerId:string;
        Username:string;
        Score:number;
        Rank:number;
    }
}