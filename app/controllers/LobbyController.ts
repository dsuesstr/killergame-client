/// <reference path='../min.references.ts'/>
module Controllers {

    class Player implements IPlayer {
        UserId:string;
        Username:string;
        Score:number;
        Rank:number;
    }

    class LobbyModel {
        Players:Models.IPlayer[]
    }

    interface ILobbyScope extends angular.IScope {
        Model:LobbyModel;
        Refresh();
    }

    class LobbyController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        private retryCount: number = 0;

        constructor(private $scope: ILobbyScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

            $scope.Model = new LobbyModel();
            var players:Models.IPlayer[];

            var player:Models.IPlayer = new Player();
            player.UserId = "asd1";
            player.Username = "Domi";
            players = [player];

            $scope.Model.Players = players;
            $scope.Refresh = this.Refresh;
        }

        private Refresh = () => {
            console.log("REFRESH");
            this.$scope.$broadcast('scroll.refreshComplete');

        }

        private OnError = () => {
            if (this.retryCount < 3) {
                this.retryCount++;
                //this.Start();
                return;
            }

            this.hidePopupWithDealy(() => this.$ionicPopup.alert({
                title: this.strings('home:nearest station resolving:title'),
                template: this.strings('home:nearest station resolving:message')
            }));
        };


        private hidePopupWithDealy(after: () => void): void {
            //Delay is necessary because a race condition might occure
            window.setTimeout(() => {
                this.$ionicLoading.hide();
                after();
            }, 500);
        }
    }

    export class LobbyControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.LobbyController, LobbyController);
        }
    }
}