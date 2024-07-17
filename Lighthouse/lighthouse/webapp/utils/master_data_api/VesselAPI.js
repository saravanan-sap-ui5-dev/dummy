sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/ErrorMessage",
    "com/lighthouse/utils/URLConstants",
    "sap/ui/core/routing/History",
    "com/lighthouse/Component"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, ErrorMessage, URLConstants, History, Component) {
    "use strict";
    return {
        baseControllerFunctions: function (masterData, pageId) {
            this.masterData = masterData;
            this.pageId = pageId;
        },

        loadIds: function (isCreate, tableId, noDataId, addShippingLineId, formId, eMdl, pageId) {
            if (isCreate) {
                this._tableId = tableId;
                this._vessel_noData = noDataId;
            }
            else {
                this._vessel_btnAddShippingLine = addShippingLineId;
                this._vessel_formId = formId;
                this.eMdl = eMdl;
                this.pageId = pageId;
            }
        },
        onAfterRendering: function (oModel) {
            let recordCount = oModel.getData().masterScreenTable.items[0].recordCount;
            let count = oModel.getData().masterScreenTable.items.length >= recordCount;//oModel.getData().advancedFilter.pageSize > recordCount;
            //oModel.getData().advancedFilter.pageSize += URLConstants.Paging.page_size;
            if (!count) {
                oModel.getData().advancedFilter.pageNumber += 1;
                oModel.refresh(true);
                // that.fetchVessel(oModel);
                // You've reached the bottom or are very close to it
                console.log("Reached the bottom of the scroll container.");
                return true;
            }
            else{
                return false;
            }
        },

        fetchVessel: async function (oModel) {
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.pageNumber = 1;
                    oModel.getData().masterScreenTable.items = [];
                }
                let exItems = oModel.getData().masterScreenTable.items;
                this._tableId.setBusy(true);
                this._tableId.setBusyIndicatorDelay(10);
                let request = oModel.getData().advancedFilter;
                request.shippingLineIdCollection = request.shippingLineColl?.toString();
                request.statuses = request.statusColl?.toString();
                let path = URLConstants.URL.vessel_all;
                let vesselRes = await BaseController.prototype.restMethodPost(path, request);
                if (vesselRes.length > 0) {
                    vesselRes.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                    });
                }
                if (!(vesselRes.length > 0)) {
                    this._vessel_noData.setText(
                        "No data found. Try adjusting the search or filter criteria."
                    );
                } else {
                    this._vessel_noData.setText(
                        'To start, set the relevant filters and choose "Go".'
                    );
                }
                if (exItems.length > 0) {
                    oModel.getData().masterScreenTable.items = [...exItems, ...vesselRes];
                } else {
                    oModel.getData().masterScreenTable.items = vesselRes;
                }
                oModel.getData().selections.isSortSelected = false;
                this._tableId.setBusy(false);
            } catch (error) {
                this._tableId.setBusy(false);
                BaseController.prototype.errorHandling(error);
            }
        },

        /* fetchMinShippingLine */
        fetchMinShippingLine: async function (oModel) {
            try {
                // this.shippingLineId.setBusy(true);
                let path = URLConstants.URL.min_shipping_line;
                let shippingLine = await BaseController.prototype.restMethodGet(path);
                return shippingLine;
                // this.shippingLineId.setBusy(false);
            } catch (error) {
                // this.shippingLineId.setBusy(false);
                BaseController.prototype.errorHandling(error);
            }
        },
        onAddShippingLineCode: function (oModel) {
            let oData = oModel.getData();
            let eShippingLineCode = {
                shippingLineId: null,
                vesselCode: null,
            };
            if (oData.vesselDetails.items.length > 0) {
                oData.vesselDetails.items.push(eShippingLineCode);
            } else {
                oData.vesselDetails.items = [eShippingLineCode];
            }
            oModel.refresh(true);

            this._vessel_btnAddShippingLine.setEnabled(false);
        },
        onDeleteShippingLineCode: function (oModel, oEvent) {
            this.compareObj;
            let oData = oModel.getData();
            let getBindingContext = oEvent.getParameter("listItem").getBindingContext();
            let selObject = getBindingContext.getObject(); //Get selected Object
            if (selObject.id) {
                if (!selObject.shippingLineId || !selObject.vesselCode) { // If user deletes existing erased data needs to maintain the data and change status to inactive. 
                    selObject = this.compareObj.vesselDetails.find(e => e.id === selObject.id);
                }
                selObject.status = 3;
                oData.vesselDetails.removedData.push(selObject);
            }
            let sPath = getBindingContext.getPath().split('/')[3];
            oData.vesselDetails.items.splice(sPath, 1);
            oData.vesselDetails.items.length > 1 ? this.onChangeShippingLine(oModel) : this._vessel_btnAddShippingLine.setEnabled(true);
            oModel.refresh(true);
        },
        onChangeShippingLine: function (oModel, oEvent) {
            let vesselCode, getValue, getSelectedObj;
            if (oEvent) {
                vesselCode = oEvent.getSource().getId().includes("vesselCode");   //To Get value only when selected from vesselCode input field.
                getValue = oEvent.getSource().getValue();
                getSelectedObj = oEvent.getSource().getBindingContext().getObject();
            }
            let modelData = oModel.getData().vesselDetails.items;
            if (vesselCode) getSelectedObj.vesselCode = getValue; //To update liveChange value to the model.
            for (let i = 0; i < modelData.length > 0; i++) {
                if (modelData[i].shippingLineId) modelData[i].shippingLineValueState = 'None';
                if (modelData[i].vesselCode) modelData[i].vesselCodeValueState = 'None';
                if (modelData[i].shippingLineId && modelData[i].vesselCode) {
                    this._vessel_btnAddShippingLine.setEnabled(true);
                }
                else {
                    this._vessel_btnAddShippingLine.setEnabled(false);
                    break;
                }
            }
        },
        tableValidation: function (oModel) {
            let flag = true;
            let tableData = oModel.getData().vesselDetails.items;
            tableData.map(e => {
                e.shippingLineValueState = 'None';
                e.vesselCodeValueState = 'None';
                if (!e.shippingLineId) {
                    e.shippingLineValueState = 'Error';
                    e.shippingLineValueStateText = 'Please select the Shipping Line field';
                    flag = false;
                }
                else {
                    e.shippingLineValueState = 'None';
                }
                if (!e.vesselCode) {
                    e.vesselCodeValueState = 'Error';
                    e.vesselCodeValueStateText = 'Please fill the Vessel Code field';
                    flag = false;
                }
                else {
                    e.vesselCodeValueState = 'None';
                }
            });
            oModel.refresh(true);
            return flag;
        },
        postVessel: async function (oModel) {
            let oModelData = oModel.getData();
            if (this.tableValidation(oModel)) {
                oModelData.vesselDetails.items.map(e => { if (!e.id) e.status = 2; });
                let mergeVesselDetails = [...oModelData.vesselDetails.items, ...oModelData.vesselDetails.removedData]; //Merge active and inactive records.
                let postData = { ...oModelData.vesselGeneral, vesselDetails: mergeVesselDetails };
                let path = URLConstants.URL.vessel_add;
                let postRes = await BaseController.prototype.restMethodPost(path, Array.of(postData));
                return true;
            }
        },
        showMasterScreenMessage: function () {
            let that = this;
            let msg = BaseController.prototype.getResourceProperty("veSavedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    let oModel = that.getView().getModel();
                    let modelData = that.emptyModelData();
                    oModel.getData().vesselGeneral = modelData.vesselGeneral;
                    oModel.getData().vesselDetails = modelData.vesselDetails;
                    oModel.refresh(true);
                },
            });
        },
        sheetDetails: function () {
            let obj = {
                columns: [
                    {
                        label: 'ID',
                        property: 'id',
                        visible: true
                    },
                    {
                        label: 'Name',
                        property: 'name',
                        visible: true
                    },
                    {
                        label: 'Call Sign',
                        property: 'callSign',
                        visible: true
                    },
                    {
                        label: "Shipping Line",
                        property: 'shippingLineName',
                        visible: true
                    },
                    {
                        label: "IMO",
                        property: 'imo',
                        visible: true
                    },
                    {
                        label: "Nationality",
                        property: 'nationality',
                        visible: false
                    },
                    {
                        label: 'Status',
                        property: 'status',
                        visible: true
                    },
                    {
                        label: 'Created By',
                        property: 'createdBy',
                        visible: false
                    },
                    {
                        label: 'Created On',
                        property: 'createdOn',
                        visible: false
                    },
                    {
                        label: 'Updated By',
                        property: 'updatedBy',
                        visible: false
                    },
                    {
                        label: 'Updated On',
                        property: 'updatedOn',
                        visible: false
                    }
                ]
            };
            return obj;
        },
    };
});