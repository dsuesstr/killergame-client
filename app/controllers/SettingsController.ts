/// <reference path='../min.references.ts'/>

module Controllers {

    class SettingsModel {
        Username:string;
        Email:string;
        OldPassword:string;
        NewPassword:string;
        NewPassword2:string;
        SettingsForm:angular.IFormController;
    }

    interface ISettingsScope extends angular.IScope {
        Save();
        IsFormValid();
        IsPasswordRequired();
        Model:SettingsModel;
    }

    class SettingsController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: ISettingsScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

            $scope.Model = new SettingsModel();
            $scope.Model.OldPassword = "";
            $scope.Model.NewPassword = "";
            $scope.Model.NewPassword2 = "";

            $scope.Save = this.Save;
            $scope.IsPasswordRequired = this.IsPasswordRequired;
            $scope.IsFormValid = this.IsFormValid;
        }

        private IsPasswordRequired = () => {
            return this.$scope.Model.OldPassword !== "" ||  this.$scope.Model.NewPassword !== "" ||  this.$scope.Model.NewPassword2 !== "";
        }

        private IsFormValid = () => {
            if(!this.$scope.Model.SettingsForm.$valid)
                return false
            if(this.IsPasswordRequired()) {
                return this.$scope.Model.OldPassword !== "" && this.$scope.Model.NewPassword !== "" && this.$scope.Model.NewPassword === this.$scope.Model.NewPassword2
            }
            return true;
        }

        private Save = () => {

            this.OnSaveSuccess();
        }

        private OnSaveFailed = () => {

            this.logger.logError("Settings not saved", null, this, true);

        }

        private OnSaveSuccess = () => {

            this.logger.logSuccess("Settings saved", null, this, true);
        }
    }

    export class SettingsControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.SettingsController, SettingsController);
        }
    }
}
