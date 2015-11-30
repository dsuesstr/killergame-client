/// <reference path='../min.references.ts'/>

module Services {
    class Converter implements IConverter {

        constructor() {
        }

        public ConvertApiPlayer = (apiPlayer:any) : Models.Messages.IPlayer => {
            //var player = new Models.Player();
            //player.PlayerId = apiPlayer.playerId;
            //player.Username = apiPlayer.username;
            //player.Email = apiPlayer.email;
            //player.Name = apiPlayer.name;
            //player.Score = apiPlayer.score;

            //return player;
            return undefined;
        }
    }

    export class ConverterRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Converter, Converter);
        }
    }
}