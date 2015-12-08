/// <reference path='../min.references.ts'/>
module Controllers {

    interface IGameScope extends angular.IScope {
        Forfeit();
        MakeMove(x:number,y:number);
        GetSizeArray(size:number);
        Game:Models.Messages.IGame;
        CanMove:boolean;
        Player1Class:string;
        Player2Class:string;
        OtherPlayer:string;
    }

    class GameController {

        private intervalPromise:angular.IPromise<void>;
        private currentPlayer:Models.Messages.IPlayer;
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
            $scope.GetSizeArray = this.GetSizeArray;
            $scope.$on($constants.Events.Destroy, this.CancelRefresh);

            this.intervalPromise = this.$interval(this.Refresh, $constants.Intervals.GameRefreshInterval);
            this.currentPlayer = playerProvider.GetCurrentPlayer();
            this.gameId = this.GetGameId();
            this.$ionicLoading.show({
                template: "wait"
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

        }

        private GetSizeArray = (size:number) => {
            return[0,1,2,3,4,5,6,7,8,9];
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
            this.$scope.OtherPlayer = game.player1 == this.currentPlayer.username ? game.player2 : game.player1;
            this.$scope.Player1Class = game.activePlayer == "player1" ? "active" : "";
            this.$scope.Player2Class = game.activePlayer == "player2" ? "active" : "";
        }

        private GetCanMove = (game:Models.Messages.IGame) => {
            if(game.player1 == this.currentPlayer.username) {
                return game.activePlayer == "player1";
            }

            return game.activePlayer == "player2";
        }

        private Forfeit = () => {
            var confirmForfeit = this.$ionicPopup.confirm( {
                title: "Sure?",
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
            var gameId = this.$stateParams['gameId'];
            if (this.$angular.isUndefined(gameId))
                return false;

            return gameId;
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