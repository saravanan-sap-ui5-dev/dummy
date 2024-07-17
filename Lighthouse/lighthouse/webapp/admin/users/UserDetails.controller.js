sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter",
    "com/lighthouse/utils/URLConstants",
    "sap/ui/core/routing/History"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter, URLConstants, History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.admin.users.UserDetails", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("userDetailEdit").attachMatched(this._onRouteMatched, this);
            let getSource = (id => this.getView().byId(id));
            [this.pageId] = [getSource("pageUserDetails")];
            this.masterData = this.getStorage("master_data");
        },
        _onRouteMatched: function (oEvent) {
            this._item = oEvent.getParameter("arguments").id || null;
            this._route = oEvent.getParameter("config").name;
            this.initialValues();
            this.setTitle(this.getResourceProperty("usrHeaderTitle"));
            this.fetchUserById();
            this.getView().setModel(
                new JSONModel({
                    edit: false,
                    view: true,
                    create: false,
                }),
                "visible"
            );
            //this.btn_Edit.setEnabled(true);
        },
        initialValues: function () {
          //  this.errorPopoverParams();
            this.pageId.setSelectedSection(this.pageId.getSections()[0].getId());//selected seciton reset
            this.pageId._expandHeader();
            this.setModel();
        },
        setModel: function () {
            let data = {
                route: this._route,
                item: this._item,
                general:{},
                /* general: {
                    firstName: null,
                    lastName: null,
                    middleName: 75,
                    active: "C",
                    gender: null,
                    dateOfBirth: null,
                    remarks: 2,
                },
                organization: {
                    jobTitle: null,
                    department: null,
                    manager: null,
                    costCenter: null,
                    employmentStatus: null,
                    terminationReason: null
                },
                personal: {
                    citizenship: null,
                    passportNo: null,
                    countryOfBirth: null,
                    passportIssueDate: null,
                    passportExpiryDate: null,
                    passportIssuer: null,
                    maritalStatus: null,
                    noOfChildren: null,
                    identificationNo: null
                },
                electronicAddress: {
                    officePhone: null,
                    mobilePhone: null,
                    homePhone: null,
                    email: null,
                    ext: null,
                    pager: null,
                    fax: null
                },
                bankDetails: {
                    bankAccountNo: null,
                    bankName: null,
                    bankBranch: null,
                },
                primaryAddress: {
                    buildingNo: null,
                    street: null,
                    poBoxNo: null,
                    postCode: null,
                    city: null,
                    country: null,
                },
                secondaryAddress: {
                    buildingNo: null,
                    street: null,
                    poBoxNo: null,
                    postCode: null,
                    city: null,
                    country: null,
                }, */
                education: {
                    "mode": "None",
                    "items": []
                },
            }
            this.getView().setModel(new JSONModel(data));
        },
        navAfterCreation: function () {
            //After navigated create to view set back nav to manage screen
            let oHistory, sPreviousHash, navData;
            navData = this.getModel("settings").getData();
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash == "userDetailCreate") {
                navData.route = "manageUser";
            } else {
                navData.route = null;
            }
            this.getModel("settings").refresh();
        },
        fetchUserById: async function () {
            try {
                this.showLoading(true);
                let oModel = this.getView().getModel();
                let oData = oModel.getData();
                if (oModel) {
                    let path = URLConstants.URL.user_by_id.replace("{id}", this._item);
                    let response = await this.restMethodGet(path);
                    response.gender = response.gender == 'gt_Male' ? 'Male' : response.gender == 'gt_Female' ? 'Female' : 'Undefined';
                    response.statusText = response.active == 'tYES' ? 'Active' : 'Inactive';
                    oData.education.items = response.employeeEducationInfoLines;
                    oData.general = response;
                    // oModel.setData({ ...response, ...oData });
                }
                oModel.refresh();
                this.showLoading(false);
            } catch (error) {
                this.showLoading(false);
                this.errorHandling(error);
            }
        },
        onAddEducation: function () {
            this.onOpenDialog("com.lighthouse.admin.users.fragments.EducationDetails");
        },
        onPressEducation: function (oEvent) {
            let oModel = this.getView().getModel();
            let oData = oModel.getData();
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();
            oData.educationDetails = rowObj;
            this.onOpenDialog("com.lighthouse.admin.users.fragments.EducationDetails");
            oModel.refresh(true);
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
        onPressCancel: function () {
            //if (this._route !== "create-property-object-hierarchy") {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
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
        },
    });
});
