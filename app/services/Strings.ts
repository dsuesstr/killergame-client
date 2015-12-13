/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Strings {
        private format:Function = null;

        static $inject = [
            $injections.Angular.$filter,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Constants.$Enumerable,
            $injections.Services.LocalStorage
        ];

        constructor(private $filter:angular.IFilterService,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private $enumerable: linqjs.EnumerableStatic,
                    private localStorage:Services.ILocalStorage){

            this.format = $filter($injections.Filters.FormatFilter);

            this.LoadStrings().then(this.StringsLoaded, this.OnError)
        }

        /**
         * tries to get the key from the resources and format it with the given args (Works like c# Strings.Format(..)
         * returns key if key is not found
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} key
         * @param {Array<any>} args
         * @returns {any}
         */
        public Format:IStrings = (key:string, ...args:any[]):string => {
            var texts = this.localStorage.Get($constants.Keys.Strings)
            if(!angular.isDefined(texts)) {
                return key;
            }
            var result = this.$enumerable.from(texts).firstOrDefault(x => x.key == key);

            if(result !== null) {
                return result.value.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                        ;
                });
            }

            return key;
        };

        /**
         * Loads the strings from a json file
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {IPromise<Array<Object>>}
         */
        private LoadStrings = ():angular.IPromise<Array<Object>> => {

            var defer = this.$q.defer<Array<Object>>();

            this.$http.get('app/data/Strings.json')
                .success((response:Array<any>) => {
                    defer.resolve(response);
                })
                .error((response:any, status:number) => {
                    defer.reject(response)
                });

            return defer.promise;
        };

        /**
         * Handles success case of load strings
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Array<string>} texts
         */
        private StringsLoaded = (texts:Array<string>) => {
            this.localStorage.Save($constants.Keys.Strings, texts);
        };

        /**
         * Handles error case of load strings
         *
         * @param {any} error
         */
        private OnError = (error:any) => {
            this.localStorage.Save($constants.Keys.Strings, null);
        };
    }

    /**
     * Registers strings
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     * @param {angular.IModule} $module
     */
    export function StringsRegister ($module:angular.IModule) {
        $module.factory($injections.Services.Strings,
            [
                $injections.Angular.$injector,
                ($injector:angular.auto.IInjectorService):IStrings => $injector.instantiate(Strings).Format
            ]);
    }
}