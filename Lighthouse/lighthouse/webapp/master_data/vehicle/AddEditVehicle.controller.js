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
    return BaseController.extend("com.lighthouse.master_data.vehicle.AddEditVehicle", {
        formatter: Formatter,

        onInit: function () {
            var that = this;

            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("vehicleDetailCreate").attachMatched(this._onRouteCreateMatched, that);
            this.oRouter.getRoute("vehicleDetailEdit").attachMatched(this._onRouteEditMatched, that);

            this.btnEdit = this.byId("btnEdit")
        },
        _onRouteCreateMatched: function (oEvent) {
            this.setTitle("Vehicle");
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            //this._mockData();

            this.getView().setModel(new JSONModel({
                route: this._route,
                item: this._item,
            }));

            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                }),
                "visible"
            );
        },
        _onRouteEditMatched: function (oEvent) {
            this.setTitle("Vehicle");
            this._item = oEvent.getParameter("arguments").id || null;
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
        },
        _mockData: function () {
            let data = {
                route: this._route,
                item: this._item,
                registrationNo: "6775-MH",
                type: 1,
                make: "Mercedes Benz",
                model: "2018",
                remarks: "Additional details",
                fuelDetails: {
                    mode: "MultiSelect",
                    items: [
                        {
                            fuelType: "Diesel",
                            quantity: 100,
                            vendor: "Shell",
                            receiptNo: 24645,
                            receiptDate: "26-04-2023",
                            requestedBy: "Sam",
                            paymentStatus: "Paid"
                        },
                        {
                            fuelType: "Diesel",
                            quantity: 100,
                            vendor: "Shell",
                            receiptNo: 24645,
                            receiptDate: "26-03-2023",
                            requestedBy: "Sam",
                            paymentStatus: "Paid"
                        }
                    ]
                },
                repairAndMaintenance: {
                    mode: "MultiSelect",
                    items: [
                        {
                            serviceType: "Repair",
                            scheduledDrop: "26-04-2023",
                            receiptNo: 94576,
                            receiptDate: "28-04-2023",
                            requestedBy: "Sam",
                            paymentStatus: "Paid",
                            status: "Completed"
                        },
                        {
                            serviceType: "Maintenance",
                            scheduledDrop: "26-04-2023",
                            receiptNo: 75364,
                            receiptDate: "28-04-2023",
                            requestedBy: "Sam",
                            paymentStatus: "Paid",
                            status: "Completed"
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
            data.fuelDetails.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onAddFuel: async function () {
            this.dialog = "Fuel";
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.vehicle.AddFuel");
            oDialog.setTitle("Add Fuel Details");
        },
        onFuelDetails: async function (oEvent) {
            this.dialog = "Fuel";
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.vehicle.AddFuel");
            oDialog.setTitle("Fuel Details");
        },
        onAddRepair: async function () {
            this.dialog = "Repair";
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.vehicle.AddRepairDetails");
            oDialog.setTitle("Add Repair Details");
        },
        onRepairDetails: async function (oEvent) {
            this.dialog = "Repair";
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.vehicle.AddRepairDetails");
            oDialog.setTitle("Repair Details");
        },
        onCustomerValueHelp: async function (oEvent) {
            this.onCloseDialog();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
            if (this.dialog == "Fuel") {
                this.onOpenDialog("com.lighthouse.master_data.vehicle.AddFuel");
            } else if (this.dialog == "Repair") {
                this.onOpenDialog("com.lighthouse.master_data.vehicle.AddRepairDetails");
            } else {
                this.dialog = null;
            }
        },
        onPressCancel: function () {
            if (this._route !== "vehicleDetailCreate") {
                let oEnabled = this.btnEdit.getEnabled();
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
                this.btnEdit.setEnabled(!oEnabled);
            } else {
                this.onNavBack();
            }
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
    });
});
