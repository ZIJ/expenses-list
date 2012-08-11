/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 12:38
 */

"use strict";

(function() {
    //publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    /**
     *
     * @param property an Observable instance
     * @param options
     * @constructor
     */
    function TextView(property, options) {
        this.parentNode = options.parentNode;
        this.node = document.createTextNode(property.value);
        this.parentNode.appendChild(this.node);
        property.subscribe(function() {
           this.node.replaceWholeText(property.value);
        });
    }
})();