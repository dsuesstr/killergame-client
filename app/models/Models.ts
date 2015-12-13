/// <reference path='../min.references.ts'/>

module Models {
    'use strict';

    export class Stone {
        X:number;
        Y:number;
        IsPlayer1:boolean;
        IsPlayer2:boolean;
    }

    export class ListParams {
        Limit:number;
        Offset:number;
        SortColumn:string;
        SortDirection:string;

        constructor() {
            this.Limit = $constants.Params.DefaultLimit;
            this.Offset = 0;
            this.SortColumn = "score";
            this.SortDirection = "desc";
        }
    }
}