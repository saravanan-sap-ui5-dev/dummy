sap.ui.define([
  "com/timetracker/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/format/DateFormat",
  "sap/m/MessageToast",
  "sap/ui/integration/library",
  "sap/ui/core/Core",
  "sap/f/library",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/Token",
  "com/timetracker/utils/AppConstants",
  "sap/ui/core/routing/History",
  //   "com/timetracker/utils/ErrorMessage",
  "sap/m/MessageBox"
], function (BaseController,
  JSONModel,
  DateFormat,
  MessageToast,
  library,
  Core,
  fioriLibrary,
  Fragment,
  Filter,
  FilterOperator,
  Token,
  AppConstants,

  History,
  //   ErrorMessage,
  MessageBox) {
  "use strict";
  var that = this;

  return BaseController.extend("com.timetracker.timesheetModify.TimeSheetModify", {
    onInit: function () {
      this.oOwnerComponent = this.getOwnerComponent();

      this.oRouter = this.oOwnerComponent.getRouter();
      this.oModel = this.oOwnerComponent.getModel();

      this.oRouter.getRoute("time-sheet").attachMatched(this._onRouteMatched, this);
      var oModel = new sap.ui.model.json.JSONModel({ filterBarVisible: true });
      this.getView().setModel(oModel, "appModel");


    },


    registerPageIds: function () {
      let oView = this.getView();
      [
        this._tableId,

        this.oFilterBar,
        this.pageId,
        this.createdOn,


      ] = [
          oView.byId("supportTable"),

          oView.byId("filterbar"),
          oView.byId("page_WageSet"),
          oView.byId("drs_createdOn"),

        ];

    },
    _onRouteMatched: function () {
      this.setTitle("Time Tracker")
      this.registerPageIds();
      this.setFilterModel();
      this.fetchActivity();
      this.initFunctionalities();
      this.fetchCustomer();
      this.createdOn.setValue();
      this.fetchProjectName();
      // this.searchMiscellaneous();




    },
    onTabSelect: function (oEvent) {
      var oSelectedKey = oEvent.getParameter("selectedKey");
      var bShowFilterBar = (oSelectedKey === "support");
      this.getView().getModel("appModel").setProperty("/filterBarVisible", bShowFilterBar);
    },
    initFunctionalities: function () {
      let oHistory = History.getInstance();
      let sDirection = oHistory.getDirection();
      let fModel = this.getView().getModel("filterMdl");
      let oSettingMdl = this.getOwnerComponent().getModel("settings");
      let fData = fModel.getData();
      fModel.refresh(true);
      // this.getView().setModel(new JSONModel(), "timeSheetMdl");
    },
    clearSearchFilter: function (oEvent) {
      //Clear filter values
      this.setFilterModel();

      this.createdOn.setValue();
      // this.updatedOn.setValue();
      // this.cboStatus.setSelectedKeys();
    },

    onResetAdaptFilter: function (oEvent) {
      //reset adapt filter options
      let that = this;
      let oSettingMdl = this.getOwnerComponent().getModel("settings");
      oSettingMdl.getData().visible_filter = that._defaultAFOption;
      oSettingMdl.refresh(true);
      oEvent
        .getSource()
        .getFilterGroupItems()
        .forEach((e) => {
          let findLbl = that._defaultAFOption.find(
            (e1) => e.getLabel() == Object.keys(e1)[0]
          );
          if (findLbl) {
            e.setVisibleInFilterBar(findLbl[e.getLabel()]);
          }
        });
    },
    setFilterModel: function () {
      var filterObj = {
        id: null,
        soldToName: "",
        soldToParty: null,
        projectName:"",
        description: "",
        postingDate: null, //active 1 - in active 2
        priorityText: "",
        userStatusDescription: "",
        mPTStatus: "",
        createdBy:this.getStorage("userInfo").email,
        updatedBy: "",
        createdOnStart: "",
        createdOnEnd: "",
        lastChangedStart:"",
        lastChangedEnd:"",
        updatedOnStart: "",
        updatedOnEnd: "",
        startTime: "",
        endTime: "",
        statuses: "",
        duration: null,
        categoryTxt: "",
        status: null,
        pageNumber: 1,
        timeStatus:2,
        pageSize: AppConstants.Paging.page_size,
        sortingKey: "id",
        orderBy: "desc",
        stringType: false,

      };
      this.getView().setModel(new JSONModel(filterObj), "filterMdl");
    },
    fetchActivity: async function () {
      try {


        let path = AppConstants.URL.activity;
        let response = await this.restMethodGetWitData(path);
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    fetchProjectName: async function () {
      try {
          let path = AppConstants.URL.alm_filter;
          var filterParams = this.getView().getModel("filterMdl").getData();
          let response = await this.restMethodGetWitData(path, filterParams);
  
          // Grouping the response by projectName
          let groupedResponse = response.reduce((acc, item) => {
              let projectName = item.projectName || 'Unknown'; // Use 'Unknown' if projectName is missing
  
              // Initialize the group if it doesn't exist
              if (!acc.some(group => group.projectName === projectName)) {
                  acc.push({
                      projectName: projectName,
                      items: []
                  });
              }
  
              // Find the group and push the item to that group
              let group = acc.find(group => group.projectName === projectName);
              group.items.push(item);
  
              return acc;
          }, []);
  
          // Set the grouped response in the model "projectNameMdl"
          this.setModel(new JSONModel(groupedResponse), "projectNameMdl");
  
          return groupedResponse;
      } catch (error) {
          console.log(error);
      }
  },
  
  
    searchTimeSheet: async function () {
      let that = this;
      try {
        var path = AppConstants.URL.time_sheet_filter;
        this._tableId.setBusy(true);

        var filterParams = this.getView().getModel("filterMdl").getData();
        if (!filterParams.createdOnStart) {
          MessageBox.error(" Date is required.");
          this._tableId.setBusy(false);
          return;
      }

        filterParams.soldToParty = filterParams.soldToParty?filterParams.soldToParty.join( "," ):null;
        let response1 = await this.restMethodGetWitData(path, filterParams);
      
        let activityResponse = await this.fetchActivity();
        let response = response1.filter(e => e.status === 1);
        response.forEach(e => {
          e.activityText = activityResponse.find(d => e.activity == d.id)?.name;
        })
        response.forEach(e => e.status = e.status === 1 ? "Active" : "Inactive");


        //   if (!(response.length > 0)) {
        //     this._noData.setText(
        //       "No data found. Try adjusting the search or filter criteria."
        //     );
        //   } else {
        //     this._noData.setText(
        //       'To start, set the relevant filters and choose "Go".'
        //     );
        //   }

        this.setModel(new JSONModel(response), "timeSheetMdl");
        this._tableId.setBusy(false);
      } catch (ex) {
        this._tableId.setBusy(false);
        //   this.errorHandling(ex);
      }
    },
    handleChangeDateRange: function (oEvent) {
      let oParams = oEvent.getParameters(),
        oSource = oEvent.getSource(),
        oFields = oSource.getCustomData()[0].getValue().split(","),
        from = oParams.from,
        to = oParams.to,
        fModel = this.getView().getModel("filterMdl"),
        dateConv = function (date) {
          let originalDateString = date.toISOString(),
            originalDate = new Date(originalDateString),
            dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
              pattern: "yyyy-MM-dd",
            }),
            formattedDate = dateFormat.format(originalDate);
          return formattedDate;
        };
      if (
        from &&
        to &&
        from.toLocaleDateString() == to.toLocaleDateString()
      ) {
        to = new Date(to.getTime());
        oEvent.getSource().setValue(dateConv(from));
      }
      fModel.getData()[oFields[0]] = from ? dateConv(from) : from;
      fModel.getData()[oFields[1]] = to ? dateConv(to) : to;
      fModel.refresh();
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
    searchMiscellaneous: async function () {
      let that = this;
      try {
        var path = AppConstants.URL.miscellaneous_filter;
        this._tableId.setBusy(true);

        var filterParams = this.getView().getModel("filterMdl").getData();
        if (!filterParams.createdOnStart) {
          MessageBox.error(" Date is required.");
          this._tableId.setBusy(false);
          return;
      }
        filterParams.soldToParty = filterParams.soldToParty?filterParams.soldToParty.join( "," ):null;

        let response1 = await this.restMethodGetWitData(path, filterParams);
        let activityResponse = await this.fetchActivity();
        let response = response1.filter(e => e.status === 1);

        response.forEach(e => {
          e.activityText = activityResponse.find(d => e.activity == d.id)?.name;
        })
        response.forEach(e => e.status = e.status === 1 ? "Active" : "Inactive");
        this.setModel(new JSONModel(response), "miscellaneousMdl");
        this._tableId.setBusy(false);
      } catch (ex) {
        this._tableId.setBusy(false);
        //   this.errorHandling(ex);
      }
    },
    onSearch: function (oEvent) {

      this.searchTimeSheet();
    },
    onSearchalm: function (oEvent) {

      this.searchAlmTimesheet();
    },
    onSearchM: function (oEvent) {

      this.searchMiscellaneous();
    },
    searchAlmTimesheet: async function () {
      let that = this;
      try {
          var path = AppConstants.URL.alm_filter;
          this._tableId.setBusy(true);
  
          // Get the filter parameters from the model
          var filterParams = this.getView().getModel("filterMdl").getData();
          
          // Ensure the date is mandatory
          if (!filterParams.createdOnStart) {
              MessageBox.error("Date is required.");
              this._tableId.setBusy(false);
              return;
          }
  
          // Fetch the data based on the filter params
          let response1 = await this.restMethodGetWitData(path, filterParams);
        
          // Fetch the activities
          let activityResponse = await this.fetchActivity();
        
          // Filter by userStatus === 1 (Active)
          let response = response1.filter(e => e.userStatus === 1);
  
          // Also filter by selected projectName (if available)
          if (filterParams.projectName) {
              response = response.filter(e => e.projectName === filterParams.projectName);
          }
  
          // Map activity name to the response
          response.forEach(e => {
              e.activityText = activityResponse.find(d => e.activity == d.id)?.name;
          });
  
          // Set user status text (Active/Inactive)
          response.forEach(e => e.userStatus = e.userStatus === 1 ? "Active" : "Inactive");
  
          // Set the response data to the model
          this.setModel(new JSONModel(response), "almMdl");
  
          // Turn off busy indicator on the table
          this._tableId.setBusy(false);
      } catch (ex) {
          // Turn off busy indicator on error
          this._tableId.setBusy(false);
          console.log(ex);
      }
  },
  
    handleExport: function (oEvent) {
      // Export handler
      let dataSource = this.getView()
        .getModel("timeSheetMdl")
        .getData();
      this.onExport(
        this.createColumnConfig(),
        dataSource,
        "Manage Time Sheet"
      );
    },
    onhandleExport: function (oEvent) {
      // Export handler
      let dataSource = this.getView()
        .getModel("miscellaneousMdl")
        .getData();
      this.onExport(
        this.ColumnConfig(),
        dataSource,
        "Manage Miscellaneous Time Sheet"
      );
    },

    onhandleExportalm: function (oEvent) {
      // Export handler
      let dataSource = this.getView()
        .getModel("almMdl")
        .getData();
      this.onExport(
        this.ColumnConfigalm(),
        dataSource,
        "Manage ALM Time Sheet"
      );
    },

    onTabSelect: function (oEvent) {
      var sSelectedKey = oEvent.getParameter("key");
      var oView = this.getView();

    },



    onpressnav: function () {
      this.getRouter().navTo("dashboard");
    },

    handleChangeDateRange: function (oEvent) {
      let oParams = oEvent.getParameters(),
        oSource = oEvent.getSource(),
        oFields = oSource.getCustomData()[0].getValue().split(","),
        from = oParams.from,
        to = oParams.to,
        fModel = this.getView().getModel("filterMdl"),
        dateConv = function (date) {
          let originalDateString = date.toISOString(),
            originalDate = new Date(originalDateString),
            dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
              pattern: "yyyy-MM-dd",
            }),
            formattedDate = dateFormat.format(originalDate);
          return formattedDate;
        };
      if (
        from &&
        to &&
        from.toLocaleDateString() == to.toLocaleDateString()
      ) {
        to = new Date(to.getTime());
        oEvent.getSource().setValue(dateConv(from));
      }
      fModel.getData()[oFields[0]] = from ? dateConv(from) : from;
      fModel.getData()[oFields[1]] = to ? dateConv(to) : to;
      fModel.refresh();
    },
    createColumnConfig: function () {
      return [
      
      {
        label: 'Customer',
        property: 'soldToName',
        width: "25",
        visible: true,
      },
      {
        label: 'Customer Id',
        property: 'soldToParty',
        width: "25",
        visible: true,
      },
      {
        label: 'Task',
        property: 'description',
        width: "25",
        visible: true,
      },
      {
        label: "Activity",
        property: "activityText",
        width: "25",
        visible: true,
      },
      {
        label: "Created date",
        property: "createdOn",
        width: "25",
        visible: true,
      },
      {
        label: 'Start Time',
        property: 'startTime',
        width: "25",
        visible: true,
      },
      {
        label: 'End Time ',
        property: 'endTime',
        width: "25",
        visible: true,
      },
      {
        label: 'Duration',
        property: 'duration',
        width: "25",
        visible: true,
      },

      {
        label: 'Updated On',
        property: 'updatedOn',
        width: "25",
        visible: true,
      },
      {
        label: 'Assigned To',
        property: 'personRespName',
        width: "25",
        visible: true,
      },
      {
        label: 'Created  By',
        property: 'createdBy',
        width: "25",
        visible: true,
      }


      ];
    },
    ColumnConfig: function () {
      return [
      
      {
        label: 'Customer',
        property: 'soldToName',
        width: "25",
        visible: true,
      },

      {
        label: "Activity",
        property: "activityText",
        width: "25",
        visible: true,
      },
      {
        label: "Created date",
        property: "createdOn",
        width: "25",
        visible: true,
      },
      {
        label: 'Start Time',
        property: 'startTime',
        width: "25",
        visible: true,
      },
      {
        label: 'End Time ',
        property: 'endTime',
        width: "25",
        visible: true,
      },
      {
        label: 'Duration',
        property: 'duration',
        width: "25",
        visible: true,
      },

      {
        label: 'Updated On',
        property: 'updatedOn',
        width: "25",
        visible: true,
      },
      {
        label: 'Created  By',
        property: 'createdBy',
        width: "25",
        visible: true,
      }

      ];
    },
    ColumnConfigalm: function () {
      return [
     
      {
        label: 'Projects',
        property: 'soldToName',
        width: "25",
        visible: true,
      },

      {
        label: "Activity",
        property: "activityText",
        width: "25",
        visible: true,
      },
      {
        label: "Created date",
        property: "createdOn",
        width: "25",
        visible: true,
      },
      {
        label: 'Start Time',
        property: 'startTime',
        width: "25",
        visible: true,
      },
      {
        label: 'End Time ',
        property: 'endTime',
        width: "25",
        visible: true,
      },
      {
        label: 'Duration',
        property: 'duration',
        width: "25",
        visible: true,
      },

      {
        label: 'Updated On',
        property: 'updatedOn',
        width: "25",
        visible: true,
      },
      {
        label: 'Created  By',
        property: 'createdBy',
        width: "25",
        visible: true,
      }

      ];
    },
    onDeleteButtonPress: function (oEvent) {
      var msg = 'This item was deleted';
      MessageToast.show(msg);
    },
    onListItemPress: function (oEvent) {
      var selObj = oEvent.getSource().getBindingContext("timeSheetMdl").getObject();
      this.oRouter.navTo("time-sheet-details", {
        id: selObj.id
      });
    },
    onListItemALm: function (oEvent) {
      var selObj = oEvent.getSource().getBindingContext("almMdl").getObject();
      this.oRouter.navTo("alm-details", {
        id: selObj.id
      });
    },
    onItemPress: function (oEvent) {
      var selObj = oEvent.getSource().getBindingContext("miscellaneousMdl").getObject();
      this.oRouter.navTo("miscellaneous-details", {
        id: selObj.id
      });
    }
  });
});


