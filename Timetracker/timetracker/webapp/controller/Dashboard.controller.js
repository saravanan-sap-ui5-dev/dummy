sap.ui.define([
    "com/timetracker/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    'sap/f/library',
    "com/timetracker/utils/AppConstants",
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, fioriLibrary,AppConstants) {
    "use strict";
    var that = this;
    return BaseController.extend("com.timetracker.controller.Dashboard", {
 
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("dashboard").attachMatched(this._onRouteMatched, this);
 
            this.oModel = this.getOwnerComponent().getModel();
        },
        _onRouteMatched: function () {
            this.dashboardData();
            this.userSettingsData();
            this._registerIds();
            this.adminActiveRecord();
            
        },
        _registerIds: function () {
            this.navContainer = this.byId("pageContainer");
            this.appGridList = this.byId("appGridList");

            let iconTabMdl = this.getView().getModel("iconTabNavigation");
            if (iconTabMdl && iconTabMdl?.getData()?.selectedKey) {
                let oKey = iconTabMdl?.getData()?.selectedKey;
                this.navContainer.to(this.getView().createId(oKey));
            } else {
                this.iconTabNavigation();
                this.navContainer.to(this.getView().createId("timesheet"));
            }

           
        },
        iconTabNavigation: function () {
            let data = {
                "selectedKey": "timesheet",
                "navigation": [{
                    "title": "Time Sheet",
                    "key": "timesheet"
                },
                {
                    "title": "Report",
                    "key": "report"
                }
                ]
            }
            this.getView().setModel(new JSONModel(data), "iconTabNavigation");
        },
        onAppItemPress: function (oEvent) {
            let iconTabMdl = this.getView().getModel("iconTabNavigation");
            let selObj = oEvent.getSource().getBindingContext("dashboardData")?.getObject();
            let oKey = selObj?.key;
            let oTitle = selObj?.title;
            iconTabMdl.getData().selectedKey = oKey;
            this.navContainer.to(this.getView().createId(oKey));
            this.setTitle(oTitle);
            iconTabMdl.refresh(true);
        },
        onTabSelect: function (oEvent) { //Icon Tab Bar Navigation
            let oItem = oEvent.getParameter("item");
            this.navContainer.to(this.getView().createId(oItem.getKey()));
            this.setTitle(oItem.getText());
        },
        adminActiveRecord: async function () {
            let that = this;
            try {
                var path = AppConstants.URL.active_support;
                let response = await this.restMethodGet(path);

                let dashBoardMdl = this.getView().getModel("dashboardData");
                let dashboardData = dashBoardMdl.getData();
                dashboardData.timesheet[0].number = (response.find(([key, value]) => key === "support") || [null, null])[1];
                // dashboardData.admin[1].number = (response.find(([key, value]) => key === "application") || [null, null])[1];
                
                dashBoardMdl.refresh();
            } catch (ex) {

                this.errorHandling(ex);
            }
        },
        onPressTile: function (oEvent) {
            let oNavContext = oEvent.getSource().getBindingContext("dashboardData");
            let oNavObj = oNavContext?.getObject();
            let getPath = oNavContext?.getPath();
            let oNavKey = oNavObj?.route;
            let tenant = oNavKey?.includes("tenant");
            let owner = oNavKey?.includes("owner");
            if (oNavKey && !tenant && !owner) {
                this.getRouter().navTo(oNavKey);
            } else {
                let key = tenant ? 3 : 1;
                this.getRouter().navTo(oNavKey, {
                    key: key
                });
            }
            this.setStorage("section", getPath);
            // this.oModel.refresh(true);
        },
        dashboardData: function () {
            let data = {
                timesheet: [{
                    title: "Clock Time",
                    sub_title: "",
                    icon: "sap-icon://customer-history",
                    key: "support",
                    number:"" ,
                    footer: "Active Tasks ",
                    route: "clock-time"
                }, {
                    title: "Time Sheet",
                    sub_title: " ",
                    icon: "sap-icon://timesheet",
                    key: "time-sheet",
                    number: " ",
                    footer: " Manage Time Sheet ",
                    route: "time-sheet"
                }],
                report: [{
                    title: "Monthly",
                    sub_title: "",
                    icon: "sap-icon://manager-insight",
                    key: "monthly-report",
                    number:" " ,

                    footer: "Monthly Report",
                    route: "monthly-report"
                }, {
                    title: "Weekly",
                    sub_title: "",
                    icon: "sap-icon://activity-items",
                    key: "monthly-report",
                    number: " ",
                    footer: "Day To Day Report",
                    route: "weekly-report"
                }, ]
            };
            this.getView().setModel(new JSONModel(data), "dashboardData");
        }
    });
});