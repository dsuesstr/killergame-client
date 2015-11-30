/// <reference path='../min.references.ts'/>
module Controllers {

    class CreateGame implements Models.Messages.ICreateGame {
        player2:string;
        fieldWidth:number;
        fieldHeight:number;
    }

    class LobbyModel {
        AvailablePlayers:Models.Messages.IPlayer[]
        AvailableGames:Models.Messages.IGame[]
    }

    interface ILobbyScope extends angular.IScope {
        Model:LobbyModel;
        Refresh();
        ChallengePlayer(player:Models.Messages.IPlayer);
        DeleteGame(game:Models.Messages.IGame);
        ShowPlayer(player:Models.Messages.IPlayer);
    }

    class LobbyController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Angular.$QService,
            $injections.Ionic.$ionicPopup,
            $injections.Services.PlayerProvider,
            $injections.Services.GameProvider,
            $injections.Services.Navigation,
            $injections.Services.Logger
        ];

        constructor(private $scope: ILobbyScope,
                    private $q: angular.IQService,
                    private $ionicPopup: any,
                    private playerProvider: Services.IPlayerProvider,
                    private gameProvider: Services.IGameProvider,
                    private navigation: Services.INavigation,
                    private logger: Services.ILogger) {


            $scope.Model = new LobbyModel();
            $scope.Refresh = this.Refresh;
            $scope.ChallengePlayer = this.ChallengePlayer;
            $scope.DeleteGame = this.DeleteGame;
            $scope.ShowPlayer = this.ShowPlayer;

            this.Refresh();
        }

        private ShowPlayer = (player:Models.Messages.IPlayer) => {
            this.navigation.Player(player);
        }

        private Refresh = () => {
            this.$q.all([
                this.playerProvider.GetAvailablePlayers(new Models.ListParams()),
                this.gameProvider.GetGames()
            ]).then(this.GetDataSuccessful, this.GetDataFailed);
        }

        private DeleteGame = (game:Models.Messages.IGame) => {

            var confirmChallenge = this.$ionicPopup.confirm( {
                title: "Sure?",
                template: "are you sure that you want to cancel this challenge?"
            });

            confirmChallenge.then((result:boolean) => {
                if(result) {
                    this.gameProvider.DeleteGame(game).then(this.CreateGameSuccessful, this.CreateGameFailed)
                }
            });


        }

        private ChallengePlayer = (player:Models.Messages.IPlayer) => {

            var confirmChallenge = this.$ionicPopup.confirm( {
                title: "Sure?",
                template: "are you sure that you want to challenge " + player.username + "?"
            });

            confirmChallenge.then((result:boolean) => {
                if(result) {
                    var createGame = new CreateGame();
                    createGame.player2 = player.username;
                    createGame.fieldHeight = 10;
                    createGame.fieldWidth = 10;

                    this.gameProvider.CreateGame(createGame).then(this.CreateGameSuccessful, this.CreateGameFailed)
                }
            });
        }

        private CreateGameSuccessful = (game:Models.Messages.IGame) => {
            this.Refresh();
        }

        private CreateGameFailed = (game:Models.Messages.IGame) => {
            //TODO:
        }

        private GetDataSuccessful = (data:any) => {
            this.$scope.Model.AvailablePlayers = data[0];
            this.$scope.Model.AvailableGames = data[1];
            this.CheckGames();
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        }

        private CheckGames = () => {
            var currentPlayer = this.playerProvider.GetCurrentPlayer();

            for (var i = 0; i < this.$scope.Model.AvailableGames.length; i++) {
                if (this.$scope.Model.AvailableGames[i].status == "prestart") {
                    this.$scope.Model.AvailableGames[i].canAccept = this.$scope.Model.AvailableGames[i].player2 === currentPlayer.username;
                }

                this.$scope.Model.AvailableGames[i].canStart = this.$scope.Model.AvailableGames[i].status == "ready";
            }
        }

        private GetDataFailed = (data:any) => {
            this.$scope.Model.AvailablePlayers = null;
            this.$scope.Model.AvailableGames = null;
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        }
    }

    export class LobbyControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.LobbyController, LobbyController);
        }
    }
}