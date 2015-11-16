/// <reference path='../min.references.ts'/>

module Services {

    class LocalStorage implements ILocalStorage {

        get(key:string):any {
            var value = localStorage.getItem(key);
            return  JSON.parse(value);
        }

        save(key:string, data):void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        remove(key:string):void {
            localStorage.removeItem(key);
        }

        clearAll():void {
            localStorage.clear();
        }
    }

    export class LocalStorageRegister{
        constructor($module:angular.IModule)
        {
            $module.service($injections.Services.LocalStorage, LocalStorage);
        }
    }
}