sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/master_data_API/ContainerAPI",
    "com/lighthouse/utils/master_data_API/CargoTypeAPI",
    "com/lighthouse/utils/master_data_API/CustomsPackageCodeAPI",
    "com/lighthouse/utils/master_data_API/HSCodeAPI",
    "com/lighthouse/utils/URLConstants",
    "sap/ui/core/routing/History",
    "com/lighthouse/utils/ErrorMessage",
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, ContainerAPI,CargoTypeAPI, CustomsPackageCodeAPI, HSCodeAPI, URLConstants, History, ErrorMessage) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.container.ContainerDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("containerInUseDetailEdit").attachMatched(this._onRouteEditMatched, this);
            this.paths = {
                shippineLine: "com.lighthouse.liner_services.container.fragments.ShippingLine",
                createShippingLine: "com.lighthouse.liner_services.container.fragments.CreateShippingLine",
                container: "com.lighthouse.master_data.dialog.Container",
                createContainer: "com.lighthouse.master_data.dialog.CreateContainer",
                cargoType: "com.lighthouse.master_data.dialog.CargoType",
                createCargoType: "com.lighthouse.master_data.dialog.CreateCargoType",
                customsPackageCode: "com.lighthouse.master_data.dialog.CustomsPackageCode",
                createCustomsPackageCode: "com.lighthouse.master_data.dialog.CreateCustomsPackageCode",
                hsCode: "com.lighthouse.master_data.dialog.HSCode",
                createHsCode: "com.lighthouse.master_data.dialog.CreateHSCode"

            };
            [this.pageId, this.popoverBtn, this.formId, this.btn_Edit, this.cargoDetailTableId] = [this.getView().byId("page_ContainerDetails"), this.getView().byId("btnContainerInUseDetailErr"), this.getView().byId("containerInUseForm"), this.getView().byId("btnEdit"), this.getView().byId("cargoDetailTableId")];
            this.masterData = this.getStorage("master_data");
            this.masterData = this.getStorage("master_data");
            ContainerAPI.baseControllerFunctions(this.masterData, this.pageId);
            CargoTypeAPI.baseControllerFunctions(this.masterData, this.pageId);
            CustomsPackageCodeAPI.baseControllerFunctions(this.masterData, this.pageId);
            HSCodeAPI.baseControllerFunctions(this.masterData, this.pageId);
        },
        _onRouteEditMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id ? oEvent.getParameter("arguments").id : null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.resetPersoDialog();
            this.setTitle(this.getResourceProperty("coiuHeaderTitle"));
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                    add: true,
                }),
                "visible"
            );
            this.btn_Edit.setEnabled(true);
            this.fetchContainerInUseById();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set

        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.Containers_In_Use;
            this.setModel();
            this.getView().setModel(new JSONModel({ items: [] }), "AttachmentMdl");
            this.fetchContainerType();
        },
        errorPopoverParams: function (formId) {
            //******Set Initially Empty Error Mdl******
            this.eMdl = this.getOwnerComponent().getModel("errors");
            ErrorMessage.removeValueState(this.formId, this.eMdl);

            this.eMdl.setData([]);
            this.errorData = [];
        },
        navAfterCreation: function () {
            //After navigated create to view set back nav to manage screen
            let oHistory, sPreviousHash, navData;
            navData = this.getModel("settings").getData();
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash == "containerInUseDetailCreate") {
                navData.route = "containerMasterInUse";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },
        emptyModelData: function () {
            return {
                route: this._route,
                item: this._item,
                general: {
                    size: null,
                    sealNumber: null,
                    tempratureFrom: null,
                    onHold: null,
                    status: 2,
                    soc: null,
                    type: null,
                    operator: null,
                    to: null,
                    damages: null,
                    remarks: null,
                    dischargeDate: null,
                    loadDate: null,
                    fullOutDate: null,
                    emptyInDate: null,
                    emptyOutDate: null,
                    fullInDate: null,
                    dueDate: null,
                },
                cargoDetails: {
                    mode: "MultiSelect",
                    items: [],
                    removedData: []
                },
                MasterScreenGeneral: {
                    id: null,
                    status: 2,
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
                selections: {
                    isResetSelected: false,
                    isSortSelected: false
                },
                containerTypeCollection: [],
                cargoTypeForm: {},
            }
        },
        setModel: function () {
            let data = this.emptyModelData();
            this.getView().setModel(new JSONModel(data));
        },
        fetchContainerInUseById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.container_in_use_by_id.replace("{id}", this._item);
                let container = await this.restMethodGet(path);
                if (container) {
                    container.title = container.vesselName + '/' + container.voyageIn;
                    container.statusText = this.masterData.status.find(ele => container.status === ele.value)?.description;
                    if(oModel.getData().containerTypeCollection && container.size )container.size_type = this.masterData.container_size.find(ele=>container.size == ele.value)?.description + '/' + oModel.getData()?.containerTypeCollection.find(e=>e.id == container.type)?.name;
                    container.cargoDetails.map(e=>{
                        e.fclOrLclText = this.masterData.fcl_lcl.find(ele => e.fclOrLcl === ele.value)?.description;
                        e.oogText = this.masterData.yes_or_no.find(ele => e.oog === ele.value)?.description;
                        e.partText = this.masterData.yes_or_no.find(ele => e.part === ele.value)?.description;
                    })
                    oModel.getData().general = container;
                    oModel.getData().cargoDetails.items = container.cargoDetails.filter(e=>e.status == 2);
                    oModel.getData().cargoDetails.removedData = container.cargoDetails.filter(e=>e.status == 3);
                    oModel.refresh(true);
                }
                this.fetchAttachmentsByFilter(this._moduleId, this._item);
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
                let res = await ContainerAPI.fetchContainerType();
                oModel.getData().containerTypeCollection = res;
                oModel.refresh(true);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        handleChangeDateTimeRange: function (oEvent) {
            let oModel = this.getView().getModel();
            let source = oEvent.getSource();
            let value = source?.getDateValue();
            let bindingInfo = source?.getBindingInfo("value");
            let bindingPath = bindingInfo?.binding.getBindings()[1].getPath();
            if (value && bindingPath) {
                let isoString = value.toISOString();
                oModel.getData().general[bindingPath] = isoString;
            }
            oModel.refresh(true);
        },
        /* Cargo Details table functionalities starts*/
        onAddCargo: async function (oEvent) {
            await this.onOpenDialog("com.lighthouse.liner_services.container.fragments.AddCargo");
            this.cargoFormId = this.getView().byId("cargoFormId");
        },
        onRemoveCargo: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getSelectedPath = this.cargoDetailTableId.getSelectedContextPaths();
            if (getSelectedPath.length > 0) {
                let originalArray = [...oData.cargoDetails.items];
                let indices = [];
                getSelectedPath.forEach(e => {
                    indices.push(e.split("/")[3]);
                });
                indices.sort((a, b) => b - a); // Sort indices in descending order to avoid index shifting
                indices.forEach(e => {
                    if (originalArray[e].id) {
                        originalArray[e].status = 3; // Soft delete
                        oData.cargoDetails.removedData.push(originalArray[e]);
                    }
                    oData.cargoDetails.items.splice(e, 1);
                });
            };
            let getSelectedItems = this.cargoDetailTableId.getSelectedItems();
            getSelectedItems.forEach(e => e.setSelected(false));
            oModel.refresh(true);
        },
        onPressCargoItem: async function (oEvent) {
            await this.onOpenDialog("com.lighthouse.liner_services.container.fragments.AddCargo");
            this.cargoFormId = this.getView().byId("cargoFormId");
            if (oEvent) {
                let getIndex = this.cargoDetailTableId.indexOfItem(oEvent.getSource());
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                var oItem = oEvent.getSource();
                var oBindingContext = oItem.getBindingContext();
                var rowObj = oBindingContext.getObject();
                this.tableData = JSON.parse(JSON.stringify(rowObj));
                oData.cargoTypeForm = rowObj;
                oData.index = getIndex;
                oModel.refresh(true);
            }
        },
        onClearMasterField: function (oEvent) {  /* To remove the value if user erases master data */
            let Source = oEvent.getSource();
            let value = Source.getValue();
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getLabel = Source.getParent().getLabel().getText();
            if (getLabel.toLowerCase().includes('Container No'.toLowerCase())) {
                if (!value) oData.general.containerNumber = null, oData.general.size = null, oData.general.soc = null, oData.general.type = null
            }
            else if (getLabel.toLowerCase().includes('Cargo Type Code'.toLowerCase())) {
                if (!value) oData.cargoTypeForm.cargoTypeCode = null, oData.cargoTypeForm.cargoType = null;
            }
            else if (getLabel.toLowerCase().includes('Customs Code'.toLowerCase())) {
                if (!value) oData.cargoTypeForm.customsCode = null, oData.cargoTypeForm.customsType = null;
            }
            else if (getLabel.toLowerCase().includes('HS Code'.toLowerCase())) {
                if (!value) oData.cargoTypeForm.hsCode = null, oData.cargoTypeForm.hsType = null;
            }
        },
        onSubmitCargo: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let cargoFormData = oData.cargoTypeForm;
            cargoFormData.fclOrLclText = this.masterData.fcl_lcl.find(e => e.value == cargoFormData?.fclOrLcl)?.description;
            cargoFormData.partText = this.masterData.yes_or_no.find(e => e.value == cargoFormData?.part)?.description;
            cargoFormData.oogText = this.masterData.yes_or_no.find(e => e.value == cargoFormData?.oog)?.description;
            if (!cargoFormData.blNumber) cargoFormData.blNumber = null
            ErrorMessage.formValidation(this.cargoFormId, this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
                if (oData.index == undefined) oData.cargoDetails.items.push(cargoFormData); //create new table row.
                else {
                    oData.cargoDetails.items[oData.index] = cargoFormData;//update the contact table row.
                }
                oModel.refresh(true);
                this.onCloseCargoFormDialog();
            }
            else {
                this.errorHandling();
            }
        },
        onCloseCargoFormDialog: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (oEvent) {
                oData.cargoDetails.items[oData.index] = this.tableData;
            }
            oData.cargoTypeForm = {}, delete oData.index;
            oModel.refresh(true);
            this.errorPopoverParams();
            BaseController.prototype.onCloseDialog.apply(this, arguments);
        },
        /* Cargo Details table functionalities Ends*/
        postContainersInUse: async function () {
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
                    let path = URLConstants.URL.container_in_use_add;
                    let mergeCargoDetails = [...oData.cargoDetails.items, ...oData.cargoDetails.removedData]; //Merge active and inactive records.
                    let postData = { ...oData.general, cargoDetails: mergeCargoDetails };
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
                        this.getRouter().navTo("containerInUseDetailEdit", {
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
            let msg = !this._item ? that.getResourceProperty("coSavedSuccessfully") : that.getResourceProperty("coUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    that.fetchContainerInUseById();
                },
            });
        },
        onPressCancel: function () {
            this.onNavBack();
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
                    if (oDialog?.getTitle().toLowerCase().includes('Container'.toLowerCase())) {
                        isScrollReached = ContainerAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchContainer();
                    }
                    if (oDialog?.getTitle().toLowerCase().includes('Cargo Type'.toLowerCase())) {
                        isScrollReached = CargoTypeAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchCargoType();
                    }
                    if (oDialog?.getTitle().toLowerCase().includes('Customs Package Code'.toLowerCase())) {
                        isScrollReached = CustomsPackageCodeAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchCustomsPackageCode();
                    }
                    if (oDialog?.getTitle().toLowerCase().includes('HS Code'.toLowerCase())) {
                        isScrollReached = HSCodeAPI.onAfterRendering(oModel);
                        if (isScrollReached) that.fetchHsCode();
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
                filters.pageNumber = 1;
                if (getMasterTitle.toLowerCase().includes('Container'.toLowerCase())) {
                    await this.fetchContainer();
                }
                else if (getMasterTitle.toLowerCase().includes('Cargo Type'.toLowerCase())) {
                    await this.fetchCargoType();
                }
                else if (getMasterTitle.toLowerCase().includes('Customs Package Code'.toLowerCase())) {
                    await this.fetchCustomsPackageCode();
                }
                else if (getMasterTitle.toLowerCase().includes('HS Code'.toLowerCase())) {
                    await this.fetchHsCode();
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
            oData.MasterScreenGeneral = data.MasterScreenGeneral;
            oData.masterScreenTable = data.masterScreenTable;
            oData.selections = data.selections;
            oModel.refresh(true);
        },
        sheetDetails: function () {
            if (this.masterScreenDialog.getTitle().toLowerCase().includes('Container'.toLowerCase())) {
                return ContainerAPI.sheetDetails();
            }
            else if (this.masterScreenDialog.getTitle().toLowerCase().includes('Cargo Type'.toLowerCase())) {
                return CargoTypeAPI.sheetDetails();
            }
            else if (this.masterScreenDialog.getTitle().toLowerCase().includes('Customs Package Code'.toLowerCase())) {
                return CustomsPackageCodeAPI.sheetDetails();
            }
            else if (this.masterScreenDialog.getTitle().toLowerCase().includes('HS Code'.toLowerCase())) {
                return HSCodeAPI.sheetDetails();
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
                    oModel.getData().MasterScreenGeneral = modelData.MasterScreenGeneral;
                    oModel.refresh(true)
                },
            });
        },
        /* Master Data Container Starts */
        onPressContainer: async function () {
            let oModel = this.getView().getModel();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.container);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadContainerIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        loadContainerIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("table_Containers");
                this._container_noData = this.getView().byId("txt_noData");
            }
            else {
                this._container_formId = this.getView().byId("containerForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            ContainerAPI.loadIds(isCreate, this._tableId, this._container_noData, this._container_formId, this.eMdl, this.pageId);
        },
        fetchContainer: async function () {
            try {
                let oModel = this.getView().getModel();
                await ContainerAPI.fetchContainer(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onPressContainerEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("table_Containers");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.general.containerNumber = selObj?.containerNo;
                oData.general.size = this.masterData.container_size.find(e => e.description == selObj?.size)?.value;
                oData.general.soc = this.masterData.yes_or_no.find(e => e.description == selObj?.soc)?.value;
                oData.general.type = selObj?.containerType;
                this.errorPopoverParams();
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
        },
        onCloseContainerDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
        },
        onPressContainerCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createContainer);
            this.loadContainerIds(false);
        },
        onSaveContainerDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._container_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    postRes = await ContainerAPI.postContainer(oModel);
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
        onCloseContainerDetail: async function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseDialog();
            this.onPressContainer();
        },
        /* Master Data Container Ends */
        /* Master Data Cargo Type Starts */
        onPressCargoType: async function () {
            let oModel = this.getView().getModel();
            this.onCloseDialog();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.cargoType);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadCargoTypeIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        loadCargoTypeIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("table_CargoType");
                this._cargoType_noData = this.getView().byId("txt_noData");
            }
            else {
                this._cargoType_formId = this.getView().byId("caForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            CargoTypeAPI.loadIds(isCreate, this._tableId, this._cargoType_noData, this._cargoType_formId, this.eMdl, this.pageId);
        },
        fetchCargoType: async function () {
            try {
                let oModel = this.getView().getModel();
                await CargoTypeAPI.fetchCargoType(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onPressCargoTypeEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("table_CargoType");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.cargoTypeForm.cargoTypeCode = selObj?.code;
                oData.cargoTypeForm.cargoType = selObj?.name;
                this.errorPopoverParams();
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
            this.onAddCargo();
        },
        onCloseCargoTypeDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
            this.onAddCargo();
        },
        onPressCargoTypeCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createCargoType);
            this.loadCargoTypeIds(false);
        },
        onSaveCargoTypeDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._cargoType_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    postRes = await CargoTypeAPI.postCargoType(oModel);
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
        onCloseCargoTypeDetail: function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseDialog();
            this.onPressCargoType();
        },
        /* Master Data Cargo Type Ends */
        /* Master Data Customs Package Code Starts */
        onPressCustomsPackageCode: async function () {
            let oModel = this.getView().getModel();
            this.onCloseDialog();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.customsPackageCode);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadCpcIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        loadCpcIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("tableCustomsPackageCodeId");
                this._cpc_noData = this.getView().byId("txt_noData");
            }
            else {
                this._cpc_formId = this.getView().byId("cpcForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            CustomsPackageCodeAPI.loadIds(isCreate, this._tableId, this._cpc_noData, this._cpc_formId, this.eMdl, this.pageId);
        },
        fetchCustomsPackageCode: async function () {
            try {
                let oModel = this.getView().getModel();
                await CustomsPackageCodeAPI.fetchCustomsPackageCode(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onPressCpcEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("tableCustomsPackageCodeId");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.cargoTypeForm.customsCode = selObj?.code;
                oData.cargoTypeForm.customsType = selObj?.name;
                this.errorPopoverParams();
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
            this.onAddCargo();
        },
        onCloseCpcDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
            this.onAddCargo();
        },
        onPressCpcCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createCustomsPackageCode);
            this.loadCpcIds(false);
        },
        onSaveCpcDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._cpc_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    postRes = await CustomsPackageCodeAPI.postCpc(oModel);
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
        onCloseCpcDetail: function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseDialog();
            this.onPressCustomsPackageCode();
        },
        /* Master Data Customs Package Code Ends */
        /* Master Data HS Code Starts */
        onPressHsCode: async function () {
            let oModel = this.getView().getModel();
            this.onCloseDialog();
            this.masterScreenDialog = await this.onOpenDialog(this.paths.hsCode);
            this.onAfterRendering(oModel, this.masterScreenDialog);
            this.loadHsCodeIds(true);
            this.sortDialog?.getSortItems().forEach(e => e.setSelected(false))  //To remove sort and group if it previously has
            this.sortDialog?.setSortDescending(true);
            this.groupDialog?.getGroupItems().forEach(e => e.setSelected(false))
            this.groupDialog?.setSelectedGroupItem(null);
            this.handleTablePersoDialogConfirm();
        },
        loadHsCodeIds: function (isCreate) {
            if (isCreate) {
                this._tableId = this.getView().byId("tableHSCode");
                this._hsCode_noData = this.getView().byId("txt_noData");
            }
            else {
                this._hsCode_formId = this.getView().byId("hsForm");
                this.eMdl = this.getOwnerComponent().getModel("errors");
            }
            HSCodeAPI.loadIds(isCreate, this._tableId, this._hsCode_noData, this._hsCode_formId, this.eMdl, this.pageId);
        },
        fetchHsCode: async function () {
            try {
                let oModel = this.getView().getModel();
                await HSCodeAPI.fetchHsCode(oModel);
                oModel.refresh(true);
            } catch (error) {
                this.errorHandling(error);
            }
        },
        onPressHsCodeEdit: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            this._tableId = this.getView().byId("tableHSCode");
            let selectedItem = this._tableId?.getSelectedItem();
            let bindingContext = selectedItem?.getBindingContext()
            let selObj = bindingContext?.getObject();
            if (selObj) {
                oData.cargoTypeForm.hsCode = selObj?.code;
                oData.cargoTypeForm.hsType = selObj?.name;
                this.errorPopoverParams();
            }
            oModel.refresh(true);
            this.clearModelSettings();
            this.onCloseDialog();
            this.onAddCargo();
        },
        onCloseHsCodeDialog: function () {
            this.clearModelSettings();
            this.oDialog = this.masterScreenDialog; //As sort and group dialog follows same variable so to use different variable for masterscren dialog.
            this.onCloseDialog();
            this.onAddCargo();
        },
        onPressHsCodeCreate: async function () {
            this.clearModelSettings();
            this.onCloseDialog();
            await this.onOpenDialog(this.paths.createHsCode);
            this.loadHsCodeIds(false);
        },
        onSaveHsCodeDetail: async function () {
            try {
                let oModel = this.getView().getModel();
                ErrorMessage.formValidation(this._hsCode_formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                let postRes = false;
                if (valid.length == 0) {
                    postRes = await HSCodeAPI.postHsCode(oModel);
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
        onCloseHsCodeDetail: function () {
            this.errorPopoverParams();
            this.clearModelSettings();
            this.onCloseDialog();
            this.onPressHsCode();
        },
        /* Master Data HS Code Ends */
        /* Master Data Functionalities Ends */
        onPressCancel: function () {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                    add: !oEnabled,
                    create: false
                });
            } else {
                this.getView().setModel(
                    new JSONModel({
                        edit: oEnabled,
                        view: !oEnabled,
                        add: !oEnabled,
                        create: false
                    }),
                    "visible"
                );
            }
            this.btn_Edit.setEnabled(!oEnabled);

        },
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                    add: !oEnabled,
                    create: false
                });
            } else {
                this.getView().setModel(
                    new JSONModel({
                        edit: oEnabled,
                        view: !oEnabled,
                        add: !oEnabled,
                        create: false
                    }),
                    "visible"
                );
            }
            if (oEnabled) {
                oSource.setEnabled(false);
            } else {
                oSource.setEnabled(true);
            }
        },
    });
});
