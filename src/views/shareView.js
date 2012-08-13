/**
 * Created by Igor Zalutsky on 13.08.12 at 12:04
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.ShareView = function(property){
        //TODO property validation in ShareView()
        var view = this;
        this.listeners = {};
        this.isVisible = false;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("p");

        this.prop.notify(function(){
            view.update();
        });

        this.update();
    };
    // ShareView extends BaseView
    elist.ShareView.inheritFrom(elist.BaseView);
    /**
     * Refreshes text
     */
    elist.ShareView.prototype.update = function(){
        var share = this.prop.get();
        if (isNaN(share) || share <= 0) {
            this.node.innerHTML = "--";
        }  else {
            this.node.innerHTML = Math.round(share * 100) + " %";
        }
    };
    /**
     * Returns value from markup
     */
    elist.ShareView.prototype.getValue = function(){
        return this.node.innerHTML;
    };


}());
