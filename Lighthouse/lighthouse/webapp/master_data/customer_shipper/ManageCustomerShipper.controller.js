sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/m/Token',
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Token, MessageBox, Fragment, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.ManageCustomerShipper", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("customerShipperMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("customerShipperDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("customerShipperDetailEdit").attachMatched(this._onRouteEditMatched, this);
            this.getView().setModel(new JSONModel(), "advancedFilterMdl");
            this._tableId = this.getView().byId("customerShipperTable");
            this._pageId = this.byId("page_CustomerShipper");
        },
        _onRouteMatched: function () {
            this._mockData();
            this.disableItemNavigated(this._tableId);
        },
        _onRouteCreateMatched: function () {
            this._mockData();
            this.disableItemNavigated(this._tableId);
        },
        _onRouteEditMatched: function () {
            this._mockData();
        },
        backToMaster: function () {
            this.getRouter().navTo("dashboard")
        },
        onPressNavCreate: function (oEvent) {
            let oNextUIState;
            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("customerShipperDetailCreate", {
                    layout: oNextUIState.layout
                });
            }.bind(this));
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("customerShipper");
            var oModel = this.getView().getModel("customerShipper");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("customerName", oBindingContext));

            //this._pageId, setHeaderExpanded
            this._pageId.setHeaderExpanded(false)

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("customerShipperDetailEdit", {
                    layout: oNextUIState.layout,
                    name: rowObj.customerName
                });
            }.bind(this));
            //this.getRouter().navTo("shippingLineDetail", { layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, name: productObj.lineName });
        },
        AdvancedFilter: function () {
            let filters = [];
            let data = this.getView().getModel("advancedFilterMdl").getData();
            for (let [key, value] of Object.entries(data)) {
                filters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.Contains, value));
            }
            let binding = this._tableId.getBinding("items");
            binding.filter(filters);
        },
        clearAllFilters: function () {
            this.getView().setModel(new JSONModel(), "advancedFilterMdl");
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
            this.getView().setModel(new JSONModel(data), "customerShipper");
        },
    });
});
