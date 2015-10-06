ko.extenders.ZeroMinutesValidation = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var Hours = options.Hours;
        var result = ((newValue == 1 || newValue == 0 || newValue == undefined || newValue == "") && (options.Hours == 0 || options.Hours == undefined || Hours == "")) ? false : true;
        var errMessage = options.message;
        if (newValue == undefined) {
            result = false;
            errMessage = options.requiredMessage;
        }
        target.hasError(result ? false : true);
        target.validationMessage(result ? "" : errMessage || "This field is required");
        target.error = result ? "" : errMessage || "This field is required";
        if (target.__valid__ != undefined)
            target.__valid__(result ? true : false);
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};

ko.extenders.ZeroMinutesisUserValidation = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validateuser(newValue) {
        var Hours = options.Hours;
        var isValidate = options.isValidate;
        var result = ((newValue == 1 || newValue == 0 || newValue == undefined || newValue == "") && ((options.Hours == 0 || options.Hours == undefined || Hours == "") && isValidate)) ? false : true;
        var errMessage = options.message;
        if (newValue == undefined && isValidate) {
            result = false;
            errMessage = options.requiredMessage;
        }
        target.hasError(result ? false : true);
        target.validationMessage(result ? "" : errMessage || "This field is required");
        target.error = result ? "" : errMessage || "This field is required";
        if (target.__valid__ != undefined)
            target.__valid__(result ? true : false);
    }

    //initial validation
    validateuser(target());

    //validate whenever the value changes
    target.subscribe(validateuser);

    //return the original observable
    return target;
};

ko.extenders.DateComparison = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var result = true;
        var compareDate = moment(options.ComparedToDate) && moment(options.ComparedToDate)._d ? moment(options.ComparedToDate)._d : undefined;
        if (options.ComparisonType == "Lesser") {
            result = (options.ComparedToDate == null || newValue == null || options.ComparedToDate == "" || newValue == "" || options.ComparedToDate == undefined || newValue == undefined || moment(newValue)._d > moment(compareDate)._d) ? true : false;
        }
        else if (options.ComparisonType == "Greater") {
            result = (options.ComparedToDate == null || newValue == null || options.ComparedToDate == "" || newValue == "" || options.ComparedToDate == undefined || newValue == undefined || moment(newValue)._d < moment(compareDate)._d) ? true : false;
        }
        var errMessage = options.message;
        target.hasError(result ? false : true);
        target.validationMessage(result ? "" : errMessage || "This field is required");
        if (!target.valMessage)
            target.valMessage = ko.observable();
        target.valMessage(result ? "" : errMessage || "This field is required");
        target.error = result ? "" : errMessage || "This field is required";
        if (target.__valid__ != undefined)
            target.__valid__(result ? true : false);
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};


ko.extenders.DayNotIn = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
        var result = true;//No Error status
        var notInDays = options && options.NotInDays ? options.NotInDays : [0];
        var IsManditory = options && options.IsManditory ? options.IsManditory() : false;
        var isMonthly = options && options.IsMonthly ? options.IsMonthly : false;
        var errMessage = "";
        if (newValue != null && isMonthly && IsManditory) {
            var day = moment(newValue) && moment(newValue)._d && moment(newValue)._d.getDate() ? moment(newValue)._d.getDate() : 30;
            for (i = 0; i < notInDays.length; i++) {
                if (day == notInDays[i]) {
                    result = false;//Error Found.
                    errMessage = options && options.InvalidDateMessage ? options.InvalidDateMessage : "This date is not allowed";
                }
            }
        }
        else {
            if (IsManditory && newValue == null) {
                result = false;//Error Found.
                errMessage = options && options.ManditoryMessage ? options.ManditoryMessage : "This field is required";
            }
        }

        target.hasError(result ? false : true);
        target.validationMessage(result ? "" : errMessage || "This field is required");
        if (!target.valMessage)
            target.valMessage = ko.observable();
        target.valMessage(result ? "" : errMessage || "This field is required");
        target.error = result ? "" : errMessage || "This field is required";
        if (target.__valid__ != undefined)
            target.__valid__(result ? true : false);
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};

