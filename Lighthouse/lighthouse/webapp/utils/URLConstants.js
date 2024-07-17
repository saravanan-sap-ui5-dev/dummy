sap.ui.define([], function () {
    "use strict";
    return {
        URL: {
            app_end_point: "http://localhost:8080/",
            login: "login",
            enumerators: "enumerators",
            attachments_by_filter: "attachments/filter",
            attachments: "attachments",
            attachments_delete_by_module: "attachments/delete",
            read_attahcment: "attachments/read",

            /* Application configuration */
            app_config: "app_config",
            add_app_config: "app_config/add",

            /* Users */
            users_all: "users",
            user_by_id: "users/{id}",

            /* Shipping Line */
            shipping_line_all: "shippingLine/filter",
            shipping_line_add: "shippingLine/add",
            shipping_line_update: "shippingLine/update",
            shipping_line_by_id: "shippingLine/{id}",

            /* Port Code */
            port_code_filter:"portCode/filter",
            port_code_by_id: "portCode/{id}",
            port_code_add: "portCode/add",
            port_code_update: "portCode/update",

            /* Vessel */
            vessel_all: "vessel/filter",
            vessel_add: "vessel/add",
            vessel_by_id: "vessel/{id}",

            /* Cargo Type */
            cargo_type_filter: "cargoType/filter",
            cargo_type_add: "cargoType/add",
            cargo_type_by_id: "cargoType/{id}",

            /* IMCO */
            imo_filter: "imo/filter",
            imo_add: "imo/add",
            imo_by_id: "imo/{id}",

            /* Container Type */
            container_type_all: "ContainerType/filter",
            container_type_add: "ContainerType/add",
            container_type_by_id: "ContainerType/{id}",

            /* Hs Code */
            hs_code_all: "HsCode/filter",
            hs_code_add: "HsCode/add",
            hs_code_by_id: "HsCode/{id}",

            /*Customs Package Code */
            customs_package_code_all: "CustomsPackageCode/filter",
            customs_package_code_add: "CustomsPackageCode/add",
            customs_package_code_by_id: "CustomsPackageCode/{id}",

            /*Containers */
            containers_all: "containers/filter",
            containers_add: "containers/add",
            containers_by_id: "containers/{id}",

            /*Customers */
            customers_all: "customers/filter",
            customers_add: "customers/add",
            customers_edit: "customers/edit",
            customers_by_id: "customers/{id}",

            /* Voyages */
            voyages_all: "voyage/filter",
            voyages_add: "voyage/add",
            voyages_edit: "voyage/edit",
            voyages_by_id: "voyage/{id}",

            /* shipment */
            shipment_all: "shipment/filter",
            shipment_add: "shipment/add",
            shipment_edit: "shipment/edit",
            shipment_by_id: "shipment/{id}",

            /* Container in use */
            container_in_use_all: "containerInUse/filter",
            container_in_use_add: "containerInUse/add",
            container_in_use_by_id: "containerInUse/{id}",

            /* Minimal Master Data */
            min_shipping_line: "minMasterData/shippingLine",
            min_vessel: "minMasterData/vessel",
            min_container_type: "minMasterData/containerType"

        },
        Paging: {
            page_size: 20,
            top: 20
        },
        moduleId: {
            customer: 19,
            vessel: 21,
            container_type: 23,
            containers: 24,
            cargo_type: 25,
            imco: 26,
            hs_code: 27,
            customs_pakcage_code: 28,
            voyage: 1,
            Containers_In_Use: 5
        }

    };
});