sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Element",
    "sap/m/Button",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/library",
    "com/lighthouse/utils/Attachments",
    "com/lighthouse/utils/ErrorMessage",
    "sap/ui/export/Spreadsheet",
    "com/lighthouse/utils/URLConstants",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "com/lighthouse/model/MimeType",
  ],
  function (
    Controller,
    History,
    JSONModel,
    Element,
    Button,
    Fragment,
    Dialog,
    mobileLibrary,
    Attachments,
    ErrorMessage,
    Spreadsheet,
    URLConstants,
    Filter,
    Sorter,
    MimeType
  ) {
    "use strict";
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;
    return Controller.extend("com.lighthouse.init.BaseController", {
      onInit: function () {
        //console.log("test")
      },
      getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
      },
      showChatBot: function (obj) {
        var chat_id = document.getElementById("cai-webchat-div");
        if (chat_id != undefined) {
          if (obj == true) chat_id.style.display = "block";
          else chat_id.style.display = "none";
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
      getResourceProperty: function (text) {
        return this.getOwnerComponent()
          .getModel("i18n")
          .getResourceBundle()
          .getText(text);
      },
      onNavBack: function () {
        var oHistory, sPreviousHash, navData;
        navData = this.getModel("settings").getData();
        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined && !navData.route) {
          window.history.go(-1);
        } else if (navData.route) {
          window.history.go(-2);
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
      setStorage: function (name, sContext) {
        jQuery.sap.require("jquery.sap.storage");
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
        oStorage.put(name, sContext);
      },
      getStorage: function (name) {
        jQuery.sap.require("jquery.sap.storage");
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
        return oStorage.get(name);
      },
      handleChangeDateRangeForApi: function (oEvent) {
        let oParams = oEvent.getParameters(),
          oSource = oEvent.getSource(),
          oFields = oSource.getCustomData()[0].getValue().split(","),
          from = oParams.from,
          to = oParams.to,
          fModel = this.getView().getModel(),
          dateConv = function (date) {
            let originalDateString = date.toISOString(),
              originalDate = new Date(originalDateString),
              dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd",
              }),
              formattedDate = dateFormat.format(originalDate);
            let apiDate = new Date(formattedDate);
            apiDate.setUTCHours(0, 0, 0, 0);
            return apiDate.toISOString();
          };
        if (from && to && from.toLocaleDateString() == to.toLocaleDateString()) {
          oEvent.getSource().setValue(dateConv(from));
        }
        // to = to ? new Date(to.getTime() + 86400000) : null;
        fModel.getData().advancedFilter[oFields[0]] = from ? dateConv(from) : from;
        fModel.getData().advancedFilter[oFields[1]] = to ? dateConv(to) : to;
        fModel.refresh();
      },
      handleChangeDateRange: function (oEvent) {
        let oParams = oEvent.getParameters(),
          oSource = oEvent.getSource(),
          oFields = oSource.getCustomData()[0].getValue().split(","),
          from = oParams.from,
          to = oParams.to,
          fModel = this.getView().getModel(),
          dateConv = function (date) {
            let originalDateString = date.toISOString(),
              originalDate = new Date(originalDateString),
              dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd",
              }),
              formattedDate = dateFormat.format(originalDate);
            return formattedDate;
          };
        if (from && to && from.toLocaleDateString() == to.toLocaleDateString()) {
          oEvent.getSource().setValue(dateConv(from));
        }
        // to = to ? new Date(to.getTime() + 86400000) : null;
        fModel.getData().advancedFilter[oFields[0]] = from ? dateConv(from) : from;
        fModel.getData().advancedFilter[oFields[1]] = to ? dateConv(to) : to;
        fModel.refresh();
      },
      onResetAdaptFilter: function (oSource) {//its alternative for reset todo: future will remove this
        //reset adapt filter options
        let that = this;
        let oSettingMdl = this.getOwnerComponent().getModel("settings");
        oSettingMdl.getData().visible_filter = that._defaultAFOption;
        oSettingMdl.refresh(true);
        oSource.getFilterGroupItems().forEach((e) => {
          let findLbl = that._defaultAFOption.find(
            (e1) => e.getLabel() == Object.keys(e1)[0]
          );
          if (findLbl) {
            e.setVisibleInFilterBar(findLbl[e.getLabel()]);
          }
        });
      },
      setVisbleFilterFields: function () {
        //set adapt filter field visiblity
        let oSettingMdl = this.getOwnerComponent().getModel("settings");
        let vData = oSettingMdl.getData().visible_filter;
        if (vData) {
          this._filterBar.getFilterGroupItems().forEach((e) => {
            let findLbl = vData.find(
              (e1) => e.getLabel() == Object.keys(e1)[0]
            );
            if (findLbl) {
              e.setVisibleInFilterBar(findLbl[e.getLabel()]);
            }
          });
        }
      },
      getFilterVisibleFields: function () {
        //get filter field visiblity
        return this._filterBar.getFilterGroupItems().map((e) => {
          let cVisible = {};
          cVisible[e.getLabel()] = e.getVisibleInFilterBar();
          return cVisible;
        });
      },
      fileReader: async function (oFile, type) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = e => {
            //resolve(e.target.result);
            resolve(e.target.result);
          };
          reader.onerror = err => reject(err);

          switch (type) {
            case "arrayBuffer":
              reader.readAsArrayBuffer(oFile);
              break;
            case "url":
              reader.readAsDataURL(oFile);
              break;
            case "text":
              reader.readAsText(oFile);
              break;
            default:
              reader.readAsBinaryString(oFile);
              break;
          }
        });
      },
      onExcelTemplate: function (sheetDetails) { // to download the excel template
        let getLabels = sheetDetails.columns.filter(e => !e.label.includes("ID")).map(e => e.label);        //sheetDetails.columns.map(e => e.label);
        // Create basic template for excel
        const worksheet = [];
        sheetDetails.sheets.sheetName.forEach(e => {
          worksheet.push(XLSX.utils.json_to_sheet([]));  //Creating multiple worksheet template
        });
        const workbook = XLSX.utils.book_new();
        worksheet.forEach((e, i) => { //Creating multiple worksheets
          XLSX.utils.book_append_sheet(workbook, e, sheetDetails.sheets.sheetName[i]);
          /* fix headers */
          XLSX.utils.sheet_add_aoa(e, Array.of(getLabels), { origin: "A1" });
          /* calculate column width */
          const max_width = getLabels.reduce((w, r) => Math.max(w, r.length), 10);
          e["!cols"] = new Array(getLabels.length).fill({ wch: max_width });
        });
        /* create an XLSX file and try to save xlsx format */
        XLSX.writeFile(workbook, sheetDetails.fileName, { compression: true });
      },
      xlsxFileReader: async function (file, sheetDetails) {
        var that = this;
        let eModel = this.getOwnerComponent().getModel("errors");
        var oErrorData = [];
        let multiWorksheet = {};
        let singleWorksheet;
        /* get raw data */
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const workbook = XLSX.read(data);
        /* do something with the workbook here */
        let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
          blankRows: false,    //To retrieve all columns even empty rows
          defval: '',
        });

        let rowChange = ((data) => {
          return data.map((e, i) => {//Single Worksheet
            let obj = {};
            let emptyCount = 0;
            let arrayOfProps = Object.entries(e);
            arrayOfProps.forEach(e => {
              obj['Row Number'] = i + 2; // adding excel row number
              let colum = e[0].trim();
              let data = e[1];
              obj[colum] = data;
              if (!data) {
                emptyCount += 1;
              }
            });
            if (emptyCount > 0) {
              obj.Valid = "Error";
            } else {
              obj.Valid = "Success";
            }
            return obj;
          });
        });

        workbook.SheetNames.forEach(e => {//Multiple Worksheet
          let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[e], {
            blankRows: false,
            defval: '',
          });
          sheetData = rowChange(sheetData);//adding excel row number
          multiWorksheet[e] = sheetData; //adding sheet into multiworksheet variable
        });

        let isEmptyArray = Object.values(multiWorksheet).every(e => e.length > 0); //Checking user doesn't entry data
        singleWorksheet = rowChange(jsonData);

        var sheetNames = workbook.SheetNames;
        var isColumnEqual = false;
        if (!isEmptyArray) {
          oErrorData.push(this.customErrorObject(this.getResourceProperty("cnPleaseFillTheExcelData"), that._pageId, null, null));
          //eModel.setData(oErrorData);
          //that.errorMessagePopover(that.popoverBtn, false);
          this.onMessageDialog("Error", this.getResourceProperty("cnPleaseFillTheExcelData"), "Error");
        }
        else {
          eModel.setData([]);
          let jsColumn = sheetDetails.columns.map(e => e.label);
          let singleColumn = Object.keys(singleWorksheet[0]);
          isColumnEqual = singleColumn.every(e => { //Checks excel column and js file field names
            let except = e.includes("Row Number") || e.includes("Valid") || e.includes("ID");
            return jsColumn.includes(e) ? true : except;//singleColumn.length === jsColumn.length ? jsColumn.includes(e) ? true : except : false;
          });

          if (isColumnEqual) {
            const labelToProperty = {};    //Column mapping 
            sheetDetails.columns.forEach(item => {
              labelToProperty[item.label] = item.property;
            });
            sheetNames.forEach(e => {
              multiWorksheet[e].forEach(obj => {
                // Iterate through keys of the object
                Object.keys(obj).forEach(key => {
                  // Check if the key exists in labelToProperty mapping
                  if (key in labelToProperty) {
                    // Replace the key with the corresponding property
                    obj[labelToProperty[key]] = obj[key];
                    delete obj[key];
                  }
                });
              });
            });
          }
          else {
            oErrorData.push(this.customErrorObject(this.getResourceProperty("cnInvalidExcelColumns"), that._pageId, null, null));
            //eModel.setData(oErrorData);
            //that.errorMessagePopover(that.popoverBtn, false);
            this.onMessageDialog("Error", this.getResourceProperty("cnInvalidExcelColumns"), "Error");
          }
        }
        if (oErrorData.length > 0) {
          return null;
        }
        else {
          //this.onExcelValidation(singleWorksheet);
          return {//Json Data
            single_worksheet: singleWorksheet,
            multiple_worksheet: multiWorksheet
          };
        }
      },
      onExcelValidation: async function (sheetData) {
        if (sheetData) {
          let vModel = this.getView().getModel();
          let errorRows = sheetData.filter(e => e.Valid == 'Error');
          let cols = Object.keys(sheetData[0]).map(e => { return { columnId: e }; });
          //vModel.getData().errorRows = errorRows.length > 0;
          if (errorRows.length > 0) {
            let rows = errorRows;
            let oModel = new sap.ui.model.json.JSONModel();
            let oTable = new sap.m.Table({});
            oModel.setData({
              columns: cols,
              rows: rows
            });

            oTable.setModel(oModel);

            oTable.bindAggregation("columns", "/columns", function (index, context) {
              return new sap.m.Column({
                header: new sap.m.Label({ text: context.getObject().columnId }),
              });
            });
            oTable.getColumns().forEach(e => {
              let colName = e.getHeader().getText();
              if (colName.includes('Valid')) {
                oTable.removeColumn(e);
              }
            });
            oTable.bindItems("/rows", function (index, context) {
              let obj = context.getObject();
              let row = new sap.m.ColumnListItem();

              for (let k in obj) {
                if (k == "Valid") {
                  //row.addCell(new sap.m.ObjectStatus({ text: obj[k], icon: "sap-icon://error", state: obj[k] }));
                } else {
                  row.addCell(new sap.m.Text({ text: obj[k] }));
                }

              }

              return row;
            });
            this.oDialog = null;
            this.excelValidationDialog = await this.onOpenDialog("com.lighthouse.init.fragment.ExcelValidation");
            this.excelValidationDialog.addContent(oTable);
          }
          vModel.refresh();
          return !errorRows.length > 0;
        } else {
          return false;
        }
      },
      //METHOD FOR GET & POST
      ///HTTP re-usable methods
      restMethodGet: function (url) {
        url = URLConstants.URL.app_end_point + url;
        var contexts = this.getStorage("userContext");
        var token = "";
        if (contexts != null)
          token = contexts.sessionID;

        var deferred = $.Deferred();
        $.ajax({
          type: 'GET',
          url: url,
          contentType: "application/json",
          /* headers: {
            "sessionCookie": this.getStorage("userContext").sessionCookie || null
          }, */
          //headers: { Authorization: "Bearer " + token },
          success: function (response) {
            deferred.resolve(response);
          },
          error: function (xhr) {
            deferred.reject(xhr.responseJSON);
          }
        });
        return deferred.promise();
      },
      restMethodGetWitData: function (url, request) {
        url = URLConstants.URL.app_end_point + url;
        var deferred = $.Deferred();
        $.ajax({
          type: 'POST',
          url: url,
          contentType: "application/json",
          data: JSON.stringify(request),
          //headers: { Authorization: "Bearer " + token },
          success: function (response) {
            deferred.resolve(response);
          },
          error: function (xhr) {
            deferred.reject(xhr.responseJSON.message);
          }
        });
        return deferred.promise();
      },
      restMethodPost: function (url, request) {
        url = URLConstants.URL.app_end_point + url;
        var deferred = $.Deferred();
        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(request),
          contentType: "application/json",
          /* headers: {
            "sessionCookie": this.getStorage("userContext").sessionCookie || null
          }, */
          success: function (response) {
            deferred.resolve(response);
          },
          error: function (xhr) {
            deferred.reject(xhr.responseJSON);
          }
        });
        return deferred.promise();
      },
      restMethodPostLogin: function (url, request)//without cookie
      {
        url = URLConstants.URL.app_end_point + url;
        var deferred = $.Deferred();
        $.ajax({
          type: 'POST',
          url: url,
          data: JSON.stringify(request),
          contentType: "application/json",
          success: function (response) {
            deferred.resolve(response);
          },
          error: function (xhr) {
            deferred.reject(xhr.responseJSON);
          }
        });
        return deferred.promise();
      },
      //Fetch master data
      fetchMasterData: async function () {
        try {
          let oModel = this.getOwnerComponent().getModel("masterDataMdl");
          if (oModel) {
            let path = URLConstants.URL.enumerators;
            let response = await this.restMethodGet(path);
            oModel.setData(response);
            this.setStorage("master_data", response);
          }
          oModel?.refresh();
        } catch (error) {
          console.log(error);
        }
      },
      fetchAttachmentsByFilter: async function (moduleId, id) {
        try {
          var path = URLConstants.URL.attachments_by_filter;
          // this.upload_set.setBusy(true);

          var inParams = {
            refObjectType: moduleId,
            refObjectId: id
          };

          let response = await this.restMethodGetWitData(path, inParams);
          let exAtModel = this.getOwnerComponent().getModel("attachmentsMdl");
          if (response.length > 0) {
            let merge = [...response, ...exAtModel.getData()];
            exAtModel.setData(merge);
          }
          //this.uploadSet.removeAllItems();
          this.onAddAttachmentItem(response, "AttachmentMdl", moduleId);
          // this.upload_set.setBusy(false);
        } catch (ex) {
          // this.upload_set.setBusy(false);
          this.errorHandling(ex);
        }
      },
      showLoading: function (status) {
        this.getView().setBusy(status);
        this.getView().setBusyIndicatorDelay(10);
      },
      getCurrentDateWithFormat: function () {
        var d = new Date(),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;

        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
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
      IsoStringToDate: function (date) {
        const newDate = new Date(date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = newDate.toLocaleDateString('en-GB', options).replace(/\//g, '-');
        return formattedDate;
      },
      JsonToDate: function (date) {
        if (date) {
          return new Date(
            parseInt(date.toLocaleString().substr(6))
          ).toLocaleDateString();
        } else {
          return "";
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
        this.getRouter().navTo("dashboard");
      },
      //Set Title
      setTitle: function (title) {
        let oModel = this.getOwnerComponent().getModel();
        oModel.getData().genericTitle = title;
        oModel.refresh();
      },
      /* Date Formate Change */
      getDateFormats(key, date) {
        let oModel = this.getOwnerComponent().getModel();
        let userSettings = oModel.getData().userSettings;
        let dateConv, fDate;
        if (date != undefined) {
          //date.slice(date.indexOf("(") + 1, date.indexOf(")"))
          dateConv = new Date(date);

          let options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };
          let numeric = function () {
            //Numeric
            options.month = "2-digit";
            options.day = "2-digit";
            fDate = dateConv.toLocaleDateString("en-IN", options);
            fDate = fDate.replaceAll("/", " ");
            userSettings.dateFormat = "dd-MM-yyyy";
          };
          if (key == 1) {
            numeric();
          } else if (key == 2) {
            //Short
            options.month = "short";
            options.day = "2-digit";
            fDate = dateConv.toLocaleDateString("en-IN", options);
            userSettings.dateFormat = "dd-MMM-yyyy";
          } else if (key == 3) {
            //Long
            options.month = "long";
            options.day = "2-digit";
            fDate = dateConv.toLocaleDateString("en-IN", options);
            userSettings.dateFormat = "dd-MMMM-yyyy";
          } else {
            numeric();
          }
          return fDate.replaceAll(" ", "-");
        } else {
          //dateConv = new Date();
        }
      },

      /* Date Formate Change */
      getDateTimeFormats(key, date) {
        let oModel = this.getOwnerComponent().getModel();
        let userSettings = oModel.getData().userSettings;
        let dateConv, fDate, fTime;
        if (date != undefined) {
          //date.slice(date.indexOf("(") + 1, date.indexOf(")"))
          dateConv = new Date(date);
          if (!isNaN(dateConv)) {
            let options = {
              year: "numeric",
              month: "short",
              day: "numeric",
            };
            let numeric = function () {
              //Numeric
              options.month = "2-digit";
              options.day = "2-digit";
              fDate = dateConv.toLocaleDateString("en-IN", options);
              fTime = dateConv.toLocaleTimeString("en-IN", {
                hour12: false
              });
              userSettings.dateFormat = "dd-MM-yyyy";
              userSettings.timeFormat = "HH:mm:ss";
              userSettings.timeFormat = "hh:mm:ss a";
            };
            if (key == 1) {
              numeric();
            } else if (key == 2) {
              //Short
              options.month = "short";
              options.day = "2-digit";
              fDate = dateConv.toLocaleDateString("en-IN", options);
              userSettings.dateFormat = "dd-MMM-yyyy";
            } else if (key == 3) {
              //Long
              options.month = "long";
              options.day = "2-digit";
              fDate = dateConv.toLocaleDateString("en-IN", options);
              userSettings.dateFormat = "dd-MMMM-yyyy";
            } else {
              numeric();
            }
            return fDate.replaceAll("/", "-") + ',' + fTime;
          }
          else {
            return date;
          }
        }
      },

      /* Time Format Change */
      getTimeFormats: function (key, time) {
        let oModel = this.getOwnerComponent().getModel();
        let userSettings = oModel.getData().userSettings;

        if (time != undefined) {
          let date = new Date().toLocaleTimeString("en-IN", {
            hour12: false,
          });
          let timeConv = new Date();
          timeConv.setTime(new Date(date + ", " + time).getTime());

          if (key == 1) {
            userSettings.timeFormat = "hh:mm:ss a";
            return timeConv.toLocaleTimeString("en-IN", {
              hour12: true,
            });
          } else if (key == 2) {
            userSettings.timeFormat = "HH:mm:ss";
            return timeConv.toLocaleTimeString("en-IN", {
              hour12: false,
            });
          }
        }
      },
      //on Apply theme
      onApplyTheme: function (key) {
        if (key) {
          sap.ui.getCore().applyTheme(key);
          sap.ui.getCore().attachThemeChanged(function (oEvent) {
            console.log(oEvent.getParameters());
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
              text: "Are you sure you want to log off?",
            }),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "OK",
              press: function () {
                //MessageToast.show("Submit pressed!");
                this.showChatBot(false);
                this.getRouter().navTo("login");
                this.oApproveDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this),
            }),
          });
        }

        this.oApproveDialog.open();
      },
      //Menu popover
      menuPopoverOpen: function (oEvent) {
        var oButton = oEvent.getSource(),
          oView = this.getView();

        // create popover
        if (!this._menuPopover) {
          this._menuPopover = Fragment.load({
            id: oView.getId(),
            name: "com.lighthouse.init.fragment.MenuButton",
            controller: this,
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            return oPopover;
          });
        }
        this._menuPopover.then(function (oPopover) {
          oPopover.openBy(oButton);
        });
      },

      //Error popover button handler
      handleMessagePopoverPress: function (oEvent) {
        let isDialog = false;
        let oSource;
        if (oEvent?.oSource) {
          oSource = oEvent.getSource();
        } else {
          oSource = oEvent;
        }
        if (!this.oPopover) {
          this.errorMessagePopover(oSource, isDialog);
        } else {
          this.oPopover.toggle(oSource);
        }
      },
      //Error Popover Start
      errorMessagePopover: async function (popoverBtn) {
        //Popover
        let oPopover = await this.onOpenPopover(
          popoverBtn,
          "com.lighthouse.init.fragment.ErrorMessage"
        );
      },
      errorMessagePopoverClose: function () {
        if (this.oPopover != undefined) {
          this.oPopover.close();
        }
      },
      onActiveTitlePress: function (oEvent) {
        var getSelItem = oEvent.getParameter("item").getBindingContext("errors").getObject();
        var control = getSelItem.control;
        var oPage = getSelItem.page;
        var oControl = Element.registry.get(control.getId());

        if (oControl) {
          jQuery.sap.delayedCall(500, this, function () {
            oControl.focus();
          });
          if (oControl?.getAccessibilityInfo) {
            var type = oControl?.getAccessibilityInfo()?.type;
          }
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
        if (!this.errorData || !ex) {
          this.errorData = [];
        }
        let isInvalidSession = ex?.errorDescription?.includes("301") || ex?.errorDescription?.includes("Invalid Session");
        let invalidSession = ((ex) => {
          if (ex.errorDescription.includes("301") || ex.errorDescription.includes("Invalid Session")) {
            sap.m.MessageBox.error(ex.errorDescription, {
              actions: [sap.m.MessageBox.Action.OK],
              emphasizedAction: "OK",
              onClose: function (sAction) {
                that.getRouter().navTo('login');
              }
            });
          }
        });
        if (!isInvalidSession) {
          let eModel = this.getOwnerComponent().getModel("errors");
          let exist = this.errorData.find((e) => e.title == (ex?.responseJSON?.errorDescription || ex?.responseJSON?.debugMessage || ex?.errorDescription));
          if (ex && !exist) {
            if (ex.responseJSON?.debugMessage) {
              this.errorData.push(that.customErrorObject(ex.responseJSON.debugMessage, that.pageId, null));
            } else if (ex.responseJSON?.errorDescription) {
              this.errorData.push(that.customErrorObject(ex.responseJSON.errorDescription, that.pageId, null));
            } else if (ex.responseJSON) {
              this.errorData.push(that.customErrorObject(ex.responseJSON.error, that.pageId, null));
            } else if (ex?.errorDescription || ex?.debugMessage) {
              this.errorData.push(that.customErrorObject(ex?.errorDescription || ex?.debugMessage, that.pageId, null));
            } else if (ex.status) {
              this.errorData.push(that.customErrorObject(ex.status + " " + ex.statusText, that.pageId, null));
            } else {
              this.errorData.push(that.customErrorObject(ex, that.pageId, null));
            }
          }
          let exData = eModel.getData().length ? eModel.getData() : [];
          let merge = [...exData, ...this.errorData];
          eModel.setData(merge);

          if (merge.length) {
            that.errorMessagePopover(that.popoverBtn, false);
          }
        } else {
          invalidSession(ex);
        }
        that.showLoading(false);
      },
      //Error Popover End

      //Advanced Filter Settings Dialog
      onPressAFSettings: function () {
        var that = this;
        if (!this.afSettingsDialog) {
          this.afSettingsDialog = this.loadFragment(
            {
              name: "com.lighthouse.init.fragment.AdvancedFilterSettings",
            },
            this
          );
        }
        this.afSettingsDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      onCloseAFSettings: function () {
        this.afSettingsDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      userSettingsData: function () {
        if (
          !this.getView().getModel() ||
          !this.getView().getModel()?.getData()
        ) {
          this.getView().setModel(new JSONModel());
        }
        //Themes and User Settings
        let settings = this.getStorage("userSettings");
        let oData = {
          themes: [
            {
              key: "sap_bluecrystal",
              name: "Blue Crystal",
            },
            {
              key: "sap_belize",
              name: "Belize",
            },
            {
              key: "sap_fiori_3",
              name: "Quartz Light",
            },
            {
              key: "sap_fiori_3_dark",
              name: "Quartz Dark",
            },
            {
              key: "sap_horizon",
              name: "Morning Horizon",
            },
            {
              key: "sap_horizon_dark",
              name: "Evening Horizon",
            },
          ],
          timeFormat: [
            {
              key: 1,
              name: "12 Hours",
            },
            {
              key: 2,
              name: "24 Hours",
            },
          ],
          dateFormat: [
            {
              key: 1,
              name: "Numeric",
            },
            {
              key: 2,
              name: "Short",
            },
            {
              key: 3,
              name: "Long",
            },
          ],
          language: [
            {
              key: "en",
              name: "English",
            },
            {
              key: "ar",
              name: "Arabic",
            },
          ],
          userSettings: {
            theme: "sap_horizon",
            language: "en",
            dateFormatKey: 1,
            timeFormatKey: 1,
            dateFormat: "dd-MM-yyyy",
            timeFormat: "HH:mm a",
          },
        };
        let oModel = this.getView().getModel();
        let existData = oModel.getData();
        let merge = {
          ...existData,
          ...oData,
        };
        oModel.setData(merge);

        oModel.getData().userSettings.currentDate = this.getDateFormats(
          1,
          new Date()
        );
        oModel.getData().userSettings.currentTime = this.getTimeFormats(
          1,
          new Date().toLocaleTimeString()
        );

        if (settings) {
          oModel.getData().userSettings = settings;
          this.setStorage("userSettings", settings);
          this.onApplyTheme(settings.theme);
        } else {
          this.setStorage("userSettings", oData.userSettings);
        }
        oModel.refresh();
      },
      //User Settings Dialog
      onPressUserSetting: function () {
        var that = this;
        if (!this.userSettingsDialog) {
          this.userSettingsDialog = this.loadFragment(
            {
              name: "com.lighthouse.init.fragment.UserSettings",
            },
            this
          );
        }
        this.userSettingsDialog.then(function (oDialog) {
          var listTheme = that.byId("dg_listThemes");
          var settings = that.getStorage("userSettings");
          listTheme.getItems().forEach((e) => {
            let key = e.getBindingContext().getObject().key;
            if (key == settings.theme) {
              listTheme.setSelectedItem(e);
            }
          });
          oDialog.open();
          that.userSettingsData();
        });
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
      //on Theme Selection
      onThemSelect: function (oEvent) {
        var oModel = this.getModel();
        var selThemObj = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject();

        oModel.getData().userSettings.theme = selThemObj.key;
        this.onApplyTheme(selThemObj.key);
        oModel.refresh();
      },
      // on Language Selection
      onChangeLanguage: function (oEvent) {
        var oModel = this.getModel();
        var coreConfig = sap.ui.getCore().getConfiguration();
        var selThemObj = oEvent
          .getParameter("selectedItem")
          .getBindingContext()
          .getObject();

        oModel.getData().userSettings.language = selThemObj.key;
        sap.ui.getCore().attachLocalizationChanged(function (oEvent) {
          console.log(oEvent.getParameters());
        });

        coreConfig.setLanguage(selThemObj.key);

        oModel.refresh();
      },
      // on Change Date Format for Entire Application
      onChangeApplicationDate: function (oEvent) {
        var oModel = this.getModel();
        var oKey = oEvent.getParameter("selectedItem").getKey();
        oModel.getData().userSettings.currentDate = this.getDateFormats(
          oKey,
          new Date()
        );
        oModel.refresh();
        // this.setStorage("userSettings", oModel.getData().userSettings)
      },
      // on Change Time Format for Entire Application
      onChangeApplicationTime: function (oEvent) {
        var oModel = this.getModel();
        var oKey = oEvent.getParameter("selectedItem").getKey();
        oModel.getData().userSettings.currentTime = this.getTimeFormats(
          oKey,
          new Date().toLocaleTimeString()
        );
        oModel.refresh();
      },
      onPressSaveSettings: function (oEvent) {
        var oModel = this.getModel();
        this.setStorage("userSettings", oModel.getData().userSettings);
        this.userSettingsDialog.then(function (oDialog) {
          oDialog.close();
        });
      },
      onListItemPress: function (oEvent) {
        var sToPageId = oEvent
          .getParameter("listItem")
          .getCustomData()[0]
          .getValue();
        var sContainer = this.getView().byId("userSettingsSplitContainer");
        sContainer.toDetail(this.createId(sToPageId));
      },
      disableItemNavigated: function (oTable) {
        if (oTable) {
          oTable.getItems().forEach((e) => e.setNavigated(false));
        }
      },
      onOpenDialog: async function (sPath) {
        try {
          //Common dialog open function
          if (!this.oDialog) {
            this.oDialog = await this.loadFragment({
              name: sPath,
            });
          }

          this.oDialog.open(); //Open Dialog
          return this.oDialog;
        } catch (error) {
          console.log(error);
        }
      },
      onCloseDialog: async function () {
        //Common dialog close function
        if (this.oDialog.close) {
          this.oDialog.close(); //Close Dialog
        }
        this.oDialog.destroy();
        delete this.oDialog;
      },

      onOpenPopover: async function (oEvent, sPath) {
        //Common popover open function
        let oButton = oEvent, //.getSource(),
          oView = this.getView();

        if (this.oPopover) {
          this.oPopover.destroy();
          delete this.oPopover;
        }

        this.oPopover = await this.loadFragment({
          name: sPath,
        });
        oView.addDependent(this.oPopover);

        let errorMsg = sPath.includes("ErrorMessage");
        if (!errorMsg) {
          this.oPopover.openBy(oButton); //Open Popover
        } else {
          this.oPopover.toggle(oButton); //Toggle Popover
        }
      },
      /* Attachment Functionalities */
      onPressUpload: function (oEvent) {
        let cModel = this.getOwnerComponent().getModel('newAttachmentMdl');
        let data = cModel.getData();
        data.url = null;
        data.name = null;
        data.description = null;
        //this.errorPopoverParams("basic");
        Attachments.onPressUpload(oEvent, this.getView(), this);
      },
      onUploadAttachment: async function (oEvent) {
        let that = this;
        let valid, newFile, exAtModel, exAtData;
        newFile = await Attachments.onUploadAttachment(
          oEvent,
          this.getView(),
          this.getOwnerComponent().getModel("newAttachmentMdl"),
          this
        );
        exAtModel = this.getOwnerComponent().getModel("attachmentsMdl");
        exAtData = exAtModel.getData();

        this.errorMessagePopoverClose();
        let errorMdl = this.getOwnerComponent().getModel('errors');
        ErrorMessage.removeValueState(this.formId, this.eMdl);
        errorMdl.setData([]);

        let attachmentForm = this.byId('sf_attachment');
        let attachmentType = this.getView().getModel('attachmentType')?.getData();
        attachmentForm.getContent().forEach(e => {
          let isLabel = e.sId.includes('__label');
          let path = e.getBinding('value')?.getPath();
          if (attachmentType.key == '2' && path?.includes('url') && !isLabel) {
            e.getCustomData()[0].setValue('None');
            that.byId('fileUploader').getCustomData()[0].setValue('FileUploader');
          } else if (attachmentType.key == '1' && path?.includes('url') && !isLabel) {
            e.getCustomData()[0].setValue('Input');
            that.byId('fileUploader').getCustomData()[0].setValue('None');
          }

        });

        try {
          ErrorMessage.formValidation(attachmentForm, this.eMdl, this.pageId); //Generic Error management model
          valid = this.eMdl.getData();
          if (valid?.length == 0) {
            this.errorMessagePopoverClose();
            let [name, description, type, file_path] = [
              newFile.statuses.find((e) => e.title.includes("Name"))?.text,
              newFile.statuses.find((e) => e.title.includes("Description"))
                ?.text,
              newFile.statuses.find((e) => e.title.includes("Type"))?.text,
              newFile.statuses.find((e) => e.title.includes("Path"))?.text,
            ];
            let file_param = {
              id: newFile.id ? newFile.id : 0,
              name: name ? name : "",
              description: description ? description : "",
              url: newFile.url ? newFile.url : "",
              type: type ? type : "",
              path: file_path ? file_path : "",
              mimeType: newFile.mimeType ? newFile.mimeType : "",
              refObjectType: this._moduleId,
              refObjectId: this._item,
              src: newFile?.src,
              createdBy: null,
              updatedBy: null,
              createdOn: null,
              updatedOn: null,
              status: 2,
              recordCount: 0,
            };
            let duplicate = exAtData.filter(
              (e) => e.name == file_param.name && e.status == 2
            );
            if (duplicate.length > 0) {
              let oErrorData=[];
              oErrorData.push(this.customErrorObject("This name is already exist. Please change the different name!", that._pageId, null, null));
              errorMdl.setData(oErrorData)
              this.errorHandling();
            } else {
              exAtData.push(file_param);
              //this.upload_set.removeAllItems();
              this.onAddAttachmentItem(exAtData);
              exAtModel.refresh();
              this.onCloseAttachmentDialog();
            }
          } else {
            this.errorHandling();
          }
        } catch (ex) {
          this.errorHandling(ex);
        }
      },
      onFileChange: function (oEvent) {
        Attachments.onFileChange(oEvent, this.getView(), this);
      },
      onPressAttachment: async function (oEvent) {
        try {
          oEvent.preventDefault();
          // this.getModel("errors").setData([]);
          this.errorPopoverParams();
          let obj = oEvent.getParameter('item').getBindingContext('AttachmentMdl').getObject();
          let attachmentMdl = this.getModel('attachmentsMdl');
          let id = obj.statuses.find(e => e.title == 'ID').text;
          let data = attachmentMdl.getData().find(e => e.id == id);
          let postData = {
            path: data.path,
            mimeType: data.mimeType,
            name: data.name,
            createdOn: data.createdOn
          };
          let path = URLConstants.URL.read_attahcment;
          let base64 = await this.restMethodPost(path, postData);

          // Construct the data URL
          let dataUrl = "data:" + MimeType.mimeTypes["." + postData.mimeType.toLowerCase()] + ";base64," + base64;

          // Create an anchor element
          let a = document.createElement('a');
          a.href = dataUrl;
          a.target = '_blank';
          // Set the download attribute if you want the browser to download the data
          // This is optional and depends on your use case
          a.download = postData.name; // Set filename as per your requirement

          // Programmatically trigger a click event on the anchor element to open the URL
          a.click();

        } catch (ex) {
          this.errorHandling(ex);
        }
      },
      onFileNameChange: function (oEvent, oView, that) {
        let selObj = oEvent.getParameter("item").getBindingContext("AttachmentMdl").getObject();
        let exAtModel = this.getOwnerComponent().getModel("attachmentsMdl");
        let exAtData = exAtModel.getData();
        let isDuplicate = !exAtData.every(e => e.name !== selObj.fileName);
        if (isDuplicate) {
          oEvent.getParameter("item").setFileName(selObj.name);
          let matchedObj = exAtData.find(e => e.id == selObj.id);
          let matchedStatusObj = selObj.statuses.find(e => e.title == "Name");
          if (matchedObj) selObj.fileName = matchedStatusObj.text;
          if (matchedStatusObj) matchedStatusObj.text = matchedStatusObj.text;
          sap.m.MessageToast.show("This file name is already exist!");
        }
        else {
          let matchedObj = exAtData.find(e => e.id == selObj.id);
          let matchedStatusObj = selObj.statuses.find(e => e.title == "Name");
          if (matchedObj) matchedObj.name = selObj.fileName;
          if (matchedStatusObj) matchedStatusObj.text = selObj.fileName;
          exAtModel.refresh(true);
        }
      },
      handleAfterItemRemoved: function (oEvent) {
        let selObj = oEvent.getParameter("item").getBindingContext("AttachmentMdl").getObject();
        let selText;
        if (selObj?.statuses?.length) {
         selText = selObj.statuses.find(e=>e.title=='ID')?.text
        }
        let exAtModel = this.getOwnerComponent().getModel("attachmentsMdl");
        let exAtData = exAtModel.getData();
        if (selText && selObj.id>0) {
          exAtData.forEach((e) => {
            if (selText == e.id) {
              e.status = 3;
            }
          });
          exAtModel.refresh(true);
        }
        else{
          selText = selObj.statuses.find(e=>e.title=='Name')?.text;
          let index=-1;
          exAtData.forEach((e) => {
            index = exAtData.findIndex(e=>e.name == selText)
          });
          if(index!=1)exAtData.splice(index,1);
        }
        exAtModel.refresh(true);
      },
      onCloseAttachmentDialog: function () {
        let errorMdl = this.getOwnerComponent().getModel('errors');
        ErrorMessage.removeValueState(this.formId, this.eMdl);
        errorMdl.setData([]);

        this.onCloseDialog();
      },
      onAddAttachmentItem: function (response, attchMdl, moduleId) {
        let arr = [];
        response.forEach((obj) => {
          let that = this;
          if (obj.status != 3) {
            if (!obj.FileName) {
              var fields = {
                id: "ID",

                name: "Name",
                description: "Description",
                type: "Type",
                path: "Path",

              };
            } else {
              var fields = {
                id: "ID",
                MimeType: "Type",
                FileName: "Name"
              };
            }
            let oStatuses = [];
            for (let [key, value] of Object.entries(fields)) {
              if (obj[key]) {
                let oStatus = {
                  title: value,
                  text: obj[key],
                  active: false,
                };
                oStatuses.push(oStatus);
              }
            }
            let getVisMdl = this.getModel("visible").getData();
            let tumbUrl = "";
            if (obj.mimeType == "png" || obj.mimeType == "jpeg" || obj.mimeType == "jpg") {
              if (obj.path.includes('blob')) {
                tumbUrl = "sap-icon://picture";
              } else {
                tumbUrl = obj.path + "/" + obj.name + '.' + obj.mimeType;
              }
            } else {
              tumbUrl = "sap-icon://document";
            }
            let oNewItem = {
              id: obj?.id,
              fileName: obj.name,
              mediaType: obj.mimeType ? obj.mimeType : obj.mimeType,
              url: obj.type.includes("Link") ? obj.url : obj.path + '/' + obj.name + '.' + obj.mimeType,
              visibleEdit: getVisMdl.edit,
              visibleRemove: getVisMdl.edit,
              thumbnailUrl: obj.path + "/" + obj.name + '.' + obj.mimeType,
              statuses: oStatuses,
            };

            if (tumbUrl) {
              oNewItem.thumbnailUrl = tumbUrl;
            }
            arr.push(oNewItem);
          }
        });
        if (!attchMdl) {
          attchMdl = "AttachmentMdl";
        }
        this.getView().setModel(new JSONModel({ moduleId: moduleId, items: arr }), "AttachmentMdl");
      },
      /* onAddAttachmentItem: function (response) {
        let aModel = this.getOwnerComponent().getModel('attachmentsMdl');
        response.forEach((obj) => {
          if (obj.status != 3) {
            let fields = {
              // id: "ID",
              type: "Type",
              name: "Name",
              path: "Path",
              description: "Description",
            };
            let oStatuses = [];
            for (let [key, value] of Object.entries(fields)) {
              if (obj[key]) {
                let oStatus = {
                  title: value,
                  text: obj[key],
                  active: false,
                };
                oStatuses.push(oStatus);
              }
            }
            let item = {
              id: obj?.id,
              fileName: obj.name,
              mediaType: obj.mimeType,
              url: obj.type.includes("Link") ? obj.url : oStatuses.find(e => e.title == 'Path').text + '/' + obj.name + '.' + obj.mimeType,
              visibleEdit: "{visible>/edit}",
              visibleRemove: "{visible>/edit}",
              thumbnailUrl: obj.type.includes("Link") ? "sap-icon://chain-link" : "sap-icon://document",
              statuses: oStatuses,
            };
            let items = aModel.getData().items;
            if (items && items.length > 0) {
              aModel.getData().items.push(item);
            } else {
              aModel.getData().items = [item];
            }
          }
        });
        aModel.refresh();
      }, */
      //Attachment end//
      setColulmnsIntoModel: function () {
        let oSettingsModel = this.oOwnerComponent.getModel("settings");
        oSettingsModel.getData().columns = this.sheetDetails().columns;
        oSettingsModel.refresh(true);
      },
      ///*********** Common sort, group, and table personalization functionality dialogs ************///

      handleSortButtonPressed: async function () {
        this.oDialog = null;
        if (!this.sortDialog) {
          this.sortDialog = await this.onOpenDialog("com.lighthouse.init.fragment.SortDialog");
        } else {
          this.sortDialog.open();
        }

        if (this.sortDialog) {//binding visible columns
          let columns = this.sheetDetails().columns;
          let exVisibleCols = this._tableId.getColumns().map((e) => {
            if (e.getVisible()) {
              return { label: e.getHeader().getProperty('text'), visible: e.getVisible() };
            }
          });
          let visibleCol = columns.filter((e) => exVisibleCols.some(ex => e.label == ex?.label));
          this.sortDialog.setModel(new JSONModel(visibleCol));
        }
      },

      handleGroupButtonPressed: async function () {
        this.oDialog = null;
        if (!this.groupDialog) {
          this.groupDialog = await this.onOpenDialog("com.lighthouse.init.fragment.GroupDialog");
        } else {
          this.groupDialog.open();
        }

        if (this.groupDialog) {//binding visible columns
          let columns = this.sheetDetails().columns;
          let exVisibleCols = this._tableId.getColumns().map((e) => {
            if (e.getVisible()) {
              return { label: e.getHeader().getProperty('text'), visible: e.getVisible() };
            }
          });
          let visibleCol = columns.filter((e) => exVisibleCols.some(ex => e.label == ex?.label));
          this.groupDialog.setModel(new JSONModel(visibleCol));
          this.groupDialog.setSelectedGroupItem(this.groupDialog.getSelectedGroupItem());
        }
      },

      handlePersoButtonPressed: function () {
        this._persoDialog;
        this._persoDialogTable;
        let settingMdl = this.getOwnerComponent().getModel("settings");
        if (!this._persoDialog) {
          this._persoDialog = sap.ui.xmlfragment("com.lighthouse.init.fragment.TablePersoDialog", this);
          this._persoDialog.setModel(new JSONModel(settingMdl.getData()), "settings");
          this._persoDialogTable = this._persoDialog.getCustomTabs()[0].getContent()[0];
          //this._persoDialogTable.selectAll();
        }
        this._persoDialogTable.getItems().forEach(e => {
          let data = e.getBindingContext('settings').getObject();
          e.getSelected(data.visible);
        });

        this._persoDialog.open();
      },

      handleSortDialogConfirm: function (oEvent) {
        var oTable = this._tableId, // this table id should be same name all views
          source = oEvent?.getSource(),
          previousSeletedItem = source?._oPreviousState?.sortItem?.getKey(),
          previousSelectedOrder = source?._oPreviousState.sortDescending,
          oBinding = oTable.getBinding("items"),
          sPath,
          isResetEnabled = oEvent?.getSource()._getResetButton().getEnabled(),
          bDescending,
          aSorters = [],
          oModel = this.getView().getModel(),
          sPath = this.sortDialog?.getSortItems().find(e => e.getSelected() == true)?.getKey()
        bDescending = this.sortDialog?.getSortDescending();
        if (!oModel.getData().selections.isResetSelected && !isResetEnabled) {
          sPath = this.sheetDetails().columns[0].property;
          bDescending = !this.sortDialog.getSortDescending();
        }
        if ((oModel.getData().selections.isResetSelected && !isResetEnabled)) {
          sPath = this.sheetDetails().columns[0].property;
          bDescending = !this.sortDialog.getSortDescending();
          oModel.getData().selections.isSortSelected = true;
        }
        if (!oModel.getData().selections.isResetSelected && isResetEnabled) {
          if (sPath && ((!previousSeletedItem) || (previousSeletedItem !== sPath) || (previousSelectedOrder !== bDescending))) {
            oModel.getData().selections.isSortSelected = true;
          }
        }
        oModel.getData().selections.isResetSelected = false;
        if (!sPath) sPath = this.sheetDetails().columns[0].property;
        aSorters.push(new Sorter(sPath, bDescending));
        oModel.getData().advancedFilter.sortingKey = sPath;
        oModel.getData().advancedFilter.orderBy = bDescending ? 'desc' : 'asc';
        if (this.groupDialog) {   //If grouping selected need to group based on field in group dialog and sort on field selected in sort dialog
          let gContext = function (oContext) {
            return oContext.getProperty(selectedGroupName);
          };
          let groupingAggregation = this.groupDialog.mAggregations.groupItems;
          let isGroupingSelected = !groupingAggregation.every(e => e.getSelected() == false);
          let selectedGroupName = groupingAggregation.find(e => e.getSelected() == true)?.getKey();
          if (isGroupingSelected) {
            aSorters = [];
            aSorters.push(new Sorter(sPath, bDescending, gContext));
          }
        }
        this.lastselected = "sort";
        // apply the selected sort and group settings
        oBinding.sort(aSorters);
      },

      resetSortDialog: function (oEvent) {
        var oModel = this.getView().getModel();
        oModel.getData().advancedFilter.sortingKey = this.sheetDetails().columns[0].property;
        oModel.getData().advancedFilter.orderBy = 'desc';
        oEvent.getSource().getSortItems().forEach(e => e.setSelected(false));
        oModel.getData().selections.isResetSelected = true;
      },

      handleGroupDialogConfirm: function (oEvent) {
        var oTable = this._tableId,
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          aGroups = [];

        let gContext = function (oContext) {
          return oContext.getProperty(sPath);
        };
        sPath = this.groupDialog?.getGroupItems().find(e => e.getSelected() == true)?.getKey()
        if (sPath) {
          bDescending = this.groupDialog?.getGroupDescending();
          aGroups.push(new Sorter(sPath, bDescending, gContext));
          // apply the selected group settings
          oBinding.sort(aGroups);
        } else if (this.groupReset || !sPath) {
          oBinding.sort();
          this.groupReset = false;
        }
        this.lastselected = "Group";
      },

      resetGroupDialog: function (oEvent) {
        this.groupReset = true;
        oEvent.getSource().getGroupItems().forEach(e => e.setSelected(false));
      },

      handleTablePersoDialogConfirm: function (oEvent) {
        //Handle Table Perso Confirm functionality
        let oTable = this._tableId,
          pTable = this._persoDialogTable;

        if (pTable) {
          this.selItems = pTable?.getSelectedItems();
          let oModel = this.getOwnerComponent().getModel();
          oModel.getData().tablePersoSelected = this.selItems;
          if (this.selItems && this.selItems.length > 0 && !this.persoReset) {
            let colNames = this.selItems.map((e) =>
              e.getCells()[0].getProperty("text")
            );
            this._tableId.getColumns().forEach((e) => {
              let colName = colNames.some((e1) => e1 == e.getHeader().getText());
              if (colName) {
                e.setVisible(true);
              } else {
                e.setVisible(false);
              }
            });
          } else if (this.persoReset) {
            //this._tableId.getColumns().forEach((e) => e.setVisible(true));
            let columns = this.sheetDetails().columns;
            this._tableId.getColumns().forEach((e) => {
              let label = e.getHeader().getProperty('text');
              let data = columns.find(e1 => e1.label == label);
              e.setVisible(data.visible);
            });
            this.persoReset = false;
          }
          else {
            this._tableId.getColumns().forEach((e, i) => {
              if (i == 0) {
                pTable.setSelectedItem(pTable.getItems()[0]);
                e.setVisible(true);
              } else {
                e.setVisible(false);
              }
            });
          }
          oModel.refresh(true);
        } else {
          let columns = this.sheetDetails().columns;
          this._tableId.getColumns().forEach((e) => {
            let label = e.getHeader().getProperty('text');
            let data = columns.find(e1 => e1.label == label);
            e.setVisible(data.visible);
          });
        }
      },
      handleTablePersoCancel: function (oEvent) {
        let exVisibleCols = this._tableId.getColumns().map((e) => { return { label: e.getHeader().getProperty('text'), visible: e.getVisible() }; });
        this._persoDialogTable.getItems().forEach((e) => {
          let itemObj = e.getBindingContext('settings').getObject();
          let data = exVisibleCols.find(e1 => e1.label == itemObj.label);
          e.setSelected(data.visible);
        });
      },
      onSelectItem: function () {
        this.persoReset = false;
        this._persoDialog._getResetButton().setEnabled(true);
      },
      resetPersoDialog: function (oEvent) {
        if (this._persoDialogTable) {
          this.persoReset = true;
          //this._persoDialogTable.removeSelections();
          //this._persoDialogTable.selectAll();
          let columns = this.sheetDetails().columns;
          this._persoDialogTable.getItems().forEach((e) => {
            let itemObj = e.getBindingContext('settings').getObject();
            let data = columns.find(e1 => e1.label == itemObj.label);
            e.setSelected(data.visible);
          });
          this._persoDialog._getResetButton().setEnabled(false);
        }
      },
      onMessageDialog: function (title, message, state) {
        if (!this.oMessageDialog) {
          this.oMessageDialog = new sap.m.Dialog({
            type: sap.m.DialogType.Message,
            title: "Error",
            state: sap.ui.core.ValueState.Error,
            content: new sap.m.Text({ text: message }),
            beginButton: new sap.m.Button({
              type: sap.m.ButtonType.Emphasized,
              text: "OK",
              press: function () {
                this.oMessageDialog.close();
              }.bind(this)
            })
          });
        }

        this.oMessageDialog.open();
      },
    });
  }
);
