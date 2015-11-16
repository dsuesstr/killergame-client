/// <reference path='../min.references.ts'/>
module Controllers {

    interface IHomeScope extends angular.IScope {
        //methods
    }

    class HomeController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        private retryCount: number = 0;

        constructor(private $scope: IHomeScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {
        }


        private OnError = () => {
            if (this.retryCount < 3) {
                this.retryCount++;
                //this.Start();
                return;
            }

            this.hidePopupWithDealy(() => this.$ionicPopup.alert({
                title: this.strings('home:nearest station resolving:title'),
                template: this.strings('home:nearest station resolving:message')
            }));
        };


        private hidePopupWithDealy(after: () => void): void {
            //Delay is necessary because a race condition might occure
            window.setTimeout(() => {
                this.$ionicLoading.hide();
                after();
            }, 500);
        }
    }

    export class HomeControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.HomeController, HomeController);
        }
    }
}