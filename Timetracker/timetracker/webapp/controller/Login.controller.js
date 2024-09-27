sap.ui.define([
"com/propertyzone/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Core',
    'sap/ui/core/Element',
    'com/propertyzone/utils/ErrorMessage'
    // 'com/app/customerportal/controller/Constant',
], function (BaseController, JSONModel, MessagePopover, MessageItem, Message, coreLibrary, Core, Element, ErrorMessage) {
    "use strict";

    return Controller.extend("com.timetracker.controller.Login", {
        onInit: function () {
            that = this;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("login").attachMatched(this._onObjectMatched, this);

            //validation related id parameters
            this.formId = this.getView().byId('loginForm');
            this.pageId = this.getView().byId('loginPage');
            this.popoverBtn = this.getView().byId('messagePopoverBtnLogin');
            //
            this.loginBtn = this.getView().byId("loginBtn");
            var oModel = new JSONModel({ email: "", password: "", enable: true })
            this.oView = this.getView();
            this.oView.setModel(oModel, "loginModel");
        },
        _onObjectMatched: function () {
            this.onPressChangePassword();
            //Default theme
            sap.ui.getCore().applyTheme("sap_horizon");
            //value state removing if existing state is thare means
            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState([this.formId], this.eMdl);
        },
        onAfterRendering: function () {
            var view = this.getView();
            view.addDelegate({
                onsapenter: function () {
                    view.getController().onPressLogin();
                }
            });
        },

        handleMessagePopoverPress: function (oEvent) {
            //this.errorMessagePopover(oEvent.getSource());
        },
        onPressChangePassword: function (oEvent) {
            var cModel = this.getView().getModel('loginModel');
            cModel.getData().enable = true;
            cModel.refresh();
            this.loginBtn.setText("Login")
        },
        onPressLogin: async function (oEvent) {
            var that = this;
            var cModel = this.getView().getModel('loginModel');
            var enableProp = cModel.getData().enable;
            //Error popover
            ErrorMessage.formValidation([this.formId], this.eMdl, this.pageId);
            //
            var valid = this.eMdl.getData()
            if (valid.length == 0) {
                this.errorMessagePopoverClose()
                that.setStorage("user_modules", null);
                that.setStorage("dashboardData", null);
                /* let login_url = URLConstants.URL.login;
                let obj = await that.restMethodGetForLogin(login_url, login_request);
                that.setStorage("login_token", obj.token); //JSON.parse(obj)*/
                that.setStorage("userContext", cModel.getData()); 
                let user_module = await this.fetchModulesByUser();
                that.showLoading(false);
                if(user_module) {
                   // that.setStorage("user_modules", user_module);
                    /* if (enableProp == true) {
                        cModel.getData().enable = false;
                        cModel.refresh();
                        this.loginBtn.setText("Verify Token")
                    } else { */
                        this.getRouter().navTo("dashboard");
                        //that.setStorage("userContext", { name: "Test User" });
                    //}
                } else {
                    sap.m.MessageToast.show("User name not found!")
                }
            } else {
                //this.errorMessagePopover(this.popoverBtn);
            }
        }
    });
});

