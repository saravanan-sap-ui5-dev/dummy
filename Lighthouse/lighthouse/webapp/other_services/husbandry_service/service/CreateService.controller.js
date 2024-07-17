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
    return BaseController.extend("com.lighthouse.other_services.husbandry_service.service.CreateService", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("serviceDetailsCreate").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Service");
            this._item = oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name
            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                }),
                "visible"
            );
        },
        _mockData: function () {
            let data = {
                route: this._route,
                item: this._item,
                partyDetails: {
                    mode: "MultiSelect",
                    items: []
                },
                cargoDetails: {},
                containerDetails: {
                    mode: "MultiSelect",
                    items: []
                },
                chargesDetails: {
                    mode: "MultiSelect",
                    items: []
                },
                depositDetails: {
                    mode: "None",
                    items: []
                },
                receiptDetails: {
                    mode: "None",
                    items: []
                },
                refundDetails: {
                    mode: "None",
                    items: []
                },
                communicationDetails: {
                    mode: "None",
                    items: []
                },
                vehicle: {
                    mode: "SingleSelectLeft",
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
                },
                customer: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            name: "Oman Sales & Service",
                            id: "234563",
                            shortName: "Oman Sales",
                            city: "Muscat",
                            country: "Oman",
                            status: "Active"
                        },
                        {
                            name: "Arabian Island Sons ",
                            id: "234524",
                            shortName: "Arabian Island",
                            city: "Abu Dhabi",
                            country: "UAE",
                            status: "Active"
                        },
                    ]
                }
            }

            this.getView().setModel(new JSONModel(data))
        },
        onAddCharge: async function () {
            this.dialog = "charge"
            let oDialog = await this.onOpenDialog("com.lighthouse.other_services.husbandry_service.fragments.AddCharge");
            oDialog.setTitle("Add Charge");
        },
        onPressCharge: async function (oEvent) {
            this.dialog = "charge"
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oDialog = await this.onOpenDialog("com.lighthouse.other_services.husbandry_service.fragments.AddCharge");
            oDialog.setTitle("Charge Details");
        },
        onCustomerValueHelp: function (oEvent) {
            if (this.dialog == "charge") {
                this.onCloseDialog();
            } else {
                this.dialog = null;
            }
            this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
            if (this.dialog == "charge") {
                this.dialog = null;
                this.onOpenDialog("com.lighthouse.other_services.husbandry_service.fragments.AddCharge");
            }
        },
        onPressCancel: function () {
            this.onNavBack();
        },
    });
});
