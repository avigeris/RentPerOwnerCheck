var Sdk = window.Sdk || {};
(function (){


    this.fromOnLoad = function(executionContext){

    }

    this.PriceCalculate = function(executionContext){
        var formContext = executionContext.getFormContext();    
        var crc6f_reservedpickup = formContext.getAttribute("crc6f_reservedpickup").getValue();
        var crc6f_reservedhandover = formContext.getAttribute("crc6f_reserved_handover").getValue();
        var crc6f_pickuplocation = formContext.getAttribute("crc6f_pickuplocation").getValue();
        var crc6f_return_location = formContext.getAttribute("crc6f_return_location").getValue();
    
        if (crc6f_pickuplocation != null && crc6f_reservedhandover != null && crc6f_reservedpickup != null && crc6f_return_location != null){
            if (formContext.getAttribute("crc6f_car_class").getValue() != null && formContext.getAttribute("crc6f_car_class").getValue()[0].id != null) {
                var carclassid = formContext.getAttribute("crc6f_car_class").getValue()[0].id;
         
                //pass entity, fields, we can use expand to get related entity fields
                Xrm.WebApi.retrieveRecord("crc6f_car_class", carclassid, "?$select=crc6f_price").then(
                function success(result) {
                    if (result != null) {
                    //set text field
                    if (result.crc6f_price != null)
                    {
                        var price = result.crc6f_price*dateDiffInDays(crc6f_reservedpickup, crc6f_reservedhandover);
                        if (crc6f_pickuplocation != 3){
                            price = price + 100;
                        }
                        if (crc6f_return_location != 3){
                            price = price + 100;
                        }
                        formContext.getAttribute("crc6f_price").setValue(price);
                    }
    
                    }
                },
                function(error) {
                    alert(error.message);
                }
                );
            }
        }
    }
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

}).call(Sdk);