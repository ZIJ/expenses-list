/**
 * Created by Igor Zalutsky on 12.08.12 at 1:49
 */

(function () {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Observable factory
     * @param initialValue
     * @return {Observable}
     * @constructor
     */
    elist.Observable = function(initialValue) {
        return new Observable(initialValue);
    };
    /**
     * Calls subscribers when value is changed by update
     * @param initialValue
     * @constructor
     */
    function Observable(initialValue) {
        this.value = (initialValue !== undefined) ? initialValue : null;
        this.subscribers = [];
    }

    /**
     * Changes value and calls subscribers
     * @param newValue
     */
    Observable.prototype.update = function(newValue){
        var oldValue = this.value;
        this.value = newValue;
        for (var i = 0; i < this.subscribers.length; i++) {
            this.subscribers[i](oldValue);
        }
    };
    /**
     * Adds subscriber function
     * @param subscriberFunc
     */
    Observable.prototype.subscribe = function(subscriberFunc) {
        this.subscribers.push(subscriberFunc);
        return this;
    };
    /**
     * Removes subscriber function
     * @param subscriberFunc
     */
    Observable.prototype.unsubscribe = function(subscriberFunc) {
        var index = this.subscribers.indexOf(subscriberFunc);
        if (index >= 0) {
            this.subscribers.splice(index,1);
        }
        return this;
    };
})();
