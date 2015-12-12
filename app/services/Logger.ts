/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Logger implements ILogger {
        constructor(private $log: angular.ILogService) {
            toastr.options.timeOut = 3000;
            toastr.options.showDuration = 1200;
            toastr.options.hideDuration = 500;
            toastr.options.positionClass = "toast-top-right";
            toastr.options.closeButton = true;
            toastr.options.preventDuplicates = true;
            toastr.options.newestOnTop = true;
            toastr.options.progressBar = true;
        }

        public Log = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "info");
        };

        public LogWarning = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "warning");
        };


        public LogSuccess = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "success");
        };

        public LogError = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "error");
        };

        public GetLogFn = (moduleId:any, fnName:string): any => {
            fnName = fnName || 'log';
            switch (fnName.toLowerCase()) { // convert aliases
                case 'success':
                    fnName = 'logSuccess'; break;
                case 'error':
                    fnName = 'logError'; break;
                case 'warn':
                    fnName = 'logWarning'; break;
                case 'warning':
                    fnName = 'logWarning'; break;
            }

            var logFn = this[fnName] || this.Log;
            return (msg, data, showToast) => {
                logFn(msg, data, moduleId, (showToast === undefined) ? true : showToast);
            };
        }

        private LogIt = (message:string, data:any, source:any, showToast:boolean, toastType:string): void => {
            var write = (toastType === 'error') ? this.$log.error : this.$log.log;
            source = source ? '[' + source + '] ' : '';                                    
            write(source, message, data);

            if (showToast) {
                if (toastType === 'error') {
                    toastr.error(message);
                } else if (toastType === 'warning') {
                    toastr.warning(message);
                } else if (toastType === 'success') {
                    toastr.success(message);
                } else {
                    toastr.info(message);
                }
            }

            if ((<any>window).cordova) {
                console.log(message);
            }
        }
    }

    //Register DI    
    angular.module($injections.Constants.AppName).factory('Logger', ['$log', ($log) => new Logger($log)]);
}