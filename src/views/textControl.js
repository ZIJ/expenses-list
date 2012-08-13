/**
 * Created by Igor Zalutsky on 13.08.12 at 0:48
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;

    elist.TextControl = function(property){
        var control = this;
        this.isEditing = true;
        this.prop = property;
        this.parentNode = null;
        this.node = null;

        this.viewNode = document.createElement("span");
        this.editNode = document.createElement("input");
        this.editNode.type = "text";

        this.prop.notify(function(){
            control.update();
        });

        this.view();
    };

    elist.TextControl.inheritFrom(elist.BaseView);

    elist.TextControl.prototype.view = function(){
        if (this.isEditing === true) {
            if (this.parentNode) {
                try {
                    this.parentNode.removeChild(this.editNode);
                } catch (e) {}
                this.parentNode.appendChild(this.viewNode);
            }
            this.node = this.viewNode;
            this.isEditing = false;
            this.update();
        }
    };

    elist.TextControl.prototype.edit = function(){
        if (this.isEditing === false) {
            if (this.parentNode) {
                try {
                    this.parentNode.removeChild(this.viewNode);
                } catch (e) {}
                this.parentNode.appendChild(this.editNode);
            }
            this.node = this.viewNode;
            this.isEditing = true;
            this.update();
        }
    };

    elist.TextControl.prototype.save = function(){
        if (this.isEditing === true){
            this.emit("saveRequest");
        }
    };

    elist.TextControl.prototype.getText = function(){
        if (this.isEditing === true) {
            return this.editNode.value;
        } else {
            return this.viewNode.innerHTML;
        }
    };

    elist.TextControl.prototype.update = function(){
        var value = this.prop.get();
        this.viewNode.innerHTML = value;
        this.editNode.value = value;
    };

    elist.TextControl.prototype.renderTo = function(element) {
        //TODO param validation in renderTo()
        var control = this;
        element.appendChild(this.node);
        this.parentNode = element;

        this.viewNode.addEventListener("click", function(){
            control.edit();
        }, false);
        this.editNode.addEventListener("change", function(){
            control.save();
        }, false);

        return this;
    };


}());
