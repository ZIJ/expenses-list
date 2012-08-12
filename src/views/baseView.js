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


    elist.BaseView = function() { };

    // BaseView extends EventEmitter
    elist.BaseView.inheritFrom(elist.EventEmitter);

    elist.BaseView.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        element.appendChild(this.node);
        this.parentNode = element;
        return this;
    };

}());
