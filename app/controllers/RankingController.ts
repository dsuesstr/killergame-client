/// <reference path='../min.references.ts'/>
module Controllers {

    interface IRankingScope extends angular.IScope {
        //methods
    }

    class RankingController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IRankingScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {


        }
    }

    export class RankingControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.RankingController, RankingController);
        }
    }
}