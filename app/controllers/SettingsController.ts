/// <reference path='../min.references.ts'/>

module Controllers {
    'use strict';

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
        IsFormValid():boolean;
        IsPasswordRequired():boolean;
        Model:SettingsModel;
    }

    class SettingsController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Logger,
            $injections.Services.PlayerProvider,
            $injections.Services.Strings
        ];

        constructor(private $scope: ISettingsScope,
                    private logger: Services.ILogger,
                    private playerProvider: Services.IPlayerProvider,
                    private strings: Services.IStrings) {

            $scope.Model = new SettingsModel();
            $scope.Model.Player = this.playerProvider.GetCurrentPlayer();
            $scope.Model.OldPassword = "";
            $scope.Model.NewPassword = "";
            $scope.Model.NewPassword2 = "";

            $scope.Save = this.Save;
            $scope.IsPasswordRequired = this.IsPasswordRequired;
            $scope.IsFormValid = this.IsFormValid;
        }

        /**
         *  Gets whether the password ist required
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {boolean}
         */
        private IsPasswordRequired = ():boolean => {
            return this.$scope.Model.OldPassword !== "" ||  this.$scope.Model.NewPassword !== "" ||  this.$scope.Model.NewPassword2 !== "";
        };

        /**
         * Gets whether the form is valid and can be sended
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {boolean}
         */
        private IsFormValid = () => {
            if(!this.$scope.Model.SettingsForm.$valid) {
                return false
            }

            if(this.IsPasswordRequired()) {
                return this.$scope.Model.OldPassword !== "" && this.$scope.Model.NewPassword !== "" && this.$scope.Model.NewPassword === this.$scope.Model.NewPassword2
            }

            return true;
        };

        /**
         * Save the settings to the API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private Save = () => {

            var playerData = new PlayerData();
            playerData.name = this.$scope.Model.Player.name;
            playerData.email = this.$scope.Model.Player.email;

            if(this.$scope.Model.NewPassword !== "") {
                playerData.password_1 = this.$scope.Model.NewPassword;
                playerData.password_2 = this.$scope.Model.NewPassword2;
            }

            this.playerProvider.UpdateCurrentPlayer(playerData).then(this.OnSaveSuccess, this.OnError);
        };

        /**
         * Handles the save success case
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        private OnSaveSuccess = (player:Models.Messages.IPlayer) => {
            this.logger.LogSuccess(this.strings("settings_saved"), null, this, true);
        };

        /**
         * Handles the error case
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IError} error
         */
        private OnError = (error:Models.Messages.IError) => {
            this.logger.LogApiError(error, this, true);
        }
    }

    /**
     * Registers the SettingsController as module
     *
     *  @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class SettingsControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.SettingsController, SettingsController);
        }
    }
}
