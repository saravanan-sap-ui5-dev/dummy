sap.ui.define(
    [
        "com/lighthouse/init/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/Popover",
        "sap/m/Button",
        "sap/m/library",
        "sap/ui/Device",
        "sap/ui/core/Popup",
        'sap/ui/core/Fragment',
        "sap/m/Dialog",
        "sap/m/library",
        'sap/f/library',
    ],
    function (BaseController, JSONModel, Popover, Button, library, Device, Popup, Fragment, Dialog, mobileLibrary, fioriLibrary) {
        "use strict";
        // shortcut for sap.m.ButtonType
        var ButtonType = mobileLibrary.ButtonType;

        // shortcut for sap.m.DialogType
        var DialogType = mobileLibrary.DialogType;

        return BaseController.extend("com.lighthouse.init.AppUnified", {
            onInit: function () {
                //this.byId("toolPage").setSideExpanded(false);

                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();

                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
                this.userSettingsData();
                this.fetchMasterData();
            },

            onPressLogo: function () {
                this.onPressHome();
            },

            getNavTitle: function (oKey) {
                if (oKey != undefined && oKey != null && oKey != "") {
                    let sectionTitles = {
                        1: "Liner Services",
                        2: "C&F Services",
                        3: "Other Services",
                        4: "Finance",
                        5: "Admin"
                    }
                    return sectionTitles[oKey];
                }
            }
        }
        );
    }
);
