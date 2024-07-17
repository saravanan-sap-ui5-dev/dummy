sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.AddEditCustomerShipper", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();
            this.oRouter.getRoute("customerShipperMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("customerShipperDetailCreate").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("customerShipperDetailEdit").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").name ? oEvent.getParameter("arguments").name : null;
            this._route = oEvent.getParameter("config").name
            this._mockData();
            this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), "customerShipper");

        },
        _mockData: function () {
            let data = {
                CustomerShipper: [
                    {
                        customerName: "Name1",
                        shortName: "n1",
                        fullAddress: "Bangalore",
                        bankingDetails: "HDFC",
                        CFLicenseID: "123",
                        bayanCode: "456",
                        customerCompanyDetails: "company1",
                        importCargoDetails: "importcargo1",
                        exportCargoDetails: "exportcargo1"
                    },
                    {
                        customerName: "Name2",
                        shortName: "n2",
                        fullAddress: "Chennai",
                        bankingDetails: "ICICI",
                        CFLicenseID: "321",
                        bayanCode: "645",
                        customerCompanyDetails: "560109",
                        importCargoDetails: "importcargo2",
                        exportCargoDetails: "exportcargo2"
                    },
                ],
                Fields: [
                    {
                        Name: "Name",
                        items: [
                            {
                                Name: "iPhone"
                            },
                            {
                                Name: "Android"
                            }
                        ]
                    },
                    {
                        Name: "Quantity",
                        items: [
                            {
                                Name: "5"
                            },
                            {
                                Name: "6"
                            }
                        ]
                    },
                    {
                        Name: "Price",
                        items: [
                            {
                                Name: "100"
                            },
                            {
                                Name: "200"
                            }
                        ]
                    }
                ]
            }
            let oModel = this.getModel();
            oModel.getData().mockData = data;
            oModel.refresh();
        },

        handleFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, name: this._item });
        },

        handleExitFullScreen: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.oRouter.navTo(this._route, { layout: sNextLayout, name: this._item });
        },

        handleClose: function () {
            var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("customerShipperMaster", { layout: sNextLayout });
        },
        onExit: function () {
            this.oRouter.getRoute("customerShipperMaster").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