var popupNotification;

function CreateNewPopupNotification(popupNotification) {

    popupNotification = $("#notification").kendoNotification({
        autoHideAfter: 0,
        //stacking: "down",
        show: onShow,
        templates: [
            {
                type: "error",
                template: $("#errorTemplate").html()
            }, {
                type: "upload-success",
                template: $("#successTemplate").html()
            }]
    }).data("kendoNotification");

    return popupNotification;
}

popupNotification = CreateNewPopupNotification(popupNotification);

function Notify(_message, _type, _title) {
    _title = _title ? _title : "Info";
    _type = _type.toUpperCase() == "SUCCESS" ? "upload-success"
            : _type.toUpperCase() == "ERROR" ? "error"
            : "error";

    //popupNotification.show(message, "error");

    popupNotification.hide();

    popupNotification = CreateNewPopupNotification(popupNotification);

    popupNotification.show({
        title: _title,
        message: _message
    }, _type);
    $("#mesh").css("height", $("body").css("height"));
    $("#mesh").show();

}


function onShow(e) {
    if (!$("." + e.sender._guid)[1]) {
        var element = e.element.parent(),
            eWidth = element.width(),
            eHeight = element.height(),
            wWidth = $(window).width(),
            wHeight = $(window).height(),
            newTop, newLeft;

        newLeft = Math.floor(wWidth / 2 - eWidth / 2);
        newTop = Math.floor(wHeight / 2 - eHeight / 2);

        e.element.parent().css({ top: newTop, left: newLeft });
    }
}

ko.extenders.requiredField = function (target, message) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        target.hasError(newValue ? false : true);
        target.validationMessage(newValue ? "" : message || "* required");
    }

    validate(target());
    target.subscribe(validate);

    return target;
};

function HideMesh() {
    $("#mesh").hide();
}

function UpdateMinutesOnHoursChange(Hours, Minutes) {
    if (Hours() != "" && Hours() != undefined && Hours() > 0)
        if (Minutes() == undefined || Minutes() == null || Minutes() == "")
            Minutes(1);
}

function PrintPopup(options) {
    $(".panel").first().hide();
    window.print();
    $(".panel").show();
}

function GetAvailableButtons() {
    var availableBts = [];
    $(".btn-default,  .btn-primary,  .btn-success,  .btn-info,  .btn-warning, .btn-danger").each(function () {
        if (this.outerHTML.indexOf("none") == -1) {
            availableBts.push(this);
        };
    })
    return availableBts;
}

function HideAvailableButtons(availableBts) {
    $(availableBts).each(function () {
        $(this).hide();
    })
}

function ShowAvailableButtons(availableBts) {
    $(availableBts).each(function () {
        $(this).show();
    })
}

function PrintScreen(PageSize) {
    var originalWidth = $(".panel-body").css("width");
    if (PageSize == "A4") {
        $(".panel-body").css("width", "960px");
    }
    var availableButtons = [];
    availableButtons = GetAvailableButtons();
    HideAvailableButtons(availableButtons);
    window.print();
    ShowAvailableButtons(availableButtons);
    if (PageSize == "A4") {
        $(".panel-body").css("width", originalWidth);
    }
}

function ClientContactChange(ClientID, jsonLoadData) {
    var values = [];
    var arraytofilter = ko.observableArray([]);
    try {
        arraytofilter = ko.observableArray(jsonLoadData.lstClientContactDTO);
    }
    catch (e) {
        arraytofilter = ko.observableArray(jsonLoadData.lstClientContactDTO());
    }
    if (ClientID) {
        var values = ko.observableArray(ko.utils.arrayFilter(arraytofilter(), function (item) {
            if (item.ClientID === ClientID) {
                return item;
            }
        }));
        jsonLoadData.lstFilteredClientContacts.removeAll();
        ko.utils.arrayPushAll(jsonLoadData.lstFilteredClientContacts, values());
        jsonLoadData.lstFilteredClientContacts.valueHasMutated();
    }
};

