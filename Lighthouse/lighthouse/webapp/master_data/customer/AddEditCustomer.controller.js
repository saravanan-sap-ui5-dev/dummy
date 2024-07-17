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
    return BaseController.extend("com.lighthouse.master_data.customer.AddEditCustomer", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("customerDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("customerDetailEdit").attachMatched(this._onRouteEditMatched, this);

            let getSource = (id => this.getView().byId(id));
            [this.btn_Edit, this.formId, this.contactFormId, this.pageId, this.popoverBtn, this.contactTableId, this.contactDialogueId] = [getSource("btnEdit"), getSource("cuForm"), getSource("contactFormId"), getSource("page_AddEditCustomer"), getSource("btnCustormerErr"), getSource("tableImportContact"), getSource("contactDialogueId")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id ? oEvent.getParameter("arguments").id : null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("cuHeaderTitle"));
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
            this._item = oEvent.getParameter("arguments").id ? oEvent.getParameter("arguments").id : null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("cuHeaderTitle"));
            this.btn_Edit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.fetchCustomersById();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set

        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this.setModel();
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
            if (sPreviousHash == "customerDetailCreate") {
                navData.route = "customerMaster";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },

        setModel: function () {
            let data = {
                route: this._route,
                item: this._item,
                general: {
                    cardCode: null,
                    cardName: null,
                    Series: 75,
                    cardType: "C",
                    city: null,
                    status: 2,
                },
                contactForm: {
                    "cardCode": null,
                    "internalCode": null,
                    "name": null,
                    "firstName": null,
                    "middleName": null,
                    "lastName": null,
                    "mobilePhone": null,
                    "e_Mail": null,
                    "fax": null,
                    "address": null,
                    "gender": null,
                    "remarks1": null,
                    "active": "tYES",
                    "poBox": null,
                    "city":null,
                    "pinCode": null,
                    "contactType": null,
                    "addressLine1": null,
                    "addressLine2": null,
                    "addressLine3": null,
                    "remarks": null,
                    "status": 2
                },
                contactDetails: {
                    mode: "Delete",
                    items: [],
                    removedData: []
                },

            };
            this.getView().setModel(new JSONModel(data));
        },
        fetchCustomersById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.customers_by_id.replace("{id}", this._item);
                let customers = await this.restMethodGet(path);
                if (customers) {
                    customers.title = customers.cardName + ' (' + customers.cardCode + ')';
                    customers.statusText = customers.valid == 'tYES' ? 'Active' : 'Inactive';
                    customers.status = customers.valid == 'tYES' ? 2 : 3;
                    customers.createDateString = this.IsoStringToDate(customers.createDate);
                    customers.updateDateString = this.IsoStringToDate(customers.updateDate);
                    oModel.getData().general = customers;
                    customers.contactEmployees.forEach(e => {
                        e.status = e.active == "tYES" ? 2 : 3;
                        e.gender = (e.gender == "gt_Female" ? 1 : e.gender == "gt_Male" ? 2 : 3);
                    });
                    oModel.getData().contactDetails.items = customers.contactEmployees.filter(e => e.active === 'tYES');
                    oModel.getData().contactDetails.removedData = customers.contactEmployees.filter(e => e.active === 'tNO');
                    oModel.refresh(true);
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        tableValidation: function () {
            var oErrorData = [];
            let eModel = this.getOwnerComponent().getModel("errors");
            let flag = true;
            let oModel = this.getView().getModel();
            let tableData = oModel.getData().contactDetails.items;
            tableData.map(e => {
                e.nameValueState = 'None';
                e.mobilePhoneValueState = 'None';
                e.e_MailValueState = 'None';
                if (!e.firstName && !e.lastName) {
                    oErrorData.push(this.customErrorObject(this.getResourceProperty("cuPleaseEnterTheName"), that.pageId, null, null));
                    flag = false;
                }
                else {
                    e.nameValueStateText = 'None';
                }
                if (!e.mobilePhone) {
                    oErrorData.push(this.customErrorObject(this.getResourceProperty("cuPleaseEnterPhoneNumber"), that.pageId, null, null));
                    flag = false;
                }
                else {
                    e.mobilePhoneValueState = 'None';
                }
                if (!e.e_Mail) {
                    oErrorData.push(this.customErrorObject(this.getResourceProperty("cuPleaseEnterEmail"), that.pageId, null, null));
                    flag = false;
                }
                else {
                    e.e_MailValueState = 'None';
                }
            });
            eModel.setData(oErrorData);

            return flag;
        },
        onChangeStatus: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            oData.general.valid = oData.general.status == 1 || oData.general.status == 2 ? "tYES" : "tNO";
            oData.general.frozen = oData.general.valid == "tYES" ? "tNO" : "tYES";
            oModel.refresh(true);
        },
        postCustomers: async function () {
            try {
                var that = this;
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    this.onChangeStatus();
                    oData.general.agentCode = oData.general.agentCode || null;
                    oData.contactDetails.items.map(e => e.name = e.firstName + '' + e.lastName);
                    oData.contactDetails.items.forEach(e => e.gender = (e.gender == 1 ? "gt_Female" : e.gender == 2 ? "gt_Male" : "gt_Undefined"));
                    oData.contactDetails.removedData.forEach(e => e.gender = (e.gender == 1 ? "gt_Female" : e.gender == 2 ? "gt_Male" : "gt_Undefined"));
                    let mergeCustomerDetails = [...oData.contactDetails.items, ...oData.contactDetails.removedData]; //Merge active and inactive records.

                    let postData = { ...oData.general, contactEmployees: mergeCustomerDetails };
                    let path = !postData.cardCode ? URLConstants.URL.customers_add : URLConstants.URL.customers_edit;
                    let post = await this.restMethodPost(path, postData);
                    if (this._item) {
                        this.onPressCancel();
                        that.setStorage("SORTING_KEY", "updatedOn");
                        this.setStorage("navigationFrom", "edit");
                    } else {
                        this.setStorage("navigationFrom", "create");
                        that.setStorage("SORTING_KEY", "createdOn");
                        this.getRouter().navTo("customerDetailEdit", {
                            id: post.CardCode
                        });
                    }
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
            let msg = !this._item ? that.getResourceProperty("veSavedSuccessfully") : that.getResourceProperty("cuUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if (!that._item) that.setModel();
                },
            });
        },
        onSubmitContact: function () {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let contactFormData = oData.contactForm;
            ErrorMessage.formValidation(this.contactFormId, this.eMdl, this.pageId);
            let valid = this.eMdl.getData();
            if (valid.length == 0) {
                if (oData.index == undefined) oData.contactDetails.items.push(contactFormData); //create new table row.
                else {
                    oData.contactDetails.items[oData.index] = contactFormData;//update the contact table row.
                }
                //oData.contactForm = {}, delete oData.index;
                oModel.refresh(true);
                this.onCloseContactDialog();
            }
            else {
                this.errorHandling();
            }

        },
        onCloseContactDialog: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            if (oEvent) {
                oData.contactDetails.items[oData.index] = this.tableData;
                oModel.refresh(true);
            }
            oData.contactForm = {}, delete oData.index;
            this.errorPopoverParams();
            BaseController.prototype.onCloseDialog.apply(this, arguments);
        },
        onAddContact: async function () {
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.customer.AddContact");
            this.contactFormId = this.getView().byId("contactFormId");
            this.contactDialogueId = this.getView().byId("contactDialogueId");
            oDialog.setTitle("Add Contact");
        },
        onPressContact: async function (oEvent) {
            let oDialog = await this.onOpenDialog("com.lighthouse.master_data.customer.AddContact");
            this.contactFormId = this.getView().byId("contactFormId");
            this.contactDialogueId = this.getView().byId("contactDialogueId");
            oDialog.setTitle("Contact Details");
            let getIndex = this.contactTableId.indexOfItem(oEvent.getSource());
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            this.tableData = JSON.parse(JSON.stringify(rowObj));
            oData.contactForm = rowObj;
            oData.index = getIndex;
            oModel.refresh(true);
        },
        onPressAddRowContact: function (oEvent) {
            var oModel = this.getView().getModel();
            if (this.validateTable() == false) {
                oModel.getData().contactDetails.push({
                    "Name": null,
                    "Type": null,
                    "Phone": null,
                    "Email": null,
                    "Fax": null
                });
                this.getView().setModel(new JSONModel(getContactMdlData), "ContactsMdl");
                this.getView().getModel("ContactsMdl").refresh();
            }
        },
        onRemoveContact: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getSelectedPath = this.contactTableId.getSelectedContextPaths();
            if (getSelectedPath.length > 0) {
                let originalArray = [...oData.contactDetails.items];
                let indices = [];
                getSelectedPath.forEach(e => {
                    indices.push(e.split("/")[3]);
                });
                indices.sort((a, b) => b - a); // Sort indices in descending order to avoid index shifting
                indices.forEach(e => {
                    if (originalArray[e].cardCode) {
                        originalArray[e].active = "tNO"; // Soft delete
                        oData.contactDetails.removedData.push(originalArray[e]);
                    }
                    oData.contactDetails.items.splice(e, 1);
                });
            };
            let getSelectedItems = this.contactTableId.getSelectedItems();
            getSelectedItems.forEach(e => e.setSelected(false));
            oModel.refresh(true);
        },

        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "customerDetailCreate") {
                this.fetchCustomersById();
                let oEnabled = this.btn_Edit.getEnabled();
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
                this.btn_Edit.setEnabled(!oEnabled);
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
