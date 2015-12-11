/// <reference path='../min.references.ts'/>
module Controllers {


    interface IGameScope extends angular.IScope {
        Forfeit();
        LeaveGame();
        MakeMove(x:number,y:number);
        GetSizeArray(size:number):Array<number>;
        IsCheckerTypeA(x:number,y:number);
        IsWinningStone(x:number,y:number);
        GetFieldValue(x:number,y:number):Models.Stone
        Game:Models.Messages.IGame;
        CanMove:boolean;
        GameLoaded:boolean;
        ResultMessage:string;
        Player1Class:string;
        Player2Class:string;
        OtherPlayer:string;
        LastMove:Models.Stone;
        CurrentPlayer:Models.Messages.IPlayer;
        Field:Array<Array<Models.Stone>>;
    }

    class GameController {

        private intervalPromise:angular.IPromise<void>;
        private previousState:string = "";
        private previousField:Array<Array<Models.Stone>>;
        private gameId:string;

        static $inject = [
            $injections.Angular.$Scope,
            $injections.Angular.$IntervalService,
            $injections.UIRouter.$StateParams,
            $injections.Constants.$Angular,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Ionic.$ionicLoading,
            $injections.Services.GameProvider,
            $injections.Services.PlayerProvider,
            $injections.Services.GameHandler,
            $injections.Services.Logger
        ];

        constructor(private $scope: IGameScope,
                    private $interval: angular.IIntervalService,
                    private $stateParams:angular.ui.IStateParamsService,
                    private $angular:angular.IAngularStatic,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private $ionicLoading: any,
                    private gameProvider: Services.IGameProvider,
                    private playerProvider: Services.IPlayerProvider,
                    private gameHandler: Services.IGameHandler,
                    private logger: Services.ILogger) {

            this.$ionicLoading.show({
                template: "Loading"
            });

            $scope.Forfeit = this.Forfeit;
            $scope.LeaveGame = this.LeaveGame;
            $scope.MakeMove = this.MakeMove;
            $scope.GetFieldValue = this.GetFieldValue;
            $scope.GetSizeArray = this.GetSizeArray;
            $scope.IsCheckerTypeA = this.IsCheckerTypeA;
            $scope.IsWinningStone = this.IsWinningStone;
            $scope.$on($constants.Events.Destroy, this.LeaveGame);
            $scope.CurrentPlayer = playerProvider.GetCurrentPlayer();
            $scope.CanMove = false;
            $scope.GameLoaded = false;
            $scope.ResultMessage = "";

            this.gameId = this.GetGameId();
            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
            this.Refresh();
        }

        private MakeMove = (x:number,y:number) => {
            if(this.$scope.CanMove) {
                this.CancelRefresh();
                this.$scope.CanMove = false;
                this.gameHandler.MakeMove(this.$scope.Game.gameId, x, y).then(this.MakeMoveSuccessful, this.MakeMoveFailed);
            }
            else {
                this.logger.LogWarning("It's not your turn mate!", null, this, true);
            }
        };

        private MakeMoveSuccessful = (game:Models.Messages.IGame) => {
            this.SetGameInfo(game);
            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
        };

        private MakeMoveFailed = (game:Models.Messages.IGame) => {
            this.Refresh();
            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
        };

        private GetFieldValue = (x:number, y:number):Models.Stone => {
            if(this.$scope.Field == undefined)
                return null;

            return this.$scope.Field[x][y];
        };

        private GetSizeArray = (size:number):Array<number> => {
            if(size == undefined) {
                size = 10;
            }

            var arr = [];
            for(var i = 0; i < size; i++) {
                arr.push(i);
            }

            return arr;
        };

        /**
         * returns true if the modulo operation of both given values is equal
         * is used to "checker" the field
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         */
        private IsCheckerTypeA = (x:number, y:number) => {
            return (x % 2 === y % 2);
        };

        /**
         * checks if the given x/y coordinates are in the winning coordinates array of the game and if so, returns true
         * otherwise false
         *
         * @author Julian Mollik <jule@creative-coding.net>
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         */
        private IsWinningStone = (x:number, y:number) => {
            var i;
            for (i = 0; i < this.$scope.Game.setCoord.length; i++) {
                if (this.$scope.Game.setCoord[i][0] === x && this.$scope.Game.setCoord[i][1] === y) {
                    return true;
                }
            }
            return false;
        };

