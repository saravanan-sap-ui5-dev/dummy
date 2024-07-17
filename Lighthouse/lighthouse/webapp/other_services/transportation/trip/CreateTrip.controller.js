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
    return BaseController.extend("com.lighthouse.other_services.transportation.trip.CreateTrip", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("tripDetailsCreate").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Trip");
            this._item = oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name;
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
            };

            this.getView().setModel(new JSONModel(data));
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
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
        },
        onVehicleValueHelp: function (oEvent) {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Vehicle");
        },
        onPressCancel: function () {
            this.onNavBack();
        },
    });
});
