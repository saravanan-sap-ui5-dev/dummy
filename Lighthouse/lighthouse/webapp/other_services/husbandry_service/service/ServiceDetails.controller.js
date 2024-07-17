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
    return BaseController.extend("com.lighthouse.other_services.husbandry_service.service.ServiceDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("serviceDetailsEdit").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Service");
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
            this.btn_Edit.setEnabled(true);
        },
        _mockData: function () {
            let data = {
                route: this._route,
                item: this._item,
                serviceType: 2,
                quotationNo: "56221",
                vendorCode: "32452",
                vendorName: "Sam",
                startDate: "11-01-2023",
                completedDate: "11-02-2023",
                serviceDescription: "Service Details",
                remarks: "Additional details",
                charges: {
                    mode: "MultiSelect",
                    items: [
                        {
                            chargeCode: 66331,
                            name: "Ocean Freight",
                            sizeAndType: "40/RH",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: "533",
                            cost: 500,
                            description: "Ocean Freight",
                            status: "Received"
                        },
                        {
                            chargeCode: 66332,
                            name: "Ocean Freight",
                            sizeAndType: "40/RH",
                            unitPrice: "2 OMR",
                            unit: 1,
                            amount: "533",
                            description: "Ocean Freight",
                            cost: 500,
                            status: "Invoiced"
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
    });
});
