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
