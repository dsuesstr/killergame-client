/// <reference path='../min.references.ts'/>

module Services
{
    class Strings{
        private format:Function = null;
        static $inject = [
            $injections.Angular.$filter
        ];

        constructor($filter:angular.IFilterService){
            this.format = $filter($injections.Filters.FormatFilter);
        }

        Format:Services.IStrings = (key:string, ...args:any[]) =>{
            //TODO: Get error
            var params = Array.prototype.slice.call(args);
            //params.unshift(this.localize.getLocalizedString(key));
            return this.format.apply(null, params);
        };
    }

    export function StringsRegister ($module:angular.IModule)
    {
        $module.factory($injections.Services.Strings,
            [
                $injections.Angular.$injector,
                ($injector:angular.auto.IInjectorService):IStrings => $injector.instantiate(Strings).Format
            ]);
    }
}