
sap.ui.define([
    "com/timetracker/controller/BaseController",

    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/Title",
    "sap/ui/core/routing/History"
], function(BaseController, UIComponent, JSONModel, Title,  History) {
    "use strict";

    return BaseController.extend("com.timetracker.controller.AppUnified", {
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            this.userSettingsData();
        },
        onRouteMatched: function (oEvent) {
            //
        },
        onPressLogo: function () {
            this.onPressHome();
        }
    }
    );
}
);
   