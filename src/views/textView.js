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
