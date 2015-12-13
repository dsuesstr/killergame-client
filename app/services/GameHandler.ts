/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Coordinates implements Models.Messages.ICoordinates {
        x:number;
        y:number;
    }

    class GameHandler implements IGameHandler {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.ApiSettingsHandler
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private apiSettingsHandler:Services.IApiSettingsHandler) {
        }

        /**
         * Make a move on a specific game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} gameId
         * @param {Models.Stone} stone
         * @returns {IPromise<Models.Messages.IGame>}
         */
        public MakeMove = (gameId:string, stone:Models.Stone):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId;
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            var coordinates = new Coordinates();
            coordinates.x = stone.X;
            coordinates.y = stone.Y;

            this.$http.put(url, coordinates, params).success((response:any) => {
                defer.resolve(response.game);
            })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        /**
         * Forfeit a specific game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} gameId
         * @returns {IPromise<Models.Messages.IGame>}
         */
        public Forfeit = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId + "/forfeit";
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.put(url, {}, params).success((response:any) => {
                defer.resolve(response.game);
            }).error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        /**
         * Create a new game (challenge a player)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Model.Messages.IGame} model
         * @returns {IPromise<Models.Messages.IGame>}
         */
        public CreateGame = (model:Models.Messages.ICreateGame):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games();
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.post(url, model, params)
                .success((response:any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });
            return defer.promise;
        };

        /**
         * Delete a specific game (only unaccepted games can be deleted)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} gameId
         * @returns {IPromise<void>}
         * @constructor
         */
        public DeleteGame = (gameId:string):angular.IPromise<void> => {
            var url = this.urls.Games() + "/" + gameId;
            var defer = this.$q.defer<void>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.delete(url, params)
                .success((response: any) => {
                    defer.resolve();
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        /**
         * Accept a specific game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} gameId
         * @returns {IPromise<Models.Messages.IGame>}
         * @constructor
         */
        public AcceptGame = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId + "/accept";
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.put(url, {}, params)
                .success((response: any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        /**
         * Converts a fieldstring from the API in an Array<Array<Models.Stone>>
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} fieldString
         * @returns {Array<Array<Models.Stone>>}
         * @constructor
         */
        public GetField = (fieldString:string):Array<Array<Models.Stone>> => {
            var fieldArray = JSON.parse(fieldString);
            var field = [];

            for(var x = 0; x < fieldArray.length; x++) {

                var row = [];

                for(var y = 0; y < fieldArray[x].length; y++) {
                    var stone = new Models.Stone();
                    stone.IsPlayer1 = fieldArray[x][y] == $constants.Game.Stones.Player1;
                    stone.IsPlayer2 = fieldArray[x][y] == $constants.Game.Stones.Player2;
                    stone.X = x;
                    stone.Y = y;
                    row.push(stone);
                }

                field.push(row);
            }
            return field;
        };

        /**
         * Get last move from the field (first not equal stone)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Array<Array<Models.Stone>>}oldField
         * @param {Array<Array<Models.Stone>>} newField
         * @returns {any}
         * @constructor
         */
        public GetLastMove = (oldField:Array<Array<Models.Stone>>, newField:Array<Array<Models.Stone>>):Models.Stone => {

            for(var x = 0; x < newField.length; x++) {
                for (var y = 0; y < newField[x].length; y++) {
                    if (angular.isDefined(oldField)) {
                        if (newField[x][y] === oldField[x][y]) {
                            continue;
                        }

                        return newField[x][y];
                    }
                    else {
                        if(newField[x][y].IsPlayer1 || newField[x][y].IsPlayer2) {

                            return newField[x][y];
                        }
                    }
                }
            }
            return null;
        }
    }

    /**
     * Register the GameHandler as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class GameHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.GameHandler, GameHandler);
        }
    }
}