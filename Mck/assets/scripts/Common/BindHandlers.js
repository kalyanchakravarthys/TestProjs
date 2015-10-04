ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: . ,
                //(event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
    }
};

//ko.validation.rules.pattern.message = 'Invalid.';

//ko.validation.configure({
//    registerExtenders: true,
//    messagesOnModified: true,
//    errorsAsTitleOnModified: true, // shows the error when hovering the input field (decorateElement must be true)
//    messageTemplate: null,
//    insertMessages: true,           // automatically inserts validation messages as <span></span>
//    parseInputAttributes: false,    // parses the HTML5 validation attribute from a form element and adds that to the object
//    writeInputAttributes: false,    // adds HTML5 input validation attributes to form elements that ko observable's are bound to
//    decorateElement: true,         // false to keep backward compatibility
//    errorClass: null,               // single class for error message and element
//    errorElementClass: 'validationMessageBorder',  // class to decorate error element
//    errorMessageClass: 'validationMessage',  // class to decorate error message
//    grouping: {
//        deep: true,        //by default grouping is shallow
//        observable: true    //and using observables
//    }
//});



ko.validation.rules['requiresOneOf'] = {
    getValue: function (obs) {
        return (typeof obs === 'function' ? obs() : obs);
    },
    validator: function (val, fields) {
        var self = this;
        var result = false;
        ko.utils.arrayForEach(fields, function (field) {
            if (self.getValue(field)) {
                result = true;
            }
        });

        return result;
    },
    message: 'Must select one option'
};
ko.validation.registerExtenders();


ko.bindingHandlers.modal = {
    init: function (element, valueAccessors) {
        var options = ko.utils.unwrapObservable(valueAccessors() || {});
        $(element).modal(options);
    },
    update: function (element, valueAccessors) {
        var options = ko.utils.unwrapObservable(valueAccessors() || {});

        $(element).modal(options.show() ? 'show' : 'hide');
    }
};


var jQueryWidget = function (element, valueAccessor, name, constructor) {
    var options = ko.utils.unwrapObservable(valueAccessor());
    var $element = $(element);
    setTimeout(function () { constructor($element, options) }, 0);
    //$element.data(name, $widget);


};

ko.bindingHandlers.dialog = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        console.log("init");
        jQueryWidget(element, valueAccessor, 'dialog', function ($element, options) {
            console.log("Creating dialog on " + $element);
            return $element.dialog(options);
        });
    },
    //update: function (element, valueAccessor, allBindingsAccessor) {
    //    //  var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible),
    //    $el = $(element),
    //    dialog = $el.data("uiDialog") || $el.data("dialog");
       
    //    //don't call open/close before initilization
    //    if (dialog) {
    //        $el.dialog(shouldBeOpen ? "open" : "close");
    //    }
    //}
};


//ko.bindingHandlers.datepicker = {
//    init: function (element, valueAccessor, allBindingsAccessor) {
//        var options = allBindingsAccessor().datepickerOptions || {},
//            $el = $(element);

//        //initialize datepicker with some optional options
//        $el.datepicker(options);

//        //handle the field changing
//        ko.utils.registerEventHandler(element, "change", function () {
//            var observable = valueAccessor();
//            observable($el.datepicker("getDate"));
//        });

//        //handle disposal (if KO removes by the template binding)
//        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//            $el.datepicker("destroy");
//        });

//    },
//    update: function (element, valueAccessor) {
//        var value = ko.utils.unwrapObservable(valueAccessor()),
//            $el = $(element),
//            current = $(element).val();

//        if (value - current !== 0) {
//            $el.datepicker("setDate", value);
//        }
//    }
//};


//ko.bindingHandlers.datepicker = {
//    init: function (element, valueAccessor, allBindingsAccessor) {
//        //initialize datepicker with some optional options
//        var options = allBindingsAccessor().datepickerOptions || {};
//        $(element).datepicker(options);

//        //when a user changes the date, update the view model
//        ko.utils.registerEventHandler(element, "changeDate", function (event) {
//            var value = valueAccessor();
//            if (ko.isObservable(value)) {
//                value(event.date);
//            }
//        });
//    },
//    update: function (element, valueAccessor) {
//        var widget = $(element).data("datepicker");
//        //when the view model is updated, update the widget
//        if (widget) {
//            widget.date = ko.utils.unwrapObservable(valueAccessor());
//            widget.setValue();
//        }
//    }
//};


