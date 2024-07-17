sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.admin.users.CreateUser", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("userDetailCreate").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("usrHeaderTitle"));
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                }),
                "visible"
            );
        },
        _mockData: function () {
            let data = {
                education: {
                    "mode": "MultiSelect",
                    "items": []//type : navigation
                }
            }
            this.getView().setModel(new JSONModel(data))
        },
        onAddEducation: function () {
            this.onOpenDialog("com.lighthouse.admin.users.fragments.EducationDetails");
        },
        onPressCancel: function () {
            this.onNavBack();
        },
    });
});
