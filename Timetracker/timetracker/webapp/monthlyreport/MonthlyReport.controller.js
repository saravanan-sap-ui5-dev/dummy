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
    "sap/m/MessageBox",
    'sap/m/DynamicDateRange'
],
function (
    BaseController, 
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
    MessageBox,
    DynamicDateRange
) {
    "use strict";

    return BaseController.extend("com.timetracker.monthlyreport.MonthlyReport", {

        onInit: function() {
            this.oOwnerComponent = this.getOwnerComponent();
            this.oModel = this.oOwnerComponent.getModel();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter.getRoute("monthly-report").attachMatched(this._onRouteMatched, this);
        },

        registerPageIds: function () {
            let oView = this.getView();
            [
                this._tableId,
                this.almTableId,
                this.oFilterBar,
                this.almFilter,
                this.pageId,
                this.createdOn,
                this.almDate,
            ] = [
                oView.byId("timesheetTable"),
                oView.byId("almtimesheetTable"),
                oView.byId("filterbar"),
                oView.byId("filterbar1"),
                oView.byId("page_MonthlyData"),
                oView.byId("drs_createdOn"),
                oView.byId("drs_createdOnalm")
            ];
        },

        _onRouteMatched: function () {
            this.setTitle("Monthly Report");
            this.registerPageIds();
            this.setFilterModel();
            this.initFunctionalities();
            this.createdOn.setValue();
            this.almDate.setValue();
        },

        initFunctionalities: function () {
            let oHistory = History.getInstance();
            let sDirection = oHistory.getDirection();
            let fModel = this.getView().getModel("filterMdl");
            let oSettingMdl = this.getOwnerComponent().getModel("settings");
            fModel.refresh(true);
            this.getView().setModel(new JSONModel(), "timeSheetMdl");
            this.getView().setModel(new JSONModel(), "almMdl");
        },

        clearSearchFilter: function (oEvent) {
            this.setFilterModel();
            this.createdOn.setValue();
        },
        clearSearchFilteralm: function (oEvent) {
            this.setFilterModel();
            this.almDate.setValue();
        },

        setFilterModel: function () {
            var filterObj = {
                id: null,
                soldToName: "",
                soldToParty: null,
                description: "",
                postingDate: null,
                priorityText: "",
                userStatusDescription: "",
                mPTStatus: "",
                createdBy: "",
                updatedBy: "",
                createdOnStart: "",
                createdOnEnd: "",
                updatedOnStart: "",
                lastChangedEnd:"",
                lastChangedStart:"",
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
       
        searchTimeSheet: async function () {
            let that = this;
            try {
                // Get the date value from the filter model
                let filterParams = this.getView().getModel("filterMdl").getData();
                let date = filterParams.createdOnStart;
        
                // Validate that the date is provided
                if (!date) {
                    MessageBox.error("Please select a date before searching.");
                    return; // Stop further execution if the date is missing
                }
        
                var path1 = AppConstants.URL.time_sheet_filter;
                var path2 = AppConstants.URL.miscellaneous_filter;
                this._tableId.setBusy(true);
        
                // Fetch data from both URLs in parallel
                let [data1, data2] = await Promise.all([
                    this.restMethodGetWitData(path1, filterParams),
                    this.restMethodGetWitData(path2, filterParams)
                ]);
        
                // Combine the data from both sources
                let combinedData = [...data1, ...data2];
        
                // Helper function to convert duration "HH:MM:SS" to seconds
                function durationToSeconds(duration) {
                    if (!duration) return 0; // Handle undefined or null duration
                    const parts = duration.split(':').map(Number);
                    if (parts.length !== 3 || parts.some(isNaN)) return 0; // Ensure valid "HH:MM:SS"
                    return parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
        
                // Helper function to convert seconds back to "HH:MM:SS"
                function secondsToDuration(seconds) {
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const secs = seconds % 60;
                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                }
        
                // Function to calculate week-wise total hours grouped by soldToParty and projectName
                function calculateWeekWiseTotal(data) {
                    const result = {};
        
                    data.forEach(activity => {
                        const { soldToParty, soldToName, lastChangedDate, duration } = activity;
        
                        // Create a unique key for the soldToParty and projectName combination
                        const key = `${soldToParty}-${soldToName}`;
        
                        if (!result[key]) {
                            result[key] = {
                                soldToParty,
                                soldToName,
                                week1: 0,
                                week2: 0,
                                week3: 0,
                                week4: 0,
                                week5: 0
                            };
                        }
        
                        const date = new Date(lastChangedDate);
                        const durationInSeconds = durationToSeconds(duration); // Convert duration to seconds
        
                        const dayOfMonth = date.getDate();
                        let week;
        
                        // Determine which week of the month the activity falls in
                        if (dayOfMonth <= 7) {
                            week = 'week1';
                        } else if (dayOfMonth <= 14) {
                            week = 'week2';
                        } else if (dayOfMonth <= 21) {
                            week = 'week3';
                        } else if (dayOfMonth <= 28) {
                            week = 'week4';
                        } else {
                            week = 'week5';
                        }
        
                        // Add the duration to the appropriate week for the given project and customer
                        result[key][week] += durationInSeconds;
                    });
        
                    // Convert the total seconds back to "HH:MM:SS" format
                    for (const key in result) {
                        for (const week in result[key]) {
                            if (week !== "soldToParty" && week !== "soldToName") {
                                result[key][week] = secondsToDuration(result[key][week]);
                            }
                        }
                    }
        
                    return result;
                }
        
                // Calculate week-wise totals grouped by soldToParty and projectName
                const weekWiseTotals = calculateWeekWiseTotal(combinedData);
        
                // Create array of results
                const resultArray = Object.keys(weekWiseTotals).map(key => {
                    const durations = weekWiseTotals[key];
        
                    // Calculate total duration for the customer and project in seconds
                    const totalSeconds = Object.values(durations).reduce((sum, duration) => {
                        if (typeof duration === 'string') {
                            return sum + durationToSeconds(duration); // Convert duration to seconds
                        }
                        return sum;
                    }, 0);
        
                    return {
                        soldToParty: durations.soldToParty,
                        soldToName: durations.soldToName,
                        week1: durations.week1,
                        week2: durations.week2,
                        week3: durations.week3,
                        week4: durations.week4,
                        week5: durations.week5,
                        totalDuration: secondsToDuration(totalSeconds) // Convert total seconds to HH:MM:SS format
                    };
                });
        
                // Set the combined data into the model for the table
                this.setModel(new JSONModel(resultArray), "combinedTimeSheetMdl");
                this._tableId.setBusy(false);
            } catch (ex) {
                this._tableId.setBusy(false);
                MessageBox.error(ex.message);
            }
        },
        
        
        
      
        
        onSearch: function (oEvent) {
            this.searchTimeSheet();
        },
        onSearchalm: function (oEvent) {
            this.searchAlmTimeSheet();
        },
        searchAlmTimeSheet: async function () {
            let that = this;
            try {
                // Get the date value from the filter model
                let filterParams = this.getView().getModel("filterMdl").getData();
                let date = filterParams.createdOnStart; // Assuming 'createdOnStart' is the field used for the date
        
                // Validate that the date is provided
                if (!date) {
                    MessageBox.error("Please select a date before searching.");
                    return; // Stop further execution if the date is missing
                }
        
                var path1 = AppConstants.URL.alm_filter;
                this._tableId.setBusy(true);
        
                // Fetch data from the first URL (path1)
                let data1 = await this.restMethodGetWitData(path1, filterParams);
                let timeSheetModel = new JSONModel(data1);
                this.setModel(timeSheetModel, "almMdl");
        
                // Helper function to convert duration "HH:MM:SS" to seconds
                function durationToSeconds(duration) {
                    const parts = duration.split(':').map(Number);
                    return parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
        
                // Helper function to convert seconds back to "HH:MM:SS"
                function secondsToDuration(seconds) {
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const secs = seconds % 60;
                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                }
        
                // Function to calculate week-wise total hours
                function calculateWeekWiseTotal(data) {
                    const result = {};
        
                    data.forEach(activity => {
                        const { projectName, lastChangedDate, duration } = activity;
                        if (!result[projectName]) {
                            result[projectName] = { week1: 0, week2: 0, week3: 0, week4: 0, week5: 0 };
                        }
        
                        const date = new Date(lastChangedDate);
                        const durationInSeconds = durationToSeconds(duration);
        
                        const dayOfMonth = date.getDate();
                        let week;
        
                        if (dayOfMonth <= 7) {
                            week = 'week1';
                        } else if (dayOfMonth <= 14) {
                            week = 'week2';
                        } else if (dayOfMonth <= 21) {
                            week = 'week3';
                        } else if (dayOfMonth <= 28) {
                            week = 'week4';
                        } else {
                            week = 'week5';
                        }
        
                        result[projectName][week] += durationInSeconds;
                    });
        
                    // Convert the total seconds back to "HH:MM:SS" format
                    for (const customerId in result) {
                        for (const week in result[customerId]) {
                            result[customerId][week] = secondsToDuration(result[customerId][week]);
                        }
                    }
        
                    return result;
                }
        
                const weekWiseTotals = calculateWeekWiseTotal(data1);
        
                // Create array of results
                const resultArray = Object.keys(weekWiseTotals).map(key => {
                    const durations = weekWiseTotals[key];
                    const projectName = data1.find(item => item.projectName === key)?.projectName || '';
        
                    // Calculate total duration in seconds
                    const totalSeconds = Object.values(durations).reduce((sum, duration) => sum + durationToSeconds(duration), 0);
        
                    return {
                        projectName: key,
                        projectName,
                        week1: durations.week1,
                        week2: durations.week2,
                        week3: durations.week3,
                        week4: durations.week4,
                        week5: durations.week5,
                        totalDuration: secondsToDuration(totalSeconds) // Convert total seconds to HH:MM:SS format
                    };
                });
        
                // Set the final results to the model
                this.setModel(new JSONModel(resultArray), "almMdl");
                this._tableId.setBusy(false);
            } catch (ex) {
                this._tableId.setBusy(false);
                MessageBox.error(ex.message);
            }
        },

        handleChangeDateRange: function (oEvent) {
            let oSource = oEvent.getSource(),
                oFields = oSource.getCustomData()[0].getValue().split(","),
                fModel = this.getView().getModel("filterMdl"),
                dateConv = function (date) {
                    let dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "yyyy-MM-dd", // Format for storing in model
                    });
                    return dateFormat.format(date);
                };
        
            // Get the start and end dates using DynamicDateRange.toDates
            let [from, to] = sap.m.DynamicDateRange.toDates(oSource.getValue());
        
            if (from && to && from.toLocaleDateString() === to.toLocaleDateString()) {
                // If the user selects only a month, set from as the first day and to as the last day of that month
                from = new Date(from.getFullYear(), from.getMonth(), 1); // First day of the selected month
                to = new Date(from.getFullYear(), from.getMonth() + 1, 0); // Last day of the selected month
            }
        
            // Convert dates to strings for display and for storing in the model
            let fromStr = from ? dateConv(from) : "",
                toStr = to ? dateConv(to) : "";
        
            // Set the formatted dates in the model
            fModel.setProperty("/" + oFields[0], fromStr); // Set createdOnStart
            fModel.setProperty("/" + oFields[1], toStr);   // Set createdOnEnd
            fModel.refresh(); // Refresh the model to apply changes
        
           
        },
        
        
        
        
        
        
       
        
        handleExport: function (oEvent) {
            // Export handler
            let dataSource = this.getView()
              .getModel("combinedTimeSheetMdl")
              .getData();
            this.onExport(
              this.createColumnConfig(),
              dataSource,
              "Rajeev Monthly Report"
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
              " Rajeev Monthly Report"
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
              label: 'Total Hours Worked ',
              property: 'durations',
              width: "25",
              visible: true,
            },
            {
              label: 'Week 1',
              property: 'week1',
              width: "25",
              visible: true,
            },
            {
              label: "Week 2",
              property: "week2",
              width: "25",
              visible: true,
            },
            {
              label: "Week 3",
              property: "week3",
              width: "25",
              visible: true,
            },
            {
              label: 'Week 4',
              property: 'week4',
              width: "25",
              visible: true,
            },
            {
              label: 'Week 5',
              property: 'week5',
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
              label: 'Total Hours Worked ',
              property: 'totalDuration',
              width: "25",
              visible: true,
            },
            {
              label: 'Week 1',
              property: 'week1',
              width: "25",
              visible: true,
            },
            {
              label: "Week 2",
              property: "week2",
              width: "25",
              visible: true,
            },
            {
              label: "Week 3",
              property: "week3",
              width: "25",
              visible: true,
            },
            {
              label: 'Week 4',
              property: 'week4',
              width: "25",
              visible: true,
            },
            {
              label: 'Week 5',
              property: 'week5',
              width: "25",
              visible: true,
            },
            {
                label: 'Assigned To  ',
                property: 'createdBy',
                width: "25",
                visible: true,
              }
      
            ];
          },

        onpressnav: function () {
            this.getRouter().navTo("dashboard");
        }
    });
});
