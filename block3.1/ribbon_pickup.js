function ribbon_pickup(primaryControl) {
    var formContext=primaryControl;
    var entityFormOptions = {};
    entityFormOptions["entityName"] = "crc6f_cartransferreport";
    entityFormOptions["useQuickCreateForm"] = true;
    var formParameters = {};

    var lookupObject = formContext.getAttribute("crc6f_car"); //get the Lookup Object 
    if (lookupObject != null) { 
    var lookupObjectValues = lookupObject.getValue();//get the Lookup Value 
    if (lookupObjectValues != null) {
        formParameters["crc6f_car"] = lookupObjectValues[0].id;
        formParameters["crc6f_carname"] = lookupObjectValues[0].name;
    }
    }
    formParameters["crc6f_date"] = formContext.getAttribute("crc6f_reservedpickup").getValue();
    formParameters["crc6f_type"] = 0;
    //Xrm.Utility.openQuickCreate("msdyn_payment", parentCase , formParameters).then(
    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
        function (success) {
            console.log(success);

            //set lookup for rent
            var lookupValue = new Array();
		    lookupValue[0] = new Object();
		    lookupValue[0].id = success.savedEntityReference[0].id;
		    lookupValue[0].name = success.savedEntityReference[0].name;
		    lookupValue[0].entityType = success.savedEntityReference[0].entityType;
            formContext.getAttribute("crc6f_pickup_report").setValue(lookupValue);

            //actual pickup 
            formContext.getAttribute("crc6f_actual_pickup").setValue(new Date());
        },
        function (error) {
            console.log(error);
        });
}



