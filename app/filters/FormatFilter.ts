/// <reference path='../min.references.ts'/>

module Filters {
    'use strict';

    class FormatFilter {
        filter = (input:string, ...args:any[]) => {
            return input.replace(/\{(\d+)\}/g, function (match, capture) {
                return args[1 * capture];
            });
        };
    }

    var FormatFilterProvider = [$injections.Angular.$injector, ($injector:angular.auto.IInjectorService) => {
        var instance = $injector.instantiate(FormatFilter);
        return  instance.filter;
    }];

    export class FormatFilterRegister {
        constructor($module:angular.IModule) {
            $module.filter($injections.Filters.FormatFilter, FormatFilterProvider);
        }
    }
}