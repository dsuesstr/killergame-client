/// <reference path='../min.references.ts'/>

module Models {
    export class ListParams implements IListParams {
        Limit:number;
        Offset:number;
        SortColumn:string;
        SortDirection:string;

        constructor() {
            this.Limit = 10;
            this.Offset = 0;
            this.SortColumn = "score";
            this.SortDirection = "desc";
        }
    }
}