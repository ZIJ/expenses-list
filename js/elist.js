/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 1:15
 */

(function() {
    this.elist = {};            //publishing namespace to window in browsers or somewhere else in other environments

    /**
     * Checks condition and throws error with optional errorMessage if check fails
     * @param condition
     * @param errorMessage Optional, "Assertion failed" by default
     */
    elist.assert = function(condition, errorMessage) {
        if (!condition) {
            throw new Error(errorMessage ? errorMessage : "Assertion failed");
        }
    }

    elist.assert(this.document !== undefined, "Document undefined");   // checking document's presence
    var doc = this.document;
    /**
     * Fires all listeners when DOM is complete
     * @param listener
     * @return {*}
     */
    elist.ready = function(listener) {
        //TODO: crossbrowser "ready"
        doc.addEventListener("DOMContentLoaded", listener, false);
        return elist;
    }

})();