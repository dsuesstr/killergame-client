/// <reference path='../min.references.ts'/>
module Controllers {

    interface IGameScope extends angular.IScope {

    }

    class GameController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IGameScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

        }



    }

    export class GameControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.GameController, GameController);
        }
    }
}