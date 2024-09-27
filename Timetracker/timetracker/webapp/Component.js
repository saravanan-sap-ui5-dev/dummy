/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "com/timetracker/model/models",
        "sap/ui/model/json/JSONModel",
    ],
    function (UIComponent, Device, models,JSONModel) {
        "use strict";

        return UIComponent.extend("com.timetracker.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oRouter;
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var oSettingsModel = new JSONModel({
                    route: null,
                    filter: null,
                  });
                  this.setModel(oSettingsModel, "settings");
            },
            _onBeforeRouteMatched: function (oEvent) {
                //
                this.setModel(new JSONModel(), "errors");
            },

        });
    }
);