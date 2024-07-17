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
    return BaseController.extend("com.lighthouse.other_services.transportation.ManageTransportation", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageTransportation").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("table_Imports");
            this._pageId = this.byId("page_Imports");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("tpHeaderTitle"));
            this._mockData();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 221106,
                        transportType: "Import",
                        cargoType: "Container",
                        consignee: "Giffin Company",
                        date: "26-04-2023",
                        status: 0
                    },
                    {
                        id: 221107,
                        transportType: "Import",
                        cargoType: "Container",
                        consignee: "Lulu Muscat",
                        date: "26-04-2023",
                        status: 1
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("transportationDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("transportationDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
