sap.ui.define([
    "sap/m/Input",
    "com/timetracker/controller/BaseController",
    "sap/ui/core/ValueState",
    "sap/ui/model/json/JSONModel",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Input,BaseController,ValueState,JSONModel,library) {
        "use strict";
      

        return BaseController.extend("com.timetracker.dashboard.CreateEntry", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("dashboard").attachMatched(this._onRouteMatched, this);
            },
            onTimeChange: function(oEvent) {
                var oTimePicker = oEvent.getSource();
                var sNewValue = oTimePicker.getValue();
                var oNewDate = new Date("1970-01-01T" + sNewValue + "Z"); // Convert value to date object
    
                // Add 2 hours to the selected time
                oNewDate.setHours(oNewDate.getHours() + 2);
    
                // Format the new time
                var sNewHours = ("0" + oNewDate.getHours()).slice(-2);
                var sNewMinutes = ("0" + oNewDate.getMinutes()).slice(-2);
    
                // Set the new value back to the TimePicker
                oTimePicker.setValue(sNewHours + ":" + sNewMinutes);
            },
            onpresssave: function () {
                this.getRouter().navTo("dashboard");
            },
            onpresscancel: function () {
                this.getRouter().navTo("dashboard");
            },
           
        });
    });