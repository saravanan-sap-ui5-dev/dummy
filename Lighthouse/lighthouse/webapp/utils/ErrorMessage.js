sap.ui.define([
    "com/lighthouse/init/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/core/message/Message',
    'sap/ui/core/library',
    'sap/ui/core/Core',
    'sap/ui/core/Element',
    'sap/m/MessageToast',
    'sap/m/Link',
], function (BaseController, JSONModel, MessagePopover, MessageItem, Message, coreLibrary, Core, Element, MessageToast, Link) {
    "use strict";
    var MessageType = coreLibrary.MessageType;
    var oMessagePopover;

    return {
        formValidation: function (formId, model, pageId) {
            model.setData([]);
            //validation : All Validations are basic and empty validation only if you want further customization
            // please add your created component below in this switch case
            //Available components are input, text area, step input, masked input, multi input, check box, combo box, 
            //multicombo box, select field, date picker, date time picker, date range selection.
            var oErrorData = [];
            var formContent = formId.getContent();
            var constraintValidation = (function (value, constraintType, inputType, exception, ele) {
                //For Constraint input field
                try {
                    constraintType.validateValue(value);
                } catch (oException) {
                    exception = oException.message;
                    var msg = {
                        type: 'Error',
                        active: true,
                        title: exception,
                        subtitle: 'Enter valid' + " " + inputType,
                        control: ele,
                        page: pageId
                    };
                    ele.setValueState("Error");
                    ele.setValueStateText(exception);
                    oErrorData.push(msg);
                } finally {
                    if (exception == null) {
                        hideError(ele);
                    } else {
                        ele.setValueState("Error");
                        ele.setValueStateText(exception.message);
                    }
                }
            });
            var hideError = (function (ele) {
                ele.setValueState();
                ele.setValueStateText();
            });
            var showError = (function (ele) {
                ele.setValueState("Error");
                ele.setValueStateText("Enter valid value");
            });
            formContent.forEach(function (ele) {
                if (ele.getCustomData().length > 0) {
                    let value,
                        selKey,
                        constraintType,
                        inputType,
                        exception,
                        selKeys,
                        selTokens,
                        isSelected;
                    let eleType = ele.getCustomData()[0].getValue();//ele.getAccessibilityInfo().type;
                    switch (eleType) {
                        //Input Type Components only starting
                        case 'Input':
                            value = ele.getValue();
                            constraintType = ele.getBindingInfo('value').type;
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value != undefined && value != "" && constraintType != undefined) {
                                //For Constraint input field
                                constraintValidation(value, constraintType, inputType, exception, ele);
                            } else if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'TextArea':
                            value = ele.getValue();
                            constraintType = ele.getBindingInfo('value').type;
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value != undefined && value != "" && constraintType != undefined) {
                                //For Constraint input field
                                constraintValidation(value, constraintType, inputType, exception, ele);
                            } else if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'MultiInput':
                            selTokens = ele.getTokens();
                            inputType = ele.getLabels()[0].getText();
                            if (selTokens == 0) {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'MaskInput':
                            value = ele.getValue();
                            constraintType = ele.getBindingInfo('value').type;
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value != undefined && value != "" && constraintType != undefined) {
                                //For Constraint input field
                                constraintValidation(value, constraintType, inputType, exception, ele);
                            } else if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'StepInput':
                            value = ele.getValue();
                            inputType = ele.getLabels()[0].getText();
                            if (value == undefined || value == "" || value == "0") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        //Input Type Ending
                        //Drop Down Fields
                        case 'ComboBox':
                            value = ele.getValue();
                            inputType = ele.getLabels()[0].getText();
                            if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please select the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'Select':
                            selKey = ele.getSelectedKey();
                            inputType = ele.getLabels()[0].getText();
                            if (selKey == undefined || selKey == "" || selKey == "-1") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please select the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'MultiComboBox':
                            selKeys = ele.getSelectedKeys();
                            inputType = ele.getLabels()[0].getText();
                            if (selKeys == 0) {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please select the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        //Check Box Only
                        case 'CheckBox':
                            isSelected = ele.getSelected();
                            inputType = ele.getText();
                            if (!isSelected) {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Select the checkbox",
                                    subtitle: "Please indicate that you accept the Terms and Conditions",
                                    control: ele,
                                    page: pageId
                                };
                                ele.setValueState("Error");
                                oErrorData.push(msg);
                            } else {
                                ele.setValueState();
                            }
                            break;
                        //Date Fields Validation Starting
                        case 'DatePicker':
                            value = ele.getValue();
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'DateTimePicker':
                            value = ele.getValue();
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'DateRangeSelection':
                            value = ele.getValue();
                            inputType = ele.getLabels()[0].getText();
                            exception = null;
                            if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Enter valid value",
                                    subtitle: 'Please fill the' + " " + inputType + " " + "field!",
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                        case 'FileUploader':
                            value = ele.getValue();
                            inputType = "File";//ele.getLabels()[0].getText();
                            exception = null;
                            if (value == undefined || value == "") {
                                //For Without Constraint inputs
                                var msg = {
                                    type: 'Error',
                                    active: true,
                                    title: "Choose valid file",
                                    subtitle: 'Please upload the file!',
                                    control: ele,
                                    page: pageId
                                };
                                showError(ele);
                                oErrorData.push(msg);
                            } else {
                                hideError(ele);
                            }
                            break;
                    }
                }
            });
            model.setData(oErrorData);
        },
        removeValueState: function (formId, model) {
            model.setData([]);
            var formContent = formId.getContent();
            formContent.forEach(function (ele) {
                if (ele.getCustomData().length > 0) {
                    ele.setValueState();
                }
            });
        }
    };
});
