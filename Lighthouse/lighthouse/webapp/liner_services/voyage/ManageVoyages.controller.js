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
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, URLConstants, Sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.voyage.ManageVoyages", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("voyagesMaster").attachMatched(this._onRouteMatched, this);
            let getSource = (id => this.byId(id));
            [this._tableId, this._pageId, this._filterBar, this.popoverBtn, this._noData] = [getSource("voTable"), getSource("page_mngVoyages"), getSource("voFilterBar"), getSource("btnManageVoyagesErr"), getSource("txt_noData")];
            this._defaultAFOption = [
                { ID: true },
                { Voyage: true },
                { "Vessel Name": true },
                { "Vessel Name": true },
                { "Vessel ETA": true },
                { "Vessel ETS": true },
                { "Call Port": true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
                { "Status": true },
            ];

            this.masterData = this.getStorage("master_data");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("voVoyage"));
            this.setColulmnsIntoModel(); //column model for export and column personalization

            this.errorPopoverParams();
            this.initFunctionalities();
            let settingMdl = this.getModel("settings");//Empty the route property in the settings model
            settingMdl.getData().route = null;
            settingMdl.refresh();

            this._tableId.getBinding("items").sort(); //Sort reset
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
            let isRelatedHash = prevHash.includes("voyagesDetailCreate") || prevHash.includes("voyagesDetailEdit");
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
                        fData.voyageType,
                        fData.vesselName,
                        fData.vesselETA,
                        fData.vesselETS,
                        fData.callPort,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                            exFilter.id,
                            exFilter.voyageType,
                            exFilter.vesselName,
                            exFilter.vesselETA,
                            exFilter.vesselETS,
                            exFilter.callPort,
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
                // Check if you're within the tolerance range of the bottom
                if (element.scrollHeight - element.scrollTop - element.clientHeight < 1) {
                    let recordCount = oModel.getData().table.items[0].recordCount;
                    let count = oModel.getData().table.items.length >= recordCount;
                    if (!count) {
                        oModel.getData().advancedFilter.pageNumber += 1;
                        oModel.getData().appliedFilter.pageNumber += 1;
                        oModel.refresh(true);
                        that.fetchVoyages();
                        // You've reached the bottom or are very close to it
                        console.log("Reached the bottom of the scroll container.");
                    }
                }
            });
        },
        emptyModelData: function () { /* Set Model data for table*/
            return {
                advancedFilter: {
                    id: null,
                    voyageType: null,
                    vesselName: null,
                    vesselETA: null,
                    vesselETS: null,
                    callPort: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    createdOnStart: null,
                    createdOnStart: null,
                    createdOnEnd: null,
                    updatedOnStart: null,
                    updatedOnEnd: null,
                    packageCodeCollection: null,
                    statusColl: null,
                    statuses: null,
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    sortingKey: "id",
                    orderBy: "desc",
                    stringType: false,
                },
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
                appliedFilter: {
                    id: null,
                    voyageType: null,
                    vesselName: null,
                    vesselETA: null,
                    vesselETS: null,
                    callPort: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    vesselETAStart: null,
                    vesselETAEnd: null,
                    vesselETSStart: null,
                    vesselETSEnd: null,
                    createdOnStart: null,
                    createdOnEnd: null,
                    updatedOnStart: null,
                    updatedOnEnd: null,
                    packageCodeCollection: null,
                    statusColl: null,
                    statuses: null,
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    sortingKey: "id",
                    orderBy: "desc",
                    stringType: false,
                },
                table: {
                    mode: "None",
                    items: []
                }
            };
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
        },
        setPayLoad: function (data) {
            if (data.statusColl) data.statuses = "(" + data.statusColl?.join() + ")";
            let dateConv = function (date,time) {
                let originalDate = new Date(date),
                    dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd" + time,
                    })
                return dateFormat.format(originalDate,time);
            }
            if (data.vesselETAStart && data.vesselETAEnd) {
                data.vesselETAStart = dateConv(data.vesselETAStart, 'T00:00:00.000Z');
                data.vesselETAEnd = dateConv(data.vesselETAEnd, 'T23:59:59.999Z');
            }
            if (data.vesselETSStart && data.vesselETSEnd) {
                data.vesselETSStart = dateConv(data.vesselETSStart, 'T00:00:00.000Z');
                data.vesselETSEnd = dateConv(data.vesselETSEnd, 'T23:59:59.999Z');
            }

            return data;
        },
        /* FetchVoyages */
        fetchVoyages: async function () {
            let oModel = this.getView().getModel();
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.pageNumber = 1;
                    oModel.getData().table.items = [];
                    oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
                }
                this.showLoading(true);
                let exItems = oModel.getData().table.items;
                let request = oModel.getData().appliedFilter;
                let payLoad = this.setPayLoad(request);
                let path = URLConstants.URL.voyages_all;
                let voyages = await this.restMethodPost(path, payLoad);
                if (voyages.length > 0) {
                    voyages.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                        e.vesselETA = this.getDateTimeFormats(1,e.vesselETA);
                        e.vesselETS = this.getDateTimeFormats(1,e.vesselETS);
                        e.type = "Navigation";
                    });
                }

                if (exItems?.length > 0) {
                    oModel.getData().table.items = [...exItems, ...voyages];
                } else {
                    oModel.getData().table.items = voyages;
                }

                if (!(voyages.length > 0)) {
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
            let oModel = this.getView().getModel();
            let filters = oModel.getData().advancedFilter;
            filters.pageNumber = 1;
            oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
            oModel.getData().table.items = [];
            this.storeFilterData();
            this.fetchVoyages();
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
            oModel.getData().advancedFilter = emptyData.advancedFilter;//filterbar clear
            oSettingMdl.getData().filter = emptyData.advancedFilter; //Settings Clear
            this._noData.setText(
                'To start, set the relevant filters and choose "Go".'
            );
            oModel.refresh(true);
            this.errorPopoverParams();
        },
        onPressNavCreate: function (oEvent) {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("voyagesDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("voyagesDetailEdit", {
                id: rowObj.id
            });
        },
        onPressBulkUpload: async function (oEvent) {
            let oSource = oEvent.getSource();
            let oModel = this.getView().getModel();
            oModel.getData().excelFileName = null;
            oModel.refresh(true);
            this.oDialog = null;
            if (!this.excelUploadDialog) {
                this.excelUploadDialog = await this.onOpenDialog("com.lighthouse.init.fragment.BulkUpload");
            } else {
                this.excelUploadDialog.open();
            }
            if (this.excelUploadDialog) {
                this.excelUploadDialog.setTitle("Upload Customs Package Code");
            }
        },
        handleUploadingExcel: async function (oEvent) {
            let oSource = oEvent.getSource();
            /* get first file */
            const file = oEvent.getParameter("files")[0];
            let oModel = this.getView().getModel();
            oModel.getData().excelFileName = file.name.split('.x')[0];
            oModel.refresh(true);
            this.jsonData = await this.xlsxFileReader(file, this.sheetDetails());
        },
        handleCloseExcelUploadDialog: function () {
            if (this.excelUploadDialog) {
                this.excelUploadDialog.close();
                this.excelUploadDialog.destroy();
                this.excelUploadDialog = null;
            }
        },
        bulkPostData: async function (data) {
            let voyagesData = data.multiple_worksheet["Customs Package Code"];
            voyagesData.forEach(e => {
                let status = data.multiple_worksheet.Status.find(d => d.name == e.status).Key;
                e.status = status;
                e.bulkPost = true; //For posting through excel 
            });
            return voyagesData;
        },

        bulkPost: async function (data) {
            var that = this;
            let oModel = this.getView().getModel();
            let fileUploader = this.byId('excelFileUploader');
            let selFileName = fileUploader.getValue();
            if (selFileName) {
                let valid = await this.onExcelValidation(this.jsonData?.multiple_worksheet["Customs Package Code"]);
                if (valid && selFileName) {
                    fileUploader.setValueState("None");
                    try {
                        this.showLoading(true);
                        let postData = await this.bulkPostData(this.jsonData);
                        let path = URLConstants.URL.customs_package_code_add;
                        let post = await this.restMethodPost(path, postData);//For both bulk and single upload
                        this.showLoading(false);
                        that.handleCloseExcelUploadDialog();
                        let msg = "\u2022 Inserted Records: " + post.inserted + '\n\n' + "\u2022 Updated Records: " + post.updated;
                        MessageBox.success(msg, {
                            title: that.getResourceProperty("cpcUploadedSuccessfully"),
                            actions: [MessageBox.Action.OK],
                            styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //oModel.getData().table.items = [];
                                //oModel.refresh(true);
                                //that.fetchVoyages();
                            },
                        });

                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                }
            }
            else {
                if (!selFileName) {
                    fileUploader.setValueState("Error");
                }
            }
        },
        sheetDetails: function () {
            let obj = {
                fileName: "Voyage.xlsx",
                sheets: {
                    sheetName: ["Voyage"]
                },
                columns: [
                    {
                        label: 'ID',
                        property: 'id',
                        visible: true
                    },
                    {
                        label: 'Voyage',
                        property: 'voyageType',
                        visible: true
                    },
                    {
                        label: 'Vessel Name',
                        property: 'vesselName',
                        visible: true
                    },
                    {
                        label: 'Vessel ETA',
                        property: 'vesselETA',
                        visible: true
                    },
                    {
                        label: 'Vessel ETS',
                        property: 'vesselETS',
                        visible: true
                    },
                    {
                        label: 'Call Port',
                        property: 'callPort',
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
                    }
                ]
            };
            return obj;
        },
        onPressTemplate: async function () {
            // this.onTemplate(this.sheetDetails());
            let sheetDetails = this.sheetDetails();
            let file = await fetch("./master_data/customs_package_code/Voyages_template.xlsx")
                .then((res) => res.url)
                .then((file) => {
                    window.open(file);
                }).catch((e) => console.error(e));
        }
    });
});
