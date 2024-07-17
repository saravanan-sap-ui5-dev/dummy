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
    "com/lighthouse/utils/master_data_API/VesselAPI",
    "com/lighthouse/utils/master_data_API/ShippingLineAPI",
    "com/lighthouse/utils/master_data_API/PortCodeAPI"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, ErrorMessage, URLConstants, History, VesselAPI, ShippingLineAPI, PortCodeAPI) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.voyage.CreateVoyage", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("voyagesDetailCreate").attachMatched(this._onRouteMatched, this);

            this.paths = {
                uploadManifest: "com.lighthouse.liner_services.dialog.UploadManifest",
                portCode: "com.lighthouse.master_data.dialog.PortCode",
                createPortCode: "com.lighthouse.master_data.dialog.CreatePortCode",
                vessel: "com.lighthouse.master_data.dialog.Vessel",
                createVessel: "com.lighthouse.master_data.dialog.CreateVessel",
                shippineLine: "com.lighthouse.master_data.dialog.ShippingLine",
                createShippingLine: "com.lighthouse.master_data.dialog.CreateShippingLine"
            };

            [this.sbtnDischarge, this.sbtnLoad, this.pageId, this.formId, this._noData, this.popoverBtn] = [this.getView().byId("sbtnDischarge"), this.getView().byId("sbtnLoad"), this.getView().byId("page_CreateVoyages"), this.getView().byId("voyageFormId"), this.getView().byId("txt_noData"), this.getView().byId("btnCVoyageError")];
            this.masterData = this.getStorage("master_data");
            VesselAPI.baseControllerFunctions(this.masterData, this.pageId);
            ShippingLineAPI.baseControllerFunctions(this.masterData, this.pageId);
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").index || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.resetPersoDialog();
            this.setTitle(this.getResourceProperty("voVoyage"));
            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: true,
                    create: false
                }),
                "visible"
            );

            this.sbtnDischarge.fireSelectionChange();//retaining the selection of transshipment view segment button - discharge 
            this.sbtnLoad.fireSelectionChange();//retaining the selection of transshipment view segment button - load 
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.voyage;
            this.setModel();
            this.getView().setModel(new JSONModel({ items: [] }), "AttachmentMdl");
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
                oData.transshipmentImport.blView = blView;
            } else if (keyPath.includes("loadKey")) {
                oModel.getData().loadContainers.containerView = containerView;
                oModel.getData().transshipmentExport.blView = blView;
            }
            oModel.refresh(true);
        },
        emptyModelData: function () {
            return {
                route: this._route,
                item: this._item,
                general: {
                    //general tab
                    voyageType: null,
                    callPort: null,
                    vesselID: null,
                    voyageIn: null,
                    vesselETA: null,
                    status: 2,
                    accountNumber: null,
                    vesselName: null,
                    voyageOut: null,
                    vesselETS: null,
                    //Operational Details
                    lastPort: null,
                    vesselRotationNumber: null,
                    service: null,
                    dpIn: null,
                    nextPort: null,
                    mrnNumber: null,
                    operator: null,
                    dpOut: null,
                    //Bayan Details
                    masterName: null,
                    carNumber: null,
                    nationality: null,
                    manifestNumber: null,
                    bulkPost: false
                },
                advancedFilter: {
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    sortingKey: "id",
                    orderBy: "desc",
                    stringType: false,
                },
                masterScreenTable: {
                    mode: "SingleSelectLeft",
                    items: [],
                    visible: {
                        excelUploadDownload: false,
                    }
                },
                shippingLine: [],
                shippingLineCollection: [],
                vesselGeneral: {
                    id: null,
                    status: 2,
                    bulkPost: false
                },
                vesselDetails: {
                    mode: "Delete",
                    items: [],
                    removedData: [],
                },
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
                imports: {
                    mode: "Delete",
                    items: [],
                    removedData: [],
                },
                exports: {
                    mode: "None",
                    items: [],
                    removedData: [],
                },
                dischargeContainers: {
                    containerView: false
                },
                loadContainers: {
                    containerView: false
                },
                transshipmentExport: {
                    blView: false
                },
                transshipmentImport: {
                    blView: false
                }
            };
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
        },
        handleChangeDateTimeRange: function (oEvent) {
            let oModel = this.getView().getModel();
            let source = oEvent.getSource();
            let value = source?.getDateValue();
            if (value) {
                let getFieldLabel = source?.getLabels()[0].getText();
                let isoString = value.toISOString();
                if (getFieldLabel.includes('Vessel ETA')) {
                    oModel.getData().general.vesselETA = isoString;
                }
                else if (getFieldLabel.includes('Vessel ETS')) {
                    oModel.getData().general.vesselETS = isoString;
                }
            }
            oModel.refresh(true);
        },
        getPortCodePayLoad: function () {
            let oModel = this.getView().getModel();
            // let oData = oModel.getData().advancedFilter;
            let oData = oModel.getData().portCodeAdvancedFilter;
            let payLoad = {
                cardCode: oData.cardCode || null,
                cardName: oData.cardName || null,
                shortName: oData.shortName || null,
                countryCollection: oData.countryCollection && oData.countryCollection.length > 0 ? oData?.countryCollection.toString() : null,
                cityCollection: oData.cityCollection && oData.cityCollection.length > 0 ? oData?.cityCollection.toString() : null,
                createDateCollection: oData.createdOnStart ? oData?.createdOnStart + ',' + oData?.createdOnEnd : null,
                updateDateCollection: oData.updatedOnStart ? oData?.updatedOnStart + ',' + oData?.updatedOnEnd : null,
                validCollection: oData.validCollection && oData.validCollection.length > 0 ? oData?.validCollection.toString() : null,
                /*       createdBy: oData.createdBy || null,
                      updatedBy: oData.updatedBy || null, */
                top: oData.top,
                skip: oData.skip,
                orderBy: oData.sortingKey?.charAt(0).toUpperCase() + oData.sortingKey?.slice(1) + " " + oData?.orderBy
            }
            return payLoad;
        },
        fetchCustomers: async function () {
            let oModel = this.getView().getModel();
            try {
                if (oModel.getData().selections.isSortSelected) { /*If sorting is selected on pagination need to fetch new data*/
                    oModel.getData().portCodeAdvancedFilter.skip = 0;
                    oModel.getData().portCodeTable.items = [];
                    oModel.getData().portCodeAppliedFilter = { ...oModel.getData().portCodeAdvancedFilter };
                }
                this.showLoading(true);
                let request = this.getPortCodePayLoad();
                let exItems = oModel.getData().portCodeTable.items;
                let path = URLConstants.URL.customers_all;
                let customers = await this.restMethodPost(path, request);
                if (customers.length > 0) {
                    customers.map(e => {
                        e.valid = e.valid === 'tYES' ? 'Active' : 'In-active';
                        e.type = "Navigation";
                    })
                }
                if (exItems.length > 0) {
                    oModel.getData().portCodeTable.items = [...exItems, ...customers];
                }
                else {
                    oModel.getData().portCodeTable.items = customers;
                }
                //    if (!(customers.length > 0)) {
                //       this._noData.setText(
                //          "No data found. Try adjusting the search or filter criteria."
                //       );
                //    } else {
                //       this._noData.setText(
                //          'To start, set the relevant filters and choose "Go".'
                //       );
                //    }
                oModel.getData().selections.isSortSelected = false;
                oModel.refresh();
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        errorPopoverParams: function (formId) {
            // formId = formId == "main" ? "basic" : formId;
            // let ids = {
            //     basic: "sf_basicDetails",
            //     attachment: "sf_attachment",
            //     property: "sf_PropHierarchy",
            // };
            // this.formId = this.getView().byId(ids[formId]);
            // this.pageId = this.getView().byId("page_pohDetail");
            // this.popoverBtn = this.getView().byId("btn_pOHDetail");

            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel("errors");
            ErrorMessage.removeValueState(this.formId, this.eMdl);

            this.eMdl.setData([]);
            this.errorData = [];
        },

        postVoyages: async function () {
            try {
                var that = this;
                let oModel = this.getView().getModel();
                let oData = oModel.getData()
                let aModel = this.getOwnerComponent().getModel('attachmentsMdl');
                this.errorPopoverParams();
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    if (oData.general.vesselETA) oData.general.vesselETA = new Date(oData.general.vesselETA).toISOString();
                    if (oData.general.vesselETS) oData.general.vesselETS = new Date(oData.general.vesselETS).toISOString();
                    let path = URLConstants.URL.voyages_add;
                    let postData = oData.general
                    let postRes = await this.restMethodPost(path, Array.of(postData));
                    let attachmentData = aModel.getData();
                    let attachmentPath = URLConstants.URL.attachments;
                    attachmentData.forEach((e) => (e.refObjectId = postRes.id));
                    let attachmentRes = await this.restMethodPost(attachmentPath, attachmentData);
                    if (this._item) {
                        this.onPressCancel();
                        that.setStorage("SORTING_KEY", "updatedOn");
                        this.setStorage("navigationFrom", "edit");
                    } else {
                        this.setStorage("navigationFrom", "create");
                        that.setStorage("SORTING_KEY", "createdOn");
                        this.getRouter().navTo("voyagesDetailEdit", {
                            id: postRes.id
                        });
                    }
                    this.showMessage();
                    this.showLoading(false);
                    this.errorPopoverParams();
                }
                else {
                    this.errorHandling();
                }
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        showMessage: function () {
            let that = this;
            let msg = !this._item ? that.getResourceProperty("voSavedSuccessfully") : that.getResourceProperty("voUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if (!that._item) that.setModel();
                },
            });
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
            var oBindingContext = oItem.getBindingContext("VoyageMdl");
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
        },
        onImportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("VoyageMdl");
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("importsDetailEdit", {
                id: rowObj.id
            });
        },
        onExportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("VoyageMdl");
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
        onPressCancel: function () {
            this.onNavBack();
        },
        onUploadManifest: function (oEvent) {
            //this.oRouter.navTo('uploadManifest')
            this.onOpenDialog(this.paths.uploadManifest);
        },
        loadPortCodeIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("tablePortTable");
                this._portCode_noData = this.getView().byId("txt_noData");
            }
            else {
                this._portCode_formId = this.getView().byId("portFormId");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            PortCodeAPI.loadIds(isCreate, this._tableId, this._portCode_noData, this._portCode_formId, this.eMdl, this.pageId);
        },
        onPressPortCode: async function () {
            let oModel = this.getView().getModel();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.portCode);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadPortCodeIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        onPressPortCodeCreate: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.createPortCode);
        },
        onSavePortCodeDetail: function () {
            this.onCloseDialog();
        },
        loadShippingLineIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("tableShippingLine");
                this._shippingLine_noData = this.getView().byId("txt_noData");
            }
            else {
                this._shippingLine_formId = this.getView().byId("slForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            ShippingLineAPI.loadIds(isCreate, this._tableId, this._shippingLine_noData, this._shippingLine_formId, this.eMdl, this.pageId);
        },
        onPressShippingLine: async function () {
            let oModel = this.getView().getModel();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.shippineLine);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadShippingLineIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        onPressShippingLineEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("tableShippingLine");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.general.operator = selObj?.id;
                oData.general.operatorName = selObj?.name;
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
        },
        onCloseShippingLineDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
        },
        onPressPortCodeEdit: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._portCodeTableId = this.getView().byId("tablePortTable");
            let selectedItem = this._portCodeTableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            oData.general.lastPort = selObj?.cardCode;
            oData.general.lastPortName = selObj?.cardName;
            oModel.refresh(true);
            this.onCloseDialog();
        },
        onClosePortCodeDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.portCode);
        },
        onSearch: async function (oEvent) {  // Getting master data
            let oModel = this.getView().getModel();
            let getMasterTitle = oEvent.getSource()?.getParent().getTitle();
            if (getMasterTitle) {
                if (getMasterTitle.toLowerCase().includes('Vessel'.toLowerCase())) {
                    oModel.getData().masterScreenTable.items = [];
                    let filters = oModel.getData().advancedFilter;
                    filters.pageNumber = 1;
                    await this.fetchVessel();
                }
                if (getMasterTitle.toLowerCase().includes('Shipping Line'.toLowerCase())) {
                    oModel.getData().masterScreenTable.items = [];
                    let filters = oModel.getData().advancedFilter;
                    filters.pageNumber = 1;
                    await this.fetchShippingLine();
                }
            }
            oModel.refresh(true);
        },
        fetchVessel: async function () {
            try {
                let oModel = this.getView().getModel();
                await VesselAPI.fetchVessel(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        fetchShippingLine: async function () {
            try {
                let oModel = this.getView().getModel();
                let exItems = oModel.getData().masterScreenTable.items;
                let shippineLineRes = await ShippingLineAPI.fetchShippingLine(oModel);
                if (exItems.length > 0) {
                    oModel.getData().masterScreenTable.items = [...exItems, ...shippineLineRes];
                } else {
                    oModel.getData().masterScreenTable.items = shippineLineRes;
                }
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        fetchPortCode: async function () {
            try {
                let oModel = this.getView().getModel();
                let exItems = oModel.getData().masterScreenTable.items;
                let portCodeRes = await PortCodeAPI.fetchPortCode(oModel);
                if (exItems.length > 0) {
                    oModel.getData().masterScreenTable.items = [...exItems, ...portCodeRes];
                } else {
                    oModel.getData().masterScreenTable.items = portCodeRes;
                }
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onReset: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let data = this.emptyModelData();
            let getMasterTitle = oEvent.getSource()?.getParent().getTitle();
            if (getMasterTitle) {
                if (getMasterTitle.toLowerCase().includes('Vessel'.toLowerCase())) {
                    oData.advancedFilter = data.advancedFilter
                }
            }
            oModel.refresh();
        },
        clearModelSettings: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.oData;
            let data = this.emptyModelData()
            oData.advancedFilter = data.advancedFilter;
            oData.vesselGeneral = data.vesselGeneral;
            oData.masterScreenTable = data.masterScreenTable;
            oData.selections = data.selections;
            oModel.refresh(true);
        },
        loadVesselIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("tableVesselId");
                this._vessel_noData = this.getView().byId("txt_noData");
            }
            else {
                this._vessel_btnAddShippingLine = this.getView().byId("btnAddShippingLine");
                this._vessel_formId = this.getView().byId("veForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            VesselAPI.loadIds(isCreate, this._tableId, this._vessel_noData, this._vessel_btnAddShippingLine, this._vessel_formId, this.eMdl, this.pageId);
        },
        onAfterRendering: function (oModel, dialog) {
            let that = this;
            let oDialog = dialog, isScrollReached = false;
            /* Dialog scroll event attaching */
            var oDialogElement = oDialog?.getDomRef();
            oDialogElement?.getElementsByClassName("sapMScrollContVH")[0].addEventListener("scroll", function (event) {
                // This function will be executed when the Dialog is scrolled
                var element = event.target;
                // Check if you're within the tolerance range of the bottom
                if (element.scrollHeight - element.scrollTop - element.clientHeight < 1) {
                    if (oDialog?.getTitle().toLowerCase().includes('Shipping Line'.toLowerCase())) {
                        isScrollReached = ShippingLineAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchShippingLine();
                    }
                    if (oDialog?.getTitle().toLowerCase().includes('Vessel'.toLowerCase())) {
                        isScrollReached = VesselAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchVessel();
                    }
                    if (oDialog?.getTitle().toLowerCase().includes('Port Code'.toLowerCase())) {
                        isScrollReached = PortCodeAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchPortCode();
                    }
                }
            });
        },
        onPressVessel: async function () {
            let oModel = this.getView().getModel();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.vessel);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadVesselIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.bindShippingLine();
            this.handleTablePersoDialogConfirm();
        },
        onClearVessel: function (oEvent) {
            let Source = oEvent.getSource();
            let value = Source.getValue();
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (!value) oData.general.vesselID = null, oData.general.vesselName = null;
        },
        bindShippingLine: async function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let res = await VesselAPI.fetchMinShippingLine(oModel);
            oData.shippingLine = res;
            oData.shippingLineCollection = res;
            oModel.refresh(true);
        },
        onPressVesselEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._vesselTableId = this.getView().byId("tableVesselId");
            let selectedItem = this._vesselTableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.general.vesselID = selObj?.id;
                oData.general.vesselName = selObj?.name;
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
        },

        onCloseVesselDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
        },
        onPressVesselCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createVessel);
            this.loadVesselIds(false);
        },

        onCloseVesselCreateDialog: function () {
            BaseController.prototype.onCloseDialog.apply(this, arguments);
            this.byId("vesselCode").destroy();
        },
        onCloseVesselDetail: async function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseVesselCreateDialog();
            this.onPressVessel();
        },
        onAddShippingLineCode: function () {
            let oModel = this.getView().getModel();
            VesselAPI.onAddShippingLineCode(oModel);
        },
        onDeleteShippingLineCode: function (oEvent) {
            let oModel = this.getView().getModel();
            VesselAPI.onDeleteShippingLineCode(oModel, oEvent);
        },
        onChangeShippingLine: function (oEvent) {
            let oModel = this.getView().getModel();
            VesselAPI.onChangeShippingLine(oModel, oEvent);
        },
        onSaveVesselDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._vessel_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    postRes = await VesselAPI.postVessel(oModel);
                }
                else {
                    this.errorHandling();
                }
                if (postRes) {
                    this.showMasterScreenMessage();
                }
            }
            catch (error) {
                this.errorHandling(error);
            }
        },
        showMasterScreenMessage: function () {
            let that = this;
            let msg = that.getResourceProperty("veSavedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    let oModel = that.getView().getModel();
                    let modelData = that.emptyModelData();
                    oModel.getData().vesselGeneral = modelData.vesselGeneral;
                    oModel.getData().vesselDetails = modelData.vesselDetails;
                    oModel.refresh(true)
                },
            });
        },

        onCloseShippingLineDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.shippineLine);
        },
        onSaveShippingLineDetail: function () {
            this.onCloseDialog();
        },
        onPressSave: function (oEvent) {
            this.onNavBack();
        },
        onAddShippingLine: function (oEvent) {
            let oModel = this.getView().getModel("VesselMdl");
            let oData = oModel.getData();
            let eShippingLineCode = {
                shippingLine: null,
                vesselCode: null
            };
            if (oData.shippingLineCodes.length > 0) {
                oData.shippingLineCodes.push(eShippingLineCode);
            } else {
                oData.shippingLineCodes = [eShippingLineCode];
            }
            oModel.refresh(true);
        },
        onDeleteShippingLine: function (oEvent) {
            let oModel = this.getView().getModel("VesselMdl");
            let oData = oModel.getData();
            let sPath = oEvent.getParameter('listItem').getBindingContext('VesselMdl').getPath().split('/')[2];
            oData.shippingLineCodes.splice(sPath, 1);
            oModel.refresh(true);
        },
        sheetDetails: function () {
            if (this.masterScreenDialog.getTitle().toLowerCase().includes('Vessel'.toLowerCase())) {
                return VesselAPI.sheetDetails();
            }
            if (this.masterScreenDialog.getTitle().toLowerCase().includes('Shipping Line'.toLowerCase())) {
                return ShippingLineAPI.sheetDetails();
            }
            if (this.masterScreenDialog.getTitle().toLowerCase().includes('Port Code'.toLowerCase())) {
                return PortCodeAPI.sheetDetails();
            }
        }
    });
});
