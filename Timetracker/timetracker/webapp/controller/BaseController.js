sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/model/json/JSONModel",
      'sap/ui/core/Element',
      "sap/m/Button",
      'sap/ui/core/Fragment',
      "sap/m/Dialog",
      "sap/m/library",
      "sap/m/MessageBox",
      "com/timetracker/utils/AppConstants",
      "sap/ui/export/Spreadsheet",
      
    ],
    function (Controller, History, JSONModel, Element, Button, Fragment, Dialog, mobileLibrary, MessageBox, AppConstants,Spreadsheet) {
      "use strict";
      // shortcut for sap.m.ButtonType
      var ButtonType = mobileLibrary.ButtonType;
  
      // shortcut for sap.m.DialogType
      var DialogType = mobileLibrary.DialogType;
      return Controller.extend(
        "com.timetracker.controller.BaseController", {
        onInit: function () {
          //console.log("test")
        },
        getRouter: function () {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
        showChatBot: function (obj) {
          var chat_id = document.getElementById('cai-webchat-div');
          if (chat_id != undefined) {
            if (obj == true)
              chat_id.style.display = 'block';
            else
              chat_id.style.display = 'none';
          }
        },
        renderRecastChatbot: function () {
  
          if (!document.getElementById("cai-webchat")) {
  
            var s = document.createElement("script");
  
            s.setAttribute("id", "cai-webchat");
  
            s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
  
            document.body.appendChild(s);
  
          }
  
          var c = document.getElementById("cai-webchat");
  
          c.setAttribute("channelId", "aa3c9270-740c-4b04-b731-6f3c0842643c");
  
          c.setAttribute("token", "d47e8fee91ba8ac4c51ef9d3ea9bbd2f");
  
        },
        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },
        getId: function (sName) {
          return this.getView().byId(sName);
        },
        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },
  
        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function (text) {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(text);
        },
        
      onExport: function (columns, dataSource, fileName) {
        //**Export table functionality enabled here**
        let aCols, oSettings, oSheet, oContext;

        aCols = columns;
        oContext = {
          sheetName: fileName,
        };

        oSettings = {
          workbook: {
            columns: aCols,
            context: oContext,
          },
          dataSource: dataSource,
          fileName: fileName,
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet
          .build()
          .then(function () {
            sap.m.MessageToast.show("Spreadsheet export has finished");
          })
          .finally(function () {
            oSheet.destroy();
          });
      },
       
        onNavBack: function () {
          var oHistory, sPreviousHash, navData;
          navData = this.getModel("settings").getData();
          oHistory = History.getInstance();
          sPreviousHash = oHistory.getPreviousHash();
  
          if (sPreviousHash !== undefined && !navData.route) {
            window.history.go(-1);
          } else if (navData.route) {
            this.getRouter().navTo(navData.route);
          } else {
            this.getRouter().navTo("dashboard", {}, true /*no history*/);
          }
        },
        encode: function (value) {
          return btoa(value);
  
        },
        decode: function (value) {
          return atob(value);
  
        },
        // setStorage: function (name, sContext) {
        //   jQuery.sap.require("jquery.sap.storage");
        //   var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
        //   oStorage.put(name, sContext);
        // },
        setStorage: function (name, sContext) {
          // Use session storage to store data
          var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
          oStorage.put(name, sContext);
      },
      
        getStorage: function (name) {
          jQuery.sap.require("jquery.sap.storage");
          var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
          return oStorage.get(name);
        },
        showLoading: function (status) {
          this.getView().setBusy(status);
        },
        getCurrentDateWithFormat: function () {
          var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
  
          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
          return [year, month, day].join('-');
        },
        getUtcDate: function (val) {
          if (val) {
  
            var dateString = val.substr(6);
  
            var d = new Date(parseInt(dateString)),
              month = "" + (d.getMonth() + 1),
              day = "" + d.getDate(),
              year = d.getFullYear();
  
            if (month.length < 2) {
              month = "0" + month;
            }
            if (day.length < 2) {
              day = "0" + day;
            }
            return [day, month, year].join("-");
          } else {
            return "";
          }
        },
        toDateFormat: function (date) {
          if (date) {
            return new Date(date).toLocaleDateString().replace(/\//g, "-");
          } else {
            //
          }
        },
       
       
        JsonToDate: function (date) {
          if (date) {
            return new Date(parseInt(date.toLocaleString().substr(6))).toLocaleDateString()
          } else {
            return ""
          }
        },
        tofixed: function (val) {
          if (val) {
            var getData = +val;
            return getData.toFixed(3);
  
          } else {
            return "";
          }
  
        },
        onPressHome: function () {
          this.getRouter().navTo("dashboard")
        },
        //Set Title
        setTitle: function (sTitle) {
          let oModel = this.getModel();
          oModel.getData().genericTitle = sTitle
          oModel.refresh();
        },
        /* Date Formate Change */
        getDateFormats(key, date) {
          let oModel = this.getModel();
          let userSettings = oModel.getData().userSettings
          let dateConv, fDate;
          if (date != undefined) {
            //date.slice(date.indexOf("(") + 1, date.indexOf(")"))
            dateConv = new Date(date);
  
            let options = {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            };
            let numeric = (function () {
              //Numeric
              options.month = "2-digit"
              options.day = "2-digit"
              fDate = dateConv.toLocaleDateString("en-IN", options);
              fDate = fDate.replaceAll("/", " ")
              userSettings.dateFormat = "dd-MM-yyyy"
            });
            if (key == 1) {
              numeric();
            } else if (key == 2) {
              //Short
              options.month = "short"
              options.day = "2-digit"
              fDate = dateConv.toLocaleDateString("en-IN", options);
              userSettings.dateFormat = "dd-MMM-yyyy"
            } else if (key == 3) {
              //Long
              options.month = "long"
              options.day = "2-digit"
              fDate = dateConv.toLocaleDateString("en-IN", options);
              userSettings.dateFormat = "dd-MMMM-yyyy"
            } else {
              numeric();
            }
            return fDate.replaceAll(" ", "-");
          } else {
            //dateConv = new Date();
          }
        },
  
        /* Time Format Change */
        getTimeFormats: function (key, time) {
          let oModel = this.getModel();
          let userSettings = oModel.getData().userSettings
  
          if (time != undefined) {
            let date = new Date().toLocaleDateString("en-IN", {
              month: "long",
              day: 'numeric',
              year: 'numeric'
            })
            let timeConv = new Date()
            timeConv.setTime(new Date(date + ", " + time).getTime())
  
            if (key == 1) {
              userSettings.timeFormat = "hh:mm:ss a"
              return timeConv.toLocaleTimeString('en-IN', {
                hour12: true
              })
            } else if (key == 2) {
              userSettings.timeFormat = "HH:mm:ss"
              return timeConv.toLocaleTimeString('en-IN', {
                hour12: false
              })
            }
          }
  
        },
        //on Apply theme
        onApplyTheme: function (key) {
          if (key) {
            sap.ui.getCore().applyTheme(key);
            sap.ui.getCore().attachThemeChanged(function (oEvent) {
              console.log(oEvent.getParameters())
            });
          }
        },
        //LogOut Dialog
        onPressLogOut: function () {
          if (!this.oApproveDialog) {
            this.oApproveDialog = new Dialog({
              type: DialogType.Message,
              title: "Confirm",
              content: new sap.m.Text({
                text: "Are you sure you want to log off?"
              }),
              beginButton: new Button({
                type: ButtonType.Emphasized,
                text: "OK",
                press: function () {
                  //MessageToast.show("Submit pressed!");
                  this.showChatBot(false);
                  this.getRouter().navTo('login');
                  this.oApproveDialog.close();
                }.bind(this)
              }),
              endButton: new Button({
                text: "Cancel",
                press: function () {
                  this.oApproveDialog.close();
                }.bind(this)
              })
            });
          }
  
          this.oApproveDialog.open();
        },
  
        //Error Popover Start
        handleMessagePopoverPress: function (oEvent) {
          let isDialog = false;
          let oSource;
          if (oEvent?.oSource) {
            oSource = oEvent;
          }
          if (!this.oPopover) {
            this.errorMessagePopover(oSource, isDialog);
          } else {
            this.oPopover.toggle(oSource.getSource());
          }
        },
        //Error Popover Start
        errorMessagePopover: async function (popoverBtn) {
          //Popover
          /* if (!this.errorMessage) {
            this.errorMessage = this.loadFragment({
              name: "com.propertyzone.view.fragment.ErrorMessage"
            }, this);
          } */
          if (popoverBtn) {
            let oPopover = await this.onOpenPopover(
              popoverBtn,
              "com.wfassist.init.ErrorMessage"
            );
          }
          /*  this.errorMessage.then(function (oPopover) { */
          //this.oPopover.toggle(popoverBtn);
          /*   }); */
        },
        errorMessagePopoverClose: function () {
          if (this.oPopover != undefined) {
            this.oPopover.close();
          }
        },
        onActiveTitlePress: function (oEvent) {
          var getSelItem = oEvent
            .getParameter("item")
            .getBindingContext("errors")
            .getObject();
          var control = getSelItem.control;
          var oPage = getSelItem.page;
          var oControl = Element.registry.get(control.getId());
  
          if (oControl) {
            /* oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
            setTimeout(function () {
              oControl.focus();
            }, 300); */
            jQuery.sap.delayedCall(500, this, function () {
              oControl.focus();
            });
            var type = oControl.getAccessibilityInfo().type;
            if (type == "Checkbox") {
              var text = oControl.getText();
              var oPopover = new sap.m.Popover({
                showHeader: false,
                placement: "Bottom",
                content: [
                  new sap.m.Text({
                    text: text,
                    width: "auto",
                  }).addStyleClass("sapUiTinyMargin"),
                ],
              });
              oPopover.openBy(oControl);
            }
          }
        },

          // Table Persenolization 

          handlePersoButtonPressed: function () {
            this._persoDialog;
            this._persoDialogTable;
            if (!this._persoDialog) {
              this._persoDialog = sap.ui.xmlfragment(
                "com.timetracker.view.fragment.TablePersoDialog",
                this
              );
              this._persoDialog.setModel(
                new JSONModel(
                  this.getOwnerComponent().getModel("settings").getData()
                ),
                "settings"
              );
              this._persoDialogTable = this._persoDialog
                .getCustomTabs()[0]
                .getContent()[0];
              this._persoDialogTable.selectAll();
            }
            this._persoDialog.open();
          },
    
          handleTablePersoDialogConfirm: function (oEvent) {
            //Handle Table Perso Confirm functionality
            let oTable = this._tableId,
              pTable = this._persoDialogTable;
            if (pTable) {
              this.selItems = pTable?.getSelectedItems();
              let oModel = this.getModel();
              oModel.getData().tablePersoSelected = this.selItems;
              if (this.selItems && this.selItems.length > 0 && !this.persoReset) {
                let colNames = this.selItems.map((e) =>
                  e.getCells()[0].getProperty("text")
                );
                this._tableId.getColumns().forEach((e) => {
                  let colName = colNames.some(
                    (e1) => e1 == e.getHeader().getText()
                  );
                  if (colName) {
                    e.setVisible(true);
                  } else {
                    e.setVisible(false);
                  }
                });
              } else if (this.persoReset) {
                this._tableId.getColumns().forEach((e) => e.setVisible(true));
                this.persoReset = false;
              } else {
                this._tableId.getColumns().forEach((e, i) => {
                  let headerText = e.getHeader().getText();
                  if (headerText == "ID") {
                    //i == 0 &&
                    let setSelected = pTable
                      .getItems()
                      .find((e) => e.getCells()[0].getText() == "ID");
                    pTable.setSelectedItem(pTable.getItems()[0]);
                    e.setVisible(true);
                  } else {
                    e.setVisible(false);
                  }
                });
              }
              oModel.refresh(true);
            }
          },
          getViewSettingsDialog: function (sDialogFragmentName) {
            var that = this;
            var pDialog =
              this.getOwnerComponent()._mViewSettingsDialogs[sDialogFragmentName];
            if (!pDialog) {
              pDialog = sap.ui.xmlfragment(sDialogFragmentName, that);
              pDialog.setModel(
                new JSONModel(
                  this.getOwnerComponent().getModel("settings").getData()
                ),
                "settings"
              );
              this.getOwnerComponent()._mViewSettingsDialogs[sDialogFragmentName] =
                pDialog;
            } else {
              pDialog.setModel(
                new JSONModel(
                  this.getOwnerComponent().getModel("settings").getData()
                ),
                "settings"
              );
            }
            return pDialog;
          },
          resetPersoDialog: function (oEvent) {
            if (this._persoDialogTable) {
              this.persoReset = true;
              //this._persoDialogTable.removeSelections();
              this._persoDialogTable.selectAll();
            }
          },
          setColulmnsIntoModel: function () {
            let oSettingsModel = this.oOwnerComponent.getModel("settings");
            oSettingsModel.getData().columns = this.createColumnConfig();
            oSettingsModel.refresh(true);
          },

        customErrorObject: function (
          errorMessages,
          pageId,
          oControl,
          description
        ) {
          return {
            type: "Error",
            active: false,
            control: oControl,
            title: errorMessages,
            subTitle: null,
            description: description,
            page: pageId,
          };
        },
        errorHandling: function (ex) {
          var that = this;
          if (!this.errorData) {
            this.errorData = [];
          }
          let eModel = this.getOwnerComponent().getModel("errors");
          let exist = this.errorData.find(
            (e) =>
              e.title ==
              (ex.responseJSON.errorDescription || ex.responseJSON.debugMessage)
          );
          if (ex && !exist) {
            if (ex.responseJSON?.debugMessage) {
              this.errorData.push(
                that.customErrorObject(
                  ex.responseJSON.debugMessage,
                  that.pageId,
                  null
                )
              );
            } else if (ex.responseJSON?.errorDescription) {
              this.errorData.push(
                that.customErrorObject(
                  ex.responseJSON.errorDescription,
                  that.pageId,
                  null
                )
              );
            } else if (ex.responseJSON) {
              this.errorData.push(
                that.customErrorObject(ex.responseJSON.error, that.pageId, null)
              );
            } else if (ex.status) {
              this.errorData.push(
                that.customErrorObject(
                  ex.status + " " + ex.statusText,
                  that.pageId,
                  null
                )
              );
            } else {
              this.showLoading(false);
  
              this.errorData.push(that.customErrorObject(ex, that.pageId, null));
            }
          }
          let exData = eModel.getData().length ? eModel.getData() : [];
          let merge = [...exData, ...this.errorData];
          eModel.setData(merge);
  
          if (merge.length) {
            that.errorMessagePopover(that.popoverBtn, false);
          }
          that.showLoading(false);
        },
        //Error Popover End
        userSettingsData: function () { //Themes and User Settings
          if (!this.getView().getModel() || !this.getView().getModel()?.getData()) {
            this.getView().setModel(new JSONModel());
          }
  
          let settings = this.getStorage("userSettings");
          let oData = {
            themes: [{
              key: "sap_bluecrystal",
              name: "Blue Crystal"
            },
            {
              key: "sap_belize",
              name: "Belize"
            },
            {
              key: "sap_fiori_3",
              name: "Quartz Light"
            },
            {
              key: "sap_fiori_3_dark",
              name: "Quartz Dark"
            },
            {
              key: "sap_horizon",
              name: "Morning Horizon"
            },
            {
              key: "sap_horizon_dark",
              name: "Evening Horizon"
            }
            ],
            timeFormat: [{
              key: 1,
              name: "12 Hours"
            },
            {
              key: 2,
              name: "24 Hours"
            }
            ],
            dateFormat: [{
              key: 1,
              name: "Numeric"
            },
            {
              key: 2,
              name: "Short"
            },
            {
              key: 3,
              name: "Long"
            }
            ],
            language: [{
              key: "en",
              name: "English"
            },
            {
              key: "ar",
              name: "Arabic"
            }
            ],
            userSettings: {
              theme: "sap_horizon",
              language: "en",
              dateFormatKey: 1,
              timeFormatKey: 1,
              dateFormat: "dd-MM-yyyy",
              timeFormat: "HH:mm a"
            }
          }
          let oModel = this.getView().getModel();
          let existData = oModel.getData();
          let merge = {
            ...existData,
            ...oData
          }
          oModel.setData(merge);
  
          oModel.getData().userSettings.currentDate = this.getDateFormats(1, new Date());
          oModel.getData().userSettings.currentTime = this.getTimeFormats(1, new Date().toLocaleTimeString());
  
          if (settings) {
            oModel.getData().userSettings = settings;
            this.setStorage("userSettings", settings);
            this.onApplyTheme(settings.theme);
          } else {
            this.setStorage("userSettings", oData.userSettings);
          }
          oModel.refresh();
        },
  
        onPressUserSetting: async function () { //User Settings Dialog
  
          let oDialog = await this.onOpenDialog("com.propertyzone.view.fragment.UserSettings");
          let listTheme = this.getView().byId("dg_listThemes");
          let settings = this.getStorage("userSettings");
          listTheme.getItems().forEach(e => {
            let key = e.getBindingContext().getObject().key
            if (key == settings.theme) {
              listTheme.setSelectedItem(e);
            }
          })
          this.userSettingsData();
        },
        onCloseUserSetting: function () {
          this.userSettingsDialog.then(function (oDialog) {
            oDialog.close();
          });
        },
        onPressUserDialogMenu: function (oEvent) {
          let splitContainer = this.byId("userSettingsSplitContainer");
          splitContainer.backMaster();
        },
  
        onThemSelect: function (oEvent) { //on Theme Selection
          var oModel = this.getModel();
          var selThemObj = oEvent.getParameter("listItem").getBindingContext().getObject();
  
          oModel.getData().userSettings.theme = selThemObj.key
          this.onApplyTheme(selThemObj.key);
          oModel.refresh();
        },
  
        onChangeLanguage: function (oEvent) { // on Language Selection 
          var oModel = this.getModel();
          var coreConfig = sap.ui.getCore().getConfiguration();
          var selThemObj = oEvent.getParameter("selectedItem").getBindingContext().getObject();
  
          oModel.getData().userSettings.language = selThemObj.key;
          sap.ui.getCore().attachLocalizationChanged(function (oEvent) {
            console.log(oEvent.getParameters())
          });
  
          coreConfig.setLanguage(selThemObj.key);
  
          oModel.refresh();
        },
  
        onChangeApplicationDate: function (oEvent) { // on Change Date Format for Entire Application
          var oModel = this.getModel();
          var oKey = oEvent.getParameter("selectedItem").getKey();
          oModel.getData().userSettings.currentDate = this.getDateFormats(oKey, new Date());
          oModel.refresh();
          // this.setStorage("userSettings", oModel.getData().userSettings)
        },
  
        onChangeApplicationTime: function (oEvent) { // on Change Time Format for Entire Application
          var oModel = this.getModel();
          var oKey = oEvent.getParameter("selectedItem").getKey();
          oModel.getData().userSettings.currentTime = this.getTimeFormats(oKey, new Date().toLocaleTimeString())
          oModel.refresh();
        },
        onPressSaveSettings: function (oEvent) {
          var oModel = this.getModel();
          this.setStorage("userSettings", oModel.getData().userSettings);
          this.onCloseDialog();
        },
        onListItemPress: function (oEvent) {
          var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
          var sContainer = this.getView().byId("userSettingsSplitContainer");
          sContainer.toDetail(this.createId(sToPageId));
        },
        onOpenDialog: async function (sPath) { //Common dialog open function
          if (!this.oDialog) {
            this.oDialog = await this.loadFragment({
              name: sPath
            });
          }
  
          this.oDialog.open(); //Open Dialog
          return this.oDialog;
        },
        onCloseDialog: async function () { //Common dialog close function
          this.oDialog.close(); //Close Dialog
          this.oDialog.destroy();
          delete this.oDialog;
        },
  
        onOpenPopover: async function (oEvent, sPath) { //Common popover open function
          let oButton;
          if(oEvent?.oSource) {
            oButton = oEvent.getSource();
          } else {
            oButton = oEvent;
          }
          let oView = this.getView();
  
          if (this.oPopover) {
            this.oPopover.destroy();
            delete this.oPopover;
          }
  
          this.oPopover = await this.loadFragment({
            name: sPath
          });
          oView.addDependent(this.oPopover);
  
          this.oPopover.openBy(oButton); //Open Popover
        },

        getHostDetail: function () {
          var that = this;
          var host = "AppConstants.URL.app_endPoint";
          if (window.location.toString().indexOf('localhost') > 0 || window.location.toString().indexOf('127.0.0.1') > 0 || window.location.toString().indexOf('applicationstudio') > 0) {
            host = AppConstants.URL.app_endPoint + "v1/";
          } else {
            let path = this.getOwnerComponent().getManifestObject()._oBaseUri._parts.path + "/v1/";
            host = path;
          }
          return host;
        },
  
        ///************API Calls***********///
        restMethodGet: async function (url) {
          try {
            const response = await $.ajax({
              type: "GET",
              // url: URLConstants.URL.app_endPoint + url,
                 url : AppConstants.URL.app_endPoint + url,

              contentType: "application/json"
            });
            return response;
          } catch (error) {
            return Promise.reject(error);
          }
        },
        restMethodDelete: function (url) {
          url = AppConstants.URL.app_endPoint + url;
          //var token = JSON.parse(sessionStorage.getItem("state.key_-userContext")).response;
          var deferred = $.Deferred();
          //if (token != "" && token != null) {
          $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            //headers: { "my-token": token },
            success: function (response) {
              deferred.resolve(response);
            },
            error: function (xhr) {
              deferred.reject(xhr); //.responseJSON.message);
            },
          });
          //}
          return deferred.promise();
        },
        restMethodGetForLogin: function (url, body) {
          url = URLConstants.URL.app_endPoint + url;
          var deferred = $.Deferred();
          $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(body),
            contentType: "application/json",
            success: function (response) {
              deferred.resolve(response);
            },
            error: function (xhr) {
              deferred.reject(xhr); //.responseJSON.message);
            },
          });
          return deferred.promise();
        },
        restMethodGetWitData: async function (url, request) {
          try {
            const response = await $.ajax({
              type: 'POST',
              url: AppConstants.URL.app_endPoint + url,
              contentType: "application/json",
              data: JSON.stringify(request)
            });
            return response;
          } catch (error) {
            return Promise.reject(error.responseJSON.message);
          }
        },
        restMethodPost: function (url, request) {
          url = AppConstants.URL.app_endPoint + url;
          // var token = JSON.parse(
          //   sessionStorage.getItem("state.key_-userContext")
          // ).response;
          // var contexts = GenericFunctions.getStorage("userContext");
          // var token = "";
          // if (contexts !== null) token = contexts.sessionID;
          var token = this.getStorage("login_token");
          var deferred = $.Deferred();
          $.ajax({
            type: "POST",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            url: url,
            data: JSON.stringify(request),
            contentType: "application/json",
            success: function (response) {
              deferred.resolve(response);
            },
            error: function (xhr) {
              deferred.reject(xhr);
            },
          });
          return deferred.promise();
        },
        readFile: function (file) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
  
            reader.onload = res => {
              resolve(res.target.result);
            };
            reader.onerror = err => reject(err);
  
            reader.readAsBinaryString(file);
          });
        },
        ///************API Calls End***********///
        formatStateByDuration: function (duration) {
          // Convert duration to seconds for comparison
          const [hours, minutes, seconds] = duration.split(':').map(Number);
          const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        
          // Define thresholds in seconds
          const thresholdRed = 3 * 3600;  // 3 hours in seconds
          const thresholdYellow = 5 * 3600; // 5 hours in seconds
        
          if (totalSeconds < thresholdRed) {
              return 'Error'; // Red
          } else if (totalSeconds < thresholdYellow) {
              return 'Warning'; // Yellow
          } else {
              return 'Success'; // Default state
          }
        }
        
      });
    }
  );