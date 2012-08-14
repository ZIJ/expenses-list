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
