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