function GetDescByID(Id, obsArray, strId) {
    var values = [];
    var arraytofilter = ko.observableArray([]);
    try {
        arraytofilter = ko.observableArray(obsArray);
    }
    catch (e) {
        arraytofilter = ko.observableArray(obsArray);
    }
    if (Id) {
        var values = ko.observableArray(ko.utils.arrayFilter(arraytofilter(), function (item) {
            if (eval("item." + strId) === Id) {
                return item;
            }
        }));

    }
    return values;
}

ko.extenders.DueDateValidation = function (target, options) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
    var dDate = options.DueDate;
    var dDateLater = options.DueDateLater;
    var isManditory = options.IsManditory;
    var ValidationRequired = options.ValidationRequired == undefined || options.ValidationRequired ? true : false;
    //define a function to do validation
    function validate(newValue) {
        if (ValidationRequired) {
            var result = newValue == null || newValue == undefined || newValue == "" ? true : Date.parse(moment(newValue).format('MM/DD/YYYY')) >= Date.parse(moment(dDate).format('MM/DD/YYYY'));
            if (result) {
                result = newValue == null || newValue == undefined || newValue == "" || dDateLater == null || dDateLater == undefined || dDateLater == "" ? true
                            : Date.parse(moment(newValue).format('MM/DD/YYYY')) <= Date.parse(moment(dDateLater).format('MM/DD/YYYY'));
            }
            var emptyNewValue = newValue == null || newValue == undefined || newValue == "";
            if (result && emptyNewValue && isManditory) {
                result = false;
                options.message = "This field is required.";
            }

            target.hasError(result ? false : true);
            target.validationMessage(result ? "" : options.message || "The selected date is invalid.");
            if (!target.valMessage)
                target.valMessage = ko.observable();
            target.valMessage(result ? "" : options.message || "The selected date is invalid.");
            target.error = result ? "" : options.message || "The selected date is invalid.";
            if (target.__valid__ != undefined) {
                target.__valid__(result ? true : false);
            }
        }
        else {
            //Setting dummy values for removing validation.
            target.hasError(false);
            target.validationMessage("");
            if (!target.valMessage)
                target.valMessage = ko.observable();
            target.valMessage("");
            target.error = "";
            if (target.__valid__ != undefined) {
                target.__valid__(true);
            }
        }
        //}
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};


function GetMaxRoleValue() {
    var vals = [];
    $("#lstRole li").each(function () {
        vals.push($(this).text());
    });
    return Math.max.apply(Math, vals);
}

function IsCDSUser() {
    return GetMaxRoleValue() < 7;
}

function pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

var isReqProcessing = "";