/* Adds the binding dateValue to use with bootstra-datepicker
   Usage :
   <input type="text" data-bind="dateValue:birthday"/>
   <input type="text" data-bind="dateValue:birthday,format='MM/DD/YYY'"/>

 */
//ko.bindingHandlers.kendoDatePicker = {

//    init: function (element, valueAccessor, allBindings) {
//        var format;
//        var defaultFormat = 'yyyy/mm/dd'
//        if (typeof allBindings == 'function') {
//            format = allBindings().format || defaultFormat;
//        }
//        else
//            format = allBindings.get('format') || defaultFormat;

//        var dpicker = $(element).datepicker({
//            'format': format
//        }).on('changeDate', function (ev) {
//            var newDate = moment(new Date(ev.date));
//            var value = valueAccessor();
//            var currentDate = moment(value() || new Date);
//            newDate.hour(currentDate.hour());
//            newDate.minute(currentDate.minute());
//            newDate.second(currentDate.second());
//            value(newDate.toDate());

//        });
//    },
//    update: function (element, valueAccessor, allBindingsAccessor) {
//        var date = ko.unwrap(valueAccessor());
//        if (date) {
//            $(element).datepicker('setDate', date);
//        }
//    }
//}


//------------------Date Picker Knockout Custom Binding
ko.bindingHandlers.kendoDatePicker = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var unwrap = ko.utils.unwrapObservable;
        var dataSource = valueAccessor();
        var binding = allBindingsAccessor();
        var options = {};
        var source;

        if (binding.datePickerOptions) {
            options = $.extend(options, binding.datePickerOptions);
        }

        if (dataSource) {
            var handleValueChange = function () {
                //change the knockout model object with the specified value
                var changeModel = function (value) {
                    if (ko.isWriteableObservable(dataSource)) {
                        //Since this is an observable, the update part will fire and select the 
                        //  appropriate display values in the controls
                        dataSource(value);
                    } else {  //write to non-observable
                        if (binding['_ko_property_writers'] && binding['_ko_property_writers']['kendoDatePicker']) {
                            binding['_ko_property_writers']['kendoDatePicker'](value);
                        }
                    }
                };

                //Get the selected Value from the Kendo ComboBox
                var selectedValue = this.value();
                //If they dont select anything, then there intent is to null out the value
                if (!selectedValue) {
                    changeModel(null);
                } else {
                    changeModel(selectedValue);
                }
                return false;
            };
            options.change = handleValueChange;
        }

        //handle the choices being updated in a Dependant Observable (DO), so the update function doesn't 
        // have to do it each time the value is updated. Since we are passing the dataSource in DO, if it is
        // an observable, when you change the dataSource, the dependentObservable will be re-evaluated
        // and its subscribe event will fire allowing us to update the autocomplete datasource
        var mappedSource = ko.dependentObservable(function () {
            return unwrap(dataSource);
        }, viewModel);
        //Subscribe to the knockout observable array to get new/remove items
        mappedSource.subscribe(function (newValue) {
            var datePicker = $(element).data('kendoDatePicker');
            if (datePicker != undefined && datePicker.value() != newValue)
                datePicker.value(newValue);
        });

        options.value = mappedSource();
        $(element).kendoDatePicker(options);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        //update value based on a model change
        var unwrap = ko.utils.unwrapObservable;
        var dataSource = valueAccessor();
        var binding = allBindingsAccessor();
        var valueProp = unwrap(binding.optionsValue);
        var labelProp = unwrap(binding.optionsText) || valueProp;

        if (dataSource) {
            var currentModelValue = unwrap(dataSource);
            if (binding.enable) {
                if (binding.enable()) {
                    $(element).data("kendoDatePicker").enable(true);
                }
                if (!binding.enable()) {
                    $(element).data("kendoDatePicker").enable(false);
                }
            }
            if (dataSource)
                $(element).data('kendoDatePicker').value(currentModelValue);
            else
                $(element).data('kendoDatePicker').value('');
        }
    }
};

//ko.bindingHandlers.datepicker = {
//    init: function (element, valueAccessor, allBindingsAccessor) {
//        //initialize datepicker with some optional options
//        var options = allBindingsAccessor().datepickerOptions || {};
//        $(element).datepicker(options);

