sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Core',
    'sap/ui/core/Element',
    'com/lighthouse/utils/ErrorMessage',
    'com/lighthouse/utils/URLConstants',
], function (BaseController, JSONModel, MessagePopover, MessageItem, Message, coreLibrary, Core, Element, ErrorMessage, URLConstants)
{
    "use strict";
    var timerId, that;
    // shortcut for sap.ui.core.MessageType
    var MessageType = coreLibrary.MessageType;

    return BaseController.extend("com.lighthouse.init.Login", {
        onInit: function ()
        {
            that = this;
            that.getView().addStyleClass(that.getOwnerComponent().getContentDensityClass());
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("login").attachMatched(this._onObjectMatched, this);

            //validation related id parameters
            this.formId = this.getView().byId('loginForm');
            this.pageId = this.getView().byId('loginPage');
            this.popoverBtn = this.getView().byId('messagePopoverBtnLogin');
            //
            this.loginBtn = this.byId("loginBtn");
            this.verifyBtn = this.byId("verifyBtn");

        },
        _onObjectMatched: function ()
        {
            //Default theme
            sap.ui.getCore().applyTheme("sap_horizon");

            this.errorPopoveraParams();

            this.loginBtn.setVisible(true);
            this.verifyBtn.setVisible(false);
            this.loginModel();
            this.onPressChangePassword();
        },
        onAfterRendering: function ()
        {
            this.getView().addDelegate({
                onsapenter: function ()
                {
                    that.oView.getController().onPressLogin();
                }
            });
        },
        loginModel: function ()
        {
            let oModel = new JSONModel({ companyDB: null, userName: null, password: null, enable: true });
            this.getView().setModel(oModel, "loginModel");
        },
        errorPopoveraParams: function ()
        {
            //value state removing if existing state is thare means
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
        },
        handleMessagePopoverPress: function (oEvent)
        {
            //this.errorMessagePopover(oEvent.getSource());
        },
        onShowPassword: function (oEvent)
        {
            let oSource = oEvent.getSource();
            let type = oSource.getType() == 'Text';
            let getIcon = oSource.getValueHelpIconSrc();
            let show = ((oSource) =>
            {
                oSource.setValueHelpIconSrc("sap-icon://show");
                oSource.setType("Password");
            });
            let hide = ((oSource) =>
            {
                oSource.setValueHelpIconSrc("sap-icon://hide");
                oSource.setType("Text");
            });

            if (type)
            {
                show(oSource);
            } else
            {
                hide(oSource);
            }

            oSource.setValue(oSource.getValue());

        },
        onPressChangePassword: function (oEvent)
        {
            var cModel = this.getView().getModel('loginModel');
            cModel.getData().enable = true;
            cModel.refresh();
            this.loginBtn.setText("Login");
        },
        onVerifyToken: function (oEvent)
        {
            var cModel = this.getView().getModel('loginModel');
            this.loginModel();
            this.getRouter().navTo("dashboard");
        },
        onPressLogin: async function (oEvent)
        {
            var cModel = this.getView().getModel('loginModel');
            var enableProp = cModel.getData().enable;
            this.showLoading(true);
            try
            {
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId); //Error popover

                var valid = this.eMdl.getData();
                if (valid.length == 0)
                {
                    this.errorMessagePopoverClose();
                    if (enableProp == true)
                    {
                        let path = URLConstants.URL.login;
                        let reqData = cModel.getData();
                        let login = await this.restMethodPostLogin(path, reqData);
                        this.setStorage("userContext", login);
                        cModel.getData().enable = false;
                        cModel.refresh();
                        this.loginBtn.setVisible(false);
                        this.verifyBtn.setVisible(true);
                        this.showLoading(false);
                    }
                } else
                {
                    this.showLoading(false);
                }
            } catch (error)
            {
                this.showLoading(false);
                this.eMdl.getData().push(this.customErrorObject(error.errorDescription, this.pageId, this.popoverBtn, "Please enter the correct values"));
                this.eMdl.refresh();
            }
        }
    });
});
