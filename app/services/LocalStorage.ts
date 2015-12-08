/// <reference path='../min.references.ts'/>

module Services {

    class LocalStorage implements ILocalStorage {

        Get(key:string):any {
            var value = localStorage.getItem(key);
            return  JSON.parse(value);
        }

        Save(key:string, data):void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        Remove(key:string):void {
            localStorage.removeItem(key);
        }

        ClearAll():void {
            localStorage.clear();
        }
    }

    export class LocalStorageRegister{
        constructor($module:angular.IModule) {
            $module.service($injections.Services.LocalStorage, LocalStorage);
        }
    }
}