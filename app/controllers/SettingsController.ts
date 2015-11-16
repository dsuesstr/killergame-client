/// <reference path='../min.references.ts'/>
module Controllers {

    interface ISettingsScope extends angular.IScope {
        Save();
    }

    class SettingsController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: ISettingsScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {


        }
    }

    export class SettingsControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.SettingsController, SettingsController);
        }
    }
}