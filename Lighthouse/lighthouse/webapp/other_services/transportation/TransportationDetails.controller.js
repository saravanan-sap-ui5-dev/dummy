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
    return BaseController.extend("com.lighthouse.other_services.transportation.TransportationDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("transportationDetailEdit").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("tpHeaderTitle"));
            this._item = oEvent.getParameter("arguments").blNo || oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name

            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.btn_Edit.setEnabled(true);
        },
        _mockData: function () {
            let data = {
                route: this._route,
                item: this._item,
                type: 1,
                bookingNo: "64512",
                consigneeCode: "070032",
                consigneeName: "Giffin Comp Associates",
                cargoType: 1,
                quotationNo: "13413432",
                blNo: "HLCUALY220338926",
                remarks: "Additional comments",
                trips: {
                    mode: "MultiSelect",
                    items: [
                        {
                            id: 23452,
                            deliveryNote: "56221",
                            transporter: "Bhacker Haji",
                            vehicleNo: "7325-RS",
                            fromLoc: "Port of Sohar",
                            toLoc: "Al Wadi",
                            date: "11-01-2023"
                        },
                        {
                            id: 23453,
                            deliveryNote: "45354",
                            transporter: "Salim Said",
                            vehicleNo: " ",
                            fromLoc: "Port of Sohar",
                            toLoc: "Al Wadi",
                            date: "12-01-2023"
                        }
                    ]
                },
                charges: {
                    mode: "MultiSelect",
                    items: [
                        {
                            chargeCode: 66331,
                            name: "Transportation 20'",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: "533",
                            cost: 500,
                            status: "Paid"
                        },
                        {
                            chargeCode: 66332,
                            name: "Transportation 40'",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: "650",
                            cost: 600,
                            status: "New"
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
            data.charges.items.forEach(e => e.type = "Navigation");
            data.trips.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                });
            } else {
                this.getView().setModel(
                    new JSONModel({
                        edit: oEnabled,
                        view: !oEnabled,
                    }),
                    "visible"
                );
            }
            if (oEnabled) {
                oSource.setEnabled(false);
            } else {
                oSource.setEnabled(true);
            }
        },
        onPressCancel: function () {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                });
            } else {
                this.getView().setModel(
                    new JSONModel({ edit: oEnabled, view: !oEnabled }),
                    "visible"
                );
            }
            this.btn_Edit.setEnabled(!oEnabled);
        },
        onPressSave: function (oEvent) {
            //this.onNavBack();
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
                this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
            }
        },
    });
});
