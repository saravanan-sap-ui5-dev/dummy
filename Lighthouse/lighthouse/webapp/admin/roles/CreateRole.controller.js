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
    return BaseController.extend("com.lighthouse.admin.roles.CreateRole", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("roleDetailCreate").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.setTitle(this.getResourceProperty("roleHeaderTitle"));
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
                modules: {
                    "mode": "None",
                    "items": [
                        {
                            id: 1,
                            name: "Liner Services",
                            parentId: null,
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 2,
                                    name: "Voyage",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 3,
                                    name: "Import",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 4,
                                    name: "Export",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 5,
                                    name: "Trans-shipment",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 6,
                                    name: "Container",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 7,
                                    name: "Operation",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 8,
                                    name: "Reports",
                                    parentId: 1,
                                    create: false,
                                    modify: false,
                                    view: false
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
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 19,
                                    name: "Reports",
                                    parentId: 18,
                                    create: false,
                                    modify: false,
                                    view: false
                                }
                            ]
                        },
                        {
                            id: 20,
                            name: "Administration",
                            parentId: null,
                            create: false,
                            modify: false,
                            view: false,
                            children: [
                                {
                                    id: 21,
                                    name: "Application Config",
                                    parentId: 20,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 22,
                                    name: "User",
                                    parentId: 20,
                                    create: false,
                                    modify: false,
                                    view: false
                                },
                                {
                                    id: 23,
                                    name: "Role",
                                    parentId: 20,
                                    create: false,
                                    modify: false,
                                    view: false
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
                                    name: "IMCO",
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
            data.filteredModuleList = data.modulesList;
            this.getView().setModel(new JSONModel(data));
        },
        onSelectModule: function (oEvent) {
            let oModel = this.getView().getModel();
            let oItem = oEvent.getParameter('selectedItem');
            let modules = oModel.getData().modules;
            let modulesList = oModel.getData().modulesList;
            let newModule = {
                module: null,
                create: false,
                modify: false,
                view: false
            }
            let moduleFil = oModel.getData().modules.items.filter(e => e.module);
            let emModuleFil = oModel.getData().modules.items.filter(e => !e.module);

            let filModuleList = modulesList.filter(e => !moduleFil.find(e1 => e1.module == e.key));
            if (oItem) {
                let selObj = oItem.getBindingContext().getObject();
                modules.items.forEach(e => {
                    if (e.module == selObj.key) {
                        e.view = true;
                    }
                });
                oModel.refresh();
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
            oModel.getData().filteredModuleList = filModuleList;
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
        onPressCancel: function () {
            this.onNavBack();
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
