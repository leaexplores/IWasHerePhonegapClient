/*global console, onSuccessGeoLoc, onErrorGeoLoc, watchGeoID, isUserGeoLocated, showOverlay, startGeolocating,
stopGeolocating, currentGeoCoords,$, hideOverlay, ich, addClass, removeClass, forceCloseSideNav, templateLoaded:true, verifierSiAccuracyEstOk, setupActiveButton*/

function updateUiGeoConfirmation(isGeoReady) {
    "use strict";
    var docToUpdate, btnMark;
    docToUpdate = document.getElementById('geolocationStatus');
    btnMark = document.getElementById('roundBtn');
    if (isGeoReady) {
        docToUpdate.textContent = "Ok ! you're ready to mark your territory";

        removeClass(btnMark, 'button-not-ready');
        removeClass(btnMark, 'round-button-circle-not-ready');
        addClass(btnMark, 'round-button-circle-ready');
        addClass(btnMark, 'button-ready');
    } else {
        docToUpdate.textContent = "We're preparing your black sharpie to write down a message here. Hold on.";
        addClass(btnMark, 'button-not-ready');
        addClass(btnMark, 'round-button-circle-not-ready');
        removeClass(btnMark, 'round-button-circle-ready');
        removeClass(btnMark, 'button-ready');
    }
}

function setupBtnMarkTerritory() {
    "use strict";

    function overlay_sendToAPI_LoadingDone() {
        var elementToChange, btnSendToApiClose;
        elementToChange = document.getElementById('currentProgress');
        btnSendToApiClose = document.getElementById('btnSendToApiClose');
        // List of class to swap fa-circle-o-notch fa-spin
        removeClass(elementToChange, 'fa-spin');
        removeClass(elementToChange, 'fa-circle-o-notch');
        removeClass(btnSendToApiClose, 'off');
        addClass(elementToChange, 'fa-check-square');
        addClass(elementToChange, 'green-icon');

        document.getElementById('sendToApiTxtProgress').textContent = "Thanks for marking your territory here !";
    }

    function modalMarkTerritory() {
        if (isUserGeoLocated && currentGeoCoords !== undefined) {
            stopGeolocating();
            showOverlay('overlay_leaveAMessage');
        }
    }

    function overlay_sendToAPI_HideOverlay() {
        var btnSendToApiClose;
        btnSendToApiClose = document.getElementById('btnSendToApiClose');
        addClass(btnSendToApiClose, 'off');
        startGeolocating();
        hideOverlay('overlay_sendingToAPI');
    }


    function sendToApi() {
        function overlay_sendToAPI_SetUIForLoading() {
            var elementToChange, btnSendToApiClose;
            elementToChange = document.getElementById('currentProgress');
            btnSendToApiClose = document.getElementById('btnSendToApiClose');
            document.getElementById('sendToApiTxtProgress').textContent = "Please wait while our dog chews your infos.";
            addClass(elementToChange, 'fa-spin');
            addClass(elementToChange, 'fa-circle-o-notch');
            addClass(btnSendToApiClose, 'off');
            removeClass(elementToChange, 'fa-check-square');
            removeClass(elementToChange, 'green-icon');
        }


        function createGeoJsonFromProps(txtIfPresent) {
            var baseData = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [currentGeoCoords.lng, currentGeoCoords.lat]
                },
                "properties": {
                    geoAccuracy: currentGeoCoords.accuracy
                }
            };

            if (txtIfPresent !== undefined && txtIfPresent.length > 0) {
                baseData.properties.textNote = txtIfPresent;
            }
            return baseData;
        }
        var txtArea, request, data;
        txtArea = document.getElementById('txtNote').textContent;

        data = createGeoJsonFromProps(txtArea);

        // Do prepare the request to send to api...
        $.post('http://192.168.2.26:4711/api/iwashere', data, function (response) {
            if (document.getElementById('overlay_sendingToAPI').classList.contains('off') === false) {
                overlay_sendToAPI_LoadingDone();
            }
        });

        hideOverlay('overlay_leaveAMessage');
        showOverlay('overlay_sendingToAPI');
        overlay_sendToAPI_SetUIForLoading();
    }

    function overlay_EnterMsg_CloseModal() {
        startGeolocating();
        hideOverlay('overlay_leaveAMessage');
    }


    var btnMarkYourTerritory, btnSendToApi, btnSendToApiClose, btnCancel;
    btnMarkYourTerritory = document.getElementById('roundBtn');
    btnSendToApi = document.getElementById('btnSendToApi');
    btnSendToApiClose = document.getElementById('btnSendToApiClose');
    btnCancel = document.getElementById('btnCancel');
    btnMarkYourTerritory.onclick = modalMarkTerritory;
    btnSendToApi.onclick = sendToApi;
    btnSendToApiClose.onclick = overlay_sendToAPI_HideOverlay;
    btnCancel.onclick = overlay_EnterMsg_CloseModal;
}


function setupMarkTerritoryView() {
    "use strict";
    forceCloseSideNav();

    setupActiveButton('side-navBtnMarkTerritory', 'side-navBtnSeeNearMarks');

    // Must start geo if it's not running.....
    if (watchGeoID === undefined || watchGeoID === null) {
        startGeolocating();
    }

    $('#main-content').empty();
    $('#main-content').append(ich.TemplateMarkTerritory());
    templateLoaded = "TemplateMarkTerritory";
    setupBtnMarkTerritory();
    updateUiGeoConfirmation(false);
}

function parseGeoResultsMarkTerritory(position) {
    "use strict";
    if (verifierSiAccuracyEstOk(position)) {
        updateUiGeoConfirmation(true);
    } else {
        updateUiGeoConfirmation(false);
    }
}