//        //handle the field changing
//        ko.utils.registerEventHandler(element, "change", function () {
//            var observable = valueAccessor();
//            observable($(element).datepicker("getDate"));
//        });

//        //handle disposal (if KO removes by the template binding)
//        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
//            $(element).datepicker("destroy");
//        });

//    },
//    //update the control when the view model changes
//    update: function (element, valueAccessor) {
//        var value = ko.utils.unwrapObservable(valueAccessor()),
//            current = $(element).datepicker("getDate");

//        if (value - current !== 0) {
//            $(element).datepicker("setDate", value);
//        }
//    }
//};

Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    var y = this.getFullYear();
    return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0));
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
//Binding handler for accept only alphabets
ko.bindingHandlers.alphabetic = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow:a-z
                (event.keyCode >= 97 && event.keyCode <= 122) ||
                //Allow:A-Z
                (event.keyCode >= 65 && event.keyCode <= 90)) {
                // let it happen, don't do anything
                //var caps = $(element).val().toUpperCase();
                //return $(element).val(caps);
                return;
            }
            else {
                // Ensure that it is a alphabet and stop the keypress
                if (event.shiftKey ||(event.keyCode < 65 || event.keyCode > 90) && (event.keyCode < 97 || event.keyCode > 122)) {
                    event.preventDefault();
                }
            }
        });
        
    }
};

//Binding handler for make uppercase
ko.extenders.uppercase = function (target, option) {
    target.subscribe(function (newValue) {
        target(newValue.toUpperCase());
    });
    return target;
};

ko.bindingHandlers.PreventSpecial = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace
            if (event.keyCode == 46 || event.keyCode == 8 ) {
                // let it happen, don't do anything
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || event.ctrlKey ||(event.keyCode != 46 || event.keyCode !=8)) {
                    event.preventDefault();
                }
            }
        });
    }
};




//Binding handler for accept only alphabets
ko.bindingHandlers.alphanumeric = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow:0-9 in numeric keypad
                (event.keyCode >= 96 && event.keyCode <= 105) ||
                //Allow:A-Z
                (event.keyCode >= 65 && event.keyCode <= 90) ||
                //allow left,right,up and down keys
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                return;
            }
            else {
                // Ensure that it is a alphabet and stop the keypress
                if (event.shiftKey || ( event.keyCode > 90||event.keyCode<48) && (event.keyCode < 96 || event.keyCode > 105||event.keyCode>57)) {
                    event.preventDefault();
                }
            }
            //
            //var keyCode = event.keyCode || event.which
            //// Don't validate the input if below arrow, delete and backspace keys were pressed 
            //if (keyCode == 8 || (keyCode >= 35 && keyCode <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            //    return;
            //}

            //var regex = new RegExp("^[a-zA-Z0-9]+$");
            //var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            //if (!regex.test(key)) {
            //    event.preventDefault();
            //    return false;
            //}
        });
        //

    }
};

//Binding handler for accept only alphabets
ko.bindingHandlers.AlphanumericCommaSpace = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow:0-9 in numeric keypad
                (event.keyCode >= 96 && event.keyCode <= 105) ||
                //Allow:A-Z
                (event.keyCode >= 65 && event.keyCode <= 90) ||
                //allow left,right,up and down keys
                (event.keyCode >= 35 && event.keyCode <= 39) ||
                //allow space
                (event.keyCode == 32) ||
                //allow comma
                (event.keyCode == 188)
                ) {
                return;
            }
            else {
                // Ensure that it is a alphabet and stop the keypress
                if (event.shiftKey || (event.keyCode > 90 || event.keyCode < 48) && (event.keyCode < 96 || event.keyCode > 105 || event.keyCode > 57)) {
                    event.preventDefault();
                }
            }
            //
            //var keyCode = event.keyCode || event.which
            //// Don't validate the input if below arrow, delete and backspace keys were pressed 
            //if (keyCode == 8 || (keyCode >= 35 && keyCode <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            //    return;
            //}

            //var regex = new RegExp("^[a-zA-Z0-9]+$");
            //var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            //if (!regex.test(key)) {
            //    event.preventDefault();
            //    return false;
            //}
        });
        //

    }
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
ko.extenders.formatMoney = function (target, option) {
    target.subscribe(function (newValue) {
        target(numberWithCommas(newValue));
    });
    return target;
};




