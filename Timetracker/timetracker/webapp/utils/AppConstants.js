sap.ui.define([], function () {
	"use strict";

	return {
		URL: {
			app_endPoint: 'http://localhost:7070/',

			//app
			application_filter:"clock-time/support/filter",

			//time=sheet
			time_sheet:"time-sheet",
			time_sheet_filter:"time-sheet/filter",
			time_sheet_by_id:"time-sheet/{id}",

			//miscellaneous
			miscellaneous_filter:"miscellaneous/filter",
			miscellaneous : "miscellaneous",

			//activity
			activity:"activity",

			//
			customer:"customer",

			// active Support
			active_support : "support/activeRecordCounts",

			//alm
			alm_implementation :"api/implementations",
			alm_projects : "api/implementations/projects",
			

			// alm Timesheet
              alm_timesheet : "alm/time-sheet",
			  alm_filter : "alm/time-sheet/filter"
		},
		Paging: {
			page_size: 100
		},
		
	};
});