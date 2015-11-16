/// <reference path='../min.references.ts'/>

module Directives {

    class RankingEntry {
        UserId:string;
        Rank:number;
        Username:string;
        Points:Number;
    }

    interface IRankingDirectiveScope extends angular.IScope {
        Entries:RankingEntry[]
    }

    class RankingDirective implements angular.IDirective {

        restrict:string = "E";
        templateUrl:string = "app/views/directives/ranking.html";


        static $inject = [
        ];

        constructor() {

        }

        link = ($scope:IRankingDirectiveScope, $element, $attr) => {
            //TODO: Load ranking vom server

            var entries:RankingEntry[];

            var entry:RankingEntry = new RankingEntry();
            entry.Rank = 1;
            entry.Username = "Domi";
            entry.UserId = "abc123";
            entry.Points = 1234;

            entries = [entry];

            var entry2:RankingEntry = new RankingEntry();
            entry2.Rank = 3;
            entry2.Username = "Domi2";
            entry2.Points = 321;

            entries.push(entry2);

            $scope.Entries = entries.sort((e1,e2) => e1.Rank - e2.Rank);
        }
    }

    var RankingDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(RankingDirective);
    }];

    export class RankingDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.RankingDirective, RankingDirectiveProvider);
        }
    }
}