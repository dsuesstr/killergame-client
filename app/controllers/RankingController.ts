/// <reference path='../min.references.ts'/>
module Controllers {

    interface IRankingScope extends angular.IScope {
        Refresh();
    }

    class RankingController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IRankingScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

            $scope.Refresh = this.Refresh;

        }

        private Refresh = () => {
            //TODO: Implement
            console.log("REFRESH");
            this.$scope.$broadcast('scroll.refreshComplete');
        };
    }

    export class RankingControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.RankingController, RankingController);
        }
    }
}