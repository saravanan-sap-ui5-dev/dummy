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
    return BaseController.extend("com.lighthouse.master_data.CallSign", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();
            // var oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("callsignMaster").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("callSignDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("callSignDetailEdit").attachMatched(this._onRouteEditMatched, this);

            this.getView().setModel(new JSONModel(), "advancedFilterMdl");

            this._tableId = this.byId("callsign_details");
            this._pageId = this.byId("page_mngCallSign");
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
        _mockData: function () {
            let oData = {
                Products: [
                    {
                        ShippingLine: "Shipping Line 1",
                        VesselName: "Vessel Name 1",
                        VesselCode: "ABC0001",
                        CallSign: "Call Sign 1"
                    },
                    {
                        ShippingLine: "Shipping Line 2",
                        VesselName: "Vessel Name 2",
                        VesselCode: "ABC0002",
                        CallSign: "Call Sign 2"
                    },
                    {
                        ShippingLine: "Shipping Line 3",
                        VesselName: "Vessel Name 3",
                        VesselCode: "ABC0003",
                        CallSign: "Call Sign 3"
                    },
                    {
                        ShippingLine: "Shipping Line 4",
                        VesselName: "Vessel Name 4",
                        VesselCode: "ABC0004",
                        CallSign: "Call Sign 4"
                    },
                    {
                        ShippingLine: "Shipping Line 5",
                        VesselName: "Vessel Name 5",
                        VesselCode: "ABC0005",
                        CallSign: "Call Sign 5"
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
            let oMdl = this.getView().setModel(new JSONModel(oData), "MngCallSignMdl");
            this.getView().getModel("MngCallSignMdl").refresh();
            // oMdl.refresh();
        },
        backToMaster: function () {
            this.getRouter().navTo("dashboard")
        },
        onFilter: function (oEvent) {
            var sQuery = oEvent.getSource().getProperty("value");
            //   let filters = [];
            if (sQuery) {
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter("lineName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("lineCode", sap.ui.model.FilterOperator.EQ, sQuery),
                        new sap.ui.model.Filter("accountCode", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("debitNotePrefix", sap.ui.model.FilterOperator.Contains, sQuery)
                    ]
                });
            }
            let binding = this._tableId.getBinding("items");

            binding.filter(oFilter);

        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("MngCallSignMdl");
            var oModel = this.getView().getModel("MngCallSignMdl");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("lineCode", oBindingContext));

            //this._pageId, setHeaderExpanded
            this._pageId.setHeaderExpanded(false)

            this.getOwnerComponent().getHelper().then(function (oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this.oRouter.navTo("callSignDetailEdit", {
                    layout: oNextUIState.layout,
                    name: rowObj.VesselCode
                });
            }.bind(this));
        },
        onPressNavCreate: function (oEvent) {

            this.getRouter().navTo("callSignDetailCreate");

        },
        // onPressRefresh : function() {


        //         let filters = [];
        //       let oKey =  oEvent.getSource().getProperty("value");
        //     //   let data = mdl.getData();

        //       for (let [key, value] of Object.entries(oKey)) {
        //           if (key == "0") {
        //               filters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.Contains, value))
        //           } else {
        //               filters.push(new sap.ui.model.Filter(key, sap.ui.model.FilterOperator.EQ, value))
        //           }
        //       }

        //       let binding = this._tableId.getBinding("rows");
        //       binding.filter(filters);
        //   },

    });
});
