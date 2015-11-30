/// <reference path='../min.references.ts'/>

module Controllers {

     class PlayerData implements Models.Messages.IPlayerUpdate {
        name:string;
        email:string;
        password_1:string;
        password_2:string;
    }

    class SettingsModel {
        Player:Models.Messages.IPlayer;
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
            $injections.Services.Logger,
            $injections.Services.PlayerProvider
        ];

        constructor(private $scope: ISettingsScope,
                    private logger: Services.ILogger,
                    private playerProvider: Services.IPlayerProvider) {

            $scope.Model = new SettingsModel();
            $scope.Model.Player = this.playerProvider.GetCurrentPlayer();
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
            if(!this.$scope.Model.SettingsForm.$valid) {
                return false
            }

            if(this.IsPasswordRequired()) {
                return this.$scope.Model.OldPassword !== "" && this.$scope.Model.NewPassword !== "" && this.$scope.Model.NewPassword === this.$scope.Model.NewPassword2
            }

            return true;
        }

        private Save = () => {

            var playerData = new PlayerData();
            playerData.name = this.$scope.Model.Player.name;
            playerData.email = this.$scope.Model.Player.email;

            if(this.$scope.Model.NewPassword !== "") {
                playerData.password_1 = this.$scope.Model.NewPassword;
                playerData.password_2 = this.$scope.Model.NewPassword2;
            }

            this.playerProvider.UpdateCurrentPlayer(playerData).then(this.OnSaveSuccess, this.OnSaveFailed);
        }

        private OnSaveSuccess = (player:Models.Messages.IPlayer) => {
            this.logger.LogSuccess("Settings saved", null, this, true);
        }

        private OnSaveFailed = (player:Models.Messages.IPlayer) => {
            this.logger.LogError("Settings not saved", null, this, true);
        }
    }

    export class SettingsControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.SettingsController, SettingsController);
        }
    }
}
