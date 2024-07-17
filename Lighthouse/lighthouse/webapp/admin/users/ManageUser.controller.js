sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/libs/Sheet",
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter, URLConstants, Sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.admin.users.ManageUser", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageUser").attachMatched(this._onRouteMatched, this);

            let getSource = (id => this.byId(id));
            [this._tableId, this._pageId, this._filterBar, this.popoverBtn, this._noData] = [getSource("tableUser"), getSource("pageUser"), getSource("filterBarUser"), getSource("btnManageUserErr"), getSource("txt_noData")];
            this._defaultAFOption = [
                { ID: true },
                { "First Name": true },
                { "Last Name": true },
                { "Job Title": true },
                { "Department": true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
                { "Status": true }
            ];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("usrHeaderTitle"));
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
                    employeeID: null,
                    firstName: null,
                    lastName: null,
                    department: null,
                    costCenterCode:null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    top: URLConstants.Paging.top,
                    skip: 0,
                    sortingKey: "employeeID",
                    orderBy: "desc"
                },
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
                appliedFilter: {
                    employeeID: null,
                    firstName: null,
                    lastName: null,
                    department: null,
                    costCenterCode:null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    top: URLConstants.Paging.top,
                    skip: 0,
                    sortingKey: "employeeID",
                    orderBy: "desc"
                },
                table: {
                    mode: "None",
                    items: []
                }
            }
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
        },
        initFunctionalities: function () {
            let oHistory = History.getInstance();
            let sDirection = oHistory.getDirection();
            let oModel = this.getView().getModel();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            let fData = oModel.getData().advancedFilter;
            let exFilter = oSettingMdl.getData().filter;
            let sortingKey = this.getStorage("SORTING_KEY");
            let prevHash = oHistory.aHistory[oHistory.aHistory.length - 1];
            let isRelatedHash = prevHash.includes("userDetailCreate") || prevHash.includes("userDetailEdit");
            if (!isRelatedHash) {
                oSettingMdl.getData().filter = null; //Erase the existing filter data when the previous hash is not related to master hash
                oSettingMdl.refresh(true);
                this.resetPersoDialog(); //Column reset
                this.handleTablePersoDialogConfirm();
            }
            if (sDirection.includes("Backwards") || sortingKey) {
                //Get Direction to change the model data

                if (sortingKey) {
                    oModel.getData().sortingKey = this.getStorage("SORTING_KEY");
                } else {
                    if (exFilter) {
                        oModel.getData().sortingKey = exFilter.sortingKey;
                    }
                }
                if (exFilter) {
                    [
                        fData.employeeID,
                        fData.firstName,
                        fData.lastName,
                        fData.department,
                        fData.costCenterCode,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                            exFilter.employeeID,
                            exFilter.firstName,
                            exFilter.lastName,
                            exFilter.department,
                            exFilter.costCenterCode,
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
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
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
                    let count = oModel.getData().advancedFilter.skip >= recordCount;
                    oModel.refresh(true);
                    if (!count) {
                        oModel.getData().advancedFilter.skip += URLConstants.Paging.top;
                        oModel.getData().appliedFilter.skip += URLConstants.Paging.top;
                        that.fetchUsers();
                        // You've reached the bottom or are very close to it
                        console.log("Reached the bottom of the scroll container.");
                    }
                }
            });
        },
        onPressStatus: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (oData.advancedFilter.active.length > 0) {
                let modifiedValue = oData.advancedFilter.active.map(e => {
                    if (e == 1 || e == 2) e = 'Y';
                    else e = 'N';
                    return e;
                })
                oData.advancedFilter.activeCollection = modifiedValue;
            }
            else {
                oData.advancedFilter.activeCollection = null;
            }
            oModel.refresh(true);
        },
        getPayLoad: function () {
            let oModel = this.getView().getModel();
            //  let oData = oModel.getData().advancedFilter;
            let oData = oModel.getData().appliedFilter;
            let payLoad = {
                employeeID: oData.employeeID || null,
                firstName: oData.firstName || null,
                lastName: oData.lastName || null,
                department:oData.department || null,
                jobTitleCollection: oData.jobTitleCollection && oData.jobTitleCollection.length > 0 ? oData?.jobTitleCollection.toString() : null,
                createDateCollection: oData.createdOnStart ? oData?.createdOnStart + ',' + oData?.createdOnEnd : null,
                updateDateCollection: oData.updatedOnStart ? oData?.updatedOnStart + ',' + oData?.updatedOnEnd : null,
                activeCollection: oData.activeCollection && oData.activeCollection.length > 0 ? oData?.activeCollection.toString() : null,
                createdBy: oData.createdBy || null,
                updatedBy: oData.updatedBy || null,
                top: oData.top,
                skip: oData.skip,
                orderBy: oData.sortingKey?.charAt(0).toUpperCase() + oData.sortingKey?.slice(1) + " " + oData?.orderBy
            }
            return payLoad;
        },
        fetchUsers: async function () {
            let oModel = this.getView().getModel();
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.skip = 0;
                    oModel.getData().table.items = [];
                    oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
                }
                this.showLoading(true);
                let request = this.getPayLoad();
                let path = URLConstants.URL.users_all;
                let exItems = oModel.getData().table.items;
                let response = await this.restMethodPost(path, request);
                if (response.length > 0) {
                    response.map(e => {
                        e.active = e.active === 'tYES' ? 'Active' : 'Inactive';
                        e.type = "Navigation";
                    })
                }
                if (exItems.length > 0) {
                    oModel.getData().table.items = [...exItems, ...response];
                }
                else {
                    oModel.getData().table.items = response;
                }
                if (!(response.length > 0)) {
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
        },
        /* Filterbar Search */
        onSearch: function () {
            let model = this.getView().getModel();
            let oData = model.getData();
            oData.advancedFilter.top = URLConstants.Paging.top,
                oData.advancedFilter.skip = 0;
            oData.appliedFilter = { ...oData.advancedFilter };
            oData.table.items = [];
            this.storeFilterData();
            this.fetchUsers();
            model.refresh(true);
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
        onPressNavCreate: function () {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("userDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("userDetailEdit", {
                id: rowObj.employeeID
            });
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
                        property: 'employeeID',
                        visible: true
                    },
                    {
                        label: 'First Name',
                        property: 'firstName',
                        visible: true
                    },
                    {
                        label: "Last Name",
                        property: 'lastName',
                        visible: true
                    },
                    {
                        label: "Job Title",
                        property: 'jobTitle',
                        visible: true
                    },
                    {
                        label: "Department",
                        property: 'department',
                        visible: true
                    },
                    {
                        label: "Cost Center",
                        property: 'costCenterCode',
                        visible: true
                    },
                    {
                        label: 'Status',
                        property: 'active',
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
        }
    });
});
