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
    return BaseController.extend("com.lighthouse.master_data.AddEditPostalCode", {

        formatter: Formatter,

        onInit: function () {
            var that = this;

            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("postalCode").attachMatched(this._onRouteMatched, that);
            this.oRouter.getRoute("postalCodeDetailCreate").attachMatched(this._onRouteMatched, that);
            this.oRouter.getRoute("postalCodeDetailEdit").attachMatched(this._onRouteMatched, that);

        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").name ? oEvent.getParameter("arguments").name : null;
            this._route = oEvent.getParameter("config").name
            this._mockData();
            this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), "postalCodeMdl");

        },
        _mockData: function () {
            let data = {
                Products: [
                    {
                        CityName: "Bangalore",
                        PinCode: 560063,

                    },
                    {
                        CityName: "Mumbai",
                        PinCode: 400029,

                    },
                    {
                        CityName: "Bangalore",
                        PinCode: 560061,

                    },
                    {
                        CityName: "Mumbai",
                        PinCode: 400022,

                    }, {
                        CityName: "Bangalore",
                        PinCode: 560064,

                    },
                    {
                        CityName: "Mumbai",
                        PinCode: 400025,

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
            this.oRouter.navTo("postalCode", { layout: sNextLayout });
        },

        onExit: function () {
            this.oRouter.getRoute("postalCode").detachPatternMatched(this._onRouteMatched, this);
            this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
        },

    });
});
