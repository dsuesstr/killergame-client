/// <reference path='../min.references.ts'/>

module Directives {

    interface IFieldDirectiveScope extends angular.IScope {
        Size:number;
        GetSizeArray(size:number):number[];
    }

    class FieldDirective implements angular.IDirective {

        restrict:string = "E";
        templateUrl:string = "app/views/directives/field.html";


        static $inject = [];

        constructor() {

        }

        link = ($scope:IFieldDirectiveScope, $element, $attr) => {
            $scope.Size = 10;
            $scope.GetSizeArray = this.GetSizeArray;
        }

        GetSizeArray = (size:number) => {
            return[0,1,2,3,4,5,6,7,8,9];
        };
    }

    var FieldDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(FieldDirective);
    }];

    export class FieldDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.FieldDirective, FieldDirectiveProvider);
        }
    }
}