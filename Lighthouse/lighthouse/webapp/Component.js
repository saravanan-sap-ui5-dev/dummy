/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/lighthouse/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/f/FlexibleColumnLayoutSemanticHelper',
    'sap/f/library',
    "sap/ui/core/IconPool"
],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary, IconPool) {
        "use strict";

        return UIComponent.extend("com.lighthouse.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oModel,
                    oRouter;

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                oModel = new JSONModel();
                this.setModel(oModel);

                // enable routing
                oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                //this.setModel(new JSONModel([]), "errors");
                ///this.setModel(new JSONModel([]), "attachmentsMdl");
                this.setModel(new JSONModel(), "newAttachmentMdl");

                //this model is used to display common data
                this.setModel(new JSONModel(), "masterDataMdl");

                var oSettingsModel = new JSONModel({
                    route: null,
                    filter: null,
                });
                this.setModel(oSettingsModel, "settings");
                this.setModel(new JSONModel(), "tempDataMdl");
                this._mViewSettingsDialogs = {};

                //Icon Register
                this.iconPoolRegister();
            },
            _onBeforeRouteMatched: function (oEvent) {
                this.setModel(new JSONModel([]), "errors"); //it can set new error model every screen navigation before routing
                this.setModel(new JSONModel([]), "attachmentsMdl"); //it can set new attachment model every screen navigation before routing
            },
            iconPoolRegister: function () {
                var b = [];
                var c = {};
                //Fiori Theme font family and URI
                var t = {
                    fontFamily: "SAP-icons-TNT",
                    fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(t);
                b.push(IconPool.fontLoaded("SAP-icons-TNT"));
                c["SAP-icons-TNT"] = t;
                //SAP Business Suite Theme font family and URI
                var B = {
                    fontFamily: "BusinessSuiteInAppSymbols",
                    fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                };
                //Registering to the icon pool
                IconPool.registerFont(B);
                b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
                c["BusinessSuiteInAppSymbols"] = B;
            },
            getContentDensityClass: function () {
                if (!this._sContentDensityClass) {
                    if (!Device.support.touch) {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    } else {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);