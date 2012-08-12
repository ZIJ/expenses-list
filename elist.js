/**
 * Created by Igor Zalutsky on 12.08.12 at 1:28
 */

(function () {
    "use strict";

    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    // shortcutting document
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
    };
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
}());

/**
 * Created by Igor Zalutsky on 11.08.12 at 21:36
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Provides interface for subscribing, unsubscribing to events and causing them
     * @constructor
     */
    elist.EventEmitter = function(){
        this.listeners = {};
    };
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
    };
    /**
     *
     * @param eventName {string} Name of event to be caused
     * @param eventArgs Object with info for listener
     */
    elist.EventEmitter.prototype.emit = function(eventName, eventArgs) {
        //TODO params validation in EventEmitter.cause
        eventArgs = eventArgs || {};
        if(this.listeners[eventName]) {    // such event exists
            var count = this.listeners[eventName].length;
            for (var i = 0; i < count; i+=1) {
                this.listeners[eventName](this, eventArgs);    // calling listener function
            }
        }
    };
}());
/**
 * Created by Igor Zalutsky on 10.08.12 at 1:15
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Extends a constructor with BaseConstructor's prototype
     * @param BaseConstructor
     */
    Function.prototype.inheritFrom = function(BaseConstructor){
        var sampleInstance = new BaseConstructor();
        this.prototype = sampleInstance;
    };
    /**
     * Throw an error with custom message
     * @param errorMessage Optional, "Something went wrong" by default
     */
    elist.report = function(errorMessage) {
        throw new Error(errorMessage ? errorMessage : "Something went wrong");
    };

    /**
     * Checks condition and reports if check fails
     * @param condition
     * @param errorMessage Optional, "Assertion failed" by default
     */
    elist.assert = function(condition, errorMessage) {
        if (!condition) {
            elist.report(errorMessage ? errorMessage : "Assertion failed");
        }
    };



}());
/**
 * Created Created by Igor Zalutsky on 12.08.12 at 0:09
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Property that notifies listeners when it's value changes through set()
     * @param options
     *   value - initial property value
     *   getter - function
     * @constructor
     */
    elist.ObservableProperty = function(options) {
        //TODO Optimize options validation in ObservableProperty
        options = options || {};
        if (typeof options === "object") {
            this.value = options.value || null;
        } else {    //allows primitive values as a param
            this.value = options;
        }
        this.getter = options.getter || function(){
            return this.value;
        };
        this.setter = options.setter || function(newValue){
            this.value = newValue;
        };
    };
    /**
     * ObservableProperty extends EventEmitter
     */
    elist.ObservableProperty.inheritFrom(elist.EventEmitter);
    /**
     * Executes getter
     * @return {*}
     */
    elist.ObservableProperty.prototype.get = function(){
        return this.getter(this.value);
    };
    /**
     * Executes setter and notifies listeners
     * @param newValue
     */
    elist.ObservableProperty.prototype.set = function(newValue){
        if (this.value !== newValue) {
            this.setter(newValue);
            this.emit("change");
        }
    };
    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    elist.ObservableProperty.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };
    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    elist.ObservableProperty.prototype.ignore = function(listenerFunc) {
        this.off("change", listenerFunc);
    };


}());
/**
 * Created by Igor Zalutsky on 10.08.12 at 6:01
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Model of Expense entity with observable properties
     * @param properties Object with initial property values (id required) or id
     * @constructor
     */
    function ExpenseModel(properties) {
        if (typeof properties === "object") {
            if (typeof properties.id === "undefined") {
                elist.report("ID not found in properties");
            } else {
                this.id = properties.id;
            }
        } else if (typeof properties === "number") {
            this.id = properties;
        } else {
            elist.report("Properties should be object or number");
        }
        this.description = new elist.ObservableProperty("");
        this.date = new elist.ObservableProperty(new Date());
        this.amount = new elist.ObservableProperty(0);
        this.isActive = new elist.ObservableProperty(true);
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
    };

}());
/**
 * Created by Igor Zalutsky on 12.08.12 at 17:40
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.ExpenseView = function(expenseModel){
        //TODO Param validation in ExpenseView
        this.model = expenseModel;
    };

    elist.ExpenseView.inheritFrom(elist.EventEmitter);

    elist.ExpenseView.prototype.viewDescription = function(){

    };

}());

/**
 * Created by Igor Zalutsky on 10.08.12 at 12:38
 */

(function() {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
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
}());
/**
 * Created by Igor Zalutsky on 12.08.12 at 1:41
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;


}());