$(document).ajaxStart(function (e, xhr, settings) {
    //Notify("loading", "");
    $("#cover").show();
    //kendo.ui.progress($("#body"), true);
    //-----------------FINDING-TRIGGERED-ELEMENT-STARTS--------------------------------------------------------
    var $el = $(e.target.activeElement);
    var isButtonActive = false;
    try {
        isButtonActive = e.target.activeElement.className.indexOf("btn") >= 0;
    }
    catch (e) { }
    var isButton = isButtonActive || $el.find("button").hasClass("btn") ? true : false;;

    //if (isButton) {
    //    $el.append($("#cover img"));
    //}
    //-----------------FINDING-TRIGGERED-ELEMENT-ENDS----------------------------------------------------------
    isReqProcessing = $("#ajaxReqStatus").text();
    //console.log("AJAX request is beginning with 'isReqProcessing' status: " + $("#ajaxReqStatus").text() + " at " + new Date());
    if ($("#ajaxReqStatus").text().length > 0) {
        //console.log("A request is already in process");
        e.preventDefault();
        return false;
    }
    $(this).css("background-color", "red");
    //console.log("Before = " + isReqProcessing);
    $("#ajaxReqStatus").text("Ajax Process Started");
    isReqProcessing = $("#ajaxReqStatus").text();
    //console.log("AJAX request - updated 'isReqProcessing' status: " + $("#ajaxReqStatus").text() + " at " + new Date());
    //console.log("After = " + isReqProcessing)
    var bodyHeight = $("body").css("height");
    bodyHeight = bodyHeight.substring(0, bodyHeight.indexOf("p"));
    var fullHeight = window.outerHeight > bodyHeight ? window.outerHeight : $("body").css("height");
    $("#cover").css("height", fullHeight);
    if ($(fullHeight).index("px") != -1)
        $("#imgLoading").css("top", fullHeight / 2);
    else
        $("#imgLoading").css("top", fullHeight / 2 + "px");
    


    $(this).attr("disabled", "disabled");
}).ajaxStop(function (e, xhr, settings) {
    $("#cover").hide();
    //kendo.ui.progress($("#body"), false);
    $("#ajaxReqStatus").text("");

    //-----------------FINDING-TRIGGERED-ELEMENT-STARTS--------------------------------------------------------
    var $el = $(e.target.activeElement);
    var isButton = e.target.activeElement.className.indexOf("btn") >= 0 || $el.find("button").hasClass("btn") ? true : false;
    if (isButton) {
        $el.remove("#imgLoading");
    }
    //-----------------FINDING-TRIGGERED-ELEMENT-ENDS----------------------------------------------------------
    //console.log("Cleared AJAX status 'isReqProcessing': " + $("#ajaxReqStatus").text() + " at " + new Date());
});

/*Function to find the EOA document attached or not strats*/

function IseoaAttached() {
    var flag = false;
    var currentAttachment = $(".files tr>.name a[href]").text();

    if (currentAttachment != undefined) {
        var currentEOA = $(".files tr>.name a[href]").text().toUpperCase().match(/EOA/);
    }
    else {
        var currentEOA = null;
    }

    if (currentEOA != null && currentEOA.length > 0) {
        flag = true;
    }
    if (!flag) {
        var attachedAttachment = $(".AttachedFiles a[href]").text();
        if (attachedAttachment != undefined) {
            var attachedEOA = $(".AttachedFiles a[href]").text().toUpperCase().match(/EOA/);
        }
        else {
            var attachedEOA = null;
        }

        if (attachedEOA != null && attachedEOA.length > 0) {
            flag = true;
        }
    }
    //if (typeof ($(".files tr>.name a[href*='EOA']").html()) != "undefined") {
    //    if (!($(".files tr>.name a[href*='EOA']").html().length > 0)) {

    //        //flag = true;
    //    } else {
    //        if ($(".files tr>.name a[href*='EOA']").html().length > 0) {
    //            flag = true;
    //        }
    //    }
    //}
    //if (!flag) {
    //    if (typeof ($(".AttachedFiles a[href*='EOA']").html()) != "undefined") {
    //        if (!($(".AttachedFiles a[href*='EOA']").html().length > 0)) {

    //            //flag = true;
    //        } else {
    //            if ($(".AttachedFiles a[href*='EOA']").html().length > 0) {
    //                flag = true;
    //            }
    //        }
    //    }
    //}
    return flag;
}

/*Function to find the EOA document attached or not ends*/

function SetAutocomplete(id, controllerMethodName, count) {
    $("#" + id).kendoAutoComplete({
        //dataTextField: "ProductName",
        filter: "contains",
        minLength: count,
        dataSource: {
            //type: "odata",
            serverFiltering: true,
            transport: {
                read: function (e) {
                    $.ajax({
                        cache: false,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        url: virtualdir + controllerMethodName,
                        type: 'POST',
                        data: JSON.stringify({ 'wildCard': $("#" + id).val() }),
                        async: true,
                        success: function (json) {
                            e.success(json);
                        },
                        error: function (e, xhr) {
                            Notify("Error retreiving job names!", "error");
                        }
                    });
                }
            }
        }
    });
}

