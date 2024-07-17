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

        loadIds: function (isCreate, tableId, noDataId, formId, eMdl, pageId) {
            if (isCreate) {
                this._tableId = tableId;
                this._cpc_noData = noDataId;
            }
            else {
                this._cpc_formId = formId;
                this.eMdl = eMdl;
                this.pageId = pageId;
            }
        },
        onAfterRendering: function (oModel) {
            let recordCount = oModel.getData().masterScreenTable.items[0].recordCount;
            let count = oModel.getData().masterScreenTable.items.length >= recordCount;
            if (!count) {
                oModel.getData().advancedFilter.pageNumber += 1;
                oModel.refresh(true);
                console.log("Reached the bottom of the scroll Customs Package Code.");
                return true;
            }
            else{
                return false;
            }
        },

        fetchCustomsPackageCode: async function (oModel) {
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.pageNumber = 1;
                    oModel.getData().masterScreenTable.items = [];
                }
                let exItems = oModel.getData().masterScreenTable.items;
                this._tableId.setBusy(true);
                this._tableId.setBusyIndicatorDelay(10);
                let request = oModel.getData().advancedFilter;
                request.statuses = request.statusColl?.toString();
                let path = URLConstants.URL.customs_package_code_all;
                let cpcRes = await BaseController.prototype.restMethodPost(path, request);
                if (cpcRes.length > 0) {
                    cpcRes.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                        e.type = 'Inactive';
                    });
                }
                if (!(cpcRes.length > 0)) {
                    this._cpc_noData.setText(
                        "No data found. Try adjusting the search or filter criteria."
                    );
                } else {
                    this._cpc_noData.setText(
                        'To start, set the relevant filters and choose "Go".'
                    );
                }
                if (exItems.length > 0) {
                    oModel.getData().masterScreenTable.items = [...exItems, ...cpcRes];
                } else {
                    oModel.getData().masterScreenTable.items = cpcRes;
                }
                oModel.getData().selections.isSortSelected = false;
                this._tableId.setBusy(false);
                return cpcRes;
            } catch (error) {
                this._tableId.setBusy(false);
                BaseController.prototype.errorHandling(error);
            }
        },

        postCpc: async function (oModel) {
                let postData = oModel.getData().MasterScreenGeneral;
                let path = URLConstants.URL.customs_package_code_add;
                let postRes = await BaseController.prototype.restMethodPost(path, Array.of(postData));
                return true;
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
                        label: 'Package Code',
                        property: 'code',
                        visible: true
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
                    }]
            };
            return obj;
        },
    };
});