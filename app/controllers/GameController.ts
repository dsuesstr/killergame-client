/// <reference path='../min.references.ts'/>
module Controllers {

    interface IGameScope extends angular.IScope {

    }

    class GameController {

        private intervalPromise:angular.IPromise<void>

        static $inject = [
            $injections.Angular.$Scope,
            $injections.Angular.$IntervalService,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IGameScope,
                    private $interval: angular.IIntervalService,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private $ionicLoading: any,
                    private logger: Services.ILogger) {

            this.intervalPromise = this.$interval(this.Refresh, 5000);
            $scope.$on($constants.Events.Destroy, this.CancelRefresh);
            
        }

        public Refresh() {
            console.log("Refresh");
        }

        private CancelRefresh = () => {
            this.$interval.cancel(this.intervalPromise);
        }
    }

    export class GameControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.GameController, GameController);
        }
    }
}