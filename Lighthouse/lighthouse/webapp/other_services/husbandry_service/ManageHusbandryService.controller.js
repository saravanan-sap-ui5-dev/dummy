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
    return BaseController.extend("com.lighthouse.other_services.husbandry_service.ManageHusbandryService", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageHusbandryService").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("tableHusbandryService");
            this._pageId = this.byId("pageHusbandryService");
        },
        _onRouteMatched: function () {
            this.setTitle("Husbandry Service");
            this._mockData();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 221106,
                        shippingLine: "Hapag Lloyd",
                        port: "Duqm",
                        vesselId: "83754W",
                        date: "26-04-2023",
                        status: 0
                    },
                    {
                        id: 221107,
                        shippingLine: "Hapag Lloyd",
                        port: "Duqm",
                        vesselId: "34563R",
                        date: "26-12-2023",
                        status: 0
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("husbandryServiceDetailsCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("husbandryServiceDetailsEdit", {
                id: rowObj.id
            });
        }
    });
});
