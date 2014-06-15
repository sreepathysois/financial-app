module FinancialApp {
    'use strict';

    export interface IIdRouteParams extends ng.route.IRouteParamsService {
        id: string;
    }

    export interface IAction {
        () : void;
    }

    export interface IAction1<T> {
        (object : T): void;
    }

    Function.prototype.withInject = function(...$inject : string[]) {
        this.$inject = $inject;

        return this;
    };

    Array.prototype.remove = function(object: any) {
        var cnt = this.length;
        for (var i = 0; i < cnt; i++) {
            if (object === this[i]) {
                this.splice(i, 1);
                return true;
            }
        }

        return false;
    };


    export class Delegate<T extends Function> {
        private functors: T[];

        constructor() {
            this.functors = [];
        }

        addListener(listener: T) {
            this.functors.push(listener);
        }

        removeListener(listener: T) {
            this.functors.remove(listener);
        }

        invoke(invoker: (func: T) => boolean) {
            var invokables = [].concat(this.functors);

            for (var i = 0; i < invokables.length; i++) {
                var retVal: boolean = invoker(invokables[i]);

                if (retVal === false) {
                    break;
                }
            }
        }
    }
}

interface Function {
    withInject(...$inject: string[]): any;
};

interface Array<T> {
    remove(object : any) : boolean;
}