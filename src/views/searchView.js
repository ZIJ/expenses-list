/**
 * Created by Igor Zalutsky on 15.08.12 at 0:08
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.SearchView = function(labelText){

        var view = this;
        this.parentNode = null;
        this.listeners = {};
        this.isVisible = false;

        this.query = new elist.ObservableProperty("");
        this.query.notify(function(){
            view.emit("query");
        });

        this.labelText = new elist.ObservableProperty(labelText);
        this.labelText.notify(function(){
            view.update();
        });

        this.node = document.createElement("label");

        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.addEventListener("input",function(){
            view.update();
        },false);

        this.update();
    };
    // Extending BaseView
    elist.SearchView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.SearchView.prototype.update = function(){
        this.node.innerHTML = this.labelText.get();
        this.node.appendChild(this.input);  //innerHTML will remove input's markup
        this.query.set(this.input.value);
    };
    /**
     * Returns value from markup
     */
    elist.SearchView.prototype.getValue = function(){
        return this.input.value;
    };


}());
