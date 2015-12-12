/// <reference path='../min.references.ts'/>
module Controllers {

    interface IPlayerScope extends angular.IScope {
        Player:Models.Messages.IPlayer
    }

    class PlayerController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Logger,
            $injections.Services.PlayerProvider,
            $injections.UIRouter.$StateParams,
            $injections.Constants.$Angular
        ];

        constructor(private $scope: IPlayerScope,
                    private logger: Services.ILogger,
                    private playerProvider: Services.IPlayerProvider,
                    private $stateParams:angular.ui.IStateParamsService,
                    private $angular: angular.IAngularStatic
        ) {

            this.LoadPlayer();
        }

        private LoadPlayer = () => {
            var playerId = this.GetPlayerId();

            this.playerProvider.GetPlayer(playerId).then(this.GetPlayerSuccessful, this.OnError);
        };

        private GetPlayerSuccessful = (player:Models.Messages.IPlayer) => {
            this.$scope.Player = player;
        };

        private OnError = (error:Models.Messages.IError) => {
            this.logger.LogApiError(error, this, true);
        };

        private GetPlayerId = () => {
            var playerId = this.$stateParams[$constants.Params.PlayerId];
            if (this.$angular.isUndefined(playerId)) return false;
            return playerId;
        }
    }

    export class PlayerControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.PlayerController, PlayerController);
        }
    }
}