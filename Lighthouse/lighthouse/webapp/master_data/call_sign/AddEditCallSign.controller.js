sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.AddEditCallSign", {
        formatter: Formatter,

        onInit: function () {

            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("callsignMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("callSignDetailEdit").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("callSignDetailCreate").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").name ? oEvent.getParameter("arguments").name : null;
            this._route = oEvent.getParameter("config").name
            this._mockData();
            this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), "MngCallSignMdl");

        },
        _mockData: function () {
            let data = {
                Products: [
                    {
                        lineName: "Shipping Line 1",
                        lineCode: 1,
                        accountCode: "ABC0001",
                        debitNotePrefix: "SHIP"
                    },
                    {
                        lineName: "Shipping Line 2",
                        lineCode: 2,
                        accountCode: "ABC0002",
                        debitNotePrefix: "SHIP"
                    }
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
        //Full Screen, Exit Full Screen, and Close 
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
            this.oRouter.navTo("callsignMaster", { layout: sNextLayout });
        },

        onExit: function () {
            this.oRouter.getRoute("callsignMaster").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        }
    });
});
