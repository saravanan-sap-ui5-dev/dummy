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
    return BaseController.extend("com.lighthouse.liner_services.import.CreateImports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("importsDetailCreate").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "ImportsMdl");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("imHeaderTitle"));
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
                shippingLine: {
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
                vessel: {
                    shippingLineCodes: [],
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            code: "2344",
                            name: "Northern Dexterity",
                            shippingLine: "HL",
                            callSign: "75433",
                            imo: "24525",
                            status: "Active"
                        },
                        {
                            name: "Berlin Express",
                            shippingLine: "HL",
                            code: "2345",
                            callSign: "234345",
                            imo: "23424",
                            status: "Active"

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
                            HSCode: "8703.23",
                            ProductDescription: "Product",
                        },
                        {
                            id: 2435,
                            name: "Paint related material",
                            HSCode: "8413.91",
                            ProductDescription: "Product",
                        }, {
                            id: 2436,
                            name: "Aerosols",
                            HSCode: "6203.42",
                            ProductDescription: "Product",
                        }, {
                            id: 2437,
                            name: "Environmentally Hazardous Substance, Liquid, N.O.S. (Not Otherwise Specified)",
                            HSCode: "1001.19",
                            ProductDescription: "Product",
                        }
                    ]
                },
                voyage: {
                    mode: "SingleSelectLeft",
                    items: [
                        {
                            voyageIndex: 18756,
                            voyage: 5468,
                            shippingLine: "HL",
                            vesselIndex: 22547,
                            vesselName: "Northern Dexterity",
                            vesselETA: "11-Aug-2022 9:35",
                            vesselETS: "13-Aug-2022 19:35",
                            callPort: "Buraimi",
                            status: "Active"
                        },
                        {
                            voyageIndex: 18757,
                            voyage: 4895,
                            shippingLine: "HL",
                            vesselIndex: 22548,
                            vesselName: "Northern Dexterity",
                            vesselETA: "11-Oct-2022 9:35",
                            vesselETS: "13-Oct-2022 19:35",
                            callPort: "Salalah",
                            status: "Inactive"
                        },
                        {
                            voyageIndex: 18758,
                            voyage: 4968,
                            shippingLine: "HL",
                            vesselIndex: 22548,
                            vesselName: "Northern Dexterity",
                            vesselETA: "11-Nov-2022 9:35",
                            vesselETS: "13-Nov-2022 19:35",
                            callPort: "Sur",
                            status: "Draft"
                        },
                        {
                            voyageIndex: 18759,
                            voyage: 6459,
                            shippingLine: "HL",
                            vesselIndex: 22548,
                            vesselName: "Northern Dexterity",
                            vesselETA: "11-Dec-2022 9:35",
                            vesselETS: "13-Dec-2022 19:35",
                            callPort: "Muscat",
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

            this.getView().setModel(new JSONModel(data));
        },
        onPressAddItem: function () {
            let obj = {
                type: null,
                code: null,
                name: null,
                city: null,
                postalCode: null,
                country: null
            };
            let oModel = this.getView().getModel("ImportsMdl");
            oModel.getData().consignee.push(obj);
            oModel.getData().consigneeCount = oModel.getData().consignee.length;
            oModel.refresh();
        },
        onPressDeleteItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().consignee;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().consigneeCount = oModel.getData().consignee.length;
            oModel.refresh();
        },

        onPressAddContainerItem: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.AddContainer");
        },
        onPressDeleteContainerItem: function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel("ImportsMdl");
            let listItems = oModel.getData().containerDetails;
            let selIndex = oEvent.getParameter("listItem").getBindingContext("ImportsMdl").getPath().split("/")[2];
            listItems.splice(selIndex, 1);
            oModel.getData().containerCount = oModel.getData().containerDetails.length;
            oModel.refresh();
        },
        onHandleActions: function (oEvent) {
            var oButton = oEvent.getSource();
            this.byId("actionSheet").openBy(oButton);
        },
        onAddParty: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddParty");
        },
        onSubmitParty: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.Customer");
        },
        onSelectCustomer: function () {
            this.onCloseDialog();
        },
        onCloseCustomerDialog: function () {
            this.onCloseDialog();
            //this.onOpenDialog("com.lighthouse.liner_services.dialog.AddParty");
        },
        onAddCharge: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.AddCharge");
        },
        onAddDeposit: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.AddDeposit");
        },
        onAddReceipt: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.AddReceipt");
        },
        onAddRefund: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.AddRefund");
        },
        onHandleDORevalidation: function () {
            this.onOpenDialog("com.lighthouse.liner_services.import.fragments.DORevalidation");
        },
        onPressCancel: function () {
            this.onNavBack();
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

        onPressVessel: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Vessel");
        },
        onPressVesselCreate: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.CreateVessel");
        },
        onPressVesselEdit: function (oEvent) {
            this.onCloseDialog();
        },
        onSaveVesselDetail: function () {
            this.onCloseDialog();
        },
        onCloseVesselDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.Vessel");
        },

        onPressShippingLine: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.ShippingLine");
        },
        onPressShippingLineCreate: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.CreateShippingLine");
        },
        onPressShippingLineEdit: function (oEvent) {
            this.onCloseDialog();
        },
        onCloseShippingLineDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog("com.lighthouse.master_data.dialog.ShippingLine");
        },
        onSaveShippingLineDetail: function () {
            this.onCloseDialog();
        },
        onPressHSCode: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.HSCode");
        },
        onPressCargoType: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.CargoType");
        },
        onPressVoyage: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.Voyage");
        },
        onPressSave: function (oEvent) {
            //this.onNavBack();
        },
        onAddShippingLineCode: function (oEvent) {
            let oModel = this.getView().getModel("VesselMdl");
            let oData = oModel.getData();
            let eShippingLineCode = {
                shippingLine: null,
                vesselCode: null
            };
            if (oData.shippingLineCodes.length > 0) {
                oData.shippingLineCodes.push(eShippingLineCode);
            } else {
                oData.shippingLineCodes = [eShippingLineCode];
            }
            oModel.refresh(true);
        },
        onDeleteShippingLineCode: function (oEvent) {
            let oModel = this.getView().getModel("VesselMdl");
            let oData = oModel.getData();
            let sPath = oEvent.getParameter('listItem').getBindingContext('VesselMdl').getPath().split('/')[2];
            oData.shippingLineCodes.splice(sPath, 1);
            oModel.refresh(true);
        },
        onPressContainerItem: function (oEvent) {
            var rowObj = oEvent.getParameter('row').getBindingContext().getObject();
            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
