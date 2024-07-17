sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/f/library',
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, fioriLibrary) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.init.Dashboard", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("dashboard").attachMatched(this._onRouteMatched, this);

            this.pageId = this.byId("oplDashboard");
        },
        _onRouteMatched: function () {
            this.dashboardModel();
            this.userSettingsData();
            this.fetchMasterData();
        },
        onPressTile: function (oEvent) {
            var route = oEvent.getSource().getCustomData().find(e => e.getProperty("key") == "route").getValue();
            this.getRouter().navTo(route);
        },
        onManageTileLoadingState: function () {
            var sections = this.pageId.getSections();
            sections.forEach((section) => {
                let tiles = section._getGrid().getContent()[0]._getGrid().getContent()[0].getItems();
                for (var i = 1; i < content.length; i++) {
                    tiles[i].setState("Loading");
                }
                setTimeout(function () {
                    for (var j = 1; j < content.length; j++) {
                        tiles[j].setState("Loaded");
                    }
                }, 10000);
            });

        },
        dashboardModel: function () {
            let dashboardData = {
                "linerService": {
                    "title": this.getResourceProperty("hLinerServices"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thVoyage"),
                            "subHeader": this.getResourceProperty("tshVoyage"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-vessel",
                            "footer": this.getResourceProperty("tfVoyage"),
                            "route": "voyagesMaster",
                            "key": 1,
                            "value": "29"
                        },
                        {
                            "header": this.getResourceProperty("thImports"),
                            "subHeader": this.getResourceProperty("tshImports"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-target",
                            "footer": this.getResourceProperty("tfImports"),
                            "route": "manageImports",
                            "key": 1,
                            "value": "17"
                        },
                        {
                            "header": this.getResourceProperty("thExports"),
                            "subHeader": this.getResourceProperty("tshExports"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-source",
                            "footer": this.getResourceProperty("tfExports"),
                            "route": "manageExports",
                            "key": 1,
                            "value": "12"
                        },
                        {
                            "header": this.getResourceProperty("thTransshipment"),
                            "subHeader": this.getResourceProperty("tshTransshipment"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-data-access",
                            "footer": this.getResourceProperty("tfTransshipment"),
                            "route": "transshipmentMaster",
                            "key": 1,
                            "value": "8"
                        },
                        {
                            "header": this.getResourceProperty("thContainersInUse"),
                            "subHeader": "",//this.getResourceProperty("thImports"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-container-loading",
                            "footer": this.getResourceProperty("tfContainersInUse"),
                            "route": "containerMasterInUse",
                            "key": 5,
                            "value": 50
                        },
                        {
                            "header": this.getResourceProperty("thOperations"),
                            "subHeader": this.getResourceProperty("tshOperations"),
                            "icon": "sap-icon://enablement",
                            "footer": this.getResourceProperty("tfOperations"),
                            "route": "",
                            "key": 1,
                            "value": "29"
                        },
                        {
                            "header": this.getResourceProperty("thlReports"),
                            "subHeader": this.getResourceProperty("tshlReports"),
                            "icon": "sap-icon://manager-insight",
                            "footer": this.getResourceProperty("tflReports"),
                            "route": "",
                            "key": 1,
                            "value": " "
                        }
                    ]
                },
                "candfServices": {
                    "title": this.getResourceProperty("hCandFServices"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thJobs"),
                            "subHeader": this.getResourceProperty("tshJobs"),
                            "icon": "sap-icon://request",
                            "footer": this.getResourceProperty("tfJobs"),
                            "route": "jobMaster",
                            "key": 2,
                            "value": "29"
                        },
                        {
                            "header": this.getResourceProperty("thPayments"),
                            "subHeader": this.getResourceProperty("tshPayments"),
                            "icon": "sap-icon://money-bills",
                            "footer": this.getResourceProperty("tfPayments"),
                            "route": "",
                            "key": 2,
                            "value": "13"
                        },
                        {
                            "header": this.getResourceProperty("thcfReports"),
                            "subHeader": this.getResourceProperty("tshcfReports"),
                            "icon": "sap-icon://manager-insight",
                            "footer": this.getResourceProperty("tfcfReports"),
                            "route": "",
                            "key": 2,
                            "value": " "
                        }
                    ]
                },
                "otherServices": {
                    "title": this.getResourceProperty("hOtherServices"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thTransportation"),
                            "subHeader": this.getResourceProperty("tshTransportation"),
                            "icon": "./images/bus.png",
                            "footer": this.getResourceProperty("tfTransportation"),
                            "route": "manageTransportation",
                            "key": 3,
                            "value": 29
                        },
                        {
                            "header": "Vehicle",
                            "subHeader": "",
                            "icon": "sap-icon://shipping-status",
                            "footer": "Vehicles",
                            "route": "vehicleMaster",
                            "key": 5,
                            "value": 40
                        },
                        {
                            "header": this.getResourceProperty("thHusbandryServices"),
                            "subHeader": this.getResourceProperty("tshHusbandryServices"),
                            "icon": "sap-icon://technical-object",
                            "footer": this.getResourceProperty("tfHusbandryServices"),
                            "route": "manageHusbandryService",
                            "key": 3,
                            "value": 29
                        },
                        {
                            "header": this.getResourceProperty("thoReports"),
                            "subHeader": this.getResourceProperty("tshoReports"),
                            "icon": "sap-icon://manager-insight",
                            "footer": this.getResourceProperty("tfoReports"),
                            "route": "",
                            "key": 3,
                            "value": 29
                        }
                    ]
                },
                "finance": {
                    "title": this.getResourceProperty("hFinance"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thfReports"),
                            "subHeader": this.getResourceProperty("tshfReports"),
                            "icon": "sap-icon://customer-financial-fact-sheet",
                            "footer": this.getResourceProperty("tffReports"),
                            "route": "",
                            "key": 4,
                            "value": 29
                        }
                    ]
                },
                "admin": {
                    "title": this.getResourceProperty("hAdmin"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thApplicationConfig"),
                            "subHeader": this.getResourceProperty("tshApplicationConfig"),
                            "icon": "sap-icon://action-settings",
                            "footer": this.getResourceProperty("tfApplicationConfig"),
                            "route": "applicationConfig",
                            "key": 5,
                            "value": 29
                        },
                        {
                            "header": this.getResourceProperty("thManageUsers"),
                            "subHeader": this.getResourceProperty("tshManageUsers"),
                            "icon": "sap-icon://user-settings",
                            "footer": this.getResourceProperty("tfManageUsers"),
                            "route": "manageUser",
                            "key": 5,
                            "value": 29
                        },
                        {
                            "header": this.getResourceProperty("thManageRoles"),
                            "subHeader": this.getResourceProperty("tshManageRoles"),
                            "icon": "sap-icon://role",
                            "footer": this.getResourceProperty("tfManageRoles"),
                            "route": "manageRole",
                            "key": 5,
                            "value": 10
                        }
                    ]
                },
                "masterData": {
                    "title": this.getResourceProperty("hMasterData"),
                    "items": [
                        {
                            "header": this.getResourceProperty("thCustomer"),
                            "subHeader": "",
                            "icon": "sap-icon://customer",
                            "footer": this.getResourceProperty("tfCustomer"),
                            "route": "customerMaster",
                            "key": 5,
                            "value": 29,
                            "state": "Loaded"
                        },
                        {
                            "header": this.getResourceProperty("thShippingLine"),
                            "subHeader": "",
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-ship",
                            "footer": this.getResourceProperty("tfShippingLine"),
                            "route": "shippingLineMaster",
                            "key": 5,
                            "value": 12
                        },
                        {
                            "header": this.getResourceProperty("thVessel"),
                            "subHeader": "",
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-vessel",
                            "footer": this.getResourceProperty("tfVessel"),
                            "route": "vesselMaster",
                            "key": 5,
                            "value": 34,
                            "class": "tileIcon"
                        },
                        {
                            "header": this.getResourceProperty("thPortCode"),
                            "subHeader": "",
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-forklift",
                            "footer": this.getResourceProperty("tfPortCode"),
                            "route": "portCodeMaster",
                            "key": 5,
                            "value": 21
                        },
                        {
                            "header": this.getResourceProperty("thContainerType"),
                            "subHeader": "",
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-container-loading",
                            "footer": this.getResourceProperty("tfContainerType"),
                            "route": "containertype",
                            "key": 5,
                            "value": 14
                        },
                        {
                            "header": this.getResourceProperty("thContainers"),
                            "subHeader": "",//this.getResourceProperty("thImports"),
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-container-loading",
                            "footer": this.getResourceProperty("tfContainers"),
                            "route": "containerMaster",
                            "key": 5,
                            "value": 50
                        },
                        {
                            "header": this.getResourceProperty("thCargoType"),
                            "subHeader": "",
                            "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-box-truck",
                            "footer": this.getResourceProperty("tfCargoType"),
                            "route": "cargoType",
                            "key": 5,
                            "value": 445
                        },
                        {
                            "header": this.getResourceProperty("thImo"),
                            "subHeader": "",
                            "icon": "sap-icon://activity-assigned-to-goal",
                            "footer": this.getResourceProperty("tfImo"),
                            "route": "iMOMaster",
                            "key": 5,
                            "value": 400
                        },
                        {
                            "header": this.getResourceProperty("thHSCode"),
                            "subHeader": "",
                            "icon": "sap-icon://activity-items",
                            "footer": this.getResourceProperty("tfHSCode"),
                            "route": "hsCode",
                            "key": 5,
                            "value": 436
                        },
                        {
                            "header": this.getResourceProperty("thCustomsPackagesCode"),
                            "subHeader": "",
                            "icon": "sap-icon://inspection",
                            "footer": this.getResourceProperty("tfCustomsPackagesCode"),
                            "route": "customsPackageCode",
                            "key": 5,
                            "value": 400
                        }
                    ]
                }
            };
            this.getView().setModel(new JSONModel(dashboardData), "dashboard");
            //this.onManageTileLoadingState();
        }
    });
});
