sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/m/Token',
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/libs/Sheet",
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Token, MessageBox, Fragment, Formatter, URLConstants, Sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.customer.ManageCustomer", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("customerMaster").attachMatched(this._onRouteMatched, this);
            this._tableId = this.getView().byId("customerTable");
            this._pageId = this.byId("page_Customer");
            this._filterBar = this.byId("customerFilterBar");
            this.popoverBtn = this.byId("btnManageCustomersErr");
            this._noData = this.byId("txt_noData");
            this._defaultAFOption = [
                { Name: true },
                { ID: true },
                { Code: true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
                { "Status": true }
            ];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("cuHeaderTitle"));
            this.setColulmnsIntoModel(); //column model for export and column personalization
            this.errorPopoverParams();
            this.initFunctionalities();
            let settingMdl = this.getModel("settings");//Empty the route property in the settings model
            settingMdl.getData().route = null;
            settingMdl.refresh();
            this._tableId.getBinding("items").sort(); //Sort reset
        },
        emptyModelData: function () { /* Set Model data for table*/
            return {
                advancedFilter: {
                    cardCode: null,
                    cardName: null,
                    shortName: null,
                    country: null,
                    city: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    top: URLConstants.Paging.top,
                    skip: 0,
                    sortingKey: "CreateDate",
                    orderBy: "desc"
                },
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
                /* appliedFilter: {
                    cardCode: null,
                    code: null,
                    cardName: null,
                    shortName: null,
                    country: null,
                    city: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    top: URLConstants.Paging.top,
                    skip: 0,
                    sortingKey: "CreateDate",
                    orderBy: "desc"
                }, */
                table: {
                    mode: "None",
                    items: [],
                    visible:{
                        excelUploadDownload:true,
                    }
                }
            }
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
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
            let isRelatedHash = prevHash.includes("customerDetailCreate") || prevHash.includes("customerDetailEdit");
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
                        fData.cardCode,
                        fData.cardName,
                        fData.shortName,
                        fData.country,
                        fData.city,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                            exFilter.cardCode,
                            exFilter.cardName,
                            exFilter.shortName,
                            exFilter.country,
                            exFilter.city,
                            exFilter.createdOnStart,
                            exFilter.createdOnEnd,
                            exFilter.updatedOnStart,
                            exFilter.updatedOnEnd,
                            exFilter.statusColl,
                        ]; //retaining existing search
                    fData.packageCodeCollection = null;
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
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.popoverBtn = this.byId("btnManageCustomersErr");
            this.eMdl = this.getOwnerComponent().getModel('errors');
            this.eMdl.setData([]);
        },
        onAfterRendering: function () {
            let that = this;
            let oDynamicPage = this._pageId;

            /* Dynamic Page scroll event attaching */
            var dynamicPageElement = oDynamicPage.getDomRef();
            dynamicPageElement.getElementsByClassName("sapFDynamicPageContentWrapper")[0].addEventListener("scroll", function (event) {
                // This function will be executed when the dynamic page is scrolled
                let oModel = that.getModel();
                var element = event.target;
                // Check if you're within the tolerance range of the bottoms
                if (element.scrollHeight - element.scrollTop - element.clientHeight < 1) {
                    let recordCount = oModel.getData().table.items[0].count;
                    let itemCount = oModel.getData().table.items.length
                    let skip = oModel.getData().advancedFilter.skip
                    let count = (skip >= recordCount);
                    oModel.refresh(true);
                    if (!count && itemCount != recordCount) {
                        oModel.getData().advancedFilter.skip += URLConstants.Paging.top;
                        oModel.getData().advancedFilter.pageNumber = +1; //If filter on db then pagination should be on db side otherwise B1.
                        //oModel.getData().appliedFilter.skip += URLConstants.Paging.top;
                        that.fetchCustomers();
                        // You've reached the bottom or are very close to it
                        console.log("Reached the bottom of the scroll container.");
                    }
                }
            });
        },
        onPressStatus: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (oData.advancedFilter.valid.length > 0) {
                let modifiedValue = oData.advancedFilter.valid.map(e => {
                    if (e == 1 || e == 2) e = 'Y';
                    else e = 'N';
                    return e;
                })
                oData.advancedFilter.validCollection = modifiedValue;
            }
            else {
                oData.advancedFilter.validCollection = null;
            }
            oModel.refresh(true);
        },
        /* Filterbar Search */
        onSearch: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (!oData.advancedFilter) {
                this.setModel();
                oModel.refresh();
            }
            oData.advancedFilter.top = URLConstants.Paging.top;
            oData.advancedFilter.skip = 0;
            oData.advancedFilter.pageNumber = 1;
            //oData.appliedFilter = { ...oData.advancedFilter };
            oData.table.items = [];
            this.storeFilterData();
            this.fetchCustomers();
            oModel.refresh();
        },
        storeFilterData: function () {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            let oFilterSettings = this.getView().getModel().getData().advancedFilter;
            oSettingMdl.getData().filter = oFilterSettings;
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
        },
        /* FilterBar Reset */
        onReset: function () {
            let oModel = this.getView().getModel();
            let emptyData = this.emptyModelData();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oModel.getData().advancedFilter = emptyData.advancedFilter; //filterbar clear
            oSettingMdl.getData().filter = emptyData.advancedFilter; //Settings Clear
            this._noData.setText(
                'To start, set the relevant filters and choose "Go".'
            );
            oModel.refresh(true);
            this.errorPopoverParams();
        },
        onPressCustomerCreate: function (oEvent) {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("customerDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("customerDetailEdit", {
                id: rowObj.cardCode
            });
        },
        onPressBulkUpload: async function (oEvent) {
            let oSource = oEvent.getSource();
            /* get first file */
            const file = oEvent.getParameter("files")[0];
            this.jsonData = await this.xlsxFileReader(file, this.sheetDetails());
        },
        bulkPostData: async function (data) {
            let customerData = data.multiple_worksheet["Customer"];
            customerData.forEach(e => {
                let status = data.multiple_worksheet.Status.find(d => d.name == e.status).Key;
                e.status = status;
                e.bulkPost = true; //For posting through excel 
            });
            return customerData;
        },
        bulkPost: async function (data) {
            var that = this;
            if (this.excelValidationDialog) {
                this.excelValidationDialog.close();
                this.excelValidationDialog.destroy();
                this.excelValidationDialog = null; // make it falsy so that it can be created next time
            }
            try {
                this.showLoading(true);
                let postData = await this.bulkPostData(this.jsonData);
                let path = URLConstants.URL.customers_add;
                let post = await this.restMethodPost(path, postData);//For both bulk and single upload
                this.showLoading(false);
                let msg = that.getResourceProperty("veUploadedSuccessfully") + '\n' + "Inserted Records: " + post?.inserted + ", Updated Records: " + post.updated;
                MessageBox.information(msg, {
                    actions: [MessageBox.Action.OK],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        that.fetchCustomers();
                    },
                });

            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },

        sheetDetails: function () {
            let obj = {
                fileName: "Shipping Line.xlsx",
                sheets: {
                    sheetName: ["Shipping Line"]
                },
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
                    }
                ]
            }
            return obj;
        },
        onPressTemplate: async function () {
            // this.onTemplate(this.sheetDetails());
            let sheetDetails = this.sheetDetails();
            let file = await fetch("./master_data/customer/Customer_template.xlsx")
                .then((res) => res.url)
                .then((file) => {
                    window.open(file);
                }).catch((e) => console.error(e));
        },
        getPayLoad: function () {
            let oModel = this.getView().getModel();
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
                pageNumber : oData.pageNumber,
                pageSize : oData.pageSize,
                orderBy: oData.sortingKey.includes("CreateDate") ? "CreateDate desc, CreateTime desc" : oData.sortingKey?.charAt(0).toUpperCase() + oData.sortingKey?.slice(1) + " " + oData?.orderBy
            }
            if(oData.sortingKey.includes("shortName") || oData.sortingKey.includes("createdBy") || oData.sortingKey.includes("updatedBy") ){
                payLoad.orderBy = oData?.orderBy;
                payLoad.sortingKey = oData?.sortingKey;
            }
            return payLoad;
        },
        fetchCustomers: async function () {
            let oModel = this.getView().getModel();
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.skip = 0;
                    oModel.getData().table.items = [];
                    oModel.getData().advancedFilter.pageNumber = 1;
                    //oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
                }
                this.showLoading(true);
                let request = this.getPayLoad();
                let exItems = oModel.getData().table.items;
                let path = URLConstants.URL.customers_all;
                let customers = await this.restMethodPost(path, request);
                if (customers.length > 0) {
                    customers.map(e => {
                        e.valid = e.valid === 'tYES' ? 'Active' : 'Inactive';
                        e.type = "Navigation";
                    })
                }
                if (exItems.length > 0) {
                    oModel.getData().table.items = [...exItems, ...customers];
                }
                else {
                    oModel.getData().table.items = customers;
                }
                if (!(customers.length > 0)) {
                    this._noData.setText(
                        "No data found. Try adjusting the search or filter criteria."
                    );
                } else {
                    this._noData.setText(
                        'To start, set the relevant filters and choose "Go".'
                    );
                }
                oModel.getData().selections.isSortSelected = false;
                oModel.refresh();
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        }
    });
});
