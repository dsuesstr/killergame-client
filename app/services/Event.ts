/// <reference path='../min.references.ts'/>

module Framework {
    class Event implements IEvent {
        private _handlers = new Array();

        constructor(public Name?:string) {

        }

        Subscribe = (handler:any):Function => {
            if (this._handlers === null)
                return () => { };

            var index = this._handlers.push(handler) - 1;

            return () => {
                if (this._handlers !== null)
                    delete this._handlers[index];
            };
        };

        Fire = (...args:any[]) => {
            if (this._handlers === null) return;

            for (var index = 0; index < this._handlers.length; index++) {
                var handler = this._handlers[index];
                if (handler === undefined || handler === null) continue;
                handler.apply(null, args);
            }
        };

        Dispose = () => {
            this._handlers = null;
        };
    }

    class EventFactory {
        factory = (name?:string):IEvent => {
            return new Event(name);
        };
    }

    class EventFactoryProvider {

        $get = [$injections.Angular.$injector, ($injector:angular.auto.IInjectorService):IEventFactory => {
            var provider = $injector.instantiate(EventFactory);
            return provider.factory;
        }]
    }

    export class EventFactoryRegister {
        constructor($module:angular.IModule) {
            $module.provider($injections.Framework.EventFactory, EventFactoryProvider);
        }
    }
}