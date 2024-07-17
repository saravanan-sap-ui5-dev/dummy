sap.ui.define([], function () {
    "use strict";
    return {
        isNavigated: function (sNavigatedItemId, sItemId) {
            return sNavigatedItemId == sItemId;
        },
        showHideFullScreen: function (val1, val2) {
            return (val1 != null && val2 != null) ? true : false;
        },
        dateFormat: function (date) {
            if (date)
                return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", "-");
        },
        contactType: function (value, data) {
            if (value)
                return data.find(e => e.value == value).description;
        }
    };
});