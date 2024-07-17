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

        loadIds: function (isCreate, tableId, noDataId, formId, eMdl, pageId, contactFormId, contactDialogueId) {
            if (isCreate) {
                this._tableId = tableId;
                this._customer_noData = noDataId;
            }
            else {
                this._customer_formId = formId;
                this.eMdl = eMdl;
                this.pageId = pageId;
            }
        },
        onAfterRendering: function (oModel) {
            let recordCount = oModel.getData().masterScreenTable.items[0].count;
            let itemCount = oModel.getData().masterScreenTable.items.length;
            let skip = oModel.getData().advancedFilter.skip
            let count = (skip >= recordCount);
            // let count = oModel.getData().masterScreenTable.items.length >= recordCount;
            if (!count && itemCount != recordCount) {
                // oModel.getData().advancedFilter.pageNumber += 1;
                oModel.getData().advancedFilter.skip += URLConstants.Paging.top;
                oModel.refresh(true);
                console.log("Reached the bottom of the scroll customer.");
                return true;
            }
            else {
                return false;
            }
        },
        getPayLoad: function (oModel) {
            let oData = oModel.getData().advancedFilter;
            //let oData = oModel.getData().appliedFilter;
            let payLoad = {
                cardCode: oData.cardCode || null,
                cardName: oData.cardName || null,
                shortName: oData.shortName || null,
                countryCollection: oData.countryCollection && oData.countryCollection.length > 0 ? oData?.countryCollection.toString() : null,
                cityCollection: oData.cityCollection && oData.cityCollection.length > 0 ? oData?.cityCollection.toString() : null,
                createDateCollection: oData.createdOnStart ? oData?.createdOnStart + ',' + oData?.createdOnEnd : null,
                updateDateCollection: oData.updatedOnStart ? oData?.updatedOnStart + ',' + oData?.updatedOnEnd : null,
                validCollection: oData.validCollection && oData.validCollection.length > 0 ? oData?.validCollection.toString() : null,
                createdBy: oData.createdBy || null,
                updatedBy: oData.updatedBy || null,
                top: oData.top,
                skip: oData.skip,
                orderBy: oData.sortingKey.includes("CreateDate") ? "CreateDate desc, CreateTime desc" : oData.sortingKey?.charAt(0).toUpperCase() + oData.sortingKey?.slice(1) + " " + oData?.orderBy
            }
            if(oData.sortingKey.includes("shortName") || oData.sortingKey.includes("createdBy") || oData.sortingKey.includes("updatedBy") ){
                payLoad.orderBy = oData?.orderBy;
                payLoad.sortingKey = oData?.sortingKey;
            }
            return payLoad;
        },
        fetchCustomer: async function (oModel) {
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    // oModel.getData().advancedFilter.pageNumber = 1;
                    oModel.getData().advancedFilter.skip = 0;
                    oModel.getData().masterScreenTable.items = [];
                }
                let exItems = oModel.getData().masterScreenTable.items;
                this._tableId.setBusy(true);
                this._tableId.setBusyIndicatorDelay(10);
                // let request = oModel.getData().advancedFilter;
                let request = this.getPayLoad(oModel);
                request.statuses = request.statusColl?.toString();
                let path = URLConstants.URL.customers_all;
                let customerRes = await BaseController.prototype.restMethodPost(path, request);
                if (customerRes.length > 0) {
                    customerRes.map(e => {
                        e.valid = e.valid === 'tYES' ? 'Active' : 'Inactive';
                        e.type = 'Inactive';
                    });
                }
                if (!(customerRes.length > 0)) {
                    this._customer_noData.setText(
                        "No data found. Try adjusting the search or filter criteria."
                    );
                } else {
                    this._customer_noData.setText(
                        'To start, set the relevant filters and choose "Go".'
                    );
                }
                if (exItems.length > 0) {
                    oModel.getData().masterScreenTable.items = [...exItems, ...customerRes];
                } else {
                    oModel.getData().masterScreenTable.items = customerRes;
                }
                oModel.getData().selections.isSortSelected = false;
                this._tableId.setBusy(false);
            } catch (error) {
                this._tableId.setBusy(false);
                BaseController.prototype.errorHandling(error);
            }
        },
        onChangeStatus: function (oModel) {
            let oData = oModel.getData();
            oData.masterScreenGeneral.valid = oData.masterScreenGeneral.status == 1 || oData.masterScreenGeneral.status == 2 ? "tYES" : "tNO";
            oData.masterScreenGeneral.frozen = oData.masterScreenGeneral.valid == "tYES" ? "tNO" : "tYES";
            oModel.refresh(true);
        },
        onPressContact: async function (oModel) {
            let getIndex = this.contactTableId.indexOfItem(oEvent.getSource());
            let oData = oModel.getData();
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.tableData = JSON.parse(JSON.stringify(rowObj));
            oData.contactForm = rowObj;
            oData.index = getIndex;
            oModel.refresh(true);
        },
        postCustomer: async function (oModel) {
            this.onChangeStatus(oModel);
            let oData = oModel.getData();
            oData.masterScreenGeneral.Series = 75;
            oData.masterScreenGeneral.cardType = "C";
            oData.masterScreenGeneral.agentCode = oData.masterScreenGeneral.agentCode || null;
            oData.contactDetails.items.map(e => e.name = e.firstName + '' + e.lastName);
            oData.contactDetails.items.forEach(e => e.gender = (e.gender == 1 ? "gt_Female" : e.gender == 2 ? "gt_Male" : "gt_Undefined"));
            oData.contactDetails.removedData.forEach(e => e.gender = (e.gender == 1 ? "gt_Female" : e.gender == 2 ? "gt_Male" : "gt_Undefined"));
            let mergeCustomerDetails = [...oData.contactDetails.items, ...oData.contactDetails.removedData]; //Merge active and inactive records.
            let postData = { ...oData.masterScreenGeneral, contactEmployees: mergeCustomerDetails };
            let path = URLConstants.URL.customers_add;
            let postRes = await BaseController.prototype.restMethodPost(path, postData);
            return true;
        },
        sheetDetails: function () {
            let obj = {
                columns: [
                    {
                        label: 'ID',
                        property: 'cardCode',
                        visible: true
                    },
                    {
                        label: 'Name',
                        property: 'cardName',
                        visible: true
                    },
                    {
                        label: "Short Name",
                        property: 'shortName',
                        visible: true
                    },
                    {
                        label: "Country",
                        property: 'country',
                        visible: true
                    },
                    {
                        label: "City",
                        property: 'city',
                        visible: true
                    },
                    {
                        label: 'Status',
                        property: 'valid',
                        visible: true
                    },
                    {
                        label: 'Created By',
                        property: 'createdBy',
                        visible: false
                    },
                    {
                        label: 'Created On',
                        property: 'createDate',
                        visible: false
                    },
                    {
                        label: 'Updated By',
                        property: 'updatedBy',
                        visible: false
                    },
                    {
                        label: 'Updated On',
                        property: 'updateDate',
                        visible: false
                    }]
            };
            return obj;
        },
    };
});