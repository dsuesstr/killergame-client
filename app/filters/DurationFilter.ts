/// <reference path='../min.references.ts'/>

module Filters {

    class DurationFilter {
        filter = (millseconds:number) => {
            var seconds = Math.floor(millseconds / 1000);
            var days = Math.floor(seconds / 86400);
            var hours = Math.floor((seconds % 86400) / 3600);
            var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
            var timeString = '';
            //if(days > 0) timeString += (days > 1) ? (days + " ds ") : (days + " d ");
            //if(hours > 0) timeString += (hours > 1) ? (hours + " hs ") : (hours + " h ");
            //if (minutes >= 0) timeString += (minutes > 1) ? (minutes + " mins ") : (minutes + " min ");

            hours = hours + days * 24;
            timeString = hours + ":";
            timeString += (minutes === 0) ? "00" : (minutes < 10) ? "0" + minutes.toString() : minutes.toString();

            return timeString;
        };
    }

    var DurationFilterProvider = [$injections.Angular.$injector, ($injector:angular.auto.IInjectorService) => {
        var instance = $injector.instantiate(DurationFilter);
        return  instance.filter;
    }];

    export class DurationFilterRegister {
        constructor($module:angular.IModule) {
            $module.filter($injections.Filters.DurationFilter, DurationFilterProvider);
        }
    }
}