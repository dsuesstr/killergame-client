/// <reference path='../min.references.ts'/>

module Services {
    class IonicConfig {
        static $inject = [
            $injections.Ionic.$ionicConfig
        ];
        constructor($ionicConfig) {
            $ionicConfig.views.maxCache(0);
            $ionicConfig.backButton.previousTitleText(false);
            $ionicConfig.backButton.text(false);
        }
    }

    export class IonicConfigServicesRegister {
        constructor($module: angular.IModule) {
            $module.run(IonicConfig);
        }
    }
}