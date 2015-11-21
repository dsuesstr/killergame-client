/// <reference path='../min.references.ts'/>

module Services {
    class Converter implements IConverter {

        constructor() {
        }

        public ConvertApiPlayer = (apiPlayer:any) : Models.IPlayer => {
            var player = new Models.Player();
            player.PlayerId = apiPlayer.playerId;
            player.Username = apiPlayer.username;
            player.Score = apiPlayer.score;

            return player;
        }
    }

    export class ConverterRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Converter, Converter);
        }
    }
}