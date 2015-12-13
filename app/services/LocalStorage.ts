/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class LocalStorage implements ILocalStorage {

        /**
         * Get value with key = key from localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} key
         * @returns {any}
         */
        public Get(key:string):any {
            var value = localStorage.getItem(key);
            return  JSON.parse(value);
        }

        /**
         * Save value with key = key to localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} key
         * @param {any} data
         */
        public Save(key:string, data):void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        /**
         * Remove value with key = key from localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} key
         * @constructor
         */
        public Remove(key:string):void {
            localStorage.removeItem(key);
        }

        /**
         * clear all values from the localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public ClearAll():void {
            localStorage.clear();
        }
    }

    export class LocalStorageRegister{
        constructor($module:angular.IModule) {
            $module.service($injections.Services.LocalStorage, LocalStorage);
        }
    }
}