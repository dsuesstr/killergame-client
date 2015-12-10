/// <reference path='../min.references.ts'/>
module Controllers {

    class Stone {
        X:number;
        Y:number;
        IsPlayer1:boolean;
        IsPlayer2:boolean;
    }

    interface IGameScope extends angular.IScope {
        Forfeit();
        MakeMove(x:number,y:number);
        GetSizeArray(size:number):Array<number>;
        IsCheckerTypeA(x:number,y:number);
        GetFieldValue(x:number,y:number):Stone
        Game:Models.Messages.IGame;
        CanMove:boolean;
        Player1Class:string;
        Player2Class:string;
        OtherPlayer:string;
        CurrentPlayer:Models.Messages.IPlayer;
        Field:Array<Array<Stone>>;
    }

    class GameController {

        private intervalPromise:angular.IPromise<void>;

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

            $scope.Forfeit = this.Forfeit;
            $scope.MakeMove = this.MakeMove;
            $scope.GetFieldValue = this.GetFieldValue;
            $scope.GetSizeArray = this.GetSizeArray;
            $scope.IsCheckerTypeA = this.IsCheckerTypeA;
            $scope.$on($constants.Events.Destroy, this.CancelRefresh);

            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
            $scope.CurrentPlayer = playerProvider.GetCurrentPlayer();
            this.gameId = this.GetGameId();
            this.$ionicLoading.show({
                template: "Loading"
            });
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
        }

        private MakeMoveSuccessful = (game:Models.Messages.IGame) => {
            this.SetGameInfo(game);
            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
        }

        private MakeMoveFailed = (game:Models.Messages.IGame) => {
            this.Refresh();
            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
        }

        private GetFieldValue = (x:number, y:number):Stone => {
            if(this.$scope.Field == undefined)
                return null;

            return this.$scope.Field[x][y];
        };

        private GetSizeArray = (size:number):Array<number> => {
            if(size == undefined) {
                size = 10;
            }

            var arr = new Array<number>();
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

        private Refresh = () => {
            this.gameProvider.GetGame(this.gameId).then(this.GetGameSuccess, this.GetGameFailed);
        }

        private GetGameSuccess = (game:Models.Messages.IGame) => {
            this.SetGameInfo(game);
            this.$ionicLoading.hide();
        }

        private GetGameFailed = (game:Models.Messages.IGame) => {

        }

        private SetGameInfo = (game:Models.Messages.IGame) => {
            this.$scope.Game = game;
            this.$scope.CanMove = this.GetCanMove(game);
            this.$scope.OtherPlayer = game.player1 == this.$scope.CurrentPlayer.username ? game.player2 : game.player1;
            this.$scope.Player1Class = game.activePlayer == $constants.Game.Player1 ? "player-active" : "";
            this.$scope.Player2Class = game.activePlayer == $constants.Game.Player2 ? "active" : "";
            this.$scope.Field = this.SetField(game.field);

            if(game.status == $constants.Game.States.Finished) {
                this.CancelRefresh();
                /*debugger;
                if(game.result == this.$scope.CurrentPlayer.playerId) {
                    this.logger.LogSuccess("You won! AMAZING!", null, this, true);
                } else {
                    this.logger.Log("You lost! Good luck next time!", null, this, true);
                }
                //TODO: Show winning
                */
            }
        }

        private SetField = (fieldString:string):Array<Array<Stone>> => {
            var fieldArray = JSON.parse(fieldString);
            var field = new Array<Array<Stone>>();

            for(var x = 0; x < fieldArray.length; x++) {

                var row = new Array<Stone>();

                for(var y = 0; y < fieldArray[x].length; y++) {
                    var stone = new Stone();
                    stone.IsPlayer1 = fieldArray[x][y] == $constants.Game.Stones.Player1;
                    stone.IsPlayer2 = fieldArray[x][y] == $constants.Game.Stones.Player2;
                    stone.X = x;
                    stone.Y = y;
                    row.push(stone);
                }

                field.push(row);
            }

            return field;
        }

        private GetCanMove = (game:Models.Messages.IGame) => {
            if(game.player1 == this.$scope.CurrentPlayer.username) {
                return game.activePlayer == $constants.Game.Player1;
            }

            return game.activePlayer == $constants.Game.Player2;
        }

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
        }

        private ForfeitSuccessful = (game:Models.Messages.IGame) => {
            this.logger.Log("You lost against this guy? LOL!", null, this, true);
            this.navigation.Lobby();
        }

        private ForfeitFailed = (game:Models.Messages.IGame) => {

        }

        private GetGameId = () => {
            var gameId = this.$stateParams[$constants.Params.GameId];
            if (this.$angular.isUndefined(gameId))
                return false;

            return gameId;
        }

        private LeaveGame = () => {

        }

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