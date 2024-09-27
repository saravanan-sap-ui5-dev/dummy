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
  MessageBox) {
  "use strict";
  var that = this;

  return BaseController.extend("com.timetracker.clocktime.ClockTime", {
    onInit: function () {
      this.oOwnerComponent = this.getOwnerComponent();
      this._tableId = this.getView().byId("supportTable");
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oModel = this.oOwnerComponent.getModel();
  
      this.oRouter.getRoute("clock-time").attachMatched(this._onRouteMatched, this);
      this.startTime = null;
      this.timerRunning = false;
      var oModel = new sap.ui.model.json.JSONModel({ filterBarVisible: true });
      this.getView().setModel(oModel, "appModel");
  },
  
  onAfterRendering: function () {
      var oMultiComboBox = this.byId("select_Status");
      // Get all the keys from the ListItems
      var aItems = oMultiComboBox.getItems();
      var aKeys = aItems.map(function(oItem) {
          return oItem.getKey();});
      // Set all keys as selected
      oMultiComboBox.setSelectedKeys(aKeys);
  },
    _onRouteMatched: async function (oEvent) {
      this.setTitle("Time Tracker");
      this.registerPageIds();
      this.getView().setModel(new JSONModel([{descriptionText:null}]), "clockTimeMdl");
      this.getView().setModel(new JSONModel([]), "miscelleanousMdl");
      this.getView().setModel(new JSONModel([]), "almMdl");

      // Fetch timesheet data and determine if data is present
      let hasTimesheetData = await this.fetchTimesheet();
      let hasMiscellaneous = await this.fetchMiscellaneous();
      let hasAlmData = await this.fetchalmTimeSheet();
      // If no data is present, set the initial search model
      if (!hasTimesheetData || !hasMiscellaneous || !hasAlmData ) {
        if (!hasTimesheetData) {
          this.setInitialSearchModel();
        }
        if (!hasMiscellaneous) {
          this.setMiscellaneousModel();
        }
        if (!hasAlmData) {
          this.setInitialModel();
        }
      }
      this.fetchActivity();
      this.fetchCustomer();
      // this.createdOn.setValue();
      this.almdate.setValue();
      this.onAfterRendering();
      this.setColulmnsIntoModel();
      this.handleTablePersoDialogConfirm();
      this.resetPersoDialog(); //Column reset
      this.fetchProjects();
    },

    registerPageIds: function () {
      let oView = this.getView();
      [
        this._tableId,

        this.oFilterBar,
        this.pageId,
        this.createdOn,
        this.almdate,
      ] = [
          oView.byId("supportTable"),

          oView.byId("filterbar"),
          oView.byId("page_WageSettings"),
          oView.byId("drs_createdOn"),
          oView.byId("drs_createdOn1"),
        ];
    },
    setMiscellaneousModel: function () {
      let body = [{
        soldToName: null,
        soldToParty: null,
        duration: null,
        activity: null,
       description:null,
        startTime: null,
        endTime: null,
        status: 1,
        timeStatus: 2,
        icon: "sap-icon://media-play"
      }];
      this.getView().setModel(new JSONModel(body), "miscelleanousMdl")
    },
    setInitialSearchModel: function () {
      let serchBody = {
        SoldToName: "",
        ObjectId: "",
        SoldToParty: [],
        DescriptiveStatusCode: [],
        Description: "",
        descriptionText:"",
        CreatedAtDateFormatted: "",
        PriorityTxt: "",
        Priority: [],
        TimeFrameId: "",
        UserStatusCode: "",
        create_start: null,
        PostingDate: null,
        create_end: null,
        UserStatusDescription: null,
        MPTPercentage: null,
        PersonRespName:null,
        CategoryTxt: "",
        pagingEnabled: 1,
  };
      this.getView().setModel(new JSONModel(serchBody), "advancedFilterMdl");
    },
    setInitialModel: function () {
      let serchBody = {
        id: "",
        name: "",
        title: "",
        type: "",
        assigneeId: "",
        assigneeName:"",
        startDate: "",
        endDate: "",
        status: 1,
        timeStatus: 2,
        icon: "sap-icon://media-play"
       
  };
      this.getView().setModel(new JSONModel(serchBody), "almFilterMdl");
    },
    initFunctionalities: function () {
      let oHistory = History.getInstance();
      let sDirection = oHistory.getDirection();
      let fModel = this.getView().getModel("advancedFilterMdl");
      let oSettingMdl = this.getOwnerComponent().getModel("settings");
      let exFilter = oSettingMdl.getData().filter;
      let fData = fModel.getData();
      fModel.refresh(true);
      this.getView().setModel(new JSONModel(), "clockTimeMdl");
      
      this.timerRunning = false;
      oSettingMdl.refresh(true);
      this.getView().setModel(new JSONModel(),"almMdl");
    },
    advancedFilter: function () {
      this.setModel(new JSONModel({}), "clockTimeMdl");
      let mdl = this.getView().getModel("advancedFilterMdl").getData();
      mdl.skip = 0;
      this.fetchclockTime();
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
    fetchCustomer: async function () {
      try {
        let path = AppConstants.URL.customer;
        let response = await this.restMethodGetWitData(path);
        this.setModel(new JSONModel(response), "customerMdl");
      } catch (error) {
        console.log(error);
      }
    },
    fetchProjects: async function () {
      try {
        let path = AppConstants.URL.alm_implementation;
        let response = await this.restMethodGet(path);
        this.setModel(new JSONModel(response), "projectsMdl");
      } catch (error) {
        console.log(error);
      }
    },
    formatDate: function (dateStr) {
      let [day, month, year] = dateStr.split(".");
      // Convert the 2-digit year to 4-digit
      year = "20" + year;
      let formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
handleChangeDateRange: function (oEvent) {
  let oDateRangeSelection = this.getView().byId("drs_createdOn");
  let oTimeFrame = this.getView().byId("timeFrame");

  let oStartDate = oDateRangeSelection.getDateValue();
  let oEndDate = oDateRangeSelection.getSecondDateValue();

  if (oStartDate && oEndDate) {
      // If a date range is selected, disable the TimeFrame
      oTimeFrame.setEnabled(false);
  } else {
      // If no date range is selected, enable the TimeFrame
      oTimeFrame.setEnabled(true);
  }

  const formatDate = function(date, isEndDate) {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = isEndDate ? '23' : String(date.getHours()).padStart(2, '0');
      const minutes = isEndDate ? '59' : String(date.getMinutes()).padStart(2, '0');
      const seconds = isEndDate ? '59' : String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  let fModel = this.getView().getModel("advancedFilterMdl");

  // Format the start and end dates
  const formattedDate = formatDate(oStartDate, false);
  const formattedDate1 = formatDate(oEndDate, true);

  // Set create_start and create_end in the model
  fModel.getData().create_start = formattedDate;
  fModel.getData().create_end = formattedDate1;

  fModel.refresh();
},

    onTimeFrameChange: function(oEvent) {
      let oTimeFrame = this.getView().byId("timeFrame");
      let oDateRangeSelection = this.getView().byId("drs_createdOn");
  
      let selectedKey = oTimeFrame.getSelectedKey();
  
      if (selectedKey) {
          // If Time Frame is selected, disable the DateRangeSelection
          oDateRangeSelection.setEnabled(false);
      } else {
          // If no Time Frame is selected, enable the DateRangeSelection
          oDateRangeSelection.setEnabled(true);
      }
      this.onAfterRendering();
  },
    refreshTabsAfterTimer: function () {
      var oIconTabBar = this.getView().byId("iconTabBar"); // Replace with actual ID of IconTabBar
  
      // Fetch all models and data
      var oModel = this.getView().getModel("clockTimeMdl");
      var data = oModel.getData().clockTimeData;
  
      var oModel1 = this.getView().getModel("miscelleanousMdl");
      var data1 = oModel1.getData();
  
      var oModel2 = this.getView().getModel("almMdl");
      var data2 = oModel2.getData();
  
      // Check if any timer is running
      var isTimerRunningInClockTime = data.some(row => row.timeStatus === 1);
      var isTimerRunningInMiscellaneous = data1.some(row => row.timeStatus === 1);
      var isTimerRunningInAlm = data2.some(row => row.timeStatus === 1);
  
      // If no timers are running, enable all tabs
      if (!isTimerRunningInClockTime && !isTimerRunningInMiscellaneous && !isTimerRunningInAlm) {
          oIconTabBar.getItems().forEach(function (tab) {
              tab.setEnabled(true); // Enable all tabs
          });
          sap.m.MessageToast.show("All tabs are re-enabled as no timers are running.");
      }
  },
    // ***for  ALM functionality ***
    onPlayPressalm: async function (oEvent) {
      var oButton = oEvent.getSource();
      var oItem = oEvent.getSource().getParent(); // Assuming the button is in a table row
      var rowObj = oItem.getBindingContext("almMdl").getObject();
      var oTable = oItem.getParent(); // Get the parent table
      var oModel = this.getView().getModel("almMdl");
      var data = oModel.getData();
  
      var oSelectedItem = this.getView().byId("almCustomer").getSelectedItem();
      var oComboBox = this.getView().byId("almCustomer"); // ComboBox reference
      var StartDateField = this.getView().byId("drs_createdOn1");
      var projectName = oSelectedItem ? oSelectedItem.getText() : ""; 
      let supportRunning, almrunning;
      var oModel12 = this.getView().getModel("clockTimeMdl");
      
          var data12 = oModel12.getData().clockTimeData;
          var oModel2 = this.getView().getModel("miscelleanousMdl");
          var data2 = oModel2.getData();
          if(data12.length>0){
             supportRunning=data12[0].timeStatus==1?true:false;
            }
            if(data2.length>0){
               almrunning=data2[0].timeStatus==1?true:false;
              }
              var isTimerRunning= supportRunning || almrunning?true:false;
      
      // If any other timer is running, don't proceed
      if (isTimerRunning) {
        sap.m.MessageToast.show("Another timer is already running.");
        // Exit function without executing further
      }
    else  if (rowObj.timeStatus === 1) {
          // Pause the timer
          oButton.setIcon("sap-icon://media-play");
          rowObj.activityVisible = false;
          rowObj.timeStatus = 2;
  
          // Enable the ComboBox and date fields when timeStatus is 2 (paused)
          oComboBox.setEnabled(true);
          StartDateField.setEnabled(true);
  
          // Stop the timer
          clearInterval(this.intervalId);
          this.intervalId = null;
          this.timerRunning = false;
          var stopTime = new Date();
          rowObj.endTime = stopTime.toTimeString().split(' ')[0]; // Capture the stop time (time only)
          var duration = this.calculateDuration2(rowObj.startTime, stopTime);
          rowObj.duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
  
          var path = AppConstants.URL.alm_timesheet;
          let requestData = {
              "id": rowObj.id,
              "projectId": rowObj.id,
              "title": rowObj.title,
              "type": rowObj.type,
              "startDate": rowObj.startDate,
              "dueDate": rowObj.dueDate,
              "priorityText": rowObj.priorityId,
              "description": rowObj.description,
              "createdBy":this.getStorage("userInfo").email,
              "location": "Work From Office",
              "projectName": rowObj.projectName,
              "duration": rowObj.duration,
              "activity": rowObj.activity,
              "startTime": rowObj.startTime,
              "endTime": rowObj.endTime,
              "remarks": rowObj.remarks,
              "status": rowObj.status,
              "userStatus": 1,
              "timeStatus": 2
          };
          await this.restMethodPost(path, [requestData]);
  
          // Enable all buttons and refresh the model
          this.enableAllButtons(oTable);
          oModel.refresh(true); 
          this._onRouteMatched();
          this.refreshTabsAfterTimer();
      } else {
          // Start the timer
          oButton.setIcon("sap-icon://media-pause");
          rowObj.activityVisible = true;
          rowObj.timeStatus = 1;
  
          // Disable the ComboBox and date fields when timeStatus is 1 (running)
          oComboBox.setEnabled(false);
          StartDateField.setEnabled(false);
  
          // Move the row to the top of the table
          var oCurrentItem = oTable.removeItem(oItem);
          oTable.insertItem(oCurrentItem, 0);
  
          // Move the rowObj to the top of the data array
          var index = data.indexOf(rowObj);
          if (index > -1) {
              data.splice(index, 1);
              data.unshift(rowObj);
          }
  
          this.startTime = new Date();
          rowObj.startTime = this.startTime.toTimeString().split(' ')[0];
          this.timerRunning = true;
  
          // Start the interval for updating the duration
          this.intervalId = setInterval(() => {
              var currentTime = new Date();
              var duration = this.calculateDuration2(this.startTime, currentTime);
              rowObj.duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
              oModel.refresh(true); // Refresh at intervals to update the duration
          }, 1000);
  
          var path = AppConstants.URL.alm_timesheet;
          let requestData = {
              "projectId": rowObj.id,
              "title": rowObj.title,
              "type": rowObj.type,
              "startDate": rowObj.startDate,
              "dueDate": rowObj.dueDate,
              "status": rowObj.status,
              "priorityText": rowObj.priorityId,
              "createdBy": this.getStorage("userInfo").email,
              "location": "Work From Office",
              "projectName": projectName,
              "duration": rowObj.duration,
              "activity": rowObj.activity,
              "description": rowObj.description,
              "startTime": rowObj.startTime,
              "endTime": rowObj.endTime,
              "remarks": rowObj.remarks,
              "status": rowObj.status,
              "userStatus": 1,
              "timeStatus": 1
          };
          await this.restMethodPost(path, [requestData]);
  
          let activeStatus = this.getView().getModel("almMdl");
          activeStatus.getData().find(function (e) {
              if (e.id === requestData.id) {
                  e.id = requestData.id;
              }
          });
          activeStatus.refresh();
          oModel.refresh(true);
          this._onRouteMatched();
      }
  
      // Disable the FilterBar if any row has timeStatus === 1
      var hasActiveTimer = data.some(item => item.timeStatus === 1);
      this.byId("almFilterbar").setEnabled(!hasActiveTimer); // Replace "filterBarId" with your actual FilterBar ID
  },
  fetchalmTimeSheet: async function () {
    try {
      var path = AppConstants.URL.alm_filter;
      let filterParams = {
        timeStatus: 1,
        pageNumber: 1,
        pageSize: AppConstants.Paging.page_size,
        sortingKey: "id",
        orderBy: "asc",
        stringType: false
      };
      let response = await this.restMethodPost(path, filterParams);
      let newResponse = response.map(e => ({
        id: e.id,
        projectId: e.projectId,
        title: e.title,
        type: e.type,
        startDate: e.startDate,
        dueDate:e.dueDate,
        priorityId:e.priorityText,
        projectName:e.projectName,
        description: e.description,
        activity: e.activityVisible,
        createdBy: e.createdBy,  // Static value
        duration: e.duration,
        startTime: e.startTime,
        timeStatus: e.timeStatus,
        status: e.status,
        icon: e.timeStatus === 1 ? "sap-icon://media-pause" : "sap-icon://media-play"
      }));
      // Set the model with the response data
      this.setModel(new JSONModel( newResponse ), "almMdl");
      // Start live update for duration
      this.startLiveDurationUpdate2(newResponse);
      // Check if data is present
      let dataFetched = response && response.length > 0;
      // Set the dataFetched flag in the appModel
      this.getView().getModel("appModel").setProperty("/dataFetched", dataFetched);
    } catch (ex) {
      console.log(ex);
      // On error or no data, reset the flag
      this.getView().getModel("appModel").setProperty("/dataFetched", false);
      // Clear any running timers
      this.clearLiveDurationUpdate2();
    }
  },
  startLiveDurationUpdate2: function () {
    this.clearLiveDurationUpdate2();
    this.intervalId = setInterval(() => {
      let oModel = this.getView().getModel("almMdl");
      let data = oModel.getData();
      var currentTime = new Date();
    var duration = this.calculateDuration2(data[0].startTime, currentTime);
    data[0].duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
    oModel.refresh(true); // Refresh the model to reflect the updated duration
}, 1000);
},
  clearLiveDurationUpdate2: function () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
// for ALM buttons
calculateDuration2: function (startTime) {
    let [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
    let now = new Date();
    let currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, startSecond);
    let diffMs = now - currentTime;
    if (diffMs < 0) diffMs += 86400000; // If time is negative, add one day in milliseconds
    let diffSecs = Math.floor(diffMs / 1000);
    let hours = Math.floor(diffSecs / 3600);
    let minutes = Math.floor((diffSecs % 3600) / 60);
    let seconds = diffSecs % 60;
    return {
      hours,
      minutes,
      seconds
    };
  },
  fetchalm: async function (sProjectId, sStartDate, sEndDate) {
    try {
        var path = AppConstants.URL.alm_projects + "?projectId=" + sProjectId; // Append the project ID to the URL
        this.byId("almTable").setBusy(true); // Adjust ID as needed

        let response = await this.restMethodGet(path);
        if (sStartDate && sEndDate) {
            const startDate = new Date(sStartDate);
            const endDate = new Date(sEndDate);

            response = response.filter(ele => {
                const eleStartDate = new Date(ele.startDate);
                
                return eleStartDate >= startDate && eleStartDate <= endDate;
            });

        }

        const statusMapping = {
            "CIPTKCLOSE": "Done",
            "CIPUSCLOSE": "Done",
            "CIPREQCLOSE": "Done",
            "CIPDFCTDONE": "Done",
            "CIPTKBLK": "Blocked",
            "CIPUSBLK": "Blocked",
            "CIPREQUBLK": "Blocked",
            "CIPDFCTBLK": "Blocked",
            "CIPTKNO": "Not Relevant",
            "CIPUSNO": "Not Relevant",
            "CIPREQUNO": "Not Relevant"
        };

        response = response.filter(ele => {
            const status = statusMapping[ele.status] || ele.status;
            return status !== "Not Relevant" && status !== "Done" && status !== "Blocked";
        });
        response.forEach(ele => {
            ele.activityVisible = false;
            ele.icon = ele.timeStatus == 1 ? "sap-icon://media-pause" : "sap-icon://media-play";
        });

        this.setModel(new JSONModel(response), "almMdl");
        this.byId("almTable").setBusy(false); // Adjust ID as needed
    } catch (ex) {
        this.byId("almTable").setBusy(false); // Adjust ID as needed
        MessageToast.show("An error occurred while fetching data.");
    }
},
onALMSearch: function (oEvent) {
  // Check if any timer is already running in the current ALM model
  var oModel = this.getView().getModel("almMdl");
  var oData = oModel ? oModel.getData() : [];

  var isTimerRunning = oData.some(function (ele) {
      return ele.timeStatus === 1;  // Check if any element has timeStatus 1 (timer running)
  });

  if (isTimerRunning) {
      MessageToast.show("A timer is already running. Please pause the timer before searching.");
      return; // Stop function execution if a timer is running
  }

  // Get the selected project ID from the ComboBox
  var oComboBox = this.byId("almCustomer");
  var sProjectId = oComboBox.getSelectedKey();

  // Get the selected date range from the DateRangeSelection control
  var oDateRangeSelection = this.byId("drs_createdOn1");
  var sStartDate = oDateRangeSelection.getDateValue();  // Get the start date
  var sEndDate = oDateRangeSelection.getSecondDateValue();  // Get the end date

  if (!sStartDate || !sEndDate) {
      MessageToast.show("Please select a valid date range.");
      return; // Stop the function if date range is not selected
  }

  if (sProjectId) {
      // Format the start and end dates as needed (e.g., 'yyyy-MM-dd')
      var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd"
      });
      sStartDate = oDateFormat.format(sStartDate);
      sEndDate = oDateFormat.format(sEndDate);

      console.log("Selected Project ID: ", sProjectId);
      console.log("Selected Start Date: ", sStartDate);
      console.log("Selected End Date: ", sEndDate);

      // Call the fetchalm function with the selected project ID and date range
      this.fetchalm(sProjectId, sStartDate, sEndDate);
  } else {
      MessageToast.show("Please select a project.");
  }
},
checkSubmitALM:function(oEvent){
  let oModel = this.getView().getModel();
  let oData = oModel.getData();
  oEvent.getSource().getBindingContext("almMdl").getObject().description =  oEvent.getSource().getValue();
  oModel.refresh(true);
},
clearALMSearchFilter: function (oEvent) {
  // Reset the model to its initial state
  this.setInitialModel();

  var oDateRangeSelection = this.byId("drs_createdOn1");
  if (oDateRangeSelection) {
      oDateRangeSelection.setValue("");  // Clear the displayed value
  }

  var oComboBox = this.byId("almCustomer");
  if (oComboBox) {
      oComboBox.setSelectedKey("");  // Clear the selected project
  }

  let oSearchBodyModel = this.getView().getModel("almFilterMdl");
  if (oSearchBodyModel) {
      oSearchBodyModel.setData({});  // Reset the data to an empty object
  }
  console.log("Search filters have been cleared.");
},

// ***for support functionality ***

fetchTimesheet: async function () {
  try {
    var path = AppConstants.URL.time_sheet_filter;
    let filterParams = {
      timeStatus: 1,
      pageNumber: 1,
      pageSize: AppConstants.Paging.page_size,
      sortingKey: "id",
      orderBy: "asc",
      stringType: false
    };
    let response = await this.restMethodPost(path, filterParams);
    let newResponse = response.map(e => ({
      id: e.id,
      SoldToName: e.soldToName,
      SoldToParty: e.soldToParty,
      ObjectId: e.objectId,
      Description: e.description,
      descriptionText:e.descriptionText,
      PersonRespName:e.personRespName,
      CreatedAtDateFormatted: e.postingDate,  // Assuming formatDate is a method in the same context
      PriorityTxt: e.priorityText,
      UserStatusDescription: e.userStatusDescription,
      CategoryTxt: e.categoryTxt,
      MPTPercentage: e.mPTPercentage,
      activity: e.activityVisible,
      createdBy:e.createdBy,  // Static value
      duration: e.duration,
      startTime: e.startTime,
      timeStatus: 1,
      status: 1,
      icon: "sap-icon://media-pause"
    }));
    // Set the model with the response data
    this.setModel(new JSONModel({ clockTimeData: newResponse }), "clockTimeMdl");
    // Start live update for duration
    this.startLiveDurationUpdate(newResponse);
    // Check if data is present
    let dataFetched = response && response.length > 0;
    // Set the dataFetched flag in the appModel
    this.getView().getModel("appModel").setProperty("/dataFetched", dataFetched);
  } catch (ex) {
    console.log(ex);
    // On error or no data, reset the flag
    this.getView().getModel("appModel").setProperty("/dataFetched", false);
    // Clear any running timers
    this.clearLiveDurationUpdate();
  }
},
calculateDuration: function (start, stop) {
  var diffMs = stop - start; // Difference in milliseconds
  var diffSecs = Math.floor(diffMs / 1000);
  var hours = Math.floor(diffSecs / 3600);
  var minutes = Math.floor((diffSecs % 3600) / 60);
  var seconds = diffSecs % 60;
  // Ensure leading zeros for single-digit numbers
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');
  return { hours, minutes, seconds };
},
    startLiveDurationUpdate: function (clockTimeData) {
      this.clearLiveDurationUpdate(); // Ensure no previous intervals are running
      this.liveUpdateIntervalId = setInterval(() => {
        clockTimeData.forEach(rowObj => {
          if (rowObj.timeStatus === 1) {
            let startTimeArray = rowObj.startTime.split(':');
            let startTime = new Date();
            startTime.setHours(parseInt(startTimeArray[0]));
            startTime.setMinutes(parseInt(startTimeArray[1]));
            startTime.setSeconds(parseInt(startTimeArray[2]));
            let currentTime = new Date();
            let duration = this.calculateDuration(startTime, currentTime);
            rowObj.duration = `${String(duration.hours).padStart(2, '0')}:${String(duration.minutes).padStart(2, '0')}:${String(duration.seconds).padStart(2, '0')}`;
          }
        });
        this.getView().getModel("clockTimeMdl").refresh(true); // Refresh the model to update the UI
      }, 1000);
    },

    clearLiveDurationUpdate: function () {
      if (this.liveUpdateIntervalId) {
        clearInterval(this.liveUpdateIntervalId);
        this.liveUpdateIntervalId = null;
      }
    },
    onSearch: function (oEvent) {
      // Get the clockTimeData model
      let oModel = this.getView().getModel("clockTimeMdl");
      let clockTimeData = oModel.getData().clockTimeData;
  
      // Check if any row has timeStatus as 1
      let activeTimer = clockTimeData.some(row => row.timeStatus === 1);
  
      if (activeTimer) {
          sap.m.MessageToast.show("An active timer is running. Please pause it before performing a search.");
          return; // Prevent the search from proceeding
      }
  
      let appModel = this.getView().getModel("appModel");
      let dataFetched = appModel.getProperty("/dataFetched");
      if (dataFetched) {
          // Data is already fetched, show the existing data
          sap.m.MessageToast.show("Data has already been fetched. Displaying existing data.");
          return;
      }
  
      let count = 0;
      let filterCount = this.getView().byId("filterbar").getAllFilterItems().length;
      let searchBody = this.getView().getModel("advancedFilterMdl").getData();
      let oTimeFrame = this.getView().byId("timeFrame").getSelectedKey();
      let Ocategory = this.getView().byId("select_Category").getSelectedKey();
      let oDateRangeSelection = this.getView().byId("drs_createdOn");
      let oStartDate = oDateRangeSelection.getDateValue();
      let oEndDate = oDateRangeSelection.getSecondDateValue();
  
      // Ensure either timeFrame or postingDate is selected
      if (!oTimeFrame && (!oStartDate || !oEndDate)) {
          sap.m.MessageToast.show("Either Time Frame or Posting Date must be selected.");
          return;
      }
      if (!Ocategory ) {
        sap.m.MessageToast.show(" Atleast one Category must be selected");
        return;
    }
      if (searchBody.Priority !== null && searchBody.Priority !== "") {
          if (!Array.isArray(searchBody.Priority)) {
              searchBody.Priority = [searchBody.Priority];
          }
          let filterConditions = searchBody.Priority.map(value => `Priority eq '${value}'`).join(' or ');
          searchBody.Priority = filterConditions;
      }
      if (searchBody.SoldToParty !== null && searchBody.SoldToParty !== "") {
          if (!Array.isArray(searchBody.SoldToParty)) {
              searchBody.SoldToParty = [searchBody.SoldToParty];
          }
          let filterConditions = searchBody.SoldToParty.map(value => `SoldToParty eq '${value}'`).join(' or ');
          searchBody.SoldToParty = filterConditions;
      }
      if (searchBody.DescriptiveStatusCode !== null && searchBody.DescriptiveStatusCode !== "") {
          if (!Array.isArray(searchBody.DescriptiveStatusCode)) {
              searchBody.DescriptiveStatusCode = [searchBody.DescriptiveStatusCode];
          }
          let filterConditions = searchBody.DescriptiveStatusCode.map(value => `DescriptiveStatusCode eq '${value}'`).join(' or ');
          searchBody.DescriptiveStatusCode = filterConditions;
      }
      if (searchBody.create_start && searchBody.create_end) {
          let lastChangeStartDate = `PostingDate ge datetime'${searchBody.create_start}'`;
          let lastChangeEndDate = `PostingDate le datetime'${searchBody.create_end}'`;
          searchBody.PostingDate = lastChangeStartDate + " and " + lastChangeEndDate;
      } else {
          delete searchBody.PostingDate;
      }
  
      if (oTimeFrame) {
          oDateRangeSelection.setEnabled(false);
      } else if (oStartDate && oEndDate) {
          this.getView().byId("timeFrame").setEnabled(false);
      }
     
      this.fetchclockTime();
      this.onAfterRendering();
  },
 
   
    fetchclockTime: async function () {
      try {
        var path = AppConstants.URL.application_filter;
        this._tableId.setBusy(true);
        let searchBody = this.getView().getModel("advancedFilterMdl").getData();
        let response = await this.restMethodPost(path, searchBody);
        response.forEach(ele => {
          ele.SoldToName = ele.SoldToName.split(" / ")[0];
          // ele.descriptionText = null;
          ele.activityVisible = false;
          ele.icon = ele.timeStatus == 1 ? "sap-icon://media-pause" : "sap-icon://media-play"
        });
        this.setModel(new JSONModel({ clockTimeData: response }), "clockTimeMdl");
        this._tableId.setBusy(false);
      } catch (ex) {
        this._tableId.setBusy(false);
        sap.m.MessageToast.show("An error occurred while fetching data.");
      }
    },
  
    checkSubmit:function(oEvent){
        let oModel = this.getView().getModel();
        let oData = oModel.getData();
        oEvent.getSource().getBindingContext("clockTimeMdl").getObject().descriptionText =  oEvent.getSource().getValue();
        oModel.refresh(true);
    },
   


    clearSearchFilter: function (oEvent) {
      this.setInitialSearchModel();
      this.createdOn.setValue();
      let searchBody = this.getView().getModel("advancedFilterMdl").getData();
      searchBody==null;
      this.onAfterRendering();
    },
onPlayPausePress: async function (oEvent) {
  var oButton = oEvent.getSource();
  var oItem = oEvent.getSource().getParent(); // Assuming the button is in a table row
  var rowObj = oItem.getBindingContext("clockTimeMdl").getObject();
  var oTable = oItem.getParent(); // Get the parent table
  var oModel = this.getView().getModel("clockTimeMdl");
  var data = oModel.getData().clockTimeData;


  let supportRunning, almrunning;
  var oModel12 = this.getView().getModel("miscelleanousMdl");
  
      var data12 = oModel12.getData();
      var oModel2 = this.getView().getModel("almMdl");
      var data2 = oModel2.getData();
      if(data12.length>0){
         supportRunning=data12[0].timeStatus==1?true:false;
        }
        if(data2.length>0){
           almrunning=data2[0].timeStatus==1?true:false;
          }
          var isTimerRunning= supportRunning || almrunning?true:false;
  // If any other timer is running, don't proceed
  if (isTimerRunning) {
    sap.m.MessageToast.show("Another timer is already running.");
    // Exit function without executing further
  }

  else if (rowObj.timeStatus === 1) {
      // Pause the timer
      oButton.setIcon("sap-icon://media-play");
      rowObj.activityVisible = false;
      rowObj.timeStatus = 2;

      // Stop the timer
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.timerRunning = false;
      var stopTime = new Date();
      rowObj.endTime = stopTime.toTimeString().split(' ')[0]; // Capture the stop time (time only)
      var duration = this.calculateDuration(this.startTime, stopTime);
      rowObj.duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
      rowObj.status = 1;

      var path = AppConstants.URL.time_sheet;
      let requestData = {
          "id": rowObj.id,
          "soldToName": rowObj.SoldToName,
          "soldToParty": rowObj.SoldToParty,
          "objectId": rowObj.ObjectId,
          "description": rowObj.Description,
          "descriptionText": rowObj.descriptionText,  // Preserve the descriptionText
          "personRespName": rowObj.PersonRespName,
          "postingDate": rowObj.CreatedAtDateFormatted,
          "priorityText": rowObj.PriorityTxt,
          "userStatusDescription": rowObj.UserStatusDescription,
          "categoryTxt": rowObj.CategoryTxt,
          "mPTStatus": rowObj.MPTPercentage,
          "createdBy":this.getStorage("userInfo").email,
          "location":"Work From Office",
          "duration": rowObj.duration,
          "activity": rowObj.activity,
          "startTime": rowObj.startTime,
          "endTime": rowObj.endTime,
          "remarks": rowObj.remarks,
          "timeStatus": 2,
          "status": 1
      };
      await this.restMethodPost(path, [requestData]);

      // Enable all buttons and refresh the model only after completing the API call
      this.enableAllButtons(oTable);
      oModel.refresh(true); // Refresh here after updates are done
      this._onRouteMatched();
      this.refreshTabsAfterTimer();

  } else {
      // Start the timer
      oButton.setIcon("sap-icon://media-pause");
      rowObj.activityVisible = true;
      rowObj.timeStatus = 1;

      // Move the row to the top of the table
      var oCurrentItem = oTable.removeItem(oItem);
      oTable.insertItem(oCurrentItem, 0);

      // Move the rowObj to the top of the data array
      var index = data.indexOf(rowObj);
      if (index > -1) {
          data.splice(index, 1);
          data.unshift(rowObj);
      }

      this.startTime = new Date();
      rowObj.startTime = this.startTime.toTimeString().split(' ')[0];
      this.timerRunning = true;

      // Start the interval for updating the duration
      this.intervalId = setInterval(() => {
          var currentTime = new Date();
          var duration = this.calculateDuration(this.startTime, currentTime);
          rowObj.duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
          oModel.refresh(true); // Refresh at intervals to update only the duration
      }, 1000);

      var path = AppConstants.URL.time_sheet;
      let requestData = {
          "soldToName": rowObj.SoldToName,
          "soldToParty": rowObj.SoldToParty,
          "objectId": rowObj.ObjectId,
          "description": rowObj.Description,
          "descriptionText": rowObj.descriptionText,  // Preserve the descriptionText
          "personRespName": rowObj.PersonRespName,
          "postingDate": this.formatDate(rowObj.CreatedAtDateFormatted),
          "priorityText": rowObj.PriorityTxt,
          "userStatusDescription": rowObj.UserStatusDescription,
          "categoryTxt": rowObj.CategoryTxt,
          "mPTStatus": rowObj.MPTPercentage,
          "createdBy": this.getStorage("userInfo").email,
          "location":"Work From Office",
          "duration": rowObj.duration,
          "activity": rowObj.activity,
          "startTime": rowObj.startTime,
          "endTime": null,
          "remarks": null,
          "timeStatus": 1,
          "status": 1
      };
      let response = await this.restMethodPost(path, [requestData]);

      let activeStatus = this.getView().getModel("clockTimeMdl");
      activeStatus.getData().clockTimeData.find(function (e) {
          if (e.ObjectId === response[0].objectId) {
              e.id = response[0].id;
          }
      });
      activeStatus.refresh();
      oModel.refresh(true);
      this._onRouteMatched();
  }
},

    disableAllButtons: function (oTable, oCurrentButton) {
      var items = oTable.getItems();
      items.forEach(function (item) {
        var button = item.getCells().find(function (control) {
          return control.isA("sap.m.Button");
        });
        if (button && button !== oCurrentButton) {
          button.setEnabled(false);
        }
      });
    },
    enableAllButtons: function (oTable) {
      var items = oTable.getItems();
      items.forEach(function (item) {
        var button = item.getCells().find(function (control) {
          return control.isA("sap.m.Button");
        });
        if (button) {
          button.setEnabled(true);
        }
      });
    },
   
    
    // ** for miscellaneous functionality
fetchMiscellaneous: async function () {
  try {
      var path = AppConstants.URL.miscellaneous_filter;
      let filterParams = {
          timeStatus: 1,
          pageNumber: 1,
          pageSize: AppConstants.Paging.page_size,
          sortingKey: "id",
          orderBy: "asc",
          stringType: false
      };
      let response = await this.restMethodPost(path, filterParams);
      let newResponse = response.map(e => ({
          id: e.id,
          soldToName: e.soldToName,
          soldToParty: e.soldToParty,
          activity: e.activity,
          createdBy: e.createdBy,
          duration: e.duration,
          description: e.description,
          startTime: e.startTime, // Keep as time string
          timeStatus: e.timeStatus,
          status: e.status,
          icon: e.timeStatus === 1 ? "sap-icon://media-pause" : "sap-icon://media-play"
      }));
  
      this.setModel(new JSONModel(newResponse), "miscelleanousMdl");
      this.getView().getModel("miscelleanousMdl").refresh(true);  // Force refresh after fetching data
      
      this.getView().getModel("appModel").setProperty("/dataFetched", newResponse.length > 0);
      if (newResponse.length > 0) {
          this.startLiveDurationUpdate1(newResponse);
      } 
      // else {
      //     this.clearLiveDurationUpdate1();
      // }
      return newResponse.length > 0;
  } catch (ex) {
      console.log(ex);
      this.getView().getModel("appModel").setProperty("/dataFetched", false);
      this.clearLiveDurationUpdate1();
      return false;
  }
},


// Calculate duration
calculateDuration1: function (startTime) {
  let [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
  let now = new Date();
  let currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, startSecond);
  let diffMs = now - currentTime;
  if (diffMs < 0) diffMs += 86400000; // If time is negative, add one day in milliseconds
  let diffSecs = Math.floor(diffMs / 1000);
  let hours = Math.floor(diffSecs / 3600);
  let minutes = Math.floor((diffSecs % 3600) / 60);
  let seconds = diffSecs % 60;
  return {
      hours,
      minutes,
      seconds
  };
},

// Handle play/pause button press
onPlayPress: async function (oEvent) {
  var oButton = oEvent.getSource();
  var oModel = this.getView().getModel("miscelleanousMdl");
  var data = oModel.getData();

  // Check if timeStatus in onPlayPausePress or onPlayPressalm is 1 (timer running)
  let supportRunning, almrunning;
  var oModel12 = this.getView().getModel("clockTimeMdl");
  
  var data12 = oModel12.getData().clockTimeData;
  var oModel2 = this.getView().getModel("almMdl");
  var data2 = oModel2.getData();
  
  if (data12.length > 0) {
    supportRunning = data12[0].timeStatus === 1;
  }
  
  if (data2.length > 0) {
    almrunning = data2[0].timeStatus === 1;
  }
  
  var isTimerRunning = supportRunning || almrunning;
  
  // If any other timer is running, don't proceed
  if (isTimerRunning) {
    sap.m.MessageToast.show("Another timer is already running.");
    return; // Exit function without executing further
  }

  // Check if soldToName is empty before starting the timer
  if (!data[0].soldToName) {
    sap.m.MessageToast.show("Please select a customer before starting the timer.");
    return; // Exit function without executing further
  }

  if (data[0].timeStatus === 1) {
    // Pause the timer
    oButton.setIcon("sap-icon://media-play");
    data[0].timeStatus = 2;
    // data[0].activityVisible = false;
    
    // Stop live duration update
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.timerRunning = false;
    var stopTime = new Date();
    data[0].endTime = stopTime.toTimeString().split(' ')[0];
    
    // Calculate final duration
    var duration = this.calculateDuration1(data[0].startTime, stopTime);
    data[0].duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
    data[0].status = 1;
    
    var path = AppConstants.URL.miscellaneous;
    let requestData = {
        "id": data[0].id,
        "soldToName": data[0].soldToName,
        "soldToParty": data[0].soldToParty,
        "duration": data[0].duration,
        "activity": data[0].activity,
        "startTime": data[0].startTime,
        "endTime": data[0].endTime,
        "remarks": data[0].remarks,
        "description": data[0].description,
        "createdBy":data[0].this.getStorage("userInfo").email,
        "status": 1,
        "timeStatus": 2
    };
    await this.restMethodPost(path, [requestData]);
    oModel.refresh(true);
    this._onRouteMatched();
   
  } else {
    // Start the timer
    oButton.setIcon("sap-icon://media-pause");
    data[0].timeStatus = 1;
    // data[0].activityVisible = true;
    
    // Capture start time
    let now = new Date();
    data[0].startTime = now.toTimeString().split(' ')[0];
    
    this.timerRunning = true;
    
    // Start live duration update every second
    this.startLiveDurationUpdate1();
    this.intervalId = setInterval(() => {
      var currentTime = new Date();
      var duration = this.calculateDuration1(data[0].startTime, currentTime);
      data[0].duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
      oModel.refresh(true); // Refresh at intervals to update only the duration
    }, 1000);
    
    var path = AppConstants.URL.miscellaneous;
    let requestData = {
        "soldToName": data[0].soldToName,
        "soldToParty": data[0].soldToParty,
        "duration": data[0].duration,
        "activity": data[0].activity,
        "startTime": data[0].startTime,
        "endTime": null,
        "remarks": null,
        "description": data[0].description,
        "createdBy":data[0].this.getStorage("userInfo").email,
        "status": 1,
        "timeStatus": 1
    };
    await this.restMethodPost(path, [requestData]);
    oModel.refresh(true);
    this.refreshTabsAfterTimer();
    this._onRouteMatched();
  }
},
// Live duration update function
startLiveDurationUpdate1: function () {
  this.clearLiveDurationUpdate1();

  // Update the duration every second
  this.intervalId = setInterval(() => {
    let oModel = this.getView().getModel("miscelleanousMdl");
    let data = oModel.getData();
      var currentTime = new Date();
      var duration = this.calculateDuration1(data[0].startTime, currentTime);
      data[0].duration = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
      oModel.refresh(true); // Refresh the model to reflect the updated duration
  }, 1000);
},

// Function to clear the live duration update
clearLiveDurationUpdate1: function () {
  if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
  }
},
 
    createColumnConfig: function () {
      return [
      
      {
        label: 'Customer',
        property: 'SoldToName',
        width: "25",
        visible: true,
      },
      {
        label: 'Customer Id',
        property: 'ObjectId',
        width: "25",
        visible: true,
      },
      {
        label: 'Task',
        property: 'Description',
        width: "25",
        visible: true,
      },
      {
        label: 'Description',
        property: 'descriptionText',
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
        label: "Priority",
        property: "PriorityTxt",
        width: "25",
        visible: true,
      },
      {
        label: "Created date",
        property: "CreatedAtDateFormatted",
        width: "25",
        visible: true,
      },
      {
        label: "Status",
        property: "UserStatusDescription",
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
        label: 'Assigned To',
        property: 'personRespName',
        width: "25",
        visible: true,
      },
      {
        label: 'Start Stop',
        property: 'icon',
        width: "25",
        visible: true,
      }

      ];
    },
   
    taskTypeFormatter: function (sTaskCode) {
      switch (sTaskCode) {
          case "CALMTMPL":
              return "Roadmap Task";
          case "CALMTASK":
              return "Project Task";
          case "CALMUS":
              return "User Story";
          case "CALMST":
              return "Sub-task";
          case "CALMREQU":
              return "Requirement";
          case "CALMDEF":
              return "Defect";
          default:
              return "Unknown Task Type";
      }
  },
  statusTextFormatter: function (sStatusCode) {
    switch (sStatusCode) {
        case "CIPTKOPEN":
        case "CIPUSOPEN":
        case "CIPREQUOPEN":
        case "CIPDFCTOPEN":
            return "Open";

        case "CIPTKINP":
        case "CIPUSINP":
        case "CIPREQUINP":
        case "CIPDFCTINP":
            return "In Progress";

        case "CIPTKCLOSE":
        case "CIPUSCLOSE":
        case "CIPREQCLOSE":
        case "CIPDFCTDONE":
            return "Done";

        case "CIPTKBLK":
        case "CIPUSBLK":
        case "CIPREQUBLK":
        case "CIPDFCTBLK":
            return "Blocked";

        case "CIPTKNO":
        case "CIPUSNO":
        case "CIPREQUNO":
            return "Not Relevant";

        default:
            return "Unknown Status";
    }
  }
  });
});