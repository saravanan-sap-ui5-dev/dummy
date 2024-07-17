sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/m/Token',
    "sap/ui/core/Fragment",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/libs/Sheet",
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Token, Fragment, Formatter, URLConstants, Sheet, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.container.ManageContainer", {
        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("containerMaster").attachMatched(this._onRouteMatched, this);

            this._tableId = this.getView().byId("table_Containers");
            this._filterBar = this.byId("containersFilterBar");
            this._pageId = this.byId("page_mngContainers");
            this.popoverBtn = this.byId("btnManageContainersErr");
            this.containerTypeId = this.byId("mngContainerContainerTypeId");
            this.masterData = this.getStorage("master_data");
            this._noData = this.byId("txt_noData");

            this._defaultAFOption = [
                { "Container No": true },
                { "Size": true },
                { "Type": true },
                { "SOC": true },
                { "Owned By": true },
                { "Status": true },
                { "Created By": false },
                { "Created On": false },
                { "Updated By": false },
                { "Updated On": false },
            ];
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("coHeaderTitle"));
            this.setColulmnsIntoModel(); //column model for export and column personalization
            this.errorPopoverParams();
            this.initFunctionalities();
            let settingMdl = this.getModel("settings");//Empty the route property in the settings model
            settingMdl.getData().route = null;
            settingMdl.refresh();

        
            this._tableId.getBinding("items").sort(); //Sort reset

            /* this.resetPersoDialog(); //Column reset
            this.handleTablePersoDialogConfirm(); */
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            this.eMdl.setData([]);
        },
        emptyModelData: function () { /* Set Model data for table*/
            return {
                advancedFilter: {
                    id: null,
                    containerNo: null,
                    containerNoCollection: null,
                    typeIdCollection: null,
                    typeIdColl: null,
                    socCollection: null,
                    socColl: null,
                    sizeCollection: null,
                    sizeColl: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
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
                appliedFilter: {
                    id: null,
                    containerNo: null,
                    containerNoCollection: null,
                    typeIdCollection: null,
                    typeIdColl: null,
                    socCollection: null,
                    socColl: null,
                    sizeCollection: null,
                    sizeColl: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
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
                table: {
                    mode: "None",
                    items: [],
                    visible:{
                        excelUploadDownload:true,
                    }
                },
                containerTypeCollection: []
            };
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
            this.fetchContainerType();
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
            let isRelatedHash = prevHash.includes("containerDetailCreate") || prevHash.includes("containerDetailEdit");
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
                        fData.containerNo,
                        fData.sizeColl,
                        fData.typeIdColl,
                        fData.socColl,
                        fData.createdOnStart,
                        fData.createdOnEnd,
                        fData.updatedOnStart,
                        fData.updatedOnEnd,
                        fData.statusColl,
                    ] = [
                            exFilter.containerNo,
                            exFilter.sizeColl,
                            exFilter.typeIdColl,
                            exFilter.socColl,
                            exFilter.createdOnStart,
                            exFilter.createdOnEnd,
                            exFilter.updatedOnStart,
                            exFilter.updatedOnEnd,
                            exFilter.statusColl,
                        ]; //retaining existing search
                    fData.containerNoCollection = null;
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
                        that.fetchContainers();
                        // You've reached the bottom or are very close to it
                        console.log("Reached the bottom of the scroll container.");
                    }
                }
            });
        },

        /* FetchContainers */
        fetchContainers: async function () {
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
                request.statuses = request.statusColl?.toString();
                request.typeIdCollection = request.typeIdColl?.toString();
                request.socCollection = request.socColl?.toString();
                request.sizeCollection = request.sizeColl?.toString();
                let path = URLConstants.URL.containers_all;
                let containers = await this.restMethodPost(path, request);
                if (containers?.length > 0) {
                    containers.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                        e.soc = this.masterData.yes_or_no.find(ele => e.soc === ele.value)?.description;
                        e.size = this.masterData.container_size.find(ele => e.size === ele.value)?.description;
                        e.type = "Navigation";
                        //e.updatedOn = e.updatedOn.split("-").reverse().join("-");
                        //e.createdOn = e.createdOn.split("-").reverse().join("-");
                    });
                }
                if (exItems?.length > 0) {
                    oModel.getData().table.items = [...exItems, ...containers];
                } else {
                    oModel.getData().table.items = containers;
                }

                if (!(containers.length > 0)) {
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
        /* fetchContainerType */
        fetchContainerType: async function () {
            let oModel = this.getView().getModel();
            try {
                this.containerTypeId.setBusy(true);
                let path = URLConstants.URL.min_container_type;
                let containerType = await this.restMethodGet(path);
                oModel.getData().containerTypeCollection = containerType;
                oModel.refresh(true);
                this.containerTypeId.setBusy(false);
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
            this.fetchContainers();
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
            oModel.refresh();
            oSettingMdl.refresh();
            this.errorPopoverParams();
        },
        onPressContainerCreate: function (oEvent) {
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("containerDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            oSettingMdl.getData().visible_filter = this.getFilterVisibleFields();
            this.oRouter.navTo("containerDetailEdit", {
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
                this.excelUploadDialog.setTitle("Upload Containers");
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
            let containersData = data.multiple_worksheet["Containers"];
            containersData.forEach(e => {
                let size = data.multiple_worksheet.Size.find(d => d.Name == e.size).Key;
                let soc = data.multiple_worksheet.SOC.find(d => d.Name == e.soc).Key;
                let type = data.multiple_worksheet["Container Type"].find(d => d.Name == e.containerTypeName).id;
                let status = data.multiple_worksheet.Status.find(d => d.Name == e.status).Key;
                e.size = size;
                e.soc = soc;
                e.type = type;
                e.status = status;
                e.bulkPost = true; //For posting through excel 
            });
            return containersData;
        },

        bulkPost: async function () {
            var that = this;
            let oModel = this.getView().getModel();
            let fileUploader = this.byId('excelFileUploader');
            let selFileName = fileUploader.getValue();
            if (selFileName) {
                let valid = await this.onExcelValidation(this.jsonData?.multiple_worksheet["Containers"]);
                if (valid && selFileName) {
                    fileUploader.setValueState("None");
                    try {
                        this.showLoading(true);
                        let postData = await this.bulkPostData(this.jsonData);
                        let path = URLConstants.URL.containers_add;
                        let postRes = await this.restMethodPost(path, postData);//For both bulk and single upload
                        that.handleCloseExcelUploadDialog();
                        this.showLoading(false);
                        let msg = "\u2022 Inserted Records: " + postRes.inserted + '\n\n' + "\u2022 Updated Records: " + postRes.updated;
                        MessageBox.success(msg, {
                            title: that.getResourceProperty("veUploadedSuccessfully"),
                            actions: [MessageBox.Action.OK],
                            styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                //oModel.getData().table.items = [];
                                //oModel.refresh(true);
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
                }
            }
        },
        sheetDetails: function () {
            let obj = {
                fileName: "Containers.xlsx",
                sheets: {
                    sheetName: ["Containers"]
                },
                columns: [
                    {
                        label: 'ID',
                        property: 'id',
                        visible: true,
                    }, 
                    {
                        label: 'Container No',
                        property: 'containerNo',
                        visible: true,
                    },
                    {
                        label: 'Type',
                        property: 'containerTypeName',
                        visible: true,
                    },
                    {
                        label: "SOC",
                        property: 'soc',
                        visible: true,
                    },
                    {
                        label: "Owned By",
                        property: 'ownedBy',
                        visible: true,
                    },
                    {
                        label: "Size",
                        property: 'size',
                        visible: true,
                    },
                    {
                        label: 'Status',
                        property: 'status',
                        visible: true,
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
        onPressTemplate: async function () {
            //this.onExcelTemplate(this.sheetDetails());
            let sheetDetails = this.sheetDetails();
            let file = await fetch("./master_data/container/Containers_template.xlsx")
                .then((res) => res.url)
                .then((file) => {
                    window.open(file);
                }).catch((e) => console.error(e));
        }
    });
});
