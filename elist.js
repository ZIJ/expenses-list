/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 1:15
 */

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }

    /**
     * Checks condition and throws error with optional errorMessage if check fails
     * @param condition
     * @param errorMessage Optional, "Assertion failed" by default
     */
    elist.assert = function(condition, errorMessage) {
        if (!condition) {
            throw new Error(errorMessage ? errorMessage : "Assertion failed");
        }
    };

    var doc = window.document;
    /**
     * Fires all listeners when DOM is complete
     * @param listener
     * @return {*}
     */
    elist.ready = function(listener) {
        //TODO: crossbrowser "ready"
        doc.addEventListener("DOMContentLoaded", listener, false);
        return elist;
    };
    /**
     * Selects DOM element by it's ID
     * @param id
     * @return
     */
    elist.byId = function(id){
        var node = document.getElementById(id);
        return new Wrapper(node);
    };
    /**
     * Wraps an element into a Wrapper :)
     * @param element
     * @return {Wrapper}
     */
    elist.wrap = function(element) {
        return new Wrapper(element);
    }
    /**
     * Wraps DOM node adding some useful features
     * @param element
     * @constructor
     */
    function Wrapper(element) {
        this.element = element ? element : null;
    }

    /**
     * Checks whether the wrapper contains an element or not
     * @return {Boolean}
     */
    Wrapper.prototype.isEmpty = function(){
        return !this.element;
    };
    /**
     * Removes node from dom
     * @return Removed node, wrapped
     */
    Wrapper.prototype.remove = function(){
        if (!this.isEmpty()) {
            var node = this.element;
            node.parentNode.removeChild(node);
        }
        return this;
    };
    /**
     * Inserts child node to the end of children list
     * @param content
     * @return {*}
     */
    Wrapper.prototype.append = function(content){

        if (!this.isEmpty()) {
            var toInsert = content instanceof Wrapper ? content.element :
                           content instanceof HTMLElement ? content :
                           doc.createTextNode(content);
            this.element.appendChild(toInsert);
        }
        return this;
    };

})();
/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 11.08.12
 * Time: 21:36
 */

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    /**
     * Provides interface for subscribing, unsubscribing to events and causing them
     * @constructor
     */
    elist.EventEmitter = function(){
        this.listeners = {};
    }
    /**
     * Subscribes listenerFunc to the the specified event
     * @param eventName {string} Name of event to be listened
     * @param listenerFunc {function} event listener; will be called with two params:
     *   origin - object in which the event occured
     *   args - optional data from origin
     */
    elist.EventEmitter.prototype.on = function(eventName, listenerFunc) {
        //TODO params validation in EventEmitter.on
        if (!this.listeners[eventName]) {                                  // no such event
            this.listeners.eventName = [];
        }
        if (this.listeners[eventName].indexOf(listenerFunc) === -1) {      //listenerFunc is not yet subscribed
            this.listeners.eventName.push(listenerFunc);
        }
    };
    /**
     * Unsubscribes listenerFunc from specified event
     * @param eventName {string} Name of event to be listened
     * @param listenerFunc event listener
     */
    elist.EventEmitter.prototype.off = function(eventName, listenerFunc) {
        //TODO params validation in EventEmitter.off
        if(this.listeners[eventName]) {    // such event exists
            var index = this.listeners[eventName].indexOf(listenerFunc);
            if (index !== -1) {         // and this func listens to it
                this.listeners[eventName].splice(index,1);     // removing listener
            }
        }
    }
    /**
     *
     * @param eventName {string} Name of event to be caused
     * @param eventArgs Object with info for listener
     */
    elist.EventEmitter.prototype.emit = function(eventName, eventArgs) {
        //TODO params validation in EventEmitter.cause
        var eventArgs = eventArgs || {};
        if(this.listeners[eventName]) {    // such event exists
            var count = this.listeners[eventName].length;
            for (var i = 0; i < count; i++) {
                this.listeners[eventName](this, eventArgs);    // calling listener function
            }
        }
    }
})();
/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 6:01
 */

"use strict";

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }

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

    /**
     * Model of Expense entity with observable properties
     * @param properties
     * @constructor
     */
    function ExpenseModel(properties) {
        elist.assert(properties !== undefined, "Should have at least ID");
        this.id = properties.id;
        this.description = elist.Observable();
        this.date = elist.Observable();
        this.amount = elist.Observable();
        this.isActive = elist.Observable();
        this.assign(properties);
    }

    /**
     * Updates using properties param
     * @param properties
     */
    ExpenseModel.prototype.assign = function(properties) {
        for (var name in properties) {
            if (this[name]) {
                this[name].update(properties[name]);
            }
        }
    }



})();
/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 12:38
 */

"use strict";

(function() {
    "use strict";
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    /**
     *
     * @param property an Observable instance
     * @param options
     * @constructor
     */
    function TextView(property, options) {
        this.parentNode = options.parentNode;
        this.node = document.createTextNode(property.value);
        this.parentNode.appendChild(this.node);
        property.subscribe(function() {
           this.node.replaceWholeText(property.value);
        });
    }
})();