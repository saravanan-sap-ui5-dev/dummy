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
    return BaseController.extend("com.lighthouse.master_data.vessel.AddEditVessel", {

        formatter: Formatter,

        onInit: function () {
            var that = this;

            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("vesselDetailCreate").attachMatched(this._onRouteCreateMatched, that);
            this.oRouter.getRoute("vesselDetailEdit").attachMatched(this._onRouteEditMatched, that);
            let getSource = (id => this.getView().byId(id));
            [this.btnEditId, this.formId, this.vesselTableId, this.vesselCodeId, this.shippingLineCodeId, this.pageId, this.popoverBtn, this.btnAddShippingLine, this.cbShippingLineGen] = [getSource("btnEdit"), getSource("veForm"), getSource("veVesselTableId"), getSource("vesselCode"), getSource("veShippingLineCodeId"), getSource("page_addEditVessel"), getSource("btnVesselErr"), getSource("btnAddShippingLine"), getSource("cbShippingLineGen")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteCreateMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setModel();
            this.setTitle(this.getResourceProperty("veHeaderTitle"));
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
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setModel();
            this.btnEditId.setEnabled(true); //Always edit btn enabled true initially
            this.setTitle(this.getResourceProperty("veHeaderTitle"));
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                    add: false,
                }),
                "visible"
            );
            this.fetchVesselById();
            this.navAfterCreation();
        },
        initialValues: function () {
            this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this._moduleId = URLConstants.moduleId.vessel;
            this.getView().setModel(new JSONModel({ items: [] }), "AttachmentMdl");
            this.fetchShippingLine();
        },
        errorPopoverParams: function () {
            //******Set Initially Empty Error Mdl******

            this.eMdl = this.getOwnerComponent().getModel('errors');
            ErrorMessage.removeValueState(this.formId, this.eMdl);
            this.eMdl.setData([]);
        },
        navAfterCreation: function () {
            //After navigated create to view set back nav to manage screen
            let oHistory, sPreviousHash, navData, oModel;
            oModel = this.getModel("settings");
            navData = oModel.getData();
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash == "vesselDetailCreate") {
                navData.route = "vesselMaster";
            } else {
                navData.route = null;
            }
            oModel.refresh();
        },

        setModel: function () {
            let data = {
                route: this._route,
                item: this._item,
                general: {
                    id: null,
                    name: null,
                    callSign: null,
                    imo: null,
                    status: 2,
                    shippingLineId: null,
                    shippingLineName: null,
                    nationality: null,
                    createdBy: null,
                    createdOn: null,
                    updatedBy: null,
                    updatedOn: null,
                    bulkPost: 'false',
                },
                vesselDetails: {
                    mode: "Delete",
                    items: [
                        {
                            id: null,
                            shippingLineId: null,
                            vesselCode: null,
                            vesselId: null,
                            status: 2
                        }
                    ],
                    removedData: [],
                },
                shippingLineCollection: [],
            };
            this.getView().setModel(new JSONModel(data));
        },
        setBindingModel: function (data) {
            let oModel = this.getView().getModel();
            let oModelData = oModel.getData();
            let generalData = oModelData.general;
            generalData.id = data.id;
            generalData.name = data.name;
            generalData.callSign = data.callSign;
            generalData.imo = data.imo;
            generalData.status = data.status;
            generalData.statusText = this.masterData.status.find(ele => data.status === ele.value)?.description;
            generalData.shippingLineId = data.vesselShippingLineId;
            generalData.shippingLineName = data.shippingLineName;
            generalData.nationality = data.nationality;
            generalData.createdOn = data.createdOn;
            generalData.createdBy = data.createdBy;
            generalData.updatedBy = data.updatedBy;
            generalData.updatedOn = data.updatedOn;
            oModelData.vesselDetails.items = data.vesselDetails.filter(e => e.status == 2);
            oModelData.vesselDetails.removedData = data.vesselDetails.filter(e => e.status == 3);
            oModel.refresh(true);
        },
        /* fetchShippingLine */
        fetchShippingLine: async function () {
            //let oModel = this.getView().getModel();
            try {
                this.shippingLineCodeId.setBusy(true);
                this.cbShippingLineGen.setBusy(true);
                let path = URLConstants.URL.min_shipping_line;
                let shippingLine = await this.restMethodGet(path);
                this.getView().getModel().getData().shippingLineCollection = shippingLine;
                this.getView().getModel().refresh(true);
                this.shippingLineCodeId.setBusy(false);
                this.cbShippingLineGen.setBusy(false);
            } catch (error) {
                this.showLoading(false);
                this.shippingLineCodeId.setBusy(false);
                this.cbShippingLineGen.setBusy(false);
                this.errorHandling(error);
            }
        },
        fetchVesselById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let path = URLConstants.URL.vessel_by_id.replace("{id}", this._item);
                let vessel = await this.restMethodGet(path);
                if (vessel) {
                    this.compareObj = structuredClone(vessel);
                    this.setBindingModel(vessel);
                    oModel.getData().vessel = vessel;
                    oModel.refresh(true);
                }
                this.fetchAttachmentsByFilter(this._moduleId, this._item);
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        tableValidation: function () {
            let flag = true;
            let oModel = this.getView().getModel();
            let tableData = oModel.getData().vesselDetails.items;
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
                if (!e.vesselCode) {
                    e.vesselCodeValueState = 'Error';
                    e.vesselCodeValueStateText = 'Please fill the Vessel Code field';
                    flag = false;
                }
                else {
                    e.vesselCodeValueState = 'None';
                }
            });
            oModel.refresh(true);
            return flag;
        },
        postVessel: async function () {
            try {
                var that = this;
                let oModel = this.getView().getModel();
                let aModel = this.getOwnerComponent().getModel('attachmentsMdl');
                let oModelData = oModel.getData();
                this.errorPopoverParams();
                ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId);
                let valid = this.eMdl.getData();
                if (valid.length == 0) {
                    if (this.tableValidation()) {
                        this.showLoading(true);
                        oModelData.vesselDetails.items.map(e => { if (!e.id) e.status = 2; }); //all new records status as Active
                        let mergeVesselDetails = [...oModelData.vesselDetails.items, ...oModelData.vesselDetails.removedData]; //Merge active and inactive records.
                        let postData = { ...oModelData.general, vesselDetails: mergeVesselDetails };
                        let attachmentData = aModel.getData();
                        let path = URLConstants.URL.vessel_add;
                        let attachmentPath = URLConstants.URL.attachments;

                        let postRes = await this.restMethodPost(path, Array.of(postData));

                        attachmentData.forEach((e) => (e.refObjectId = postRes.id));

                        let attachmentRes = await this.restMethodPost(attachmentPath, attachmentData);
                        if (this._item) {
                            this.onPressCancel();
                            that.setStorage("SORTING_KEY", "updatedOn");
                            this.setStorage("navigationFrom", "edit");
                        } else {
                            this.setStorage("navigationFrom", "create");
                            that.setStorage("SORTING_KEY", "createdOn");
                            this.getRouter().navTo("vesselDetailEdit", {
                                id: postRes.id
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
            let msg = !this._item ? that.getResourceProperty("veSavedSuccessfully") : that.getResourceProperty("veUpdatedSuccessfully");
            MessageBox.information(msg, {
                actions: [MessageBox.Action.OK],
                onClose: function (sAction) {
                    that._item ? null : (that.setModel(), that.fetchShippingLine());
                },
            });
        },

        onAddShippingLineCode: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let eShippingLineCode = {
                shippingLineId: null,
                vesselCode: null,
            };
            if (oData.vesselDetails.items.length > 0) {
                oData.vesselDetails.items.push(eShippingLineCode);
            } else {
                oData.vesselDetails.items = [eShippingLineCode];
            }
            oModel.refresh(true);

            this.btnAddShippingLine.setEnabled(false);
        },
        onDeleteShippingLineCode: function (oEvent) {
            this.compareObj;
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            let getBindingContext = oEvent.getParameter("listItem").getBindingContext();
            let selObject = getBindingContext.getObject(); //Get selected Object
            if (selObject.id) {
                if (!selObject.shippingLineId || !selObject.vesselCode) { // If user deletes existing erased data needs to maintain the data and change status to inactive. 
                    selObject = this.compareObj.vesselDetails.find(e => e.id === selObject.id);
                }
                selObject.status = 3;
                oData.vesselDetails.removedData.push(selObject);
            }
            let sPath = getBindingContext.getPath().split('/')[3];
            oData.vesselDetails.items.splice(sPath, 1);
            oData.vesselDetails.items.length > 1 ? this.onChangeShippingLine() : this.btnAddShippingLine.setEnabled(true);
            oModel.refresh(true);
        },
        onChangeShippingLine: function (oEvent) {
            let vesselCode, getValue, getSelectedObj;
            if (oEvent) {
                vesselCode = oEvent.getSource().getId().includes("vesselCode");   //To Get value only when selected from vesselCode input field.
                getValue = oEvent.getSource().getValue();
                getSelectedObj = oEvent.getSource().getBindingContext().getObject();
            }
            let oModel = this.getView().getModel();
            let modelData = oModel.getData().vesselDetails.items;
            if (vesselCode) getSelectedObj.vesselCode = getValue; //To update liveChange value to the model.
            for (let i = 0; i < modelData.length > 0; i++) {
                if (modelData[i].shippingLineId) modelData[i].shippingLineValueState = 'None';
                if (modelData[i].vesselCode) modelData[i].vesselCodeValueState = 'None';
                if (modelData[i].shippingLineId && modelData[i].vesselCode) {
                    this.btnAddShippingLine.setEnabled(true);
                }
                else {
                    this.btnAddShippingLine.setEnabled(false);
                    break;
                }
            }
        },
        onPressCancel: function () {
            this.errorPopoverParams();
            if (this._route !== "vesselDetailCreate") {
                this.fetchVesselById();
                let oEnabled = this.btnEditId.getEnabled();
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
                this.btnEditId.setEnabled(!oEnabled);
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
