/// <reference path='../min.references.ts'/>
module Controllers {

    class SettingsModel {
        Username:string;
        Email:string;
        OldPassword:string;
        NewPassword:string;
        NewPassword2:string;
    }

    interface ISettingsScope extends angular.IScope {
        Save();
        Model:SettingsModel;
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

            $scope.Model = new SettingsModel();
            $scope.Model.OldPassword = "";
            $scope.Model.NewPassword = "";
            $scope.Model.NewPassword2 = "";


            $scope.Save = this.Save;
        }

        Save = () => {

            if(this.$scope.Model.OldPassword !== "") {

                if(this.$scope.Model.NewPassword === "") {
                    this.ResetPasswords();
                    this.logger.logError("You have to set a new password!", null, this, true);
                    return;
                }

                if(this.$scope.Model.NewPassword !== this.$scope.Model.NewPassword2) {
                    this.ResetPasswords();
                    this.logger.logError("The new password does not match!", null, this, true);
                    return;
                }
            }

            this.OnSaveSuccess();
        }

        OnSaveSuccess = () => {

            this.logger.logSuccess("Settings saved", null, this, true);
        }

        ResetPasswords = () => {
            this.$scope.Model.OldPassword = "";
            this.$scope.Model.NewPassword = "";
            this.$scope.Model.NewPassword2 = "";
        }
    }

    export class SettingsControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.SettingsController, SettingsController);
        }
    }
}