/// <reference path='../min.references.ts'/>
module Controllers {
    'use strict';

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
            this.Load();
        }

        /**
         * Gets the result of a game for the currentplayer
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         * @param {Models.Messages.IGame} game
         * @returns {any}
         */
        private GetResult = (player:Models.Messages.IPlayer, game:Models.Messages.IGame):string => {
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

        /**
         * Load the player and the games
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private Load = () => {
            var playerId = this.GetPlayerId();

            this.playerProvider.GetPlayer(playerId).then(this.GetPlayerSuccessful, this.OnError);
            this.gameProvider.GetFinishedGames(playerId).then(this.GetGamesSuccessful, this.OnError);
        };

        /**
         * Sets the player on the scope
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        private GetPlayerSuccessful = (player:Models.Messages.IPlayer) => {
            this.$scope.Player = player;
        };

        /**
         * Sets the games on the scope
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        private GetGamesSuccessful = (games:Models.Messages.IGame[]) => {
            this.$scope.Games = games;
        };

        /**
         * Handles errors from the API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IError} error
         */
        private OnError = (error:Models.Messages.IError) => {
            this.logger.LogApiError(error, this, true);
        };

        /**
         * Gets the playerId from the stateparamsservice
         *
         * @returns {string}
         * @constructor
         */
        private GetPlayerId = ():string => {
            var playerId = this.$stateParams[$constants.Params.PlayerId];
            if (this.$angular.isUndefined(playerId)) return "";
            return playerId;
        }
    }

    /**
     * Registers the PlayerController as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class PlayerControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.PlayerController, PlayerController);
        }
    }
}