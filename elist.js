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

    elist.monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
                        "июля", "августа", "сентября", "октября", "ноября", "декабря"];

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
     * @param initialValue
     * @constructor
     */
    elist.ObservableProperty = function(initialValue) {
        this.value = initialValue;
        this.listeners = {};
    };

    // Extending EventEmitter
    elist.ObservableProperty.inheritFrom(elist.EventEmitter);

    /**
     * Returns property value
     * @return {*}
     */
    elist.ObservableProperty.prototype.get = function(){
        return this.value;
    };
    /**
     * Sets property value, notifies listeners
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
 * Created by Igor Zalutsky on 13.08.12 at 8:02
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Collection that emits "change" event whenever it's changed
     * @constructor
     */
    elist.ObservableCollection = function(){
        this.listeners = {};
        this.items = [];
    };

    // Extending EventEmitter
    elist.ObservableCollection.inheritFrom(elist.EventEmitter);

    /**
     * Searches for item by index
     * @param index
     * @return {*}
     */
    elist.ObservableCollection.prototype.at = function(index) {
        if (index < 0 || index >= this.items.length) {
            elist.report("Index out of bounds");
        }
        return this.items[index];
    };

    /**
     * Checks if it contains specified item
     * @param item
     * @return {Boolean}
     */
    elist.ObservableCollection.prototype.has = function(item){
        return (this.items.indexOf(item) >= 0);
    };

    /**
     * Returns amount of items
     * @return {Number}
     */
    elist.ObservableCollection.prototype.count = function(){
        return this.items.length;
    };

    /**
     * Adds an item. Causes "change" event.
     * @param item
     * @return {*}
     */
    elist.ObservableCollection.prototype.add = function(item){
        if (!this.has(item)) {
            this.items.push(item);
            this.emit("change");
        }
        return this;
    };

    /**
     * Removes an item. Causes "change" event
     * @param item
     * @return {*}
     */
    elist.ObservableCollection.prototype.remove = function(item){
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.emit("change");
        }
        return this;
    };

    /**
     * Sorts collection according to comparer func. Causes "change" event.
     * @param comparer Function(item1, item2), must return number, better -1 0 1
     */
    elist.ObservableCollection.prototype.sortBy = function(comparer){
        this.items.sort(comparer);
        this.emit("change");
        return this;
    };
    /**
     * Sorts collection according to keyExtractor result. Causes "change" event.
     * @param keyExtractor
     */
    elist.ObservableCollection.prototype.orderBy = function(keyExtractor, reverse){
        return this.sortBy(function(item1, item2){
            var result = 0;
            var key1 = keyExtractor(item1);
            var key2 = keyExtractor(item2);
            if (key1 > key2) {
                return 1;
            } else if (key1 < key2) {
                result = -1;
            }
            return reverse ? -result : result;
        });
    };

    /**
     * Calls func(item) for each item
     * @param func Function, should accept item
     */
    elist.ObservableCollection.prototype.each = function(func) {
        for (var i = 0; i < this.items.length; i+=1) {
            func(this.items[i]);
        }
    };

    //TODO Refactor notify() and ignore() shortcuts in Observables

    /**
     * Shorcut for on("change", listener)
     * @param listenerFunc
     */
    elist.ObservableCollection.prototype.notify = function(listenerFunc) {
        this.on("change", listenerFunc);
    };
    /**
     * Shorcut for off("change", listener)
     * @param listenerFunc
     */
    elist.ObservableCollection.prototype.ignore = function(listenerFunc) {
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
 * Created by Igor Zalutsky on 12.08.12 at 18:57
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Base class for all Views, extends EventEmitter. Provides common rendering logic.
     * @constructor
     */
    elist.BaseView = function() {
        this.listeners = {};
        this.isVisible = false;
    };

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
        if (!this.isVisible){
            if (!this.parentNode) {
                elist.report("Parent node unknown. Call renderTo() first.");
            }
            this.parentNode.appendChild(this.node);
            this.isVisible = true;
        }
        return this;
    };
    /**
     * Removes view from DOM
     */
    elist.BaseView.prototype.hide = function() {
        if (this.isVisible && this.parentNode) {
            //TODO Find out why removeChild causes DOM Exception 8
            try {
                this.parentNode.removeChild(this.node);
            } catch (e) {}
            this.isVisible = false;
        }
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 7:50
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
    * Model of entire app
    * @param descriptors Object with expenseModel descriptors
        * @constructor
    */
    elist.AppModel = function(descriptors) {
        //TODO descriptors validation in AppModel()

        var model = this;

        this.expenses = new elist.ObservableCollection();
        for (var i = 0; i < descriptors.length; i+=1) {
            var id = descriptors[i].id;
            var properties = descriptors[i].props;
            var expense = new elist.ExpenseModel(id, properties);
            this.expenses.add(expense);
        }

    };

    // AppModel extends BaseModel
    elist.AppModel.inheritFrom(elist.BaseModel);

    /**
     * Returns a fresh new unused ID
     * @return {Number}
     */
    elist.AppModel.prototype.nextId = function(){
        var maxId = 0;
        this.expenses.each(function(expenseModel){
            maxId = Math.max(maxId, expenseModel.id);
        });
        return maxId + 1;
    };
    /**
     * Creates new ExpenseModel with default property values and adds it to this.expenses collection
     * @return {elist.ExpenseModel}
     */
    elist.AppModel.prototype.createModel = function(){
        var expense = new elist.ExpenseModel(this.nextId());
        this.expenses.add(expense);
        return expense;
    };
    /**
     * Deletes specified ExpenseModel
     * @param expenseModel
     */
    elist.AppModel.prototype.deleteModel = function(expenseModel){
        //TODO Clear listeners for preventing memory leaks when deleting models
        this.expenses.remove(expenseModel);
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
 * Created by Igor Zalutsky on 13.08.12 at 6:37
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Self-updating View for displaying ObservableProperty with numeric value as currency
     * @param property ObservableProperty
     * @constructor
     */
    elist.AmountView = function(property){
        //TODO property validation in AmountView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
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
    // AmountView extends BaseView
    elist.AmountView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.AmountView.prototype.update = function(){
        this.node.innerHTML = "$" + this.prop.get();
    };
    /**
     * Returns value from markup
     */
    elist.AmountView.prototype.getValue = function(){
        return this.node.innerHTML;
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 9:44
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * View of entire app. Contains controls and renders DOM elements.
     * @param appModel
     * @constructor
     */
    elist.AppView = function(appModel){
        //TODO Param validation in ExpenseView
        var model = appModel;
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.model = appModel;
        this.parentNode = null;
        this.invertSort = false;

        this.totalActiveAmount = 0;

        // wrapping div
        this.node = document.createElement("div");

        // container for createButton and searchControl
        this.bar = document.createElement("div");
        this.node.appendChild(this.bar);

        this.createButton = new elist.ButtonView("Создать");
        this.createButton.on("press", function(){
            view.createExpense();
        });
        this.createButton.renderTo(this.bar);

        this.searchControl = new elist.SearchView("Поиск");
        this.searchControl.on("query", function(){
            view.filter(view.searchControl.query.get());
        });
        this.searchControl.renderTo(this.bar);

        // table
        this.table = document.createElement("table");
        this.node.appendChild(this.table);

        // table headings
        this.headings = document.createElement("tr");
        this.table.appendChild(this.headings);

        var titles = ["Что", "Когда", "Сколько", "Доля", "Считать", "Удалить"];
        for (var i = 0; i < titles.length; i+=1){
            var th = document.createElement("th");
            th.innerHTML = titles[i];
            this.headings.appendChild(th);
        }

        //TODO refactor UGLY code below in appView

        this.headings.children[0].addEventListener("click",function(){
            view.sortBy("description");
        }, false);
        this.headings.children[1].addEventListener("click",function(){
            view.sortBy("date");
        }, false);
        this.headings.children[2].addEventListener("click",function(){
            view.sortBy("amount");
        }, false);
        this.headings.children[3].addEventListener("click",function(){
            view.sortBy("share");
        }, false);

        // creating views of Expenses
        this.views = new elist.ObservableCollection();
        model.expenses.each(function(expenseModel){
            var expenseView = new elist.ExpenseView(expenseModel);
            view.views.add(expenseView);
        });
        // rendering views
        this.views.each(function(expenseView){
            expenseView.renderTo(view.table);
        });
        // subscribing for views' events
        this.views.each(function(expenseView){
            expenseView.activeAmount.notify(function(){
                view.updateTotalActiveAmount();
            });
            expenseView.on("deleteRequest", function(){
                view.deleteExpense(expenseView);
            });
        });

        this.updateTotalActiveAmount();
    };

    // Extending BaseView
    elist.AppView.inheritFrom(elist.BaseView);

    /**
     * Recalculates total amount for active expenses
     */
    elist.AppView.prototype.updateTotalActiveAmount = function(){
        var total = 0;
        this.views.each(function(expenseView){
            total += expenseView.activeAmount.get();
        });
        this.totalActiveAmount = total;
        this.views.each(function(expenseView){
            var amount = expenseView.activeAmount.get();
            expenseView.activeShare.set(amount / total);
        });
    };

    /**
     * Creates a new Expense and renders it
     */
    elist.AppView.prototype.createExpense = function(){
        var appView = this;
        var model = this.model.createModel();
        var view = new elist.ExpenseView(model);
        this.views.add(view);
        view.renderTo(this.table);
        view.activeAmount.notify(function(){
            appView.updateTotalActiveAmount();
        });
        view.on("deleteRequest", function(){
            appView.deleteExpense(view);
        });
        view.editAll();
    };

    /**
     * Deletes an expense
     * @param expenseView
     */
    elist.AppView.prototype.deleteExpense = function(expenseView){
        //TODO Clear listeners for preventing memory leaks when deleting views
        expenseView.model.isActive.set(false);
        expenseView.hide();
        this.views.remove(expenseView);
        this.model.deleteModel(expenseView.model);
        //this.updateTotalActiveAmount();
    };

    /**
     * Sorts expenses according to specified property name
     * @param propName
     */
    elist.AppView.prototype.sortBy = function(propName){
        if(propName) {
            this.views.each(function(expenseView){
                expenseView.hide();
            });
            this.views.orderBy(function(expenseView){
                //TODO refactor too specific code in AppView.sortBy()
                if(propName === "share") {
                    return expenseView.activeAmount.get();
                }
                return expenseView.model[propName].get();
            }, this.invertSort);
            this.invertSort = !this.invertSort;
            this.views.each(function(expenseView){
                expenseView.show();
            });
        }

    };

    /**
     * Shows only expenses which description contains key string, case-insesitive
     * @param str
     */
    elist.AppView.prototype.filter = function(str) {
        if (str.length > 0) {
            this.views.each(function(expenseView){
                var description = expenseView.model.description.get().toLowerCase();
                if (description.indexOf(str.toLowerCase()) === -1){
                    expenseView.hide();
                } else {
                    expenseView.show();
                }
            });
        } else {
            this.views.each(function(expenseView){
                expenseView.show();
            });
        }
    };


}());

/**
 * Created by Igor Zalutsky on 14.08.12 at 23:25
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Renders a button with given text, emits "press" event
     * @param text
     * @constructor
     */
    elist.ButtonView = function(text){

        var view = this;
        this.parentNode = null;
        this.listeners = {};
        this.isVisible = false;

        this.node = document.createElement("input");
        this.node.type = "button";
        this.node.innerHTML = text;
        this.node.addEventListener("click", function(){
            view.emit("press");
        }, false);

        this.text = new elist.ObservableProperty(text);
        this.text.notify(function(){
            view.update();
        });

        view.update();
    };
    // Extending BaseView
    elist.ButtonView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.ButtonView.prototype.update = function(){
        this.node.value = this.text.get();
    };
    /**
     * Returns value from markup
     */
    elist.ButtonView.prototype.getValue = function(){
        return this.node.value;
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 5:41
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Self-updating View for displaying ObservableProperty with Date value
     * @param property ObservableProperty
     * @constructor
     */
    elist.DateView = function(property){
        //TODO property validation in DateView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
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
    // DateView extends BaseView
    elist.DateView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.DateView.prototype.update = function(){
        var date = this.prop.get();
        var text = date.getDate() +
            " " + elist.monthNames[date.getMonth()] +
            " " + date.getFullYear();
        this.node.innerHTML = text;
    };
    /**
     * Returns value from markup
     */
    elist.DateView.prototype.getValue = function(){
        return this.node.innerHTML;
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
    elist.EditableView = function(property, viewControlName, editControlName, inputEditType){
        //TODO params validation in EditableView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("div");

        //TODO validate control names in EditableView()
        this.viewControl = new elist[viewControlName](property);
        if (editControlName === "InputEdit") {
            this.editControl = new elist.InputEdit(property, inputEditType);
        } else {
            this.editControl = new elist[editControlName](property);
        }

        this.viewControl.parentNode = this.node;
        this.editControl.parentNode = this.node;

        this.viewControl.on("editRequest", function(){
            view.edit();
        });
        this.editControl.on("change", function(){
            //TODO maybe re-emit on saveRequest in EditableView?
            var newValue = null;
            if (typeof view.editControl.inputType === "string") {
                if (view.editControl.inputType === "date"){
                    newValue = new Date(view.getValue());
                } else if (view.editControl.inputType === "number") {
                    newValue = Number(view.getValue());
                } else {
                    newValue = view.getValue();
                }
            } else {
                newValue = view.getValue();
            }
            view.prop.set(newValue);
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

    /**
     * View of single Expense
     * @param expenseModel
     * @constructor
     */
    elist.ExpenseView = function(expenseModel){
        //TODO Param validation in ExpenseView
        var view = this;
        var model = expenseModel;
        this.listeners = {};
        this.isVisible = false;
        this.model = expenseModel;
        this.parentNode = null;

        this.activeAmount = new elist.ObservableProperty(0);
        this.model.amount.notify(function(){
            view.updateActiveAmount();
        });
        this.model.isActive.notify(function(){
            view.updateActiveAmount();
        });

        this.activeShare = new elist.ObservableProperty(0);

        this.node = document.createElement("tr");
        for (var i = 0; i < 6; i+=1){
            this.node.appendChild(document.createElement("td"));
        }

        // creating controls
        this.descriptionControl = new elist.EditableView(model.description, "TextView", "InputEdit", "text");
        this.dateControl = new elist.EditableView(model.date, "DateView", "InputEdit", "date");
        this.amountControl = new elist.EditableView(model.amount, "AmountView", "InputEdit", "number");
        this.activeControl = new elist.FlagView(model.isActive);
        this.shareControl = new elist.ShareView(this.activeShare);

        // rendering controls
        this.descriptionControl.renderTo(this.node.children[0]);
        this.dateControl.renderTo(this.node.children[1]);
        this.amountControl.renderTo(this.node.children[2]);
        this.activeControl.renderTo(this.node.children[4]);
        this.shareControl.renderTo(this.node.children[3]);

        // working with DOM
        this.deleteButton = document.createElement("button");
        this.deleteButton.type = "button";
        this.deleteButton.innerHTML = "Удалить";
        this.deleteButton.addEventListener("click", function(){
            view.emit("deleteRequest");
        }, false);
        this.node.children[5].appendChild(this.deleteButton);

        this.updateActiveAmount();
    };

    // Extending BaseView
    elist.ExpenseView.inheritFrom(elist.BaseView);

    /**
     * Recalculates active amount and assigns it to observable property
     */
    elist.ExpenseView.prototype.updateActiveAmount = function(){
        var isActive = this.model.isActive.get();
        var amount = this.model.amount.get();
        this.activeAmount.set(isActive ? amount : 0);
    };

    /**
     * Toggles edit mode for all editable properties
     */
    elist.ExpenseView.prototype.editAll = function(){
        this.descriptionControl.edit();
        this.dateControl.edit();
        this.amountControl.edit();
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 11:09
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Displays checkbox which controls specified boolean observable property
     * @param property
     * @constructor
     */
    elist.FlagView = function(property){
        //TODO property validation in FlagView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("input");
        this.node.type = "checkbox";

        this.node.addEventListener("change", function(){
            view.prop.set(view.node.checked);
        },false);

        this.update();
    };

    // FlagView extends BaseView
    elist.FlagView.inheritFrom(elist.BaseView);

    /**
     * Refreshes value
     */
    elist.FlagView.prototype.update = function(){
        this.node.checked = this.prop.get();
    };

    /**
     * Returns value from markup
     */
    elist.FlagView.prototype.getValue = function(){
        return this.node.checked;
    };

}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 5:53
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * View based on input of specified type for editing single ObservableProperty
     * @param property ObservableProperty
     * @constructor
     */
    elist.InputEdit = function(property, inputType){
        //TODO property validation in InputEdit()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.prop = property;
        this.parentNode = null;
        this.inputType = inputType;

        //TODO input type validation in InputEdit()
        this.node = document.createElement("input");
        this.node.type = inputType;

        this.node.addEventListener("input", function(){
            view.emit("input");
        },false);
        this.node.addEventListener("change", function(){
            view.emit("change");
        },false);
        this.node.addEventListener("keypress", function(event){
            if (event.keyCode === elist.keyCodes.ENTER) {
                view.emit("change");
            }
        },false);

        this.prop.notify(function(){
            view.update();
        });
        this.update();
    };

    // InputEdit extends BaseView
    elist.InputEdit.inheritFrom(elist.BaseView);

    /**
     * Refreshes value
     */
    elist.InputEdit.prototype.update = function(){
        this.node.value = this.prop.get();
    };

    /**
     * Returns value from markup
     */
    elist.InputEdit.prototype.getValue = function(){
        return this.node.value;
    };
}());

/**
 * Created by Igor Zalutsky on 15.08.12 at 0:08
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Displays a search input nested in a label with specified text. Emits "query" event whenever input text is changed
     * @param labelText
     * @constructor
     */
    elist.SearchView = function(labelText){

        var view = this;
        this.parentNode = null;
        this.listeners = {};
        this.isVisible = false;

        this.query = new elist.ObservableProperty("");
        this.query.notify(function(){
            view.emit("query");
        });

        this.labelText = new elist.ObservableProperty(labelText);
        this.labelText.notify(function(){
            view.update();
        });

        this.node = document.createElement("label");

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.addEventListener("input",function(){
            view.update();
        },false);

        this.update();
    };

    // Extending BaseView
    elist.SearchView.inheritFrom(elist.BaseView);

    /**
     * Refreshes text
     */
    elist.SearchView.prototype.update = function(){
        this.node.innerHTML = this.labelText.get();
        this.node.appendChild(this.input);  //innerHTML will remove input's markup
        this.query.set(this.input.value);
    };

    /**
     * Returns value from markup
     */
    elist.SearchView.prototype.getValue = function(){
        return this.input.value;
    };


}());

/**
 * Created by Igor Zalutsky on 13.08.12 at 12:04
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Displays percentage for given numeric ObservableProperty
     * @param property
     * @constructor
     */
    elist.ShareView = function(property){
        //TODO property validation in ShareView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("p");

        this.prop.notify(function(){
            view.update();
        });

        this.update();
    };

    // ShareView extends BaseView
    elist.ShareView.inheritFrom(elist.BaseView);

    /**
     * Refreshes text
     */
    elist.ShareView.prototype.update = function(){
        var share = this.prop.get();
        if (isNaN(share) || share <= 0) {
            this.node.innerHTML = "--";
        }  else {
            this.node.innerHTML = Math.round(share * 100) + " %";
        }
    };

    /**
     * Returns value from markup
     */
    elist.ShareView.prototype.getValue = function(){
        return this.node.innerHTML;
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
        this.listeners = {};
        this.isVisible = false;

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
 * Created by Igor Zalutsky on 15.08.12 at 1:14
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    /**
     * Setings for initial ExpenseModels
     * @type {Array}
     */
    elist.descriptors = [
        {
            id: 1,
            props: {
                description: "Корм коту",
                date: new Date("8.13.2012"),
                amount: 5
            }
        },{
            id: 2,
            props: {
                description: "Батарейки",
                date: new Date("8.12.2012"),
                amount: 3
            }
        },{
            id: 3,
            props: {
                description: "Хот-дог",
                date: new Date("8.14.2012"),
                amount: 2
            }
        },{
            id: 4,
            props: {
                description: "Молоко",
                date: new Date("8.10.2012"),
                amount: 1,
                isActive: false
            }

        },{
            id: 5,
            props: {
                description: "Интернет",
                date: new Date("8.9.2012"),
                amount: 20,
                isActive: false
            }

        },{
            id: 6,
            props: {
                description: "Носки",
                date: new Date("8.11.2012"),
                amount: 5,
                isActive: false
            }
        }
    ];

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


    elist.ready(function(){                                     // waiting for DOM

        var model = new elist.AppModel(elist.descriptors);      // creating model of application

        var view = new elist.AppView(model);                    // creating view for our model

        view.renderTo(document.body);                           // rendering our view

    });

}());
