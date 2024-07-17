sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/libs/Sheet",
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox,library, Core, Formatter,URLConstants, Sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.import.ManageImports", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageImports").attachMatched(this._onRouteMatched, this);
            let getSource = (id => this.byId(id));
            [this._tableId, this._pageId, this._filterBar,this._noData] = [getSource("table_Imports"), getSource("page_Imports"), getSource("imFilterBar"), getSource("txt_noData")];
            this._defaultAFOption = [
                { ID: true },
                { "B/L Number": true },
                { "Shipment No": true },
                { "Shipping Line": true },
                { "Voyage": true },
                { "Vessel Name": true },
                { "Vessel ETA": true },
                { "Port of Destination": true },
                { "Vessel ETA": true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
                { "Status": true },
            ];

            this.masterData = this.getStorage("master_data");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("imHeaderTitle"));
            this.setColulmnsIntoModel(); //column model for export and column personalization

            this.errorPopoverParams();
            this.initFunctionalities();
            let settingMdl = this.getModel("settings");//Empty the route property in the settings model
            settingMdl.getData().route = null;
            settingMdl.refresh();

            this._tableId.getBinding("items").sort(); //Sort reset
            // this._mockData();
        },
        initFunctionalities: function () {
            let that = this;
            let oHistory = History.getInstance();
            let sDirection = oHistory.getDirection();
            let oModel = this.getView().getModel();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            let fData = oModel.getData().advancedFilter;
            let exFilter = oSettingMdl.getData().filter;
            let sortingKey = this.getStorage("SORTING_KEY");
            let prevHash = oHistory.aHistory[oHistory.aHistory.length - 1];
            let isRelatedHash = prevHash.includes("importsDetailCreate") || prevHash.includes("importsDetailEdit");
            if (!isRelatedHash) {
                oSettingMdl.getData().filter = null; //Erase the existing filter data when the previous hash is not related to master hash
                oSettingMdl.refresh(true);
                this.resetPersoDialog(); //Column reset
                this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))
                this.sortDialog?.setSortDescending(true);
                this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
                this.groupDialog?.setSelectedGroupItem(null);
                this.handleTablePersoDialogConfirm();
            }
            if (sDirection.includes("Backwards") || sortingKey) {
                //Get Direction to change the model data
                setTimeout(() => {    //To retain grouping and sorting settings
                    if (this.lastselected == "sort") {
                        that.groupDialog?.fireConfirm();
                        that.sortDialog?.fireConfirm();
                    }
                    if (this.lastselected == "Group") {
                        that.sortDialog?.fireConfirm();
                        that.groupDialog?.fireConfirm();
                    }

                }, 1000)
                if (sortingKey) {
                    oModel.getData().sortingKey = this.getStorage("SORTING_KEY");
                } else {
                    if (exFilter) {
                        oModel.getData().sortingKey = exFilter.sortingKey;
                    }
                }
                if (exFilter) {
                    [
                        fData.id,
                        fData.blNumber,
                        fData.shipmentNumber,
                        fData.shippingLine,
                        fData.vesselName,
                        fData.vesselETAStart,
                        fData.vesselETAEnd,
                        fData.portOfDestination,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                        exFilter.id,
                        exFilter.blNumber,
                        exFilter.shipmentNumber,
                        exFilter.shippingLine,
                        exFilter.vesselName,
                        exFilter.vesselETAStart,
                        exFilter.vesselETAEnd,
                        exFilter.portOfDestination,
                        exFilter.createdOnStart,
                        exFilter.createdOnEnd,
                        exFilter.updatedOnStart,
                        exFilter.updatedOnEnd,
                        exFilter.statusColl,
                        ]; //retaining existing search
                }
                oModel.refresh(true);

                this.setStorage("SORTING_KEY", null); //clear sorting key
            } else {
                oSettingMdl.getData().visible_filter = this._defaultAFOption;
                this.setModel();
                oModel.getData().sortingKey = "id";
                this._noData.setText(
                    'To start, set the relevant filters and choose "Go".'
                );
            }
            oSettingMdl.refresh(true);
            this.setVisbleFilterFields();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 2344,
                        voyageIndex: 18756,
                        shipmentNo: 79887,
                        shippingLine: "HL",
                        blNo: 22547,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Aug-2022 9:35",
                        vesselETS: "13-Aug-2022 19:35",
                        pod: "SOH",
                        status: 0
                    },
                    {
                        id: 2345,
                        voyageIndex: 18757,
                        shipmentNo: 79888,
                        shippingLine: "HL",
                        blNo: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Sep-2022 9:35",
                        vesselETS: "13-Sep-2022 19:35",
                        pod: "SLL",
                        status: 1
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("importsDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("importsDetailEdit", {
                id: rowObj.blNo
            });
        }
    });
});
