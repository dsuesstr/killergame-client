/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Logger implements ILogger {

        constructor(private $log: angular.ILogService,
                    private strings: Services.IStrings) {
            toastr.options.timeOut = 3000;
            toastr.options.showDuration = 1200;
            toastr.options.hideDuration = 500;
            toastr.options.positionClass = "toast-top-right";
            toastr.options.closeButton = true;
            toastr.options.preventDuplicates = true;
            toastr.options.newestOnTop = true;
            toastr.options.progressBar = true;
        }

        /**
         * Log an info (showToast = true: shows a toast on the Frontend)
         *
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         */
        public Log = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "info");
        };

        /**
         * Log an warning (showToast = true: shows a toast on the Frontend)
         *
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         */
        public LogWarning = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "warning");
        };


        /**
         * Log an success (showToast = true: shows a toast on the Frontend)
         *
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         */
        public LogSuccess = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "success");
        };

        /**
         * Log an error (showToast = true: shows a toast on the Frontend)
         *
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         */
        public LogError = (message:string, data:any, source:any, showToast:boolean) => {
            this.LogIt(message, data, source, showToast, "error");
        };

        /**
         * Log an error from the api (showToast = true: shows a toast on the Frontend)
         * error.key is resolved with Strings
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         */
        public LogApiError = (error:Models.Messages.IError, source:any, showToast:boolean) => {
            this.LogError(this.strings(error.key), error, source, showToast);
        };


        /**
         * Get a logfunction by name
         *
         * @param {any} moduleId
         * @param {string} fnName
         * @returns {function(any, any, any): undefined}
         * @constructor
         */
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

        /**
         * Log with the angular.ILogService and toastr (if showToast = true)
         *
         * @param {string} message
         * @param {any} data
         * @param {any} source
         * @param {boolean} showToast
         * @param {string} toastTypes
         */
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
    angular.module($injections.Constants.AppName).factory('Logger', ['$log', $injections.Services.Strings, ($log, strings) => new Logger($log, strings)]);
}