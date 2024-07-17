sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/integration/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/libs/Sheet",
    "sap/ui/core/routing/History",
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Filter, FilterOperator, Core, Formatter, URLConstants, sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.vessel.Vessel", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();
            // var oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("vesselMaster").attachMatched(this._onRouteMatched, this);
            let getSource = (id => this.byId(id));
            [this._tableId, this._pageId, this._filterBar, this.shippingLineId, this.popoverBtn, this._noData] = [getSource("tableVesselId"), getSource("page_Vessel"), getSource("veFilterBar"), getSource("veShippingLineId"), getSource("btnManageVesselErr"), getSource("txt_noData")];
            this._defaultAFOption = [
                { "Name": true },
                { "ID": true },
                { "Call Sign": true },
                { "IMO": true },
                { "Shipping Line": true },
                { "Nationality": false },
                { "Status": true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
            ];
            this.masterData = this.getStorage("master_data");

        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("veHeaderTitle"));
            this.setColulmnsIntoModel(); //column model for export and column personalization

            this.errorPopoverParams();
            //this.setModel();
            this.initFunctionalities();
            let settingMdl = this.getModel("settings");//Empty the route property in the settings model
            settingMdl.getData().route = null;
            settingMdl.refresh();
            //this.onResetAdaptFilter(this._filterBar);


            this._tableId.getBinding("items").sort(); //Sort reset

            /* this.resetPersoDialog(); //Column reset
            this.handleTablePersoDialogConfirm(); */
        },
        initFunctionalities: function () {
            // let that = this;
            let oHistory = History.getInstance();
            let sDirection = oHistory.getDirection();
            let oModel = this.getView().getModel();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            let fData = oModel.getData().advancedFilter;
            let exFilter = oSettingMdl.getData().filter;
            let sortingKey = this.getStorage("SORTING_KEY");

            let prevHash = oHistory.aHistory[oHistory.aHistory.length - 1];
            let isRelatedHash = prevHash.includes("vesselDetailCreate") || prevHash.includes("vesselDetailEdit");
            if (!isRelatedHash) {
                oSettingMdl.getData().filter = null; //Erase the existing filter data when the previous hash is not related to master hash
                oSettingMdl.refresh(true);
                this.resetPersoDialog(); //Column reset
                // this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))
                // this.sortDialog?.setSortDescending(true);
                // this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
                // this.groupDialog?.setSelectedGroupItem(null);
                this.handleTablePersoDialogConfirm();
            }

            if (sDirection.includes("Backwards") || sortingKey) {
                //Get Direction to change the model data
                // setTimeout(() => {    //To retain grouping and sorting settings
                //     if (this.lastselected == "sort") {
                //         that.groupDialog?.fireConfirm();
                //         that.sortDialog?.fireConfirm();
                //     }
                //     if (this.lastselected == "Group") {
                //         that.sortDialog?.fireConfirm();
                //         that.groupDialog?.fireConfirm();
                //     }

                // }, 1000)
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
                        fData.name,
                        fData.callSign,
                        fData.imo,
                        fData.shippingLineColl,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                            exFilter.id,
                            exFilter.name,
                            exFilter.callSign,
                            exFilter.imo,
                            exFilter.shippingLineColl,
                            exFilter.createdOnStart,
                            exFilter.createdOnEnd,
                            exFilter.updatedOnStart,
                            exFilter.updatedOnEnd,
                            exFilter.statusColl,
                        ]; //retaining existing search
                    fData.imoCollection = null;
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
                    let count = oModel.getData().table.items.length >= recordCount;//oModel.getData().advancedFilter.pageSize > recordCount;
                    //oModel.getData().advancedFilter.pageSize += URLConstants.Paging.page_size;
                    if (!count) {
                        oModel.getData().advancedFilter.pageNumber += 1;
                        oModel.getData().appliedFilter.pageNumber += 1;
                        oModel.refresh(true);
                        that.fetchVessel();
                        // You've reached the bottom or are very close to it
                        console.log("Reached the bottom of the scroll container.");
                    }
                }
            });
        },
        /* Filterbar Search */
        onSearch: function () {
            let oModel = this.getView().getModel();
            let filters = oModel.getData().advancedFilter;
            if (!filters) {
                oModel.getData().advancedFilter = this.emptyModelData().advancedFilter;
                oModel.refresh();
            }
            filters.pageNumber = 1;
            oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
            oModel.getData().table.items = [];
            this.storeFilterData();
            this.fetchVessel();
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
            oModel.getData().advancedFilter = emptyData.advancedFilter;
            oSettingMdl.getData().filter = emptyData.advancedFilter;
            this._noData.setText(
                'To start, set the relevant filters and choose "Go".'
            );
            oModel.refresh();
            oSettingMdl.refresh();
            this.errorPopoverParams();
        },
        emptyModelData: function () { /* Set Model data for table*/
            return {
                advancedFilter: {
                    id: null,
                    name: null,
                    callSign: null,
                    imo: null,
                    imoCollection: null,
                    shippingLineIdCollection: null,
                    shippingLineColl: null,
                    nationality: null,
                    createdBy: null,
                    updatedBy: null,
                    createdOnStart: null,
                    createdOnEnd: null,
                    updatedOnStart: null,
                    updatedOnEnd: null,
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
                    name: null,
                    callSign: null,
                    imo: null,
                    imoCollection: null,
                    shippingLineIdCollection: null,
                    shippingLineColl: null,
                    nationality: null,
                    createdBy: null,
                    updatedBy: null,
                    createdOnStart: null,
                    createdOnEnd: null,
                    updatedOnStart: null,
                    updatedOnEnd: null,
                    statusColl: null,
                    statuses: null,
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    sortingKey: "id",
                    orderBy: "desc",
                    stringType: false,
                },
                shippingLine: [],
                table: {
                    mode: "None",
                    items: [],
                    visible: {
                        excelUploadDownload: true,
                    }
                },
            };
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
            this.fetchShippingLine();
        },
        onPressVesselCreate: function (oEvent) {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("vesselDetailCreate");
        },

        onPressVesselEdit: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("vesselDetailEdit", {
                id: rowObj.id
            });
        },
        /* fetchShippingLine */
        fetchShippingLine: async function () {
            let oModel = this.getView().getModel();
            this.errorPopoverParams();
            try {
                this.shippingLineId.setBusy(true);
                let path = URLConstants.URL.min_shipping_line;
                let shippingLine = await this.restMethodGet(path);
                oModel.getData().shippingLine = shippingLine;
                oModel.refresh();
                this.shippingLineId.setBusy(false);
            } catch (error) {
                this.shippingLineId.setBusy(false);
                this.errorHandling(error);
            }
        },
        /* FetchVessel */
        fetchVessel: async function () {
            let oModel = this.getView().getModel();
            this.errorPopoverParams();
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().advancedFilter.pageNumber = 1;
                    oModel.getData().table.items = [];
                    oModel.getData().appliedFilter = { ...oModel.getData().advancedFilter };
                }
                this.showLoading(true);
                let exItems = oModel.getData().table.items;
                let request = oModel.getData().appliedFilter;
                request.shippingLineIdCollection = request.shippingLineColl?.toString();
                request.statuses = request.statusColl?.toString();

                let path = URLConstants.URL.vessel_all;
                let vesselRes = await this.restMethodPost(path, request);
                if (vesselRes.length > 0) {
                    vesselRes.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                        e.type = "Navigation";
                    });
                }

                if (exItems.length > 0) {
                    oModel.getData().table.items = [...exItems, ...vesselRes];
                } else {
                    oModel.getData().table.items = vesselRes;
                }

                if (!(vesselRes.length > 0)) {
                    this._noData.setText(
                        "No data found. Try adjusting the search or filter criteria."
                    );
                } else {
                    this._noData.setText(
                        'To start, set the relevant filters and choose "Go".'
                    );
                }
                oModel.getData().selections.isSortSelected = false;
                oModel.refresh(true);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
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
                this.excelUploadDialog.setTitle("Upload Vessels");
            }
        },
        handleUploadingExcel: async function (oEvent) {
            let oSource = oEvent.getSource();
            /* get first file */
            const file = oEvent.getParameter("files")[0];
            if (file) {
                oEvent.getSource().setValueState("None");
            }
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
            let oModel = this.getView().getModel();
            let filterData = oModel.getData().advancedFilter;
            let vesselData = data.multiple_worksheet.Vessel;
            vesselData.forEach(e => {
                let shippingLineId = data.multiple_worksheet.ShippingLine.find(d => d.name == e.shippingLineName).id;
                let status = data.multiple_worksheet.Status.find(d => d.name == e.status).Key;
                e.shippingLineId = shippingLineId;
                e.status = status;
                e.bulkPost = 'true';
            });
            let imoCollection = vesselData.map(e => e.imo);
            filterData.imoCollection = "(" + imoCollection.join() + ")";
            filterData.statuses = null;
            oModel.getData().advancedFilter.imoCollection = null;
            return vesselData;
        },
        bulkPost: async function () {
            var that = this;
            let oModel = this.getView().getModel();
            let fileUploader = this.byId('excelFileUploader');
            let selFileName = fileUploader.getValue();
            if (selFileName) {
                let valid = await this.onExcelValidation(this.jsonData?.multiple_worksheet.Vessel);
                if (valid && selFileName) {
                    fileUploader.setValueState("None");
                    try {
                        this.showLoading(true);
                        let postData = await this.bulkPostData(this.jsonData);;
                        let path = URLConstants.URL.vessel_add;
                        let postRes = await this.restMethodPost(path, postData);//For both bulk and single upload
                        this.showLoading(false);
                        that.handleCloseExcelUploadDialog();
                        let msg = "\u2022 Inserted Records: " + postRes.inserted + '\n\n' + "\u2022 Updated Records: " + postRes.updated;
                        MessageBox.success(msg, {
                            title: that.getResourceProperty("veUploadedSuccessfully"),
                            actions: [MessageBox.Action.OK],
                            styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //oModel.getData().table.items = [];
                                //oModel.refresh(true);
                                //that.fetchVessel();
                            }
                        });

                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                }
            } else {
                if (!selFileName) {
                    fileUploader.setValueState("Error");
                    //that.handleCloseExcelUploadDialog();
                }
            }
        },
        sheetDetails: function () {
            let obj = {
                fileName: "Vessel.xlsx",
                sheets: {
                    sheetName: ["Vessel"]
                },
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
        onPressTemplate: async function () {
            //this.onExcelTemplate(this.sheetDetails());
            let sheetDetails = this.sheetDetails();
            let file = await fetch("./master_data/vessel/Vessel_template.xlsx")
                .then((res) => res.url)
                .then((file) => {
                    window.open(file);
                }).catch((e) => console.error(e));
        }
    });
});