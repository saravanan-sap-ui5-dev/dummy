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
    "sap/ui/core/routing/History",
], function (BaseController, JSONModel, DateFormat, MessageToast, MessageBox, library, Core, Formatter, URLConstants, ErrorMessage, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.master_data.shipping_line.AddEditShippingLine", {
        formatter: Formatter,

        onInit: function () {
            var that = this;

            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("shippingLineDetailCreate").attachMatched(this._onRouteCreateMatched, that);
            this.oRouter.getRoute("shippingLineDetailEdit").attachMatched(this._onRouteEditMatched, that);
            let getSource = (id => this.getView().byId(id));
            [this.btnEdit, this.formId, this.pageId, this.popoverBtn] = [getSource("btnEdit"), getSource("slForm"), getSource("page_addEditShippingLine"), getSource("btnShippingLineErr")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            this.initialValues();
            this.setTitle(this.getResourceProperty("shHeaderTitle"));
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
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            this.initialValues();
            this.setTitle(this.getResourceProperty("shHeaderTitle"));
            this.btnEdit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            this.fetchShippingLineById();
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
            if (sPreviousHash == "shippingLineDetailCreate") {
                navData.route = "shippingLineMaster";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },
      /*   setModel: function () { 
            let data = {
                route: this._route,
                item: this._item,
                shippingLine: {
                    code: null,
                    name: null,
                    accountCode: null,
                    debitNotePrefix: null,
                    createdOn: null,
                    createdBy: null,
                    updatedOn: null,
                    updatedBy: null,
                    status: 2
                },
            }
            this.getView().setModel(new JSONModel(data));
        }, */
        setModel: function () {
            let data = {
                route: this._route,
                item: this._item,
                shippingLine: {
                    cardCode: null,
                    cardName: null,
                    Series: 76,
                    industry:2,
                    cardType: "cSupplier",
                    valid:"tYES",
                    debitorAccount:"201001",
                    debitNotePrefix:null,
                    status: 2,
                },
            }
            this.getView().setModel(new JSONModel(data));
        },
        fetchShippingLineById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.shipping_line_by_id.replace("{id}", this._item);
                let shippingLine = await this.restMethodGet(path);
                if (shippingLine) {
                    shippingLine.title =  shippingLine.cardName + ' (' + shippingLine.cardCode + ')';
                    shippingLine.status = shippingLine.valid === 'tYES' ? 2 : 3;
                    shippingLine.statusText = this.masterData.status.find(e=>e.value == shippingLine.status)?.description;
                    shippingLine.createDateString = this.IsoStringToDate(shippingLine.createDate);
                    shippingLine.updateDateString = this.IsoStringToDate(shippingLine.updateDate);
                    oModel.getData().shippingLine = shippingLine;
                    oModel.refresh(true);
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
       /*  fetchCustomersById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.customers_by_id.replace("{id}", this._item);
                let customers = await this.restMethodGet(path);
                if (customers) {
                    customers.title =  customers.cardName + ' (' + customers.cardCode + ')';
                    customers.statusText = customers.valid == 'tYES' ? 'Active' : 'Inactive';
                    customers.status = customers.valid == 'tYES' ? 2 : 3;
                    customers.createDateString = this.IsoStringToDate(customers.createDate);
                    customers.updateDateString = this.IsoStringToDate(customers.updateDate);
                    oModel.getData().shippingLine = customers;
                  
                    oModel.refresh(true);
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        }, */
        onChangeStatus: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            oData.shippingLine.valid = oData.shippingLine.status == 1 ||  oData.shippingLine.status == 2 ? "tYES" :  "tNO";
            oData.shippingLine.frozen = oData.shippingLine.valid == "tYES" ? "tNO" : "tYES";
            oModel.refresh(true);
        },
        onPressSave: function () {
            this.postShippingLine();
        },
        postShippingLine: async function () {
            try {
                var that = this;
                let postMdl = this.getView().getModel();
                let postData = postMdl.getData().shippingLine;
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    this.showLoading(true);
                    postData.name = postData.cardName;
                    this._item 
                    let path = this._item ? URLConstants.URL.shipping_line_update : URLConstants.URL.shipping_line_add;
                 //   let post = await this.restMethodPost(path,Array.of(postData));//For both bulk and single upload
                    let post = await this.restMethodPost(path,postData);
                    if (this._item) {
                        this.onPressCancel();
                        that.setStorage("SORTING_KEY", "updatedOn");
                        this.setStorage("navigationFrom", "edit");
                    } else {
                        this.setStorage("navigationFrom", "create");
                        that.setStorage("SORTING_KEY", "createdOn");
                        this.getRouter().navTo("shippingLineDetailEdit", {
                            id: post.cardCode
                        });
                    }
                    this.showMessage();
                    this.showLoading(false);
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
            let msg = !this._item ? that.getResourceProperty("shSavedSuccessfully") : that.getResourceProperty("shUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if(!that._item) that.setModel();
                },
            });
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "shippingLineDetailCreate") {
                this.fetchShippingLineById();
                let oEnabled = this.btnEdit.getEnabled();
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
                this.btnEdit.setEnabled(!oEnabled);
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
