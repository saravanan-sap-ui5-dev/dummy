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
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, URLConstants, ErrorMessage, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.container_type.AddEditContainerType", {
        formatter: Formatter,
        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("containertypeCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("containertypeEdit").attachMatched(this._onRouteEditMatched, this);
            let getSource = (id => this.getView().byId(id));
            [this.btnEdit, this.formId, this.pageId, this.popoverBtn] = [getSource("btnEdit"), getSource("ctForm"), getSource("page_addEditContainerType"), getSource("btnContainerTypeErr")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("ctHeaderTitle"));
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
            this.setTitle(this.getResourceProperty("ctHeaderTitle"));
            this.btnEdit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.fetchContainerTypeById();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.container_type;
            this.setModel();
            this.getView().setModel(new JSONModel({ items: [] }),"AttachmentMdl");
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
            if (sPreviousHash == "containertypeCreate") {
                navData.route = "containertype";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },

        setModel: function () { /* Set Model data for table*/
            let data = {
                route: this._route,
                item: this._item,
                containerType: {
                    code: null,
                    name: null,
                    description: null,
                    createdOn: null,
                    createdBy: null,
                    updatedOn: null,
                    updatedBy: null,
                    status: 2,
                    bulkPost: "false"
                },
            };
            this.getView().setModel(new JSONModel(data));
        },
        fetchContainerTypeById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.container_type_by_id.replace("{id}", this._item);
                let containerType = await this.restMethodGet(path);
                if (containerType) {
                    containerType.title = containerType.name + ' (' + containerType.code + ')';
                    containerType.statusText = this.masterData.status.find(ele => containerType.status === ele.value)?.description;
                    containerType.bulkPost = "false";
                    oModel.getData().containerType = containerType;
                    oModel.refresh(true);
                }
                this.fetchAttachmentsByFilter(this._moduleId, this._item);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        postContainerType: async function () {
            try {
                var that = this;
                let postMdl = this.getView().getModel();
                let postData = postMdl.getData().containerType;
                let aModel = this.getOwnerComponent().getModel('attachmentsMdl');
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    let path = URLConstants.URL.container_type_add;
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
                        this.getRouter().navTo("containertypeEdit", {
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
            let msg = !this._item ? that.getResourceProperty("ctSavedSuccessfully") : that.getResourceProperty("ctUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if(!that._item)  that.setModel();
                },
            });
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "containertypeCreate") {
                this.fetchContainerTypeById();
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
        },

    });
});
