sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "com/timetracker/controller/BaseController",
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("com.timetracker.controller.App", {
        onInit: function() {
          var that = this;
          // let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path;
           let path = "http://localhost:7070/";
          var sUrl = path + "userInfo";

          jQuery.ajax({
            url: sUrl,
            method: "GET",
            success: function (oResponse) {
              // that.login(oResponse);
                        jQuery.sap.require("jquery.sap.storage");
          var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
          oStorage.put("userInfo", oResponse);
              // that.setStorage("userInfo",oResponse)
               console.log(oResponse)
            },
            error: function () {
              console.log("fail");
            }
          });

        }
      });
    }
  );
  