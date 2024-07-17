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
    return BaseController.extend("com.lighthouse.admin.roles.ManageRole", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("manageRole").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("tableUser");
            this._pageId = this.byId("pageUser");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("roleHeaderTitle"));
            this._mockData();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 24353,
                        roleName: "Import Users Role",
                        description: "Screen access to Import department",
                        createdBy: "Sam",
                        createdOn: "24-04-2022",
                        updatedBy: "Sam",
                        updatedOn: "24-04-2022",
                        status: "Active"
                    },
                    {
                        id: 24353,
                        roleName: "Export Users Role",
                        description: "Screen access to Export department",
                        createdBy: "Sam",
                        createdOn: "24-04-2022",
                        updatedBy: "Sam",
                        updatedOn: "24-04-2022",
                        status: "Active"
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data))
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("roleDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("roleDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
