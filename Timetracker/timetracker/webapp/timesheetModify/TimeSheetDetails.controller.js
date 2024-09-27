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
    return BaseController.extend("com.timetracker.timesheetModify.TimeSheetDetails", {

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            
            this.oRouter.getRoute("time-sheet-details").attachMatched(this._onRouteMatched, this);
            this.btn_Edit = this.byId("btn_Edit1");       
          },
        _onRouteMatched: function (oEvent) {
          this.setTitle("Time Sheet Details");
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
          this.fetchTimesheet(this._id);
          this.fetchActivity();
           
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
         
          fetchTimesheet: async function (id) {
           
            try{
              var path = AppConstants.URL.time_sheet_filter;
              let filterParams={
                  id: id,
                  pageNumber: 1,
                  pageSize: AppConstants.Paging.page_size,
                  sortingKey: "id",
                  orderBy: "asc",
                  
                  stringType: false
              }
              let response = await this.restMethodPost(path, filterParams);
             
              response[0].status= response[0].status===1?"Active":"Inactive";
              this.getView().setModel(new JSONModel(response[0]), "timeSheetMdl");
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
              this.fetchApplicationById(this._id);
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
             
              let reqData = this.getView().getModel("timeSheetMdl").getData();
          
              // Ensure that createdOn is in "YYYY-MM-DD" format
              if (reqData.createdOn instanceof Date) {
                  reqData.createdOn = reqData.createdOn.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
              } else {
                  let date = new Date(reqData.createdOn);
                  reqData.createdOn = !isNaN(date) ? date.toISOString().split('T')[0] : "Invalid Date";
              }
        
              // Ensure that both startTime and endTime are provided
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
        
              // Set status based on its value
              reqData.status = reqData.status === "Active" ? 1 : 2;
        
              // Send the data to the backend
              let url = AppConstants.URL.time_sheet;
              let response = await this.restMethodPost(url, [reqData]);
              this.getView().setModel(new JSONModel(response), "timeSheetMdl");
        
              var msg = "Record updated successfully!";
              MessageBox.information(msg, {
                  actions: [MessageBox.Action.OK],
                  onClose: function (sAction) {
                      that.getRouter().navTo("time-sheet", { id: response[0].id });
                      that.fetchTimesheet(that._id);
                      that.showLoading(false);
                      that.onPressCancel();
                  },
              });
          } catch (ex) {
              this.showLoading(false);
              MessageBox.error("An error occurred while saving the record.");
          }
        },
        
         
    });
});