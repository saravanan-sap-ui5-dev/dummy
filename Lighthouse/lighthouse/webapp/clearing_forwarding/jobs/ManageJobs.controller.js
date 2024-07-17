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
    return BaseController.extend("com.lighthouse.clearing_forwarding.jobs.ManageJobs", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("jobMaster").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("table_Jobs");
            this._pageId = this.byId("page_Jobs");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("joHeaderTitle"));
            this._mockData();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        id: 2344,
                        blNo: "HLCUALY220338926",
                        blType: "Import",
                        quotationNo: "39668836",
                        agent: "Sam",
                        bayanNo: "1324142",
                        shippingLine: "HL",
                        pol: "SOH",
                        pod: "DME",
                        status: "Active"
                    },
                    {
                        id: 2345,
                        blNo: "HLCUALY220338927",
                        blType: "Import",
                        quotationNo: "39668837",
                        agent: "Sam",
                        bayanNo: "1324143",
                        shippingLine: "HL",
                        pol: "SOH",
                        pod: "DME",
                        status: "Active"
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data))
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("jobDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("jobDetailEdit", {
                id: rowObj.id
            });
        }
    });
});
