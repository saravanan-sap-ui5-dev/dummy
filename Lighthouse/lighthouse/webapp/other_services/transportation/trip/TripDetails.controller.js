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
    return BaseController.extend("com.lighthouse.other_services.transportation.trip.TripDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("tripDetailsEdit").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Trip");
            this._item = oEvent.getParameter("arguments").blNo || oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name;

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
                deliveryNoteNo: "56221",
                ccroNo: "13413234",
                siteFrom: "Port of Sohar",
                siteTo: "Al Wadi Al Kabir",
                transporterCode: "1915",
                transporterName: "Salim Said",
                transportationDate: "11-01-2023",
                status: 1,
                cargoDescription: "Cargo Details",
                vehicleAndDriver: {
                    vehicleCode: "32423-RS",
                    vehicleName: "Trailer",
                    driverCode: "1324",
                    driverName: "Tom",
                    trips: 1,
                    holiday: 1
                },
                containerDetails: {
                    mode: "MultiSelect",
                    items: [
                        {
                            "id": 4721,
                            "containerNo": "CAIU962866",
                            "seal": "948525",
                            "sizeAndType": "40/HC",
                            "st": "F",
                            "fAndL": "F",
                            "cargoWeight": "6000",
                            "tareWeight": "3860",
                            "cbm": "57",
                            "packages": "140",
                            "soc": "Y",
                            "fromTemp": "22",
                            "toTemp": "8",
                            "imcoClass": "2354",
                            "imcoUnno": "568",
                            "oh": "08",
                            "olf": "03",
                            "ola": "07",
                            "owl": "03",
                            "owr": "04"
                        },
                        {
                            "id": 4722,
                            "containerNo": "CAIU962866",
                            "seal": "948525",
                            "sizeAndType": "40/HC",
                            "st": "F",
                            "fAndL": "F",
                            "cargoWeight": "6000",
                            "tareWeight": "3860",
                            "cbm": "57",
                            "packages": "140",
                            "soc": "Y",
                            "fromTemp": "22",
                            "toTemp": "8",
                            "imcoClass": "2354",
                            "imcoUnno": "568",
                            "oh": "08",
                            "olf": "03",
                            "ola": "07",
                            "owl": "03",
                            "owr": "04"
                        }
                    ]
                },
                delayAndAcknowledgement: {
                    receivedBy: "Sam",
                    receivedTime: "26/Apr/2024 12:30PM",
                    emptiedBy: "Sam",
                    emtiedTime: "26/Apr/2024 4:30PM",
                    delayInHours: 1,
                    chargeHour: 2,
                    acknowledgedBy: "Sam",
                    signedAt: "26/Apr/2024 4:30PM",
                    remarks: "Customer comments"
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
                            name: "Detention",
                            unitPrice: "2 OMR",
                            unit: 1,
                            amount: "2",
                            cost: 0,
                            status: "Paid"
                        }
                    ]
                },
                containerItems: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            containerNo: "CSVU7509625",
                            blno: "HLCUALY220338926",
                            id: "29084",
                            size: "40",
                            containerType: "HC",
                            operator: "HL",
                            onHold: "No",
                            soc: "No",
                            movement: "Empty-In",
                            status: "Empty"
                        },
                        {
                            containerNo: "CSVU7509625",
                            blno: "HLCUALY220338926",
                            id: "29085",
                            size: "40",
                            containerType: "HC",
                            operator: "HL",
                            onHold: "No",
                            soc: "No",
                            movement: "Empty-In",
                            status: "Empty"
                        }
                    ]
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
            };
            data.charges.items.forEach(e => e.type = "Navigation");
            data.containerDetails.items.forEach(e => e.type = "Navigation");
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
        onAddCharge: function () {
            this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
        },
        onAddContainer: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddContainer");
        },
        onPressContainer: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
        },
        onPressCharge: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.onOpenDialog("com.lighthouse.other_services.transportation.fragments.AddCharge");
        },
        onCustomerValueHelp: function (oEvent) {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onVehicleValueHelp: function (oEvent) {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Vehicle");
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
        },
    });
});