//Common logic for due dates triggering extenders.. here..
function TriggerDueDateValidations(self, DeveloperRDueDateValidationMessage, BARDueDateValidationMessage, CSARDueDateValidationMessage, IsManditory, PageName) {
    var IsDevRDateValidationRequired = (PageName == "BA" || PageName == "CSA") && !IsManditory ? false : true,
        IsBaRDateValidationRequired = (PageName == "CSA") && !IsManditory ? false : true;
    var bacsaManditory = IsManditory && (PageName == "BA" || PageName == "CSA") ? true : false;
    var csaManditory = IsManditory && (PageName == "CSA") ? true : false;
    var DevDueDate = self.DeveloperDueDate && self.DeveloperDueDate()
                             && Date.parse(moment(self.DeveloperDueDate()).format('MM/DD/YYYY')) > Date.parse(moment(new Date()).format('MM/DD/YYYY'))
                             ? self.DeveloperDueDate() : new Date();
    var DevDueDateLater = self.BusinessAnalystRevisedDueDate() || self.BusinessAnalystDueDate() || self.CSARevisedDueDate() || self.CSADueDate();
    var BADueDateLater = self.CSARevisedDueDate() || self.CSADueDate();
        //Set Validation
    self.DeveloperRevisedDueDate.extend({ DueDateValidation: { DueDate: DevDueDate, DueDateLater: DevDueDateLater, message: DeveloperRDueDateValidationMessage, IsManditory: bacsaManditory, ValidationRequired: IsDevRDateValidationRequired } });

    self.BusinessAnalystRevisedDueDate.extend({
        DueDateValidation: {
            DueDate: self.DeveloperRevisedDueDate() ? self.DeveloperRevisedDueDate() : self.BusinessAnalystDueDate(),
            DueDateLater: BADueDateLater,
            message: BARDueDateValidationMessage,
            IsManditory: csaManditory,
            IsBaRDateValidationRequired: IsBaRDateValidationRequired,
            ValidationRequired: csaManditory
        }
    });

    self.CSARevisedDueDate.extend({ DueDateValidation: { DueDate: self.BusinessAnalystRevisedDueDate() ? self.BusinessAnalystRevisedDueDate() : self.DeveloperRevisedDueDate() ? self.DeveloperRevisedDueDate() : self.CSADueDate(), message: CSARDueDateValidationMessage, IsManditory: false, ValidationRequired: true } });
}

function TriggerDueDateValidationsForOGOD(self, DeveloperDueDateValidationMessage, LDeveloperDueDateValidationMessage, CSADueDateValidationMessage, checkDevDueDate) {
    var DevDueDateLater = self.LeadDeveloperRevisedDueDate() || self.LeadDeveloperDueDate() || self.CSARevisedDuedate() || self.CSADueDate();
    var LeadDeveloperDueDateLater = self.CSARevisedDuedate() || self.CSADueDate();
    if (checkDevDueDate == undefined || checkDevDueDate == true) {
        var DevDueDate = self.DeveloperDueDate && self.DeveloperDueDate()
                           && Date.parse(moment(self.DeveloperDueDate()).format('MM/DD/YYYY')) > Date.parse(moment(new Date()).format('MM/DD/YYYY'))
                           ? self.DeveloperDueDate() : new Date();
        self.DeveloperRevisedDueDate.extend({ DueDateValidation: { DueDate: DevDueDate, DueDateLater: DevDueDateLater, message: DeveloperDueDateValidationMessage } });
    }
    self.LeadDeveloperRevisedDueDate.extend({
        DueDateValidation: {
            DueDate: self.DeveloperRevisedDueDate() ? self.DeveloperRevisedDueDate() : self.LeadDeveloperDueDate(),
            DueDateLater: LeadDeveloperDueDateLater,
            message: LDeveloperDueDateValidationMessage
        }
    });
    self.CSARevisedDuedate.extend({ DueDateValidation: { DueDate: self.LeadDeveloperRevisedDueDate() ? self.LeadDeveloperRevisedDueDate() : self.DeveloperRevisedDueDate() ? self.DeveloperRevisedDueDate() : self.CSADueDate(), message: CSADueDateValidationMessage } });
}

