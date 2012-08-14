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
