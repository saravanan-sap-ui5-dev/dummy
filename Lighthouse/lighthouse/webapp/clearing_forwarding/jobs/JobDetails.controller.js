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
    return BaseController.extend("com.lighthouse.clearing_forwarding.jobs.JobDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("jobDetailEdit").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "JobsMdl");
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("joHeaderTitle"));
            this._item = oEvent.getParameter("arguments").id || null;
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
                service: "",
                shippingLine: "Hapag Lloyd",
                blNo: "HLCUALY220338926",
                quotationNo: "",
                bayanNo: "",
                blType: "Import",
                consigneeCode: "070032",
                consigneeName: "Giffin Comp Associates",
                portOfLoading: "Port of Sohar (SOH)",
                portOfDestination: "Damietta (DME)",
                tsPoL: "Jebel Ali (JEA)",
                remarks: "Additional comments",
                agent: "Tom",
                charges: {
                    mode: "MultiSelect",
                    items: [
                        {
                            chargeCode: 66331,
                            name: "Ocean Freight",
                            sizeAndType: "40/RH",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: 533,
                            cost: 550,
                            status: "Received"
                        }
                    ]
                },
                payments: {
                    mode: "MultiSelect",
                    items: [
                        {
                            chargeCode: 66331,
                            name: "Ocean Freight",
                            vendor: "Hapag Lloyd",
                            sizeAndType: "40/RH",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: 533,
                            cost: 550,
                            status: "Received"
                        }
                    ]
                },
                "cargoDetails": {
                    "cargoWeight": "6000",
                    "tareWeight": "",
                    "cbm": "57",
                    "type": "2",
                    "cargoDescription": "Furniture",
                    "totalPackages": "140",
                    "hsCode": "830242000",
                    "hsCodeDescription": "",
                    "cargoTypeCode": "59",
                    "cargoTypeName": "Iron & Steel finished goods",
                    "Description": "Cereloc, Banana, Orange, Bicuits"
                },
                "containerDetails": {
                    mode: "MultiSelect",
                    items: [
                        {
                            "id": 4721,
                            "containerNo": "CAIU962866",
                            "seal": "948525",
                            "sizeAndType": "40/H",
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
                            "sizeAndType": "40/H",
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
                "communicationDetails": {
                    mode: "None",
                    items: [
                        {
                            "documentId": "12341",
                            "documentName": "Arrival Notice",
                            "createdBy": "Sam",
                            "date": "01/01/2023",
                            "sentTo": "Arabian Traders"
                        },
                        {
                            "documentId": "12346",
                            "documentName": "Bayan updated",
                            "createdBy": "Sam",
                            "date": "03/01/2023",
                            "sentTo": "Sam"
                        }
                    ]
                },
                shippingLine: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            lineName: "Hapag Lloyd",
                            lineCode: "HL",
                            id: 1001,
                            accountCode: "ABC0001",
                            debitNotePrefix: "SHIP"
                        },
                        {
                            lineName: "United Arab Shipping Company",
                            lineCode: "UASC",
                            id: 1002,
                            accountCode: "ABC0002",
                            debitNotePrefix: "SHIP"
                        },
                        {
                            lineName: "Pacific International Lines",
                            lineCode: "PIL",
                            id: 1002,
                            accountCode: "ABC0002",
                            debitNotePrefix: "SHIP"
                        },
                        {
                            lineName: "K-Line",
                            lineCode: "KL",
                            id: 1002,
                            accountCode: "ABC0002",
                            debitNotePrefix: "SHIP"
                        },
                        {
                            lineName: "Shipping Corporation of India",
                            lineCode: "SCI",
                            id: 1002,
                            accountCode: "ABC0002",
                            debitNotePrefix: "SHIP"
                        }
                    ]
                },
                exportItems: {
                    mode: "SingleSelectLeft",
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
                },
                portCode: {
                    mode: "SingleSelectLeft",
                    shippingLineCodes: [],
                    items: [
                        {
                            id: 3423,
                            countryCode: "Port code1",
                            code: "1",
                            name: "Buraimi",
                            customCode: "1232",
                            zoneCode: "zone1",
                            zoneName: "zonename1",
                            postalCode: "postal 123",
                            ETADays: "1days",
                            shippingLine: "SCI",
                            portCode: "BUR"
                        },
                        {
                            id: 3424,
                            countryCode: "Port code2",
                            code: "2",
                            name: "Suwaiq",
                            customCode: "1233",
                            zoneCode: "zone2",
                            zoneName: "zonename2",
                            postalCode: "postal 321",
                            ETADays: "2days",
                            shippingLine: "Hypaycloyd",
                            portCode: "SUW"
                        },
                        {
                            id: 3425,
                            countryCode: "Port code2",
                            code: "3",
                            name: "Sur",
                            customCode: "1234",
                            zoneCode: "zone2",
                            zoneName: "zonename2",
                            postalCode: "postal 321",
                            ETADays: "2days",
                            shippingLine: "Hypaycloyd",
                            portCode: "SUR"
                        },
                        {
                            id: 3426,
                            countryCode: "Port code2",
                            code: "4",
                            name: "Port Sultan Qaboos",
                            customCode: "1235",
                            zoneCode: "zone2",
                            zoneName: "zonename2",
                            postalCode: "postal 321",
                            ETADays: "2days",
                            shippingLine: "Hypaycloyd",
                            portCode: "PSQ"
                        },
                        {
                            id: 3427,
                            countryCode: "Port code2",
                            code: "5",
                            name: "Port Sohar",
                            customCode: "1236",
                            zoneCode: "zone2",
                            zoneName: "zonename2",
                            postalCode: "postal 321",
                            ETADays: "2days",
                            shippingLine: "Hypaycloyd",
                            portCode: "SOH"
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
                cargoType: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            id: 1234,
                            Name: "Motor cars",
                            Code: "ABC0001",
                            Description: "Description"
                        },
                        {
                            id: 1334,
                            Name: "Vacuum pumps",
                            Code: "ABC0002",
                            Description: "Description"
                        },
                        {
                            id: 1434,
                            Name: "Wheat and meslin",
                            Code: "ABC0003",
                            Description: "Description"
                        },
                        {

                            id: 1534,
                            Name: "Electrical equipments",
                            Code: "ABC0004",
                            Description: "Description"
                        }
                    ]
                },
                hsCode: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            id: 2434,
                            name: "Acetone",
                            hsCode: "8703.23",
                            description: "Product",
                        },
                        {
                            id: 2435,
                            name: "Paint related material",
                            hsCode: "8413.91",
                            description: "Product",
                        }, {
                            id: 2436,
                            name: "Aerosols",
                            hsCode: "6203.42",
                            description: "Product",
                        }, {
                            id: 2437,
                            name: "Environmentally Hazardous Substance, Liquid, N.O.S. (Not Otherwise Specified)",
                            hsCode: "1001.19",
                            description: "Product",
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
            };
            data.containerDetails.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onAddCharge: function () {
            this.onOpenDialog("com.lighthouse.clearing_forwarding.jobs.fragments.AddCharge");
        },
        onAddPayments: function () {
            this.onOpenDialog("com.lighthouse.clearing_forwarding.jobs.fragments.AddPayments");
        },
        onPressShippingLine: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.ShippingLine");
        },
        onPressPortCode: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.PortCode");
        },
        onPressPortCodeCreate: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.CreatePortCode");
        },
        onSavePortCodeDetail: function () {
            this.onCloseDialog();
        },
        onPressPortCodeEdit: function () {
            this.onCloseDialog();
        },
        onClosePortCodeDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.PortCode");
        },
        onCustomerValueHelp: async function (oEvent) {
            this.onCloseDialog();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onAddBLView: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddBLView");
        },
        onPressHSCode: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.HSCode");
        },
        onPressCargoType: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.CargoType");
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
        },
        onPressAddContainerItem: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddContainer");
        },
        onPressContainerItem: function (oEvent) {
            var rowObj = oEvent.getSource().getBindingContext().getObject();
            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
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
            //if (this._route !== "create-property-object-hierarchy") {
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
            //this.errorPopoverParams("basic");
        },
    });
});
