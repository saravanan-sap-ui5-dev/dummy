sap.ui.define([
    "sap/ui/model/json/JSONModel",
], function (JSONModel) {
    "use strict";
    return {
        onPressUpload: async function (oEvent, oView, that) {
            let oKey = oEvent.getSource().getCustomData()[0].getValue();
            oView.setModel(new JSONModel({ key: oKey }), "attachmentType");
            let oDialog = await that.onOpenDialog("com.lighthouse.init.fragment.attachment.AddAttachment");
            if (oKey == 1) {
                oDialog.setTitle("Add Link");
            } else if (oKey == 2) {
                oDialog.setTitle("Upload");
            }
        },
        onUploadAttachment: async function (oEvent, oView, cModel, that) {
            let newFile;
            let oKey = oView.getModel("attachmentType").getData().key;
            let data = cModel?.getData();
            let description = data?.description;
            let name = data?.name;
            if (oKey == 2) {
                newFile = await that.newFile;
                if (newFile) {
                    newFile.statuses.forEach(e => {
                        /*  if (e.title == "Description") {
                             e.text = description
                         } */
                        (e.title == "Description" ? e.text = description : "");
                        (e.title == "Name" ? e.text = name : "");
                    });
                }
            } else if (oKey == 1) {
                newFile = {
                    "fileName": data.name,
                    "url": data.url,
                    "thumbnailUrl": "sap-icon://chain-link",
                    "statuses": [
                        {
                            "title": "Type",
                            "text": "Link",
                            "active": false
                        },
                        {
                            "title": "Name",
                            "text": name,
                            "active": false
                        },
                        {
                            "title": "Description",
                            "text": description,
                            "active": false
                        }
                    ],
                    "selected": false
                };
            }

            return newFile;
        },
        onFileChange: function (oEvent, oView, that) {
            let oSource = oEvent.getSource();
            let oFile = oEvent.getParameter("files")[0];
            that.newFile = this.getFileObject(oSource, oFile);
        },
        getFileObject: async function (oSource, oFile) {

            let getFile = await this.readFile(oFile);
            let localSerPath = URL.createObjectURL(oFile);
            let nFile = {
                "fileName": oFile.name,
                "mediaType": oFile.type,
                "mimeType": oFile.name.slice((oFile.name.lastIndexOf(".")) + 1, oFile.name.length),
                "url": localSerPath,
                "src": getFile,
                "uploadState": null,
                "statuses": [
                    {
                        "title": "Type",
                        "text": "Document",
                        "active": false
                    },
                    {
                        "title": "Name",
                        "text": null,
                        "active": false
                    },
                    {
                        "title": "Path",
                        "text": localSerPath,
                        "active": true
                    },
                    {
                        "title": "Description",
                        "text": null,
                        "active": false
                    }
                ],
                "selected": false
            };
            return nFile;
        },
        readFile1: async function (oFile) {
            return new Promise((resolve, reject) => {
                let src = "";
                if (oFile && oFile.length > 0) {
                    let file = oFile;
                    let fileType = file.type;

                    let fr = new FileReader();
                    fr.onload = function () {
                        let index = fr.result.indexOf(";base64,") + 8;
                        let base64Image = fr.result.slice(index, fr.result.length);
                        src = base64Image;
                        resolve(src);
                    };
                    fr.onerror = function () {
                        reject(new Error("Failed to read the file."));
                    };
                    fr.readAsDataURL(oFile);
                } else {
                    reject(new Error("No files selected."));
                }
            });
        },
        readFile: function (file) {
            return new Promise((resolve, reject) => {
                let src = "";
                const reader = new FileReader();

                reader.onload = res => {
                    let result = res.target.result;
                    let index = result.indexOf(";base64,") + 8;
                    let base64Image = result.slice(index, result.length);
                    src = base64Image;
                    resolve(src);
                };
                reader.onerror = err => reject(err);

                //reader.readAsText(file);
                reader.readAsDataURL(file);
            });
        },
    };
});