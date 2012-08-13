/**
 * Created by Igor Zalutsky on 13.08.12 at 4:50
 */

(function () {
    "use strict";
    // publishing namespace
    if (!window.elist) {
        window.elist = {};
    }
    var elist = window.elist;
    /**
     * View that automatically switches between edit and view modes
     * @param property ObservableProperty
     * @param editControlName
     * @param viewControlName
     * @constructor
     */
    elist.EditableView = function(property, editControlName, viewControlName){
        //TODO params validation in EditableView()
        var view = this;
        this.prop = property;
        this.parentNode = null;

        this.node = document.createElement("div");

        //TODO validate control names in EditableView()
        this.viewControl = new elist[viewControlName](property);
        this.editControl = new elist[editControlName](property);

        this.viewControl.parentNode = this.node;
        this.editControl.parentNode = this.node;

        this.viewControl.on("editRequest", function(){
            view.edit();
        });
        this.editControl.on("saveRequest", function(){
            //TODO maybe re-emit on saveRequest in EditableView?
            view.prop.set(view.getValue());
            view.view();
        });

        this.isEditing = true;
        this.view();
    };
    // EditableView extends BaseView
    elist.EditableView.inheritFrom(elist.BaseView);
    /**
     * Toggles view mode
     */
    elist.EditableView.prototype.view = function(){
        if (this.isEditing) {
            this.editControl.hide();
            this.viewControl.show();
            this.isEditing = false;
        }
    };
    /**
     * Toggles edit mode
     */
    elist.EditableView.prototype.edit = function(){
        if (!this.isEditing) {
            this.viewControl.hide();
            this.editControl.show();
            this.isEditing = true;
        }
    };
    /**
     * Returns value from markup
     */
    elist.EditableView.prototype.getValue = function(){
        if (this.isEditing) {
            return this.editControl.getValue();
        } else {
            return this.viewControl.getValue();
        }
    };

}());
