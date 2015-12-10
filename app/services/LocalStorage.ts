/// <reference path='../min.references.ts'/>

module Services {

    class LocalStorage implements ILocalStorage {

        public Get(key:string):any {
            var value = localStorage.getItem(key);
            return  JSON.parse(value);
        }

        public Save(key:string, data):void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        public Remove(key:string):void {
            localStorage.removeItem(key);
        }

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