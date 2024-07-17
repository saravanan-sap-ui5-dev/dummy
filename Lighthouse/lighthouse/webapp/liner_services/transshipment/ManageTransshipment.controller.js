sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/ui/integration/library",
    "sap/ui/core/Core",
    "com/lighthouse/utils/Formatter"
], function (BaseController, JSONModel, DateFormat, MessageToast, library, Core, Formatter) {
    "use strict";
    var that = this;
    return BaseController.extend("com.lighthouse.liner_services.transshipment.ManageTransshipment", {

        formatter: Formatter,

        onInit: function () {
            this.oOwnerComponent = this.getOwnerComponent();

            this.oRouter = this.oOwnerComponent.getRouter();
            this.oModel = this.oOwnerComponent.getModel();

            this.oRouter.getRoute("transshipmentMaster").attachMatched(this._onRouteMatched, this);

            this._tableId = this.byId("table_Transshipment");
            this._pageId = this.byId("page_Transshipment");
        },
        _onRouteMatched: function () {
            this.setTitle(this.getResourceProperty("tsHeaderTitle"));
            this._mockData();
        },
        _mockData: function () {
            let data = {
                mode: "None",
                items: [
                    {
                        voyageIndex: 18756,
                        voyage: 5468,
                        shippingLine: "HL",
                        vesselIndex: 22547,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Aug-2022 9:35",
                        vesselETS: "13-Aug-2022 19:35",
                        callPort: "Buraimi",
                        status: "Active"
                    },
                    {
                        voyageIndex: 18757,
                        voyage: 4895,
                        shippingLine: "HL",
                        vesselIndex: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Oct-2022 9:35",
                        vesselETS: "13-Oct-2022 19:35",
                        callPort: "Salalah",
                        status: "Inactive"
                    },
                    {
                        voyageIndex: 18758,
                        voyage: 4968,
                        shippingLine: "HL",
                        vesselIndex: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Nov-2022 9:35",
                        vesselETS: "13-Nov-2022 19:35",
                        callPort: "Sur",
                        status: "Draft"
                    },
                    {
                        voyageIndex: 18759,
                        voyage: 6459,
                        shippingLine: "HL",
                        vesselIndex: 22548,
                        vesselName: "Northern Dexterity",
                        vesselETA: "11-Dec-2022 9:35",
                        vesselETS: "13-Dec-2022 19:35",
                        callPort: "Muscat",
                        status: "Active"
                    }
                ]
            }
            data.items.forEach(e => e.type = "Navigation");
            this.getView().setModel(new JSONModel(data));
        },
        onPressNavCreate: function () {
            this.oRouter.navTo("transshipmentDetailCreate");
        },
        onListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext();
            var rowObj = oBindingContext.getObject();

            this.oRouter.navTo("transshipmentDetailEdit", {
                id: rowObj.voyageIndex
            });
        }
    });
});
