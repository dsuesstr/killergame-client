/// <reference path='../min.references.ts'/>
module Services {
    'use strict';

    interface IIonicHistory {
        clearHistory();
        currentView(view?):any;
        nextViewOptions(options:any):any;
    }

    class ClearHistoryService {

        static $inject = [
            $injections.Ionic.$ionicHistory,
            $injections.Angular.$RootScope
        ];

        constructor($ionicHistory: IIonicHistory, $rootScope:angular.IRepeatScope) {
            $rootScope.$on('$stateChangeStart',(event, toState) => {
                if (toState.clearHistory)
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
            });
        }
    }

    export class ClearHistoryServicesRegister {
        constructor($module: angular.IModule) {
            $module.run(ClearHistoryService);
        }
    }
}