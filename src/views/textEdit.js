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
