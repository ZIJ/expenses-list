/**
 * Created by Igor Zalutsky on 10.08.12 at 12:38
 */

"use strict";

(function() {
    "use strict";
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