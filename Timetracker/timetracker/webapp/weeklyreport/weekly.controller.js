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
],
  function (BaseController, JSONModel, DateFormat,
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

    return BaseController.extend("com.timetracker.weeklyreport.weekly", {


      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();

        this.oModel = this.oOwnerComponent.getModel();

        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.getRoute("weekly-report").attachMatched(this._onRouteMatched, this);
        // var oModel = new sap.ui.model.json.JSONModel({ filterBarVisible: true });
        // this.getView().setModel(oModel, "appModel");

      },
      registerPageIds: function () {
        let oView = this.getView();
        [
          this._tableId,
           this.almTableId,
          this.oFilterBar,
          this.almFilterBar,
          this.pageId,
          this.createdOn,
          this.almCreatedOn


        ] = [
            oView.byId("timesheetTable"),
            oView.byId("almtimesheetTable"),
            oView.byId("filterbar"),
            oView.byId("filterbar1"),
            oView.byId("page_MngSyncErpData"),
            oView.byId("drs_createdOn"),
            oView.byId("drs_createdOnalm")

          ];

      },
      _onRouteMatched: function () {
        this.setTitle("Weekly Report ")
        this.registerPageIds();
        this.setFilterModel();
        // this.fetchActivity();
        this.initFunctionalities();
        this.createdOn.setValue();
        this.almCreatedOn.setValue();
       

      },
      onAfterRendering: function() {
        let table = this.byId("timesheetTable");
        let items = table.getItems();
        if (items.length > 0) {
            let lastItem = items[items.length - 1];
            lastItem.addStyleClass("lastRow");
        }
    },
    // In your controller
  
    
      initFunctionalities: function () {
        let oHistory = History.getInstance();
        let sDirection = oHistory.getDirection();
        let fModel = this.getView().getModel("filterMdl");
        let oSettingMdl = this.getOwnerComponent().getModel("settings");
        let fData = fModel.getData();
        fModel.refresh(true);
        this.getView().setModel(new JSONModel(), "timeSheetMdl");
        this.getView().setModel(new JSONModel(),"almMdl");
      },
      clearSearchFilter: function (oEvent) {
        //Clear filter values
        this.setFilterModel();

        this.createdOn.setValue();
        // this.updatedOn.setValue();
        // this.cboStatus.setSelectedKeys();
      },
      clearSearchFilteralm: function (oEvent) {
        //Clear filter values
        this.setFilterModel();
        this.almCreatedOn.setValue();
        
      },
      setFilterModel: function () {
        var filterObj = {
          id: null,
          soldToName: "",
          soldToParty: null,
          description: "",
          postingDate: null, //active 1 - in active 2
          priorityText: "",
          userStatusDescription: "",
          mPTStatus: "",
          createdBy: "",
          updatedBy: "",
          createdOnStart: "",
          createdOnEnd: "",
          updatedOnStart: "",
          lastChangedEnd: "",
          lastChangedStart: "",
          updatedOnEnd: "",
          startTime: "",
          endTime: "",
          statuses: "",
          duration: null,
          categoryTxt: "",
          status: null,
          pageNumber: 1,
          timeStatus: 2,
          pageSize: AppConstants.Paging.page_size,
          sortingKey: "id",
          orderBy: "desc",
          stringType: false,

        };
        this.getView().setModel(new JSONModel(filterObj), "filterMdl");
      },

      searchTimeSheet: async function () {
        let that = this;
        try {
            const path1 = AppConstants.URL.time_sheet_filter;
            const path2 = AppConstants.URL.miscellaneous_filter;
            this._tableId.setBusy(true);
    
            const filterParams = this.getView().getModel("filterMdl").getData();
            let startDate = new Date(filterParams.createdOnStart);
            let endDate = new Date(filterParams.createdOnEnd);
    
            function isStartOfWeek(date) {
                return date.getDay() === 0; // Sunday (Day 0 in JavaScript)
            }
    
            function isEndOfWeek(date) {
                return date.getDay() === 6; // Saturday (Day 6 in JavaScript)
            }
    
            if (!isStartOfWeek(startDate) || !isEndOfWeek(endDate)) {
                this._tableId.setBusy(false);
                throw new Error("The start date must be the first day (Sunday) and the end date must be the last day (Saturday) of the week.");
            }
    
            // Fetch data from both paths
            let data1 = await this.restMethodGetWitData(path1, filterParams);
            let data2 = await this.restMethodGetWitData(path2, filterParams);
    
            // Combine data
            const combinedData = [...data1, ...data2];
    
            // Group data by `soldToName`
            const data = combinedData.reduce((acc, currentItem) => {
                const { soldToName } = currentItem;
    
                if (!acc[soldToName]) {
                    acc[soldToName] = [];
                }
    
                acc[soldToName].push(currentItem);
    
                return acc;
            }, {});
    
            // Helper functions
            function durationToSeconds(duration) {
                const parts = duration.split(':').map(Number);
                return parts[0] * 3600 + parts[1] * 60 + parts[2];
            }
    
            function secondsToDuration(seconds) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
    
            function calculateDayWiseTotal(data) {
                const result = {};
                const totalDayWise = { day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0 };
    
                for (const customerId in data) {
                    const activities = data[customerId];
                    const dailyTotals = { day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0 };
    
                    activities.forEach(activity => {
                        const date = new Date(activity.lastChangedDate);
                        const durationInSeconds = durationToSeconds(activity.duration);
    
                        // Determine the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                        let dayOfWeek = date.getDay(); // Sunday = 0, Saturday = 6 in JavaScript
    
                        // Add duration to the corresponding day for this customer
                        dailyTotals[`day${dayOfWeek + 1}`] += durationInSeconds; // Sunday becomes day1, Monday becomes day2, and so on.
    
                        // Add duration to the corresponding day for the total across all customers
                        totalDayWise[`day${dayOfWeek + 1}`] += durationInSeconds;
                    });
    
                    // Convert the total seconds back to "HH:MM:SS" format for each customer
                    for (const day in dailyTotals) {
                        dailyTotals[day] = secondsToDuration(dailyTotals[day]);
                    }
    
                    result[customerId] = dailyTotals;
                }
    
                // Convert the total day-wise seconds back to "HH:MM:SS" format for all customers
                for (const day in totalDayWise) {
                    totalDayWise[day] = secondsToDuration(totalDayWise[day]);
                }
    
                return { result, totalDayWise };
            }
    
            const { result: weekWiseTotals, totalDayWise } = calculateDayWiseTotal(data);
    
            let resultArray = Object.keys(weekWiseTotals).map(key => {
                const durations = weekWiseTotals[key];
                const soldToName = key;
    
                // Calculate total duration in seconds for this customer
                const totalSeconds = Object.values(durations).reduce((sum, duration) => sum + durationToSeconds(duration), 0);
    
                return {
                    soldToParty: key,
                    soldToName,
                    day1: durations.day1,
                    day2: durations.day2,
                    day3: durations.day3,
                    day4: durations.day4,
                    day5: durations.day5,
                    day6: durations.day6,
                    day7: durations.day7,
                    totalDuration: secondsToDuration(totalSeconds),
                };
            });
    
            // Adding total day-wise duration for all customers
            resultArray.push({
                soldToParty: "Total",
                soldToName: "Total Day Wise",
                day1: totalDayWise.day1,
                day2: totalDayWise.day2,
                day3: totalDayWise.day3,
                day4: totalDayWise.day4,
                day5: totalDayWise.day5,
                day6: totalDayWise.day6,
                day7: totalDayWise.day7,
                totalDuration: secondsToDuration(Object.values(totalDayWise).reduce((sum, duration) => sum + durationToSeconds(duration), 0)),
                colorDay1: this.formatStateByDuration(totalDayWise.day1),
                colorDay2: this.formatStateByDuration(totalDayWise.day2),
                colorDay3: this.formatStateByDuration(totalDayWise.day3),
                colorDay4: this.formatStateByDuration(totalDayWise.day4),
                colorDay5: this.formatStateByDuration(totalDayWise.day5),
                colorDay6: this.formatStateByDuration(totalDayWise.day6),
                colorDay7: this.formatStateByDuration(totalDayWise.day7),
            });
    
            this.setModel(new JSONModel(resultArray), "timeSheetMdl");
            this._tableId.setBusy(false);
        } catch (ex) {
            this._tableId.setBusy(false);
            MessageBox.error(ex.message);
        }
    },
    
    
    onSearchalm: function (oEvent) {

      this.searchAlmTimeSheet();
    },
    searchAlmTimeSheet: async function () {
      let that = this;
      try {
          const path1 = AppConstants.URL.alm_filter;
          this._tableId.setBusy(true);
  
          const filterParams = this.getView().getModel("filterMdl").getData();
          let startDate = new Date(filterParams.createdOnStart);
          let endDate = new Date(filterParams.createdOnEnd);
  
          function isStartOfWeek(date) {
              return date.getDay() === 0; // Sunday (Day 0 in JavaScript)
          }
  
          function isEndOfWeek(date) {
              return date.getDay() === 6; // Saturday (Day 6 in JavaScript)
          }
  
          if (!isStartOfWeek(startDate) || !isEndOfWeek(endDate)) {
              this._tableId.setBusy(false);
              throw new Error("The start date must be the first day (Sunday) and the end date must be the last day (Saturday) of the week.");
          }
  
          // Fetch data only from path1
          let data1 = await this.restMethodGetWitData(path1, filterParams);
  
          // Combine data by soldToParty
          const data = data1.reduce((acc, currentItem) => {
              const { projectName } = currentItem;
  
              if (!acc[projectName]) {
                  acc[projectName] = [];
              }
  
              acc[projectName].push(currentItem);
  
              return acc;
          }, {});
  
          // Helper functions
          function durationToSeconds(duration) {
              const parts = duration.split(':').map(Number);
              return parts[0] * 3600 + parts[1] * 60 + parts[2];
          }
  
          function secondsToDuration(seconds) {
              const hours = Math.floor(seconds / 3600);
              const minutes = Math.floor((seconds % 3600) / 60);
              const secs = seconds % 60;
              return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          }
  
          
  
          function calculateDayWiseTotal(data) {
              const result = {};
              const totalDayWise = { day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0 };
  
              for (const customerId in data) {
                  const activities = data[customerId];
                  const dailyTotals = { day1: 0, day2: 0, day3: 0, day4: 0, day5: 0, day6: 0, day7: 0 };
  
                  activities.forEach(activity => {
                      const date = new Date(activity.lastChangedDate);
                      const durationInSeconds = durationToSeconds(activity.duration);
  
                      let dayOfWeek = date.getDay();
                      // dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Convert Sunday (0) to 7 for easier mapping to `dayX`
  
                      dailyTotals[`day${dayOfWeek + 1}`] += durationInSeconds; // Sunday becomes day1, Monday becomes day2, and so on.
    
                      // Add duration to the corresponding day for the total across all customers
                      totalDayWise[`day${dayOfWeek + 1}`] += durationInSeconds;
                  });
  
                  for (const day in dailyTotals) {
                      dailyTotals[day] = secondsToDuration(dailyTotals[day]);
                  }
  
                  result[customerId] = dailyTotals;
              }
  
              for (const day in totalDayWise) {
                  totalDayWise[day] = secondsToDuration(totalDayWise[day]);
              }
  
              return { result, totalDayWise };
          }
  
          const { result: weekWiseTotals, totalDayWise } = calculateDayWiseTotal(data);
  
          let resultArray = Object.keys(weekWiseTotals).map(key => {
              const durations = weekWiseTotals[key];
              const projectName = data[key][0].projectName;
  
              const totalSeconds = Object.values(durations).reduce((sum, duration) => sum + durationToSeconds(duration), 0);
  
              return {
                projectName: key,
                projectName,
                  day1: durations.day1,
                  day2: durations.day2,
                  day3: durations.day3,
                  day4: durations.day4,
                  day5: durations.day5,
                  day6: durations.day6,
                  day7: durations.day7,
                  totalDuration: secondsToDuration(totalSeconds),
              };
          });
  
          resultArray.push({
            projectName: "Total",
            projectName: "Total Day Wise",
              day1: totalDayWise.day1,
              day2: totalDayWise.day2,
              day3: totalDayWise.day3,
              day4: totalDayWise.day4,
              day5: totalDayWise.day5,
              day6: totalDayWise.day6,
              day7: totalDayWise.day7,
              totalDuration: secondsToDuration(Object.values(totalDayWise).reduce((sum, duration) => sum + durationToSeconds(duration), 0)),
              colorDay1: this.formatStateByDuration(totalDayWise.day1),
              colorDay2: this.formatStateByDuration(totalDayWise.day2),
              colorDay3: this.formatStateByDuration(totalDayWise.day3),
              colorDay4: this.formatStateByDuration(totalDayWise.day4),
              colorDay5: this.formatStateByDuration(totalDayWise.day5),
              colorDay6: this.formatStateByDuration(totalDayWise.day6),
              colorDay7: this.formatStateByDuration(totalDayWise.day7),
          });
  
          this.setModel(new JSONModel(resultArray), "almMdl");
          this._tableId.setBusy(false);
      } catch (ex) {
          this._tableId.setBusy(false);
          MessageBox.error(ex.message);
      }
  },
  

      onSearch: function (oEvent) {

        this.searchTimeSheet();
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
      handleExport: function (oEvent) {
        // Export handler
        let dataSource = this.getView()
          .getModel("timeSheetMdl")
          .getData();
        this.onExport(
          this.createColumnConfig(),
          dataSource,
          "Rajeev Weekly Report"
        );
      },
      almhandleExport: function (oEvent) {
        // Export handler
        let dataSource = this.getView()
          .getModel("almMdl")
          .getData();
        this.onExport(
          this.createColumnConfigalm(),
          dataSource,
          "Rajeev Weekly Report"
        );
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
          label: ' TotalHours Worked ',
          property: 'totalDuration',
          width: "25",
          visible: true,
        },
        {
          label: 'Monday',
          property: 'day1',
          width: "25",
          visible: true,
        },
        {
          label: 'Tuesday ',
          property: 'day2',
          width: "25",
          visible: true,
        },
        {
          label: "Wednesday",
          property: "day3",
          width: "25",
          visible: true,
        },
        {
          label: "Thrusday",
          property: "day4",
          width: "25",
          visible: true,
        },
        {
          label: 'Friday',
          property: 'day5',
          width: "25",
          visible: true,
        },
        {
          label: 'Assigned To',
          property: 'createdBy',
          width: "25",
          visible: true,
        }
  
        ];
      },
      createColumnConfigalm: function () {
        return [
          {
          label: 'Projects',
          property: 'projectName',
          width: "25",
          visible: true,
        },
        {
          label: ' TotalHours Worked ',
          property: 'totalDuration',
          width: "25",
          visible: true,
        },
        {
          label: 'Monday',
          property: 'day1',
          width: "25",
          visible: true,
        },
        {
          label: 'Tuesday ',
          property: 'day2',
          width: "25",
          visible: true,
        },
        {
          label: "Wednesday",
          property: "day3",
          width: "25",
          visible: true,
        },
        {
          label: "Thrusday",
          property: "day4",
          width: "25",
          visible: true,
        },
        {
          label: 'Friday',
          property: 'day5',
          width: "25",
          visible: true,
        },
        {
          label: 'Assigned To',
          property: 'createdBy',
          width: "25",
          visible: true,
        }
  
        ];
      },
      onpressnav: function () {
        this.getRouter().navTo("dashboard");
      }

    }
    );
  });




