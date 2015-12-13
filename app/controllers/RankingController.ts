/// <reference path='../min.references.ts'/>
module Controllers {
    'use strict';

    interface IRankingScope extends angular.IScope {
        LoadMore();
        Refresh();
        HasMoreData:boolean;
    }

    class RankingController {
        static $inject = [
            $injections.Angular.$Scope
        ];

        constructor(private $scope: IRankingScope) {
            $scope.HasMoreData = true;
            $scope.Refresh = this.Refresh;
            $scope.$on($constants.Events.Kg.RankingRefreshComplete, this.RefreshComplete);

        }

        /**
         * Fires the RankingRefresh event
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private Refresh = () => {
            this.$scope.$broadcast($constants.Events.Kg.RankingRefresh);
        };

        /**
         * Fires the RefreshComplete Event to hide the "refresh" icon
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private RefreshComplete = () => {
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        };
    }

    /**
     * Registers the RankingController as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class RankingControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.RankingController, RankingController);
        }
    }
}