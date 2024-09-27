sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("com.timetracker.timesheet.TimeSheet", {
            onInit: function() {
                // JSON data directly within the controller
                var aAppointments = [
                    {
                        "date": "2024-04-17",
                        "startTime": "09:00",
                        "endTime": "11:00",
                        "customer": "John Doe",
                        "task": "Meeting",
                        "duration": "2 hours",
                        "editIcon": "edit",
                        "deleteIcon": "delete"
                    },
                    {
                        "date": "2024-04-18",
                        "startTime": "14:00",
                        "endTime": "16:00",
                        "customer": "Jane Smith",
                        "task": "Presentation",
                        "duration": "2 hours",
                        "editIcon": "edit",
                        "deleteIcon": "delete"
                    },
                    {
                        "date": "2024-04-19",
                        "startTime": "10:30",
                        "endTime": "12:30",
                        "customer": "Alice Johnson",
                        "task": "Training",
                        "duration": "2 hours",
                        "editIcon": "edit",
                        "deleteIcon": "delete"
                    }
                ];
    
                // Create JSON model and set the data to it
                var oModel = new JSONModel(aAppointments);
                this.getView().setModel(oModel, "appointmentsModel");
            }

        });
    });
