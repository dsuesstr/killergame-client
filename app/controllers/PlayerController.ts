/// <reference path='../min.references.ts'/>
module Controllers {

    interface IPlayerScope extends angular.IScope {
        Player:Models.IPlayer
    }

    class PlayerController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IPlayerScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

        }
    }

    export class PlayerControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.PlayerController, PlayerController);
        }
    }
}