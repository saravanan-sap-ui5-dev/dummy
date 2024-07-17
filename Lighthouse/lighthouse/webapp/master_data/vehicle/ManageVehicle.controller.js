sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/f/library',
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, fioriLibrary, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.vehicle.ManageVehicle", {

        formatter: Formatter,

        onInit: function () {
            // var that = this;
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("vehicleMaster").attachMatched(this._onRouteMatched, this);

            this._pageId = this.byId("page_mngShippingLine");
            this._tableId = this.byId("table_Shipping");
        },
        _onRouteMatched: function () {
            this.setTitle("Vehicle");
            this._mockData();
        },
        _mockData: function () {
            let data = {
                table: {
                    mode: "None",
                    items: [
                        {
                            vehicleType: "Trailer",
                            registrationNo: "6775-MH",
                            id: 13413,
                            make: "Mercedes Benz",
                            status: "Active"
                        },
                        {
                            vehicleType: "Trailer",
                            registrationNo: "8463-YS",
                            id: 73453,
                            make: "Hino",
                            status: "Active"
                        },
                        {
                            vehicleType: "Trailer",
                            registrationNo: "1135-YS",
                            id: 73454,
                            make: "Scania",
                            status: "Active"
                        }
                    ]
                }
            }
            data.table.items.forEach(e => e.type = "Navigation")
            this.getView().setModel(new JSONModel(data));
        },
        onPressVehicleCreate: function (oEvent) {
            this.oRouter.navTo("vehicleDetailCreate");
        },
        onPressVehicleEdit: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.getRouter().navTo("vehicleDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
