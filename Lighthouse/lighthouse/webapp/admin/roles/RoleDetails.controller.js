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
    return BaseController.extend("com.lighthouse.admin.roles.RoleDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("roleDetailEdit").attachMatched(this._onRouteMatched, this);
            this.getView().setModel(new JSONModel(), "JobsMdl");
            this.btn_Edit = this.byId("btnEdit");
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("roleHeaderTitle"));
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name

            this._mockData();

            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.btn_Edit.setEnabled(true);
        },
        _mockData: function () {
            let data = {
                item: this._item,
                route: this._route,
                id: "24353",
                roleName: "Import Users Role",
                status: 2,
                remarks: "Additional Details",
                users: {
                    mode: "MultiSelect",
                    items: [
                        {
                            id: 24353,
                            firstName: "Manraj",
                            lastName: "Singh",
                            jobTitle: "Sales Executive",
                            department: "Imports",
                            costCenter: "32532",
                            status: "Active"
                        },
                        {
                            id: 83453,
                            firstName: "Suraj",
                            lastName: "Kumar",
                            jobTitle: "Sales Executive",
                            department: "Exports",
                            costCenter: "72535",
                            status: "Active"
                        }
                    ]
                },
                userList: {
                    mode: "MultiSelect",
                    items: [
                        {
                            id: 24353,
                            firstName: "Manraj",
                            lastName: "Singh",
                            jobTitle: "Sales Executive",
                            department: "Imports",
                            costCenter: "32532",
                            status: "Active"
                        },
                        {
                            id: 83453,
                            firstName: "Suraj",
                            lastName: "Kumar",
                            jobTitle: "Sales Executive",
                            department: "Exports",
                            costCenter: "72535",
                            status: "Active"
                        }
                    ]
                },
                modules: {
                    "mode": "None",
                    "items": [
                        {
                            id: 1,
                            name: "Liner Services",
                            parentId: null,
                            create: true,
                            modify: false,
                            view: true,
                            children: [
                                {
                                    id: 2,
                                    name: "Voyage",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 3,
                                    name: "Import",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 4,
                                    name: "Export",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 5,
                                    name: "Trans-shipment",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 6,
                                    name: "Container",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 7,
                                    name: "Operation",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 8,
                                    name: "Reports",
                                    parentId: 1,
                                    create: true,
                                    modify: false,
                                    view: true
                                }
                            ]
                        },
                        {
                            id: 9,
                            name: "C&F Services",
                            parentId: 2,
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 10,
                                    name: "Jobs",
                                    parentId: 9,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 11,
                                    name: "Payments",
                                    parentId: 9,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 12,
                                    name: "Reports",
                                    parentId: 9,
                                    create: false,
                                    modify: false,
                                    view: false
                                }
                            ]
                        },
                        {
                            id: 13,
                            name: "Other Services",
                            parentId: null,
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 14,
                                    name: "Transportation",
                                    parentId: 13,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 15,
                                    name: "Vehicle",
                                    parentId: 13,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 16,
                                    name: "Husbandry Service",
                                    parentId: 13,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 17,
                                    name: "Reports",
                                    parentId: 13,
                                    create: false,
                                    modify: false,
                                    view: false
                                }
                            ]
                        },
                        {
                            id: 18,
                            name: "Finance",
                            parentId: null,
                            create: true,
                            modify: true,
                            view: true,
                            children: [
                                {
                                    id: 19,
                                    name: "Reports",
                                    parentId: 18,
                                    create: true,
                                    modify: true,
                                    view: true
                                }
                            ]
                        },
                        {
                            id: 20,
                            name: "Administration",
                            parentId: null,
                            create: true,
                            modify: false,
                            view: true,
                            children: [
                                {
                                    id: 21,
                                    name: "Application Config",
                                    parentId: 20,
                                    create: false,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 22,
                                    name: "User",
                                    parentId: 20,
                                    create: true,
                                    modify: false,
                                    view: true
                                },
                                {
                                    id: 23,
                                    name: "Role",
                                    parentId: 20,
                                    create: true,
                                    modify: false,
                                    view: true
                                }
                            ]
                        },
                        {
                            id: 24,
                            name: "Master Data",
                            parentId: null,
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 25,
                                    name: "Customer",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 26,
                                    name: "Shipping Line",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 27,
                                    name: "Vessel",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 28,
                                    name: "Port Code",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 29,
                                    name: "Container Type",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 30,
                                    name: "Cargo Type",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 31,
                                    name: "IMO",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 32,
                                    name: "HS Code",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 33,
                                    name: "Customs Package Code",
                                    parentId: 24,
                                    create: false,
                                    modify: false,
                                    view: false
                                }
                            ]
                        }
                    ]
                }

            }
            //data.education.items.forEach(e => e.type = "Navigation")
            this.getView().setModel(new JSONModel(data));
        },
        onSelectModule: function (oEvent) {
            let oModel = this.getView().getModel();
            let oItem = oEvent.getParameter('selectedItem');
            let selObj = oItem.getBindingContext().getObject();
            let modules = oModel.getData().modules;
            let newModule = {
                module: null,
                create: false,
                modify: false,
                view: false
            }
            let moduleFil = oModel.getData().modules.items.filter(e => e.module);
            let emModuleFil = oModel.getData().modules.items.filter(e => !e.module);
            modules.items.forEach(e => {
                if (e.module == selObj.key) {
                    e.view = true;
                }
            });
            if (oItem) {
                if (emModuleFil.length != 1) {
                    modules.items.push(newModule);
                } else {
                    moduleFil.push(newModule)
                    modules.items = moduleFil;
                }
            } else {
                moduleFil.push(newModule);
                modules.items = moduleFil;
            }
            oModel.refresh();
        },
        onDeleteSelectedModule: function (oEvent) {
            let oTable = oEvent.getSource();
            let oModel = this.getView().getModel();
            let oItem = oEvent.getParameter("listItem");
            let delObj = oItem.getBindingContext().getObject();
            let index = oItem.getBindingContext().getPath().split("/")[3];
            let modules = oModel.getData().modules;
            let newModule = {
                module: null,
                create: false,
                modify: false,
                view: false
            }
            if (oItem) {
                let eModule = modules.items.filter(e => !e.module);

                if (delObj.module || eModule.length > 1) {
                    modules.items.splice(oItem.getBindingContext().getPath().split("/")[3], 1);
                    if (modules.items.length == 0) {
                        modules.items.push(newModule);
                    }
                }

            }
            oModel.refresh();
        },
        onAddUser: function () {
            this.onOpenDialog("com.lighthouse.admin.dialog.Users");
        },
        onPressUser: function (oEvent) {
            let oItem = oEvent.getSource();
            let oBindingContext = oItem.getBindingContext();
            let rowObj = oBindingContext.getObject();

            this.onOpenDialog("com.lighthouse.admin.dialog.Users");
        },
        onPressEdit: function (oEvent) {
            let oSource = oEvent.getSource();
            let oEnabled = oSource.getEnabled();
            let oModel = this.getView().getModel();
            let vModel = this.getView().getModel("visible");
            let nModule = {
                module: null,
                create: false,
                modify: false,
                view: false
            }
            let modules = oModel.getData().modules;
            modules.mode = "Delete"
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

            if (oEnabled) {
                modules.items.push(nModule);
            }
            oModel.refresh();
        },
        onPressCancel: function () {
            //if (this._route !== "create-property-object-hierarchy") {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
            let oModel = this.getView().getModel();
            let modules = oModel.getData().modules;
            modules.mode = "None"
            if (vModel) {
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
            this.btn_Edit.setEnabled(!oEnabled);
            //this.errorPopoverParams("basic");

            if (!oEnabled) {
                let filModules = modules.items.filter(e => e.module);
                oModel.getData().modules.items = filModules;
            }
            oModel.refresh();
        },
        onCollapseAll: function () {
            var oTreeTable = this.byId("moduleTable");
            oTreeTable.collapseAll();
        },

        onExpandSelection: function () {
            var oTreeTable = this.byId("moduleTable");
            oTreeTable.expandToLevel(20);
        }
    });
});
