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
    "com/lighthouse/utils/master_data_API/CustomerAPI",
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, URLConstants, ErrorMessage, History,CustomerAPI) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.container.AddEditContainer", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("containerDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("containerDetailEdit").attachMatched(this._onRouteEditMatched, this);

            let getSource = (id => this.getView().byId(id));
            [this.btnEdit, this.formId, this.pageId, this.popoverBtn, this.containerTypeId] = [getSource("btnEdit"), getSource("containerForm"), getSource("pageAddEditContainer"), getSource("btnContainerErr"), getSource("containerContainerTypeId")];
            this.paths={
                customer:"com.lighthouse.master_data.dialog.Customer",
                createCustomer:"com.lighthouse.master_data.dialog.createCustomer"
            };
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").blno ? oEvent.getParameter("arguments").blno : null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("coHeaderTitle")); 
            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                }),
                "visible"
            );
        },
        _onRouteEditMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("coHeaderTitle"));
            this.btnEdit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.fetchContainersById();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.containers;
            this.setModel();
            this.getView().setModel(new JSONModel({ items: [] }),"AttachmentMdl");
            this.fetchContainerType();
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
        },
        navAfterCreation: function () {
            //After navigated create to view set back nav to manage screen
            let oHistory, sPreviousHash, navData;
            navData = this.getModel("settings").getData();
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash == "containerDetailCreate") {
                navData.route = "containerMaster";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },
        emptyModelData: function () { /* Set Model data for table*/
            return {
                route: this._route,
                item: this._item,
                containers: {
                    containerNo: null,
                    type: null,
                    soc: null,
                    size: null,
                    ownedBy: null,
                    createdOn: null,
                    createdBy: null,
                    updatedOn: null,
                    updatedBy: null,
                    bulkPost: false, //For posting through screen
                    status: 2
                },
                containerTypeCollection: [],
                masterScreenGeneral: {
                    id: null,
                    status: 2,
                    bulkPost: false
                },
                advancedFilter: {
                    top: URLConstants.Paging.top,
                    skip: 0,
                    sortingKey: "CreateDate",
                    orderBy: "CreateDate desc, CreateTime desc"
                },
                masterScreenTable: {
                    mode: "SingleSelectLeft",
                    items: [],
                    visible: {
                        excelUploadDownload: false,
                    }
                },
                contactDetails: {
                    mode: "Delete",
                    items: [],
                    removedData: []
                },
                contactForm:{},
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
            }
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
        },
        onClearMasterField: function (oEvent) {  /* To remove the value if user erases master data */
            let Source = oEvent.getSource();
            let value = Source.getValue();
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getLabel = Source.getParent().getLabel().getText();
            if (getLabel.toLowerCase().includes('Owned By'.toLowerCase())) {
                if (!value) oData.containers.ownedBy = null, oData.containers.ownedByName = null;
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
        fetchContainersById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.containers_by_id.replace("{id}", this._item);
                let containers = await this.restMethodGet(path);
                if (containers) {
                    containers.statusText = containers.status === 1 ? 'Draft' : containers.status === 2 ? 'Active' : 'In-active';
                    oModel.getData().containers = containers;
                    oModel.refresh(true);
                }
                this.fetchAttachmentsByFilter(this._moduleId, this._item);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
         /* Master Data Functionalities Starts */
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
                    if (oDialog?.getTitle().toLowerCase().includes('Customer'.toLowerCase())) {
                        isScrollReached = CustomerAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchCustomer();
                    }
                }
            });
        },
        onSearch: async function (oEvent) {  // Getting master data
            let oModel = this.getView().getModel();
            let getMasterTitle = oEvent.getSource()?.getParent().getTitle();
            if (getMasterTitle) {
                oModel.getData().masterScreenTable.items = [];
                let filters = oModel.getData().advancedFilter;
                filters.skip = 0;
                filters.top = URLConstants.Paging.top;
                if (getMasterTitle.toLowerCase().includes('Customer'.toLowerCase())) {
                    await this.fetchCustomer();
                }
            }
            oModel.refresh(true);
        },
        onReset: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let data = this.emptyModelData();
            oData.advancedFilter = data.advancedFilter
            oModel.refresh();
        },
        clearModelSettings: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.oData;
            let data = this.emptyModelData()
            oData.advancedFilter = data.advancedFilter;
            oData.masterScreenGeneral = data.masterScreenGeneral;
            oData.masterScreenTable = data.masterScreenTable;
            oData.selections = data.selections;
            oModel.refresh(true);
        },
        sheetDetails: function () {
            if (this.masterScreenDialog.getTitle().toLowerCase().includes('Customer'.toLowerCase())) {
                return CustomerAPI.sheetDetails();
            }
        },
        showMasterScreenMessage: function () {
            var that=this;
            let msg = this.getResourceProperty("coSavedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    let oModel = that.getView().getModel();
                    let modelData = that.emptyModelData();
                    oModel.getData().masterScreenGeneral = modelData.masterScreenGeneral;
                    oModel.refresh(true)
                },
            });
        },
        /* Master Data Customer Starts */
        onPressCustomer: async function () {
            let oModel = this.getView().getModel();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.customer);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadCustomerIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        loadCustomerIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("customerTable");
                this._customer_noData = this.getView().byId("txt_noData");
            }
            else {
                this._customer_formId = this.getView().byId("cuForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
                this.contactTableId =  this.getView().byId("tableImportContact");
            }
            this.contactFormId = this.getView().byId("contactFormId");
            this.contactDialogueId = this.getView().byId("contactDialogueId");    
            CustomerAPI.loadIds(isCreate, this._tableId, this._customer_noData, this._customer_formId, this.eMdl, this.pageId);
        },
        fetchCustomer: async function () {
            try {
                let oModel = this.getView().getModel();
                await CustomerAPI.fetchCustomer(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onPressCustomerEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("customerTable");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.containers.ownedBy = selObj?.cardCode;
                oData.containers.ownedByName = selObj?.cardName;
                this.errorPopoverParams();
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
        },
        onCloseCustomerDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
        },
        onPressCustomerCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createCustomer);
            this.loadCustomerIds(false);
        },
        onChangeStatus: function () {
            let oModel = this.getView().getModel();
            CustomerAPI.onChangeStatus(oModel);
            let oData = oModel.getData();
            oData.general.valid = oData.general.status == 1 || oData.general.status == 2 ? "tYES" : "tNO";
            oData.general.frozen = oData.general.valid == "tYES" ? "tNO" : "tYES";
            oModel.refresh(true);
        },
        onAddContact:async function(){
            this.onCloseDialog();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.customer.AddContact");
            this.loadCustomerIds();
        },
        onRemoveContact: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getSelectedPath = this.contactTableId.getSelectedContextPaths();
            if (getSelectedPath.length > 0) {
                let originalArray = [...oData.contactDetails.items];
                let indices = [];
                getSelectedPath.forEach(e => {
                    indices.push(e.split("/")[3]);
                });
                indices.sort((a, b) => b - a); // Sort indices in descending order to avoid index shifting
                indices.forEach(e => {
                    if (originalArray[e].cardCode) {
                        originalArray[e].active = "tNO"; // Soft delete
                        oData.contactDetails.removedData.push(originalArray[e]);
                    }
                    oData.contactDetails.items.splice(e, 1);
                });
            };
            let getSelectedItems = this.contactTableId.getSelectedItems();
            getSelectedItems.forEach(e => e.setSelected(false));
            oModel.refresh(true);
        },
        onSubmitContact: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let contactFormData = oData.contactForm;
            ErrorMessage.formValidation(this.contactFormId, this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
                if (oData.index == undefined) oData.contactDetails.items.push(contactFormData); //create new table row.
                else {
                    oData.contactDetails.items[oData.index] = contactFormData;//update the contact table row.
                }
                oModel.refresh(true);
                this.onCloseContactDialog();
            }
            else {
                this.errorHandling();
            }
        },
        onPressContact: async function (oEvent) {
            this.onCloseDialog();
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.customer.AddContact");
            this.loadCustomerIds(true);
            let getIndex = oEvent.getSource().getBindingContext().getPath().split('/')[3];
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.tableData = JSON.parse(JSON.stringify(rowObj));
            oData.contactForm = rowObj;
            oData.index = getIndex;
            oModel.refresh(true);
        },
        onCloseContactDialog:async function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (oEvent) {
                oData.contactDetails.items[oData.index] = this.tableData;
                oModel.refresh(true);
            }
            oData.contactForm = {}, delete oData.index;
            this.errorPopoverParams();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createCustomer);
            this.loadCustomerIds(false);
        },
        onSaveCustomerDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._customer_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    this.oDialog.setBusy(true);
                    postRes = await CustomerAPI.postCustomer(oModel);
                    this.oDialog.setBusy(false);
                }
                else {
                    this.errorHandling();
                }
                if (postRes) {
                    this.showMasterScreenMessage();
                }
            }
            catch (error) {
                this.oDialog.setBusy(false);
                this.errorHandling(error);
            }
        },
        onCloseCustomerDetail: async function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseDialog();
            this.onPressCustomer();
        },
         /* Master Data Customer Ends */
        onPressSave: function () {
            this.postContainers();
        },
        postContainers: async function () {
            try {
                var that = this;
                let postMdl = this.getView().getModel();
                let postData = postMdl.getData().containers;
                let aModel = this.getOwnerComponent().getModel('attachmentsMdl');
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    let path = URLConstants.URL.containers_add;
                    postData.bulkPost = false;
                    let postRes = await this.restMethodPost(path, Array.of(postData));//For both bulk and single upload

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
                        this.getRouter().navTo("containerDetailEdit", {
                            id: postRes.id
                        });
                    }
                    this.showMessage();
                    this.showLoading(false);
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
            let msg = !this._item ? that.getResourceProperty("coSavedSuccessfully") : that.getResourceProperty("coUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if(!that._item)  that.setModel();
                },
            });
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "containerDetailCreate") {
                this.fetchContainersById();
                let oEnabled = this.btnEdit.getEnabled();
                let vModel = this.getView().getModel("visible");
                if (vModel) {
                    vModel.setData({
                        edit: oEnabled,
                        view: !oEnabled,
                    });
                } else {
                    this.getView().setModel(
                        new JSONModel({
                            edit: oEnabled,
                            view: !oEnabled,
                        }),
                        "visible"
                    );
                }
                this.btnEdit.setEnabled(!oEnabled);
            } else {
                this.onNavBack();
            }
        },
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                });
            } else {
                this.getView().setModel(
                    new JSONModel({
                        edit: oEnabled,
                        view: !oEnabled,
                    }),
                    "visible"
                );
            }
            if (oEnabled) {
                oSource.setEnabled(false);
            } else {
                oSource.setEnabled(true);
            }
        }
    });
});
