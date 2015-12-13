/// <reference path='../min.references.ts'/>
module Controllers {
    'use strict';

    class CreateGame implements Models.Messages.ICreateGame {
        player2:string;
        fieldWidth:number;
        fieldHeight:number;
    }

    class LobbyModel {
        AvailablePlayers:Models.Messages.IPlayer[];
        AvailableGames:Models.Messages.IGame[];
        CurrentPlayer:Models.Messages.IPlayer
    }

    interface ILobbyScope extends angular.IScope {
        Model:LobbyModel;
        Refresh();
        ChallengePlayer(player:Models.Messages.IPlayer);
        DeleteGame(game:Models.Messages.IGame);
        AcceptGame(game:Models.Messages.IGame);
        StartGame(game:Models.Messages.IGame);
    }

    class LobbyController {

        private intervalPromise:angular.IPromise<void>;
        
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Angular.$QService,
            $injections.Angular.$IntervalService,
            $injections.Ionic.$ionicPopup,
            $injections.Services.PlayerProvider,
            $injections.Services.GameProvider,
            $injections.Services.GameHandler,
            $injections.Services.Navigation,
            $injections.Services.Strings,
            $injections.Services.Logger
        ];

        constructor(private $scope: ILobbyScope,
                    private $q: angular.IQService,
                    private $interval: angular.IIntervalService,
                    private $ionicPopup: any,
                    private playerProvider: Services.IPlayerProvider,
                    private gameProvider: Services.IGameProvider,
                    private gameHandler: Services.IGameHandler,
                    private navigation: Services.INavigation,
                    private strings: Services.IStrings,
                    private logger: Services.ILogger) {


            $scope.Model = new LobbyModel();
            $scope.Model.CurrentPlayer = this.playerProvider.GetCurrentPlayer();
            $scope.Refresh = this.Refresh;
            $scope.ChallengePlayer = this.ChallengePlayer;
            $scope.DeleteGame = this.DeleteGame;
            $scope.AcceptGame = this.AcceptGame;
            $scope.StartGame = this.StartGame;

            this.Refresh();

            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.LobbyRefreshInterval);
            $scope.$on($constants.Events.Destroy, this.CancelRefresh);
        }

        /**
         * Cancels refresh interval
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private CancelRefresh = () => {
            this.$interval.cancel(this.intervalPromise);
        };

        /**
         * Refreshes the view (Loads availablePlayers and AvailableGames)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private Refresh = () => {
            this.$q.all([
                this.playerProvider.GetAvailablePlayers(new Models.ListParams()),
                this.gameProvider.GetGames()
            ]).then(this.GetDataSuccessful, this.GetDataFailed);
        };


        /**
         * Delete/Cancel a game (Only possible for not accepted games)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        private DeleteGame = (game:Models.Messages.IGame) => {
            this.$ionicPopup.confirm( {
                title: this.strings("delete_confirm_title"),
                template: this.strings("delete_confirm")
            }).then((result:boolean) => {
                if(result) {
                    this.gameHandler.DeleteGame(game.gameId).then(this.Refresh, this.OnError)
                }
            });
        };

        /**
         * Start an accepted game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        private StartGame = (game:Models.Messages.IGame) => {
            this.navigation.Game(game);
        };

        /**
         * Accept a game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        private AcceptGame = (game:Models.Messages.IGame) => {
            this.$ionicPopup.confirm( {
                title: this.strings("accept_confirm_title"),
                template: this.strings("accept_confirm"),
            }).then((result:boolean) => {
                if(result) {
                    this.gameHandler.AcceptGame(game.gameId).then(this.GameAcceptSuccessful, this.OnError)
                }
            });
        };

        /**
         * Challenge a player
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        private ChallengePlayer = (player:Models.Messages.IPlayer) => {
            this.$ionicPopup.confirm( {
                title: this.strings("challenge_confirm_title"),
                template: this.strings("challenge_confirm", player.username)
            }).then((result:boolean) => {
                if(result) {
                    var createGame = new CreateGame();
                    createGame.player2 = player.username;
                    createGame.fieldHeight = undefined;
                    createGame.fieldWidth = undefined;

                    this.gameHandler.CreateGame(createGame).then(this.GameUpdateSuccessful, this.OnError)
                }
            });
        };

        /**
         * Handler For success of GetData. Sets AvailablePlayers and AvailableGames
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Array} data
         */
        private GetDataSuccessful = (data:Array<any>) => {
            this.$scope.Model.AvailablePlayers = data[0];
            this.$scope.Model.AvailableGames = data[1];
            this.CheckGames();
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        };

        /**
         * Handler if one promise of GetData failes
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Array} data
         * @constructor
         */
        private GetDataFailed = (data:any) => {
            this.logger.LogError("GetDataFailed", data, this, false);
            this.$scope.Model.AvailablePlayers = null;
            this.$scope.Model.AvailableGames = null;
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        };

        /**
         * Handles Accept success
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        private GameAcceptSuccessful = (game:Models.Messages.IGame) => {
            this.CancelRefresh();
            this.navigation.Game(game);
        };

        /**
         * Handles Game Success
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        private GameUpdateSuccessful = (game:Models.Messages.IGame) => {
            this.Refresh();
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
         * Adds CanAccept and CanStart to the gameslist
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private CheckGames = () => {
            var currentPlayer = this.playerProvider.GetCurrentPlayer();

            for (var i = 0; i < this.$scope.Model.AvailableGames.length; i++) {
                if (this.$scope.Model.AvailableGames[i].status == $constants.Game.States.Prestart) {
                    this.$scope.Model.AvailableGames[i].canAccept = this.$scope.Model.AvailableGames[i].player2 === currentPlayer.username;
                }

                this.$scope.Model.AvailableGames[i].canStart = this.$scope.Model.AvailableGames[i].status == $constants.Game.States.Ready;
            }
        };
    }

    /**
     * Registers the InfoController as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class LobbyControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.LobbyController, LobbyController);
        }
    }
}