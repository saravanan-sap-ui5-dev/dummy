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
    return BaseController.extend("com.lighthouse.liner_services.transshipment.CreateTransshipment", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("transshipmentDetailCreate").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "TransshipmentMdl");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("tsHeaderTitle"));
            this._item = oEvent.getParameter("arguments").blNo || null;
            this._route = oEvent.getParameter("config").name;
            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                    blView: true,
                    containerView: false,
                    dischargeKey: 1,
                    loadKey: 1,
                    dischargeView: {
                        blView: true,
                        containerView: false
                    },
                    loadView: {
                        blView: true,
                        containerView: false
                    }
                }),
                "visible"
            );
        },
        _mockData: function () {
            let data = {
                route: this._route, item: this._item,
                "blno": "HLCUALY220338926",
                "shippingLine": "Hapag Lloyd",
                "shipmentNo": "39668836",
                "seawayBill": "1",
                "feederVesselId": "32413",
                "feederVesselName": "Montpellier/009",
                "exVesselId": "64254",
                "exVesselName": "OOCL Memphis/070E",
                "portOfLoading": "Damietta (DME)",
                "portOfDischarge": "Port Sohar (SOH)",
                "fclAndLcl": "1",
                "deliveryType": "1",
                "transhipmentPort": "Jebel Ali (JEA)",
                "placeOfReceipt": "Port Sohar (SOH)",
                "thdPrepaid": "1",
                "status": "2",
                "imports": {
                    blView: true,
                    items: []
                },
                "exports": {
                    blView: true,
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
                dischargeContainers: {
                    containerView: false,
                    create: true,
                    add: false,
                    remove: false,
                    items: []
                },
                loadContainers: {
                    containerView: false,
                    create: false,
                    add: true,
                    remove: true,
                    items: []
                },
                portCode: {
                    mode: "SingleSelectLeft",
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
                        }]
                },
                vessel: {
                    mode: "SingleSelectLeft",
                    shippingLineCodes: [],
                    items: [
                        {
                            code: "2344",
                            name: "Northern Dexterity",
                            shippingLine: "HL",
                            imo: "75433",
                            callSign: "24525",
                            status: "Active"
                        },
                        {
                            code: "2345",
                            name: "Berlin Express",
                            shippingLine: "HL",
                            imo: "234345",
                            callSign: "23424",
                            status: "Active"

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
                "changeLog": [
                    {
                        slNo: "1",
                        sectionName: "Basic Details",
                        modifiedBy: "John Doe",
                        modifiedOn: "22-07-2023",
                    }
                ]
            };
            this.getView().setModel(new JSONModel(data));
        },
        onChangeView: function (oEvent) {
            let oSource = oEvent.getSource();
            let selKey = oSource.getSelectedKey() || 1;
            let keyPath = oSource.getBinding('selectedKey').getPath();
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let blView = selKey == 1 ? true : false;
            let containerView = selKey == 2 ? true : false;

            if (keyPath.includes("dischargeKey")) {
                oData.dischargeContainers.containerView = containerView;
                oData.imports.blView = blView;
            } else if (keyPath.includes("loadKey")) {
                oModel.getData().loadContainers.containerView = containerView;
                oModel.getData().exports.blView = blView;
            }
            oModel.refresh(true);
        },
        onUploadManifest: function (oEvent) {
            //this.oRouter.navTo('uploadManifest')
            this.onOpenDialog("com.lighthouse.liner_services.dialog.UploadManifest");
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
        onNavExportCreate: function () {
            this.oRouter.navTo("exportsDetailCreate");
        },
        onNavImportCreate: function () {
            this.oRouter.navTo("importsDetailCreate");
        },
        onNavContainerCreate: function () {
            this.oRouter.navTo("containerInUseDetailCreate");
        },
        onContainerDetails: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("TransshipmentMdl");
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
        },
        onImportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("TransshipmentMdl");
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("importsDetailEdit", {
                id: rowObj.id
            });
        },
        onExportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("TransshipmentMdl");
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("exportsDetailEdit", {
                id: rowObj.id
            });
        },
        onAddContainer: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddContainer");
        },
        onAddBLView: function () {
            this.onOpenDialog("com.lighthouse.liner_services.dialog.AddBLView");
        },
    });
});
