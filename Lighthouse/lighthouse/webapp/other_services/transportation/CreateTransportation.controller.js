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
    return BaseController.extend("com.lighthouse.other_services.transportation.CreateTransportation", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("importsDetailCreate").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "ImportsMdl");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("tpHeaderTitle"));
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
                },
                trips: {
                    mode: "MultiSelect",
                    items: []
                },
                charges: {
                    mode: "MultiSelect",
                    items: []
                },
            }

            this.getView().setModel(new JSONModel(data))
        },
        onAddCharge: async function () {
            this.dialog = "charge"
            let oDialog = await this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
            oDialog.setTitle("Add Charge");
        },
        onAddTrip: function () {
            this.getRouter().navTo("tripDetailsCreate");
        },
        onPressTrip: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("tripDetailsEdit", {
                id: rowObj.id
            });
        },
        onPressCharge: async function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oDialog = await this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
            oDialog.setTitle("Charge Details")
        },
        onCustomerValueHelp: function (oEvent) {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
            if (this.dialog == "charge") {
                this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
                this.dialog = null;
            }
        },
        onPressCancel: function () {
            this.onNavBack();
        }
    });
});
