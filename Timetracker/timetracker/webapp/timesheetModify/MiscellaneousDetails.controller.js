sap.ui.define([
  "com/timetracker/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/timetracker/utils/AppConstants",
    "sap/m/MessageBox",
   
    "sap/ui/core/routing/History",
  
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core,AppConstants,MessageBox,ErrorMessage,History) {
    "use strict";
    var that = this;
    return BaseController.extend("com.timetracker.timesheetModify.MiscellaneousDetails", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            
            this.oRouter.getRoute("miscellaneous-details").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btn_Edit");       
          },
        _onRouteMatched: function (oEvent) {
          this.setTitle("Miscellaneous Details");
            this._route = oEvent.getParameter("config").name;
            this._id = oEvent.getParameter("arguments").id;
            this._tempId = 0;
            
          this.getView().setModel(
            new JSONModel({
              edit: false,
              view: true,
              create: false,
            }),
            "visible"
          );
          this.btn_Edit.setEnabled(true);
          this.fetchMiscellaneous(this._id);
          this.fetchActivity();
          this.fetchCustomer();
           
        },
        fetchActivity: async function () {
          try {
           
            
              let path = AppConstants.URL.activity;
              let response = await this.restMethodGetWitData(path);
              this.setModel(new JSONModel(response), "activityMdl");
          } catch (error) {
            console.log(error);
          }
        },
        // navAfterCreation: function () {
        //   //After navigated create to view set back nav to manage screen
        //   let oHistory, sPreviousHash, navData;
        //   navData = this.getModel("settings").getData();
        //   oHistory = History.getInstance();
        //   sPreviousHash = oHistory.getPreviousHash();
        //   if (sPreviousHash == "create-app") {
        //     navData.route = "manage-app";
        //   } else {
        //     navData.route = null;
        //   }
        //   this.getModel("settings").refresh();
        // },
        // errorPopoverParams: function () {
        //   //let ids = { basic: "sfBasicDetails", attachment: "sf_attachment" }
        //   this.formId = [this.getId("iasFrom"),this.getId("btpFrom"),this.getId("generalFrom")];
        //   this.pageId = this.getView().byId("pageAppDetails");
        //   this.popoverBtn = this.getView().byId("btn_editError");

        //   //******Set Initially Empty Error Mdl******
        //   this.eMdl = this.getOwnerComponent().getModel("errors");
        //   ErrorMessage.removeValueState(this.formId, this.eMdl);

        //   this.eMdl.setData([]);
        //   this.errorData = [];
        // },
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
          fetchCustomer: async function () {
            try {
             
              
                let path = AppConstants.URL.customer;
                let response = await this.restMethodGetWitData(path);
                this.setModel(new JSONModel(response), "customerMdl");
            } catch (error) {
              console.log(error);
            }
          },
          fetchMiscellaneous: async function (id) {
           
            try{
              var path = AppConstants.URL.miscellaneous_filter;
              let filterParams={
                  id: id,
                  pageNumber: 1,
                  pageSize: AppConstants.Paging.page_size,
                  sortingKey: "id",
                  orderBy: "asc",
                  stringType: false
              }
              let response = await this.restMethodPost(path, filterParams);
              // let activityResponse = await this.fetchActivity();
              // response[0].forEach(e=>{
              //   e.activityText = activityResponse.find(d=>e.activity==d.id)?.name;
              // })
              // response.forEach(e => e.status = e.status === 1 ? "Active" : "Inactive");
              response[0].status= response[0].status===1?"Active":"Inactive";
              this.getView().setModel(new JSONModel(response[0]), "miscellaneousMdl");
            }
            catch(ex) {
              this.showLoading(false);
              //  this.errorHandling(ex);
            }
          },
          onPressCancel: function () {
            let oEnabled = this.btn_Edit.getEnabled();
            let vModel = this.getView().getModel("visible");
            if (vModel) {
              vModel.setData({
                edit: oEnabled,
                view: !oEnabled,
              });
              this.fetchMiscellaneous(this._id);
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
        },
      
        onPressSave: async function () {
          var that = this;
          try {
              let reqData = this.getView().getModel("miscellaneousMdl").getData();
              if (reqData.createdOn instanceof Date) {
                reqData.createdOn = reqData.createdOn.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
            } else {
                let date = new Date(reqData.createdOn);
                reqData.createdOn = !isNaN(date) ? date.toISOString().split('T')[0] : "Invalid Date";
            }
              // Calculate the duration if startTime and endTime are provided
              if (reqData.startTime && reqData.endTime) {
                  let startDateTime = new Date(reqData.createdOn + " " + reqData.startTime);
                  let endDateTime = new Date(reqData.createdOn + " " + reqData.endTime);
      
                  if (!isNaN(startDateTime) && !isNaN(endDateTime)) {
                      if (endDateTime >= startDateTime) {
                          let durationMs = endDateTime - startDateTime;
                          let hours = Math.floor(durationMs / (1000 * 60 * 60));
                          let minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                          let seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
      
                          reqData.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      } else {
                          MessageBox.error("End time cannot be before start time.");
                          return; // Exit the function without saving
                      }
                  } else {
                      reqData.duration = "Invalid time";
                  }
              } else {
                  reqData.duration = "Invalid time";
              }
      
              reqData.status = reqData.status === "Active" ? 1 : 2;
              let url = AppConstants.URL.miscellaneous;
              let response = await this.restMethodPost(url, [reqData]);
      
              this.getView().setModel(new JSONModel(response), "miscellaneousMdl");
              var msg = "Record updated successfully!";
              MessageBox.information(msg, {
                  actions: [MessageBox.Action.OK],
                  onClose: function (sAction) {
                      that.getRouter().navTo("time-sheet", { id: response[0].id });
                      that.fetchMiscellaneous(that._id);
                      that.showLoading(false);
                      that.onPressCancel();
                  }
              });
      
          } catch (ex) {
              that.showLoading(false);
              // Handle errors
          }
      },
         
    });
});