function onKendoGridDataBound(e) {
    //Notify("Kendo Grid Data Bounded.", "success");
    $("tr").hover(
        function () {
            if (!($(this).hasClass("k-grouping-row"))) {
                var datauiid = $(this).attr("data-uid");
                if (datauiid != null)
                    $("[data-uid='" + datauiid + "']").find("td").css("background-color", "#DBECFF");
            }
        },
         function () {
             if (!($(this).hasClass("k-grouping-row"))) {
                 var datauiid = $(this).attr("data-uid");
                 if (datauiid != null)
                     $("[data-uid='" + datauiid + "']").find("td").css("background-color", "rgb(184, 204, 228)");
             }
         }
    );
    var foundIndex = -1, newText = '';
    $(".k-grouping-row .k-reset").each(function () {
        foundIndex = $(this).text().indexOf(":");
        if (foundIndex != -1) {
            newText = $(this).text().substring(0, foundIndex);
            $(this).text("");
            $(this).append('<a class="k-icon k-i-collapse" href="#" tabindex="-1"></a>').append(newText != "Status" ? newText : "");
        }
    });

    setTimeout(function () {
        e.sender.wrapper.find(".k-grid-header th").height("");
        var lockedHeight = e.sender.wrapper.find(".k-grid-header-locked th:first-child").height();
        var unlockedHeight = e.sender.wrapper.find(".k-grid-header-wrap th:first-child").height();
        e.sender.wrapper.find(".k-grid-header th").height(Math.max(lockedHeight, unlockedHeight));
        e.sender.resize(true);
    });
    try{
        this.content.scrollTop(0);
    }
    catch(ex){
    }
}

function TriggerNextSubmitDateValidation(self, InvalidDateErrorMessage, ManditoryErrorMessage, notInDays) {
    self.NextSubmitDate.extend({
        DayNotIn: {
            NotInDays: notInDays,
            IsMonthly: self && self.FrequencyTypeID && self.FrequencyTypeID() == 1 ? true : false,
            InvalidDateMessage: InvalidDateErrorMessage,
            IsManditory: function () {
                var isAutomaticScheduled = self.AutomaticScheduleIndicator ? self.AutomaticScheduleIndicator()
                                                : self.isJobEligibleAutomaticSchedule ? self.isJobEligibleAutomaticSchedule()
                                                : true;

                return isAutomaticScheduled == true
            },
            ManditoryMessage: ManditoryErrorMessage
        }
    });
}

function BindClientContacts(ClientID, jsonLoadData, self) {
    if (self.LoadData == undefined) {
        jsonLoadData.lstFilteredClientContacts = ko.observableArray([]);
    }
    else {
        self.LoadData.lstFilteredClientContacts.removeAll();
    }
    var values = [];
    if (ClientID) {

        $.ajax({
            type: 'POST',
            cache: false,
            dataType: 'json',
            url: virtualdir + 'request' + '/GetMatchingClientContacts',
            data: { ClientID: ClientID },
            //contentType: 'application/json;',
            async: false,
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    values.push(data[i]);

                }
            },
            error: function (err) {
                var actionComplete = "fasle";
            }
        });
        if (self.LoadData == undefined) {
            ko.utils.arrayPushAll(jsonLoadData.lstFilteredClientContacts, values);
            jsonLoadData.lstFilteredClientContacts.valueHasMutated();
        }
        else {
            ko.utils.arrayPushAll(self.LoadData.lstFilteredClientContacts(), values);
            self.LoadData.lstFilteredClientContacts.valueHasMutated();
        }
    }
};

