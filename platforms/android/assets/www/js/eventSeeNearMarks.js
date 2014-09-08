/*global console, onSuccessGeoLoc, onErrorGeoLoc, watchGeoID, isUserGeoLocated, showOverlay, startGeolocating,
stopGeolocating, currentGeoCoords,$, hideOverlay, ich, setupBtnMarkTerritory, updateUiGeoConfirmation, forceCloseSideNav, templateLoaded, verifierSiAccuracyEstOk*/
function setupNearMarksView() {
    "use strict";
    forceCloseSideNav();
    $('#main-content').empty();
    $('#main-content').append(ich.TemplateShowNearMarks());
    templateLoaded = "TemplateShowNearMarks";

    if (watchGeoID === undefined || watchGeoID === null) {
        startGeolocating();
    }
}

function parseGeoResultsSeeNearMarks(position) {
    "use strict";
    if (verifierSiAccuracyEstOk(position)) {
        /// OK WE CAN DOWNLOAD FROM API !
        document.getElementById('loadingModal').textContent = "Asking dog to sniff around for marks...";
        fetchNearMarksFromAPI();
    }
}

function fetchNearMarksFromAPI() {
    "use strict";

    function formatUrl(toleratedRadius) {
        return 'http://192.168.2.26:4711/api/iwashere/' + 100 + '/' + currentGeoCoords.lat + '/' + currentGeoCoords.lng;
    }

    stopGeolocating();
    $.getJSON(formatUrl(100), function (data) {
        document.getElementById('loadingModal').textContent = "We got everything. Oiling the crank.";
        parseApiResults(data);
        addClass(document.getElementById('overlay_loadingDataAndGeoLocating'), 'off');
    });
}


function parseApiResults(data) {
    "use strict";
    var list, listItems, len, iCpt;
    len = data.features.length;
    listItems = [];
    for (iCpt =0; iCpt< len; iCpt = iCpt + 1) {
        listItems.push(ich.TemplateShowNearMarks_Item({name:data.features[iCpt].properties.geoAccuracy});
    }

    list = ich.TemplateShowNearMarks_ListItem({listItems: listItems});
    $('#listNearMarks').append(list);
}
