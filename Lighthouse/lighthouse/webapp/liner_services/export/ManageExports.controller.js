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
    return BaseController.extend("com.lighthouse.liner_services.export.ManageExports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageExports").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("table_Exports");
            this._pageId = this.byId("page_Exports");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("exHeaderTitle"));
            this._mockData();
            this.disableItemNavigated(this._tableId);
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 3453,
                        shipmentNo: 22549,
                        voyageIndex: 18758,
                        shippingLine: "Hopag Lloyd",
                        blNo: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Aug-2022 9:35",
                        vesselETS: "13-Aug-2022 19:35",
                        pod: "DME",
                        pol: "SOH",
                        status: 0
                    }, {
                        id: 3454,
                        shipmentNo: 22550,
                        voyageIndex: 18759,
                        shippingLine: "Hopag Lloyd",
                        blNo: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Aug-2022 9:35",
                        vesselETS: "13-Aug-2022 19:35",
                        pod: "DME",
                        pol: "SOH",
                        status: 0
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data))
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("exportsDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.oRouter.navTo("exportsDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
