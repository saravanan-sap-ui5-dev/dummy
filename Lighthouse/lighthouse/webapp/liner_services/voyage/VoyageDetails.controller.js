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
    "com/lighthouse/utils/ErrorMessage",
    "sap/ui/core/routing/History",
    "com/lighthouse/utils/master_data_API/VesselAPI",
    "com/lighthouse/utils/master_data_API/ShippingLineAPI",
    "com/lighthouse/utils/master_data_API/PortCodeAPI"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, URLConstants, ErrorMessage, History, VesselAPI, ShippingLineAPI, PortCodeAPI) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.voyage.VoyageDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("voyagesDetailEdit").attachMatched(this._onRouteMatched, this);

            this.paths = {
                addBLView: "com.lighthouse.liner_services.dialog.AddBLView",
                addContainer: "com.lighthouse.liner_services.dialog.AddContainer",
                uploadManifest: "com.lighthouse.liner_services.dialog.UploadManifest",
                portCode: "com.lighthouse.master_data.dialog.PortCode",
                createPortCode: "com.lighthouse.master_data.dialog.CreatePortCode",
                vessel: "com.lighthouse.master_data.dialog.Vessel",
                createVessel: "com.lighthouse.master_data.dialog.CreateVessel",
                shippineLine: "com.lighthouse.master_data.dialog.ShippingLine",
                createShippingLine: "com.lighthouse.master_data.dialog.CreateShippingLine"
            };

            [this.sbtnDischarge, this.sbtnLoad, this.btnEdit, this.pageId, this.formId, this._noData, this.popoverBtn,] = [this.byId("sbtnDischarge"), this.byId("sbtnLoad"), this.byId("btnEdit"), this.byId("page_editVoyages"), this.getView().byId("voyageFormId"), this.getView().byId("txt_noData"), this.getView().byId("btnVoyageError")];
            this.masterData = this.getStorage("master_data");
            VesselAPI.baseControllerFunctions(this.masterData, this.pageId);
            ShippingLineAPI.baseControllerFunctions(this.masterData, this.pageId);
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle("Voyage");
            this.btnEdit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false
                }),
                "visible"
            );
            this.btnEdit.setEnabled(true);
            this.fetchVoyageById();
            this.fetchShipment();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set
            this.sbtnDischarge.fireSelectionChange();//retaining the selection of transshipment view segment button - discharge 
            this.sbtnLoad.fireSelectionChange();//retaining the selection of transshipment view segment button - load 
        },
        navAfterCreation: function () {
            //After navigated create to view set back nav to manage screen
            let oHistory, sPreviousHash, navData;
            navData = this.getModel("settings").getData();
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash == "voyagesDetailCreate") {
                navData.route = "voyagesMaster";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.voyage;
            this.setModel();
            this.getView().setModel(new JSONModel({ items: [] }), "AttachmentMdl");
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
                    mode: "None",
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
        errorPopoverParams: function (formId) {
            // formId = formId == "main" ? "basic" : formId;
            // let ids = {
            //     basic: "sfGeneral",
            //     attachment: "sf_attachment",
            //     property: "sf_PropHierarchy",
            // };
            // this.formId = this.getView().byId(ids[formId]);
            // this.pageId = this.getView().byId("page_editVoyages");
            // this.popoverBtn = this.getView().byId("btnVoyageError");

            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel("errors");
            ErrorMessage.removeValueState(this.formId, this.eMdl);

            this.eMdl.setData([]);
            this.errorData = [];
        },
        fetchVoyageById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.voyages_by_id.replace("{id}", this._item);
                let voyage = await this.restMethodGet(path);
                if (voyage) {
                    voyage.title = voyage.vesselName + '/' + voyage.voyageIn;
                    voyage.statusText = this.masterData.status.find(ele => voyage.status === ele.value)?.description;
                    oModel.getData().general = voyage;
                    oModel.refresh(true);
                }
                this.fetchAttachmentsByFilter(this._moduleId, this._item);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        fetchShipment: async function () {
            let oModel = this.getView().getModel();
            try {
                this.showLoading(true);
                let request = {
                    voyageID: this._item,
                    sortingKey: "id",
                    orderBy: "desc",
                    pageNumber: 1,
                    pageSize: URLConstants.Paging.page_size,
                    stringType: false
                }
                let path = URLConstants.URL.shipment_all;
                let shipment = await this.restMethodPost(path, request);
                if (shipment.length > 0) {
                    shipment.map(e => {
                        e.status = this.masterData.status.find(ele => e.status === ele.value)?.description;
                        e.type = "Navigation";
                    })
                }
                oModel.getData().imports.items = shipment.filter(e => e.blType == 1);
                oModel.getData().exports.items = shipment.filter(e => e.blType == 2);
                //    if (!(customers.length > 0)) {
                //       this._noData.setText(
                //          "No data found. Try adjusting the search or filter criteria."
                //       );
                //    } else {
                //       this._noData.setText(
                //          'To start, set the relevant filters and choose "Go".'
                //       );
                //    }
                oModel.refresh();
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
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
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("containerInUseDetailEdit", {
                id: rowObj.id
            });
        },
        onImportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("importsDetailEdit", {
                id: rowObj.id
            });
        },
        onExportItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("exportsDetailEdit", {
                id: rowObj.id
            });
        },
        onAddContainer: function () {
            this.onOpenDialog(this.paths.addContainer);
        },
        onAddBLView: function () {
            this.onOpenDialog(this.paths.addBLView);
        },
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let data = vModel.getData();
                data.edit = oEnabled;
                data.view = !oEnabled;
            }
            if (oEnabled) {
                oSource.setEnabled(false);
            } else {
                oSource.setEnabled(true);
            }
            vModel.refresh(true);
        },
        onPressCancel: function () {
            let oEnabled = this.btnEdit.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                let data = vModel.getData();
                data.edit = oEnabled;
                data.view = !oEnabled;
            }
            this.btnEdit.setEnabled(!oEnabled);
            vModel.refresh(true);
        },
        _closeDialog: function () {
            this.oAddLinkDialog.then(function (oDialog) {
                this.oDialog = oDialog;
                this.oDialog.close();
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                oData.url = undefined;
                oData.description = undefined;
                oData.valueStateUrl = "None";
                oData.valueStateDes = "None";
                oModel.refresh();
            }.bind(this));
        },
        onPressAddLink: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let regEx = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            let match = regEx.test(oData.url);
            if (oData.url && oData.description && match) {
                let obj = {
                    "fileName": oData.url,
                    "url": oData.url,
                    "mediaType": "url",
                    "statuses": [
                        {
                            "title": "Description",
                            "text": oData.description,
                            "active": false
                        }
                    ]
                };
                oData.items.push(obj);
                oModel.refresh();
                this._closeDialog();
            } else {
                oData.valueStateUrl = "Error";
                oData.valueStateDes = oData.description ? "Error" : "None";
                oModel.refresh();
            }
        },
        onChangeUrl: function (oEvent) {
            let url = oEvent.getParameter("value");
            let regEx = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            let match = regEx.test(url);
            if (match) {
                oEvent.getSource().setValueState("None");
            } else {
                oEvent.getSource().setValueState("Error");
                oEvent.getSource().setValueStateText("Invalid URL!");
            }
        },
        onAfterItemRemoved: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let oSource = oEvent.getSource();
            let itemCount = oSource.getItems().length;
            let mediaType = oEvent.getParameter("item").getProperty("mediaType");
            if (mediaType == "url") {
                let index = oEvent.getParameter('item').getBindingContext().getPath().split("/")[2];
                oData.items.splice(index, 1);
                oModel.refresh();
            }
            this.byId("lb_attachmentCount").setText("Items(" + itemCount + ")");
        },
        onUploadCompleted: function (oEvent) {
            let oSource = oEvent.getSource();
            let itemCount = oSource.getItems().length;
            this.byId("lb_attachmentCount").setText("Items(" + itemCount + ")");
        },
        onUploadManifest: function (oEvent) {
            //this.oRouter.navTo('uploadManifest')
            this.onOpenDialog(this.paths.uploadManifest);
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
                    that.fetchVoyageById();
                },
            });
        },
        onPressPortCode: function () {
            this.onOpenDialog(this.paths.portCode);
        },
        onPressPortCodeCreate: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.createPortCode);
        },
        onSavePortCodeDetail: function () {
            this.onCloseDialog();
        },
        onPressPortCodeEdit: function () {
            this.onCloseDialog();
        },
        onClosePortCodeDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.portCode);
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
        onPressVesselCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createVessel);
            this.loadVesselIds(false);
        },
        onCloseVesselDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
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
        onCloseShippingLineDetail: function () {
            this.onCloseDialog();
            this.onOpenDialog(this.paths.shippineLine);
        },
        onSaveShippingLineDetail: function () {
            this.onCloseDialog();
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
        onPressSave: function (oEvent) {
            //this.onNavBack();
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
