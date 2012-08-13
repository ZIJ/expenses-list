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
     * Removes all child nodes from element, including text nodes
     * @param element HTMLElement
     * @return {*}
     */
    elist.empty = function(element) {
        //TODO param validation in empty()
        var children = element.childNodes;
        for (var i = 0; i < children.length; i+=1) {
            //TODO possible memory leak in empty()
            element.removeChild(children[i]);
        }
        return element;
    };
    /**
     * For replacing dom elements. Use like this: replace(element).with(substitute);
     * @param element
     */
    elist.replace = function(element) {
        //TODO Fix! replace() not working properly! Dom error 8
        var replacer = {};
        replacer.by = function(substitute){
            var parent = element.parentNode;
            var shouldReplace = parent &&
                typeof parent === "object" &&
                typeof parent.replaceChild === "function" &&
                element.parentNode === parent;
            if (shouldReplace) {
                parent.replaceChild(substitute, element);
            }
        };
        return replacer;
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

        if (!(this.listeners[eventName] instanceof Array)) {                                  // no such event
            this.listeners[eventName] = [];
        }
        if (this.listeners[eventName].indexOf(listenerFunc) === -1) {      //listenerFunc is not yet subscribed
            this.listeners[eventName].push(listenerFunc);
        }
    };
    /**
     * Unsubscribes listenerFunc from specified event
     * @param eventName {string} Name of event to be listened
     * @param listenerFunc event listener
     */
    elist.EventEmitter.prototype.off = function(eventName, listenerFunc) {
        //TODO params validation in EventEmitter.off
        if(this.listeners[eventName] instanceof Array) {    // such event exists
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
        if(this.listeners[eventName] instanceof Array) {    // such event exists
            var count = this.listeners[eventName].length;
            for (var i = 0; i < count; i+=1) {
                this.listeners[eventName][i](this, eventArgs);    // calling listener function
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

    elist.keyCodes = {};
    elist.keyCodes.ENTER = 13;

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
    elist.ObservableProperty = function(initialValue) {
        this.value = initialValue;
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
        return this.value;
    };
    /**
     * Executes setter and notifies listeners
     * @param newValue
     */
    elist.ObservableProperty.prototype.set = function(newValue){
        if (this.value !== newValue) {
            this.value = newValue;
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
 * Created by Igor Zalutsky on 12.08.12 at 19:05
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Base classs for entity model
     * @param properties Object with initial property values (id required) or id
     * @constructor
     */
    elist.BaseModel = function(id, properties) {
        //this.id = 0;
    };
    /**
     * Checks ObservableProperties presence and sets their values
     * @param properties
     */
    elist.BaseModel.prototype.assign = function(properties) {
        if (typeof properties !== "object") {
            elist.report("Properties should be object");
        }
        for (var name in properties){
            if (properties.hasOwnProperty(name)) {
                if (!(this[name] instanceof elist.ObservableProperty)) {
                    elist.report("No such ObservableProperty: " + name);
                }
                this[name].set(properties[name]);
            }
        }
    };
    /**
     * Checks given ID validity and returns it
     * @param id
     * @return {*}
     */
    elist.BaseModel.prototype.newId = function(id) {
        if (typeof id !== "number") {
            elist.report("ID should be number");
        } else if (id < 0) {
            elist.report("ID should be positive");
        } else if (id !== Math.floor(id)) {
            elist.report("ID should be integer");
        }
        return id;
    };
    /**
     * Creates ObservableProperty with given initial value
     * @param initialValue
     * @return {elist.ObservableProperty}
     */
    elist.BaseModel.prototype.newProp = function(initialValue){
        return new elist.ObservableProperty(initialValue);
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
    elist.ExpenseModel = function(id, properties) {
        this.id = this.newId(id);
        this.description = this.newProp("");
        this.amount = this.newProp(0);
        this.date = this.newProp(new Date());
        this.isActive = this.newProp(true);
        if (properties !== undefined) {
            this.assign(properties);
        }
    };

    // ExpenseModel extends BaseModel
    elist.ExpenseModel.inheritFrom(elist.BaseModel);

}());
/**
 * Created by Igor Zalutsky on 12.08.12 at 18:57
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;


    elist.BaseView = function() { };

    // BaseView extends EventEmitter
    elist.BaseView.inheritFrom(elist.EventEmitter);


    /**
     * Renders a view to specified DOM node
     * @param element
     * @return {*}
     */
    elist.BaseView.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        this.parentNode = element;
        return this.show();
    };
    /**
     * Appends view to its parent node
     * @return {*}
     */
    elist.BaseView.prototype.show = function() {
        if (!this.parentNode) {
            elist.report("Parent node unknown. Call renderTo() first.");
        }
        this.parentNode.appendChild(this.node);
        return this;
    };

    elist.BaseView.prototype.hide = function() {
        if (this.parentNode) {
            //TODO Find out why removeChild causes DOM Exception 8
            try {
                this.parentNode.removeChild(this.node);
            } catch (e) {}
        }
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 4:50
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * View that automatically switches between edit and view modes
     * @param property ObservableProperty
     * @param editControlName
     * @param viewControlName
     * @constructor
     */
    elist.EditableView = function(property, editControlName, viewControlName){
        //TODO params validation in EditableView()
        var view = this;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("div");

        //TODO validate control names in EditableView()
        this.viewControl = new elist[viewControlName](property);
        this.editControl = new elist[editControlName](property);

        this.viewControl.parentNode = this.node;
        this.editControl.parentNode = this.node;

        this.viewControl.on("editRequest", function(){
            view.edit();
        });
        this.editControl.on("saveRequest", function(){
            //TODO maybe re-emit on saveRequest in EditableView?
            view.prop.set(view.getValue());
            view.view();
        });

        this.isEditing = true;
        this.view();
    };
    // EditableView extends BaseView
    elist.EditableView.inheritFrom(elist.BaseView);
    /**
     * Toggles view mode
     */
    elist.EditableView.prototype.view = function(){
        if (this.isEditing) {
            this.editControl.hide();
            this.viewControl.show();
            this.isEditing = false;
        }
    };
    /**
     * Toggles edit mode
     */
    elist.EditableView.prototype.edit = function(){
        if (!this.isEditing) {
            this.viewControl.hide();
            this.editControl.show();
            this.isEditing = true;
        }
    };
    /**
     * Returns value from markup
     */
    elist.EditableView.prototype.getValue = function(){
        if (this.isEditing) {
            return this.editControl.getValue();
        } else {
            return this.viewControl.getValue();
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
        this.parentNode = null;
        this.node = document.createElement("tr");
        for (var i = 0; i < 6; i+=1){
            this.node.appendChild(document.createElement("td"));
        }
        this.viewDescription();
    };

    elist.ExpenseView.inheritFrom(elist.BaseView);

    elist.ExpenseView.prototype.viewDescription = function(){
        var view = this;
        var model = view.model;
        var td = view.node.children[0];
        //TODO Fix memory leak - update() remains subscribed after view refreshing
        var update = function(){
            var text = document.createTextNode(model.description.get());
            elist.empty(td).appendChild(text);
        };
        model.description.notify(update);
        update();
    };

    elist.ExpenseView.prototype.editDescription = function(){
        var model = this.model;
        var td = this.node.children[0];
        var input = document.createElement("input");
        input.type = "text";
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 0:48
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.TextControl = function(property){
        var control = this;
        this.isEditing = true;
        this.prop = property;
        this.parentNode = null;
        this.node = null;

        this.viewNode = document.createElement("span");
        this.editNode = document.createElement("input");
        this.editNode.type = "text";

        this.viewNode.addEventListener("click", function(){
            control.edit();
        }, false);
        this.editNode.addEventListener("change", function(){
            control.save();
        }, false);

        this.prop.notify(function(){
            control.update();
        });

        this.view();
    };

    elist.TextControl.inheritFrom(elist.BaseView);

    elist.TextControl.prototype.view = function(){
        if (this.isEditing === true) {
            if (this.parentNode) {
                try {
                    this.parentNode.removeChild(this.editNode);
                } catch (e) {}
                this.parentNode.appendChild(this.viewNode);
            }
            this.node = this.viewNode;
            this.isEditing = false;
            this.update();
        }
    };

    elist.TextControl.prototype.edit = function(){
        if (this.isEditing === false) {
            if (this.parentNode) {
                try {
                    this.parentNode.removeChild(this.viewNode);
                } catch (e) {}
                this.parentNode.appendChild(this.editNode);
            }
            this.node = this.viewNode;
            this.isEditing = true;
            this.update();
        }
    };

    elist.TextControl.prototype.save = function(){
        if (this.isEditing === true){
            this.emit("saveRequest");
        }
    };

    elist.TextControl.prototype.getText = function(){
        if (this.isEditing === true) {
            return this.editNode.value;
        } else {
            return this.viewNode.innerHTML;
        }
    };

    elist.TextControl.prototype.update = function(){
        var value = this.prop.get();
        this.viewNode.innerHTML = value;
        this.editNode.value = value;
    };

    elist.TextControl.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        var control = this;
        element.appendChild(this.node);
        this.parentNode = element;
        /*
        this.viewNode.addEventListener("click", function(){
            control.edit();
        }, false);
        this.editNode.addEventListener("change", function(){
            control.save();
        }, false);

        return this; */
    };


}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 4:37
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * View for editing ObservableProperty with text value
     * @param property ObservableProperty
     * @constructor
     */
    elist.TextEdit = function(property){
        //TODO property validation in TextView()
        var view = this;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("input");
        this.node.type = "text";

        this.node.addEventListener("change", function(){
            view.emit("saveRequest");
        },false);
        this.node.addEventListener("keypress", function(event){
            if (event.keyCode === elist.keyCodes.ENTER) {
                view.emit("saveRequest");
            }
        },false);

        this.prop.notify(function(){
            view.update();
        });
        this.update();
    };
    // TextView extends BaseView
    elist.TextEdit.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.TextEdit.prototype.update = function(){
        this.node.value = this.prop.get();
    };
    /**
     * Returns value from markup
     */
    elist.TextEdit.prototype.getValue = function(){
        return this.node.value;
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 4:14
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * Self-updating View for displaying ObservableProperty with text value
     * @param property ObservableProperty
     * @constructor
     */
    elist.TextView = function(property){
        //TODO property validation in TextView()
        var view = this;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("p");

        this.node.addEventListener("dblclick", function(){
            view.emit("editRequest");
        },false);
        this.prop.notify(function(){
            view.update();
        });
        this.update();
    };
    // TextView extends BaseView
    elist.TextView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.TextView.prototype.update = function(){
        this.node.innerHTML = this.prop.get();
    };
    /**
     * Returns value from markup
     */
    elist.TextView.prototype.getValue = function(){
        return this.node.innerHTML;
    };


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

    elist.ready(function(){
        var model = new elist.ExpenseModel(13);
        model.description.set("Description");

        var view = new elist.EditableView(model.description, "TextEdit", "TextView");


        var div = document.createElement("div");
        view.renderTo(div);

        document.body.appendChild(div);

        setTimeout(function(){
            model.description.set("Updated");
        }, 1000);
    });



}());