function RedirectToQueue(pageUrl) {
    var found = false, redirectUrl="";
    var QueueUrls = ["request/index/", "development/index/", "estimation/index/", "discountreview/index", "/ongoingondemand/index/", "/ongoingondemand/activelist/"
                    , "/ongoingondemand/duetoexpire/", "/ongoingondemand/inactivelist/", "/ongoingondemand/csaqueue/"];
   
    do {
        //redirectUrl = $("#browsingHistory li[aria-labelledby*='" + pageUrl + "']").last().attr("aria-describedby");
        var indexVal = pageUrl.indexOf("#") != -1 ? pageUrl.indexOf("#") : pageUrl.length;
        redirectUrl = $("#browsingHistory li[aria-labelledby='" + pageUrl.substring(0, indexVal) + "']").last().attr("aria-describedby");
            for (var i = 0; i < QueueUrls.length; i++) {
                var indexCheck = redirectUrl ? redirectUrl.lastIndexOf(QueueUrls[i]) : 0;
                if (indexCheck > -1) {
                    found = true;
                }
            }
            if (!found) {
                $("#browsingHistory li[aria-labelledby='" + pageUrl + "']").last().remove();
                pageUrl = redirectUrl;//$("#browsingHistory li[aria-labelledby='" + pageUrl + "']").last().attr("aria-describedby");
            }
        }
        while (!found)
        window.location.href = redirectUrl;
         
}

function SetDateFormat(self, fieldName) {
    if (fieldName == "DevelopmentDataDate") {
        if (self.developmentDetail().DataDate() && self.developmentDetail().DataDate() != "") {
            self.developmentDetail().DataDate(moment(new Date(self.developmentDetail().DataDate())).format('MM/DD/YYYY'));
        }
    }
}

ko.extenders.ListDataCheck = function (target, options) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
    var fieldNames = options && options.fields ? options.fields : [];
    var validationTypes = options && options.validationTypes ? options.validationTypes : [];
    //define a function to do validation
    function validateuser(newListValues) {
        var IsValid = true, expression = "", thisValidationType, thisErrorMessage;
        for (k = 0; k < validationTypes.length; k++) {
            thisValidationType = validationTypes[k].Name ? validationTypes[k].Name : "";
            thisErrorMessage = validationTypes[k].ErrorMessage ? validationTypes[k].ErrorMessage : "Invalid data.";
            expression = "";
            switch (thisValidationType) {
                case "All Required":
                    for (i = 0; i < newListValues.length; i++) {
                        var thisFieldName;
                        for (j = 0 ; j < fieldNames.length ; j++) {
                            thisFieldName = fieldNames[j]
                            expression = "newListValues[i]." + thisFieldName + "()";
                            var thisFieldValue = eval(expression);
                            if (thisFieldValue == undefined || thisFieldValue.trim() == "") {
                                IsValid = false;
                                break;
                            }
                        }
                    }
                    break;
                case "":
                    break;
            }
        }


        target.hasError(IsValid ? false : true);
        target.validationMessage(IsValid ? "" : thisErrorMessage || "Invalid data.");
        target.error = IsValid ? "" : thisErrorMessage || "Invalid data.";
        if (target.__valid__ != undefined)
            target.__valid__(IsValid ? true : false);
    }

    //initial validation
    validateuser(target());

    //validate whenever the value changes
    target.subscribe(validateuser);

    //return the original observable
    return target;
};

function SaveDataToLocalStorage(itemName, item, errMessage){
    try{
        localStorage.setItem(itemName, JSON.stringify(item));
    }
    catch(e){
        Notify(errMessage, "error");
    }
}

//------------------------------------------------------------------------------------------------------------------------------------

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6

if(isIE){
    //IE doesn't support scroll on hover, so setting scroll initially.
    $(".TaskList").css("overflow-y", "scroll");
}
//------------------------------------------------------------------------------------------------------------------------------------