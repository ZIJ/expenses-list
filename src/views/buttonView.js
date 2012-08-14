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
