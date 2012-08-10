/**
 * Created with JetBrains WebStorm.
 * Author: Igor Zalutsky
 * Date: 10.08.12
 * Time: 1:15
 */

(function() {
    //publishing namespace
    if (this.elist === undefined) {
        this.elist = {};
    }

    /**
     * Checks condition and throws error with optional errorMessage if check fails
     * @param condition
     * @param errorMessage Optional, "Assertion failed" by default
     */
    elist.assert = function(condition, errorMessage) {
        if (!condition) {
            throw new Error(errorMessage ? errorMessage : "Assertion failed");
        }
    };

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
    };
    /**
     * Selects DOM element by it's ID
     * @param id
     * @return
     */
    elist.byId = function(id){
        var node = document.getElementById(id);
        return new Wrapper(node);
    };
    /**
     * Wraps an element into a Wrapper :)
     * @param element
     * @return {Wrapper}
     */
    elist.wrap = function(element) {
        return new Wrapper(element);
    }
    /**
     * Wraps DOM node adding some useful features
     * @param element
     * @constructor
     */
    function Wrapper(element) {
        this.element = element ? element : null;
    }

    /**
     * Checks whether the wrapper contains an element or not
     * @return {Boolean}
     */
    Wrapper.prototype.isEmpty = function(){
        return !this.element;
    };
    /**
     * Removes node from dom
     * @return Removed node, wrapped
     */
    Wrapper.prototype.remove = function(){
        if (!this.isEmpty()) {
            var node = this.element;
            node.parentNode.removeChild(node);
        }
        return this;
    };
    /**
     * Inserts child node to the end of children list
     * @param content
     * @return {*}
     */
    Wrapper.prototype.append = function(content){

        if (!this.isEmpty()) {
            var toInsert = content instanceof Wrapper ? content.element :
                           content instanceof HTMLElement ? content :
                           doc.createTextNode(content);
            this.element.appendChild(toInsert);
        }
        return this;
    };

})();