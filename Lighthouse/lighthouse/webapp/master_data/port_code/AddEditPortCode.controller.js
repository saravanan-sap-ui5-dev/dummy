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
    return BaseController.extend("com.lighthouse.master_data.port_code.AddEditPortCode", {

        formatter: Formatter,

        onInit: function () {
            // var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("portCodeDetailCreate").attachMatched(this._onRouteCreateMatched, this);
            this.oRouter.getRoute("portCodeDetailEdit").attachMatched(this._onRouteEditMatched, this);

            let getSource = (id => this.getView().byId(id));
            [this.btn_Edit, this.formId, this.pageId, this.popoverBtn, this.shippingLineCodeId, this.btnAddShippingLinePortId] = [getSource("btnEdit"), getSource("portFormId"), getSource("page_AddEditPortCode"), getSource("btnPortCodeErr"), getSource("shippingLinePortId"), getSource("btnAddShippingLinePortId")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            this.initialValues();
            this.setTitle(this.getResourceProperty("pcHeaderTitle"));
            this.getView().setModel(
                new JSONModel({
                    edit: true,
                    view: false,
                    create: true,
                    add: false
                }),
                "visible"
            );
        },
        _onRouteEditMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name
            this.initialValues();
            this.setTitle(this.getResourceProperty("pcHeaderTitle"));
            this.btn_Edit.setEnabled(true); //Always edit btn enabled true 
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                    add: false
                }),
                "visible"
            );
            this.fetchFunction();
            this.navAfterCreation();
            this.setStorage("SORTING_KEY", this.getStorage("SORTING_KEY"));//sorting key set
        },
        fetchFunction: async function () {
            this.fetchPortCodeById();
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.setModel();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this.fetchShippingLine();
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
            if (sPreviousHash == "portCodeDetailCreate") {
                navData.route = "portCodeMaster";
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
                    "Series": 76,
                    industry: 1,
                    cardType: "cSupplier",
                    valid: "tYES",
                    debitorAccount: "201001",
                    city: null,
                    status: 2,
                },
                shippingLinePort: {
                    mode: "Delete",
                    items: [{
                        id: null,
                        shippingLineId: null,
                        cardCode: this._item,
                        portCode: null,
                        zoneCode: null,
                        zoneName: null,
                        status: 2
                    }],
                    removedData: [],
                },
                shippingLineCollection: [],
            }
            this.getView().setModel(new JSONModel(data));
        },
        fetchPortCodeById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.port_code_by_id.replace("{id}", this._item);
                let customers = await this.restMethodGet(path);
                if (customers) {
                    customers.title = customers.cardName + ' (' + customers.cardCode + ')';
                    customers.statusText = customers.valid == 'tYES' ? 'Active' : 'Inactive';
                    customers.status = customers.valid == 'tYES' ? 2 : 3;
                    customers.createDateString = this.IsoStringToDate(customers.createDate);
                    customers.updateDateString = this.IsoStringToDate(customers.updateDate);
                    oModel.getData().general = customers;
                    oModel.getData().shippingLinePort.items = customers.shippingLinePorts ? customers.shippingLinePorts : [];
                    if (oModel.getData().shippingLinePort.items.length> 0) {
                        oModel.getData().shippingLinePort.items = customers.shippingLinePorts?.filter(e => e.status == 2);
                        oModel.getData().shippingLinePort.removedData = customers.shippingLinePorts?.filter(e => e.status == 3);
                    }
                    oModel.refresh(true);
                }
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        setBindingModel: function (data) {
            let oModel = this.getView().getModel();
            let oModelData = oModel.getData();
            oModelData.shippingLinePort.items = data.filter(e => e.status == 2);
            oModelData.shippingLinePort.removedData = data.filter(e => e.status == 3);
            oModel.refresh(true);
        },
        /* fetchShippingLine */
        fetchShippingLine: async function () {
            // let oModel = this.getView().getModel();
            try {
                this.shippingLineCodeId.setBusy(true);
                let path = URLConstants.URL.min_shipping_line;
                let shippingLine = await this.restMethodGet(path);
                this.getView().getModel().getData().shippingLineCollection = shippingLine;
                this.getView().getModel().refresh(true);
                this.shippingLineCodeId.setBusy(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        onChangeStatus: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            oData.general.valid = oData.general.status == 1 || oData.general.status == 2 ? "tYES" : "tNO";
            oData.general.frozen = oData.general.valid == "tYES" ? "tNO" : "tYES";
            oModel.refresh(true);
        },
        onChangeShippingLinePort: function (oEvent) {
            let portCode, zoneCode, zoneName, getValue, getSelectedObj;
            if (oEvent) {
                portCode = oEvent.getSource().getId().includes("portCode");   //To Get value only when selected from vesselCode input field.
                zoneCode = oEvent.getSource().getId().includes("zoneCode");
                zoneName = oEvent.getSource().getId().includes("zoneName");
                getValue = oEvent.getSource().getValue();
                getSelectedObj = oEvent.getSource().getBindingContext().getObject();
            }
            let oModel = this.getView().getModel();
            let modelData = oModel.getData().shippingLinePort.items;
            if (portCode) getSelectedObj.portCode = getValue; //To update liveChange value to the model.
            if (zoneCode) getSelectedObj.zoneCode = getValue; //To update liveChange value to the model.
            if (zoneName) getSelectedObj.zoneName = getValue; //To update liveChange value to the model.
            for (let i = 0; i < modelData.length > 0; i++) {
                if (modelData[i].shippingLineId) modelData[i].shippingLineValueState = 'None';
                if (modelData[i].portCode) modelData[i].portCodeValueState = 'None';
                if (modelData[i].zoneCode) modelData[i].zoneCodeValueState = 'None';
                if (modelData[i].zoneName) modelData[i].zoneNameValueState = 'None';
                if (modelData[i].shippingLineId && modelData[i].portCode && modelData[i].zoneCode && modelData[i].zoneName) {
                    this.btnAddShippingLinePortId.setEnabled(true);
                }
                else {
                    this.btnAddShippingLinePortId.setEnabled(false);
                    break;
                }
            }
        },
        onAddShippingLine: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let eShippingLinePort = {
                id: null,
                shippingLineId: null,
                portCodeId: null,
                portCode: null,
                zoneCode: null,
                zoneName: null,
                status: 2
            }
            if (oData.shippingLinePort) {
                let slPorts = oData.shippingLinePort;
                if (slPorts.items.length > 0) {
                    slPorts.items.push(eShippingLinePort);
                } else {
                    slPorts.items = [eShippingLinePort];
                }
            } else {
                oData.shippingLinePort.items = [eShippingLinePort];
            }
            oModel.refresh(true);
            this.btnAddShippingLinePortId.setEnabled(false);
        },
        onDeleteShippingLinePort: function (oEvent) {
            this.compareObj;
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getBindingContext = oEvent.getParameter("listItem").getBindingContext();
            let selObject = getBindingContext.getObject(); //Get selected Object
            if (selObject.id) {
                if (!selObject.shippingLineId || !selObject.portCode || !selObject.zoneCode || !selObject.zoneName) { // If user deletes existing erased data needs to maintain the data and change status to inactive. 
                    selObject = this.compareObj.shippingLinePort.find(e => e.id === selObject.id);
                }
                selObject.status = 3;
                oData.shippingLinePort.removedData.push(selObject);
            }
            let sPath = getBindingContext.getPath().split('/')[3];
            oData.shippingLinePort.items.splice(sPath, 1);
            oData.shippingLinePort.items.length > 1 ? this.onChangeShippingLinePort() : this.btnAddShippingLinePortId.setEnabled(true);
            oModel.refresh(true);
        },
        tableValidation: function () {
            let flag = true;
            let oModel = this.getView().getModel();
            let tableData = oModel.getData().shippingLinePort.items;
            if (tableData) {
                tableData.map(e => {
                    e.shippingLineValueState = 'None';
                    e.vesselCodeValueState = 'None';
                    if (!e.shippingLineId) {
                        e.shippingLineValueState = 'Error';
                        e.shippingLineValueStateText = 'Please select the Shipping Line field';
                        flag = false;
                    }
                    else {
                        e.shippingLineValueState = 'None';
                    }
                    if (!e.portCode) {
                        e.portCodeValueState = 'Error';
                        e.portCodeValueStateText = 'Please fill the Port Code field';
                        flag = false;
                    }
                    else {
                        e.portCodeValueState = 'None';
                    }
                    if (!e.zoneCode) {
                        e.zoneCodeValueState = 'Error';
                        e.zoneCodeValueStateText = 'Please fill the Zone Code field';
                        flag = false;
                    }
                    else {
                        e.zoneCodeValueState = 'None';
                    }
                    if (!e.zoneName) {
                        e.zoneNameValueState = 'Error';
                        e.zoneNameValueStateText = 'Please fill the Zone Name field';
                        flag = false;
                    }
                    else {
                        e.zoneNameValueState = 'None';
                    }
                });
                oModel.refresh(true);
                return flag;
            } else {
                return true;
            }
        },
        postPortCode: async function () {
            try {
                var that = this;
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                this.errorPopoverParams();
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    if (this.tableValidation()) {
                        this.showLoading(true);
                        let path;
                        let postData = oData.general;
                        if ((oData.shippingLinePort && oData.shippingLinePort.items?.length) || oData.shippingLinePort.removedData?.length) {
                            postData.shippingLinePorts = [...oData.shippingLinePort.items, ...oData.shippingLinePort.removedData]; //Merge active and inactive shiping line records.
                        }
                        postData.bulkPost = false;

                        if (this._route !== "portCodeDetailCreate" && postData.cardCode) {
                            path = URLConstants.URL.port_code_update
                        } else {
                            path = URLConstants.URL.port_code_add;
                        }
                        let postRes = await this.restMethodPost(path, postData);
                        if (this._item) {
                            this.onPressCancel();
                            that.setStorage("SORTING_KEY", "updatedOn");
                            this.setStorage("navigationFrom", "edit");
                        } else {
                            this.setStorage("navigationFrom", "create");
                            that.setStorage("SORTING_KEY", "createdOn");
                            this.getRouter().navTo("portCodeDetailEdit", {
                                id: postRes.cardCode
                            });
                        }
                        this.showMessage();
                        this.showLoading(false);
                        this.errorPopoverParams();
                    }
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
            let msg = !this._item ? that.getResourceProperty("pcSavedSuccessfully") : that.getResourceProperty("pcUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    if (!that._item) that.setModel();
                },
            });
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "portCodeDetailCreate") {
                this.fetchPortCodeById();
                let oEnabled = this.btn_Edit.getEnabled();
                let vModel = this.getView().getModel("visible");
                if (vModel) {
                    vModel.setData({
                        edit: oEnabled,
                        add: false,
                        view: !oEnabled,
                    });
                } else {
                    this.getView().setModel(
                        new JSONModel({
                            edit: oEnabled,
                            add: false,
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
                    add: oEnabled
                });
            } else {
                this.getView().setModel(
                    new JSONModel({
                        edit: oEnabled,
                        view: !oEnabled,
                        add: oEnabled
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
