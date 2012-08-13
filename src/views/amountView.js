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
