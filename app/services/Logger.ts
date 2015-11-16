/// <reference path='../min.references.ts'/>

module Services {
    'use strict';    

    //TODO: ILogger interface?

    export class Logger {
        public log: (message, data, source, showToast) => void;
        public logWarning: (message, data, source, showToast) => void;
        public logSuccess: (message, data, source, showToast) => void;
        public logError: (message, data, source, showToast) => void;
        public getLogFn: (moduleId, fnName) => any;

        constructor(private $log: angular.ILogService, private localize: any) {
            this.log = (message, data, source, showToast) => this.logInner(message, data, source, showToast);
            this.logWarning = (message, data, source, showToast) => this.logWarningInner(message, data, source, showToast);
            this.logSuccess = (message, data, source, showToast) => this.logSuccessInner(message, data, source, showToast);
            this.logError = (message, data, source, showToast) => this.logErrorInner(message, data, source, showToast);
            this.getLogFn = (moduleId, fnName) => this.getLogFnInner(moduleId, fnName);

            toastr.options.timeOut = 3000;
            toastr.options.showDuration = 1200;
            toastr.options.hideDuration = 500;
            toastr.options.positionClass = "toast-top-right";
            toastr.options.closeButton = true;
        }

        public getLogFnInner(moduleId, fnName): any {
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

            var logFn = this[fnName] || this.log;
            return (msg, data, showToast) => {
                logFn(this.localize.getLocalizedString(msg), data, moduleId, (showToast === undefined) ? true : showToast);                
            };
        }

        public logInner(message, data, source, showToast): void {
            this.logIt(message, data, source, showToast, 'info');
        }

        public logWarningInner(message, data, source, showToast): void {
            this.logIt(message, data, source, showToast, 'warning');
        }

        public logSuccessInner(message, data, source, showToast): void {
            this.logIt(message, data, source, showToast, 'success');
        }

        public logErrorInner(message, data, source, showToast): void {
            this.logIt(message, data, source, showToast, 'error');
        }

        private logIt(message, data, source, showToast, toastType): void {
            var write = (toastType === 'error') ? this.$log.error : this.$log.log;
            source = source ? '[' + source + '] ' : '';                                    
            write(source, message, data);

            if (showToast) {
                message = this.localize.getLocalizedString(message);
            }

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
    angular.module($injections.Constants.AppName).factory('Logger', ['$log', 'localize', ($log, localize) => new Logger($log, localize)]);
}