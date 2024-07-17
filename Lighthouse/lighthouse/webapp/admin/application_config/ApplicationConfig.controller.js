sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "com/lighthouse/utils/ErrorMessage",
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter, URLConstants, ErrorMessage) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.admin.application_config.ApplicationConfig", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();
            this.getView().setModel(new JSONModel({ files: [] }), "filesModel");

            this.oRouter.getRoute("applicationConfig").attachMatched(this._onRouteMatched, this);

            let getSource = (id => this.getView().byId(id));
            [this.btnEdit, this.formId, this.pageId, this.popoverBtn] = [getSource("btnEdit"), getSource("sfConfig1"), getSource("pageAppConfig"), getSource("btnAppConfigError")];
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle("Application Configuration");
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.setModel();

            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                }),
                "visible"
            );

            this.fetchApplicationConfiguration(1);
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******

            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
            this.eMdl.setData([]);
        },
        setModel: function () {
            let data = {
                route: this._route,
                item: this._item,
                attachment_folder_path: null,
                archive_folder_path: null,
                archive_period: null
            };
            this.getView().setModel(new JSONModel(data));
        },
        fetchApplicationConfiguration: async function (key) {
            let oModel = this.getView().getModel();
            let data = oModel.getData();
            try {
                this.showLoading(true);
                let path = URLConstants.URL.app_config;
                let getRes = await this.restMethodGet(path);
                if(getRes)oModel.setData(getRes);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        onSave: async function () {
            try {
                let that = this,
                    oModel = this.getView().getModel(),
                    postData = oModel.getData(),
                    arfPath = postData?.archive_folder_path?.replaceAll(/(\\|\/)/g, "/"),
                    atfPath = postData?.attachment_folder_path?.replaceAll(/(\\|\/)/g, "/");
                if (!arfPath.substr(-1).includes("/")) {
                    arfPath += "/";
                }
                if (!atfPath.substr(-1).includes("/")) {
                    atfPath += "/";
                }
                postData.archive_folder_path = arfPath;
                postData.attachment_folder_path = atfPath;
                this.errorPopoverParams();
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    let path = URLConstants.URL.add_app_config;
                    let postRes = await this.restMethodPost(path, postData);
                    this.setStorage("userContext", { ...this.getStorage("userContext"), ...postRes });
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
            let msg = !this._item ? that.getResourceProperty("veSavedSuccessfully") : that.getResourceProperty("veUpdatedSuccessfully");
            sap.m.MessageBox.information(msg, {
                actions: [sap.m.MessageBox.Action.OK],
                onClose: function (sAction) {
                    that.fetchApplicationConfiguration(2);
                    // that.onPressCancel();
                },
            });
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
        onPressCancel: function () {
            let oEnabled = this.btnEdit.getEnabled();
            let oModel = this.getView().getModel();
            let data = oModel.getData();
            let vModel = this.getView().getModel("visible");
            this.onNavBack();
            /* if (vModel) {
                vModel.setData({
                    edit: oEnabled,
                    view: !oEnabled,
                });
            } else {
                this.getView().setModel(
                    new JSONModel({ edit: oEnabled, view: !oEnabled }),
                    "visible"
                );
            }
            this.btnEdit.setEnabled(!oEnabled); */

        },
    });
});
