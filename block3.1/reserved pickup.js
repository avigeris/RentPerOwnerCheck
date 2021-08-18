

var Sdk = window.Sdk || {};
(function (){


    this.fromOnLoad = function(executionContext){

    }

    this.ReservedPickupOnChange = function(executionContext){
        var formContext = executionContext.getFormContext();
        var datefield= formContext.getAttribute("crc6f_reservedpickup").getValue();
        if (datefield != null) {
            var today = new Date();
            var todayyear = today.getFullYear() + "";
            var todaymonth = (today.getMonth() + 1) + "";
            var todayday = today.getDate() + "";
            var todaydate = new Date(todayyear, todaymonth, todayday);

            var dateyear = datefield.getFullYear() + "";
            var datemonth = (datefield.getMonth() + 1) + "";
            var dateday = datefield.getDate() + "";
            var datefielddate = new Date(dateyear, datemonth, dateday);

            if(datefielddate < todaydate){
                formContext.getAttribute("crc6f_reservedpickup").setValue(null);
                formContext.getControl("crc6f_reservedpickup").setNotification("Reserved pickup date/time cannot be earlier than current date.");
            } else {

                Xrm.Page.getControl("crc6f_reservedpickup").clearNotification();
        
            }

        } else {

            Xrm.Page.getControl("crc6f_reservedpickup").clearNotification();
    
        }
    
    }
}).call(Sdk);


