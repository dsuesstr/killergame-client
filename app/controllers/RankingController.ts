/// <reference path='../min.references.ts'/>
module Controllers {

    interface IRankingScope extends angular.IScope {
        LoadMore();
        Refresh();
        HasMoreData:boolean;
    }

    class RankingController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Logger
        ];

        constructor(private $scope: IRankingScope,
                    private logger: Services.ILogger) {

            $scope.HasMoreData = true;
            $scope.LoadMore = this.LoadMore;
            $scope.Refresh = this.Refresh;
            $scope.$on($constants.Events.Kg.RankingRefreshComplete, this.RefreshComplete);

            //TODO: Make infinit scroll work
            $scope.$on($constants.Events.Kg.RankingLoadMoreComplete, this.LoadMoreComplete);
        }

        private Refresh = () => {
            this.$scope.$broadcast($constants.Events.Kg.RankingRefresh);
        };

        private LoadMore = () => {
            this.$scope.$broadcast($constants.Events.Kg.RankingLoadMore);
        };

        private RefreshComplete = () => {
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        };

        private LoadMoreComplete = (event, data:boolean) => {
            this.$scope.HasMoreData = data;
            this.$scope.$broadcast($constants.Events.Scroll.InfiniteScrollComplete);
        }
    }

    export class RankingControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.RankingController, RankingController);
        }
    }
}