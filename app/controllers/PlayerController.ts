/// <reference path='../min.references.ts'/>
module Controllers {

    interface IPlayerScope extends angular.IScope {
        GetResult(player:Models.Messages.IPlayer, game:Models.Messages.IGame):string;
        Player:Models.Messages.IPlayer
        Games:Models.Messages.IGame[];
    }

    class PlayerController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Logger,
            $injections.Services.PlayerProvider,
            $injections.Services.GameProvider,
            $injections.UIRouter.$StateParams,
            $injections.Constants.$Angular
        ];

        constructor(private $scope: IPlayerScope,
                    private logger: Services.ILogger,
                    private playerProvider: Services.IPlayerProvider,
                    private gameProvider: Services.IGameProvider,
                    private $stateParams:angular.ui.IStateParamsService,
                    private $angular: angular.IAngularStatic
        ) {
            this.$scope.GetResult = this.GetResult;
            this.LoadPlayer();
        }

        private GetResult = (player:Models.Messages.IPlayer, game:Models.Messages.IGame) => {
            switch(game.result) {
                case $constants.Game.Results.Draw:
                    return "draw";
                    break;
                case $constants.Game.Results.ForfeitPlayer2:
                case $constants.Game.Results.WinPlayer1:
                    return game.player1 == player.username ? "winner" : "loser";
                    break;
                case $constants.Game.Results.ForfeitPlayer1:
                case $constants.Game.Results.WinPlayer2:
                    return game.player2 == player.username ? "winner" : "loser";
                    break;
                default:
                    return "";
            }
        }

        private LoadPlayer = () => {
            var playerId = this.GetPlayerId();

            this.playerProvider.GetPlayer(playerId).then(this.GetPlayerSuccessful, this.OnError);
            this.gameProvider.GetFinishedGames(playerId).then(this.GetGamesSuccessful, this.OnError);
        };

        private GetPlayerSuccessful = (player:Models.Messages.IPlayer) => {
            this.$scope.Player = player;
        };

        private GetGamesSuccessful = (games:Models.Messages.IGame[]) => {
            this.$scope.Games = games;
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