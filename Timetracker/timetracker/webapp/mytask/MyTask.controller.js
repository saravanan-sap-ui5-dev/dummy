sap.ui.define([
  "com/timetracker/controller/BaseController",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,JSONModel) {
        "use strict";

        return BaseController.extend("com.timetracker.mytask.MyTask", {
            onInit: function () {
             
                    // JSON data directly within the controller
                    var aAppointments = [
                        {
                          "customer": "Customer A",
                          "task": "Task 1",
                          "created_date": "2024-04-28",
                          "priority": "High",
                          "est_end_date": "2024-05-05",
                          "status": "In Progress",
                          "mpt_status": "60",
                          "category": "Development"
                        },
                        {
                          "customer": "Customer B",
                          "task": "Task 2",
                          "created_date": "2024-04-25",
                          "priority": "Medium",
                          "est_end_date": "2024-05-10",
                          "status": "Pending",
                          "mpt_status": "20",
                          "category": "Design"
                        },
                        {
                          "customer": "Customer C",
                          "task": "Task 3",
                          "created_date": "2024-04-20",
                          "priority": "Low",
                          "est_end_date": "2024-05-15",
                          "status": "Completed",
                          "mpt_status": "45",
                          "category": "Testing"
                        }
                      ];
                      
        
                    // Create JSON model and set the data to it
                    var oModel = new JSONModel(aAppointments);
                    this.getView().setModel(oModel, "appointmentsModel");
                },
                onpressnav: function () {
                  this.getRouter().navTo("dashboard");
              },
              formatMPTStatus: function(value) {
                // return (parseFloat(value) * 100).toFixed(2) + "%";
                 return (parseFloat(value));
             }
            
        
        });
    });