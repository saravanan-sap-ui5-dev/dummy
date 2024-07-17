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
    return BaseController.extend("com.lighthouse.liner_services.transshipment.TransshipmentDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("transshipmentDetailEdit").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("tsHeaderTitle"));
            this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
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
            this.btn_Edit.setEnabled(true);
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
                    items: [
                        {
                            id: "33123",
                            blNumber: "HLCAULY220327101",
                            shipper: "Al Ameen",
                            consignee: "Arabian Island & Sons",
                            fclAndLcl: "FCL",
                            pol: "DME",
                            pod: "SOH",
                            status: "Active"
                        },
                        {
                            id: "33124",
                            blNumber: "HLCAULY220327101",
                            shipper: "Al Ameen",
                            consignee: "Arabian Island & Sons",
                            fclAndLcl: "FCL",
                            pol: "DME",
                            pod: "SOH",
                            status: "Active"
                        }
                    ]
                },
                "exports": {
                    blView: true,
                    items: [
                        {
                            id: "23123",
                            blNumber: "HLCAULY220327101",
                            shipper: "Al Ameen",
                            consignee: "Arabian Island & Sons",
                            fclAndLcl: "FCL",
                            pod: "DME",
                            pol: "SOH",
                            status: "Active"
                        },
                        {
                            id: "23124",
                            blNumber: "HLCAULY220327101",
                            shipper: "Al Ameen",
                            consignee: "Arabian Island & Sons",
                            fclAndLcl: "FCL",
                            pod: "DME",
                            pol: "SOH",
                            status: "Active"
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
                    items: [
                        {
                            containerNo: "CSVU75096252",
                            blno: "HLCUALY220338926",
                            id: "29084",
                            size: "40",
                            type: "HC",
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
                            type: "HC",
                            operator: "HL",
                            onHold: "No",
                            soc: "No",
                            movement: "Empty-In",
                            status: "Empty"
                        }
                    ]
                },
                loadContainers: {
                    containerView: false,
                    create: false,
                    add: true,
                    remove: true,
                    items: [
                        {
                            containerNo: "CSVU7509625",
                            blno: "HLCUALY220338926",
                            id: "29084",
                            size: "40",
                            type: "HC",
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
                            type: "HC",
                            operator: "HL",
                            onHold: "No",
                            soc: "No",
                            movement: "Empty-In",
                            status: "Empty"
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
        onHandleActions: function (oEvent) {
            var oButton = oEvent.getSource();
            this.byId("actionSheet").openBy(oButton);
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
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let data = vModel.getData();
                data.edit = oEnabled;
                data.view = !oEnabled;
            }
            if (oEnabled) {
                oSource.setEnabled(false);
            } else {
                oSource.setEnabled(true);
            }
            vModel.refresh(true);
        },
        onPressCancel: function () {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let data = vModel.getData();
                data.edit = oEnabled;
                data.view = !oEnabled;
            }
            this.btn_Edit.setEnabled(!oEnabled);
            vModel.refresh(true);
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
