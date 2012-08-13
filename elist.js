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

    elist.ObservableCollection.inheritFrom(elist.EventEmitter);

    elist.ObservableCollection.prototype.at = function(index) {
        if (index < 0 || index >= this.items.length) {
            elist.report("Index out of bounds");
        }
        return this.items[index];
    };

    elist.ObservableCollection.prototype.has = function(item){
        return (this.items.indexOf(item) >= 0);
    };

    elist.ObservableCollection.prototype.count = function(){
        return this.items.length;
    };

    elist.ObservableCollection.prototype.add = function(item){
        if (!this.has(item)) {
            this.items.push(item);
            this.emit("change");
        }
        return this;
    };

    elist.ObservableCollection.prototype.remove = function(item){
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
            this.emit("change");
        }
        return this;
    };
    /**
     * Sorts collection according to comparer
     * @param comparer Function(item1, item2), must return number, better -1 0 1
     */
    elist.ObservableCollection.prototype.sortBy = function(comparer){
        this.items.sort(comparer);
        this.emit("change");
        return this;
    };
    /**
     * Sorts collection according to keyExtractor result
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


    elist.BaseView = function() {
        this.listeners = {};
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

        this.sortBy = new elist.ObservableProperty(null);
        this.sortBy.notify(function(){
            model.expenses.orderBy(function(expense){
                // getting value of property with name from sortBy
                var key = model.sortBy.get();
                return expense[key].get();
            });
        });
        this.sortBy.set("amount");
    };

    // ExpenseModel extends BaseModel
    elist.AppModel.inheritFrom(elist.BaseModel);

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

    elist.AppView = function(appModel){
        //TODO Param validation in ExpenseView
        var model = appModel;
        var view = this;
        this.listeners = {};
        this.model = appModel;
        this.parentNode = null;

        this.totalActiveAmount = 0;

        // wrapping div
        this.node = document.createElement("div");

        // controls bar
        this.bar = document.createElement("div");
        this.node.appendChild(this.bar);

        // create button
        this.createButton = document.createElement("button");
        this.createButton.type = "button";
        this.createButton.innerHTML = "Создать";
        this.bar.appendChild(this.createButton);

        // search label
        this.searchLabel = document.createElement("label");
        this.searchLabel.innerHTML = "Поиск";
        this.bar.appendChild(this.searchLabel);

        // search input
        this.searchInput = document.createElement("input");
        this.searchInput.type = "text";
        this.searchLabel.appendChild(this.searchInput);

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


        this.views = new elist.ObservableCollection();
        model.expenses.each(function(expenseModel){
            var expenseView = new elist.ExpenseView(expenseModel);
            view.views.add(expenseView);
        });

        this.views.each(function(expenseView){
            expenseView.renderTo(view.table);
        });

        this.views.each(function(expenseView){
            expenseView.activeAmount.notify(function(){
                view.updateTotalActiveAmount();
            });
        });

        this.updateTotalActiveAmount();

    };

    elist.AppView.inheritFrom(elist.BaseView);

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
        this.editControl.on("saveRequest", function(){
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

    elist.ExpenseView = function(expenseModel){
        //TODO Param validation in ExpenseView
        var view = this;
        var model = expenseModel;
        this.listeners = {};
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

        this.descriptionControl = new elist.EditableView(model.description, "TextView", "InputEdit", "text");
        this.dateControl = new elist.EditableView(model.date, "DateView", "InputEdit", "date");
        this.amountControl = new elist.EditableView(model.amount, "AmountView", "InputEdit", "number");
        this.activeControl = new elist.FlagView(model.isActive);
        this.shareControl = new elist.ShareView(this.activeShare);

        this.descriptionControl.renderTo(this.node.children[0]);
        this.dateControl.renderTo(this.node.children[1]);
        this.amountControl.renderTo(this.node.children[2]);
        this.activeControl.renderTo(this.node.children[4]);
        this.shareControl.renderTo(this.node.children[3]);

        this.updateActiveAmount();
    };

    elist.ExpenseView.inheritFrom(elist.BaseView);

    elist.ExpenseView.prototype.updateActiveAmount = function(){
        var isActive = this.model.isActive.get();
        var amount = this.model.amount.get();
        this.activeAmount.set(isActive ? amount : 0);
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

    elist.FlagView = function(property){
        //TODO property validation in FlagView()
        var view = this;
        this.listeners = {};
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
     * View based on input for editing ObservableProperty
     * @param property ObservableProperty
     * @constructor
     */
    elist.InputEdit = function(property, inputType){
        //TODO property validation in InputEdit()
        var view = this;
        this.listeners = {};
        this.prop = property;
        this.parentNode = null;
        this.inputType = inputType;

        //TODO input type validation in InputEdit()
        this.node = document.createElement("input");
        this.node.type = inputType;

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
 * Created by Igor Zalutsky on 13.08.12 at 12:04
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.ShareView = function(property){
        //TODO property validation in ShareView()
        var view = this;
        this.listeners = {};
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
        if (share <= 0) {
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

    elist.descriptors = [
        {
            id: 1,
            props: {
                description: "Корм коту",
                amount: 5
            }
        },{
            id: 2,
            props: {
                description: "Батарейки",
                amount: 3
            }
        },{
            id: 3,
            props: {
                description: "Хот-дог",
                amount: 2
            }
        }
    ];

    elist.ready(function(){

        var model = new elist.AppModel(elist.descriptors);

        var view = new elist.AppView(model);

        view.renderTo(document.body);

        /*
        var model = new elist.ExpenseModel(13);
        model.description.set("Some text");
        model.amount.set(13);

        var view = new elist.ExpenseView(model);

        var table = document.createElement("table");
        view.renderTo(table);

        document.body.appendChild(table);

        setTimeout(function(){
            model.description.set("Updated");
        }, 1000);
        */
    });



}());
