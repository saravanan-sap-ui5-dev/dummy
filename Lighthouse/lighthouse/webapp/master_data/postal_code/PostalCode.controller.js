sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, Filter, FilterOperator, library, Core, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.PostalCode", {
        formatter: Formatter,
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("postalCode").attachMatched(this._onRouteMatched, this);
            this.oRouter.getRoute("postalCodeDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("postalCodeDetailEdit").attachMatched(this._onRouteEditMatched, this);

            this._tableId = this.byId("table_PostalCode");
            this._pageId = this.byId("page_mngPostalCode");
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
        _filter: function () {
            var oFilter;

            if (this._oTxtFilter && this._oFacetFilter) {
                oFilter = new Filter([this._oTxtFilter, this._oFacetFilter], true);
            } else if (this._oTxtFilter) {
                oFilter = this._oTxtFilter;
            } else if (this._oFacetFilter) {
                oFilter = this._oFacetFilter;
            }

            this.byId("table").getBinding("items").filter(oFilter, "Application");
        },

        handleTxtFilter: function (oEvent) {

            var sQuery = oEvent ? oEvent.getParameter("query") : null;
            var afilters = [
                new Filter("CityName", FilterOperator.Contains, sQuery),
                new Filter("PinCode", FilterOperator.EQ, sQuery),

            ]
            var allFilter = new sap.ui.model.Filter(afilters);
            var oBinding = this.getView().byId("table").getBinding("items");
            oBinding.filter(allFilter);
        },
        onPressPortCodeCreate: function (oEvent) {
            this.oRouter.navTo("postalCodeDetailCreate");
        },
        clearAllFilters: function () {
            this.handleTxtFilter();
            // this.handleFacetFilterReset();
            this._filter();
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
            this.getView().setModel(new JSONModel(data), "postalCodeMdl")
        },
        backToMaster: function () {
            this.onNavBack();
        },
        onPressPortCodeEdit: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("postalCodeMdl");
            var oModel = this.getView().getModel("postalCodeMdl");
            var rowObj = oBindingContext.getObject(), oNextUIState;
            var oSettingsModel = this.oOwnerComponent.getModel('settings');

            //Set Navigated Items
            //oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("PinCode", oBindingContext));

            //this._pageId, setHeaderExpanded
            //this._pageId.setHeaderExpanded(false)

            // var productObj = oEvent.getSource().getBindingContext("postalCodeMdl").getObject(),
            //     oNextUIState;



            this.oRouter.navTo("postalCodeDetailEdit", {
                name: rowObj.PinCode
            });

        }
    });
});