        private Refresh = () => {
            this.gameProvider.GetGame(this.gameId).then(this.GetGameSuccess, this.GetGameFailed);
        };

        private GetGameSuccess = (game:Models.Messages.IGame) => {
            this.SetGameInfo(game);
            this.$ionicLoading.hide();
            this.$scope.GameLoaded = true;
        };

        private GetGameFailed = (game:Models.Messages.IGame) => {

        };

        private SetGameInfo = (game:Models.Messages.IGame) => {
            this.$scope.Game = game;
            this.$scope.CanMove = this.GetCanMove(game);
            this.$scope.OtherPlayer = game.player1 == this.$scope.CurrentPlayer.username ? game.player2 : game.player1;
            this.$scope.Player1Class = game.activePlayer == $constants.Game.Player1 ? "player-active" : "";
            this.$scope.Player2Class = game.activePlayer == $constants.Game.Player2 ? "active" : "";
            this.$scope.Field = this.gameHandler.GetField(game.field);
            this.$scope.LastMove = this.gameHandler.GetLastMove(this.previousField, this.$scope.Field);
            this.previousField = this.$scope.Field;

            if(game.status == $constants.Game.States.Finished) {
                this.CancelRefresh();

                if(this.previousState == "") {
                    this.logger.Log("This game is already finished", null, this, true);
                }

                this.HandleResult(game.result, this.previousState !== "");
            }

            this.previousState = game.status;
        };

        private HandleResult = (result:string, showToast:boolean) => {

            var isPlayer1 = this.$scope.Game.player1 == this.$scope.CurrentPlayer.username;
            var player1 = isPlayer1 ? "You" : this.$scope.Game.player1;
            var player2 = !isPlayer1 ? "You" : this.$scope.Game.player2;

            switch(result) {
                case $constants.Game.Results.ForfeitPlayer1:
                    this.$scope.ResultMessage = player1 + " forfeited the game. " + player2 + " won";
                    break;
                case $constants.Game.Results.ForfeitPlayer2:
                    this.$scope.ResultMessage = player2 + " forfeited the game. " + player1 + " won!";
                    break;
                case $constants.Game.Results.WinPlayer1:
                    this.$scope.ResultMessage = player1 + " won against " + player2;
                    break;
                case $constants.Game.Results.WinPlayer2:
                    this.$scope.ResultMessage = player2 + " won against " + player1;
                    break;
                case $constants.Game.Results.Draw:
                    default:
                    return;
            }

            this.logger.Log(this.$scope.ResultMessage, null, this, showToast);
        };

        private GetCanMove = (game:Models.Messages.IGame) => {
            if(game.player1 == this.$scope.CurrentPlayer.username) {
                return game.activePlayer == $constants.Game.Player1;
            }

            return game.activePlayer == $constants.Game.Player2;
        };

        private Forfeit = () => {
            var confirmForfeit = this.$ionicPopup.confirm( {
                title: "Forefeit game",
                template: "a quiter never wins. a winner never quits?"
            });

            confirmForfeit.then((result:boolean) => {
                if(result) {
                    this.CancelRefresh();
                    this.gameHandler.Forfeit(this.$scope.Game.gameId).then(this.ForfeitSuccessful, this.ForfeitFailed)
                }
            });
        };

        private ForfeitSuccessful = (game:Models.Messages.IGame) => {
            this.logger.Log("You just forfeited the game? LOL!", null, this, true);
            this.navigation.Lobby();
        };

        private ForfeitFailed = (game:Models.Messages.IGame) => {

        };

        private GetGameId = () => {
            var gameId = this.$stateParams[$constants.Params.GameId];
            if (this.$angular.isUndefined(gameId))
                return false;

            return gameId;
        };

        private LeaveGame = () => {
            this.CancelRefresh();
            if(this.$scope.Game.status !== $constants.Game.States.Finished) {
                this.gameHandler.Forfeit(this.gameId).then(this.ForfeitSuccessful, this.ForfeitFailed);
            }
            else {
                this.navigation.Lobby();
            }
        };

        private CancelRefresh = () => {
            this.$interval.cancel(this.intervalPromise);
        }
    }

    export class GameControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.GameController, GameController);
        }
    }
}