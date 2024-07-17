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
    return BaseController.extend("com.lighthouse.other_services.husbandry_service.HusbandryServiceDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("husbandryServiceDetailsEdit").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Husbandry Service");
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
                status: 1,
                vesselCode: "83754W",
                vesselName: "Northern Dexterity",
                shippingLineCode: "HL",
                shippingLineName: "Hapag Lloyd",
                portCodeInput: "SOH",
                portName: "Port Sohar",
                cargoType: 1,
                quotationNo: "13413432",
                blNo: "HLCUALY220338926",
                remarks: "Additional comments",
                services: {
                    mode: "MultiSelect",
                    items: [
                        {
                            id: 23452,
                            serviceType: "Vessel Maintenance",
                            vendor: "Salim Said",
                            startDate: "11-01-2023",
                            quotationNo: "20984",
                            status: "Active"
                        },
                        {
                            id: 23452,
                            serviceType: "Crew Change",
                            vendor: "Visa Agent",
                            startDate: "11-01-2023",
                            quotationNo: "20985",
                            status: "Active",
                        }
                    ]
                },
                charges: {
                    mode: "MultiSelect",
                    items: [
                        {
                            chargeCode: 66331,
                            name: "Vessel Maintenance",
                            unitPrice: "533 OMR",
                            sizeAndType: "40/RH",
                            unit: 1,
                            amount: "533",
                            cost: 500,
                            description: "Vessel Maintenance",
                            status: "Paid"
                        },
                        {
                            chargeCode: 66332,
                            name: "Crew Change",
                            sizeAndType: "40/RH",
                            unitPrice: "533 OMR",
                            unit: 1,
                            amount: "650",
                            cost: 600,
                            description: "Crew Change",
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
            }
            data.charges.items.forEach(e => e.type = "Navigation");
            data.services.items.forEach(e => e.type = "Navigation");
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
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oDialog = await this.onOpenDialog("com.lighthouse.other_services.husbandry_service.fragments.AddCharge");
            oDialog.setTitle("Charge Details")
        },
        onAddService: function () {
            this.getRouter().navTo("serviceDetailsCreate");
        },
        onPressService: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("serviceDetailsEdit", {
                id: rowObj.id
            });
        },
        onCustomerValueHelp: function (oEvent) {
            if (this.dialog == "charge") {
                this.onCloseDialog();
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
        onVesselValueHelp: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.Vessel");
        },
        onShippingLineValueHelp: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.ShippingLine");
        },
        onPortValueHelp: function () {
            this.onOpenDialog("com.lighthouse.master_data.dialog.PortCode");
        }
    });
});
