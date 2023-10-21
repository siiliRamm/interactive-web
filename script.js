(function() {
    "use strict";
    
    //clock

    document.addEventListener("DOMContentLoaded", function() {
        
        let c = document.getElementById("clock");
       
        //setTimeout(updateClock, 2000);
        //setInterval(updateClock, 1000);

        function updateClock() {
            let date = new Date();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            let elpl = "XX";
            if (h >= 12) {
                elpl = "PL";
            } else {
                elpl = "EL";
            }
            h = h % 12;
            if (h == 0) {
                h = 12;
            }
            if (m < 10) {
                m = "0" + m;
            }
            if (s < 10) {
                s = "0" + s;
            }
            c.innerHTML = h + ":" + m + ":" + s + " " + elpl;

            setTimeout(updateClock, 1000);
        };
        setTimeout(updateClock, 1000);

    });

    // forms

    document.getElementById("form").addEventListener("submit", estimateDelivery);

    let e = document.getElementById("delivery");
    let d = document.getElementById("tarnija-debug");
    e.innerHTML = "0,00 &euro;";

    function estimateDelivery(event) {
        event.preventDefault();

        let messages = [];
        let elements = [];

        let fname = document.getElementById("fname");
        let lname = document.getElementById("lname");
        if (fname.value === "") {
            messages.push("Palun sisestage eesnimi");
            elements.push(fname);
        }
        if (/\d/.test(fname.value)) {
            messages.push("Eesnimi ei tohi sisaldada numbreid");
            elements.push(fname);
        }
        if (lname.value === "") {
            messages.push("Palun sisestage perekonnanimi");
            elements.push(lname);
        }
        if (/\d/.test(lname.value)) {
            messages.push("Perekonnanimi ei tohi sisaldada numbreid");
            elements.push(lname);
        }

        let linn = document.getElementById("linn");
        let inputs = document.getElementsByTagName("input");
        let buttonValues = [];
        for (let i = 0; i < inputs.length; i++) {
            if(inputs[i].getAttribute("type") == "radio") {
                buttonValues.push(inputs[i].checked);
            }
        }
        if (linn.value === "") {
            messages.push("Palun valige linn nimekirjast");
            elements.push(linn);
        }
        if (!buttonValues.includes(true)) {
            messages.push("Palun valige tarnija nimekirjast");
            elements.push(document.getElementById("itella"));
        }

        if (messages.length != 0) {
            let alertMsg = "";
            for (let i = 0; i < messages.length; i++) {
                alertMsg += messages[i] + "\n";
            }
            alert(alertMsg);
            elements[0].focus();
        } else {
            let sum = 0;
            if (document.getElementById("v1").checked) {
                sum += 5;
            }
            if (document.getElementById("v2").checked) {
                sum += 1;
            }
            switch (linn.value) {
                // Kui valitud linnaks on Tallinn, lisandub tarnele 0€. Jätame selle väärtuse kontrollimata. Teised linnad:
                case "trt":
                    sum += 2.5;
                    break;
                case "nrv":
                    sum += 2.5;
                    break;
                case "prn":
                    sum += 3;
                    break;
            }
            // Itella Smartpostiga lisandub tarnele 0€. Jätame selle väärtuse kontrollimata. Teised tarnijad:
            if (document.getElementById("omniva").checked) {
                sum += 2.5;
            }
            if (document.getElementById("kuller").checked) {
                sum += 3;
            }
            e.innerHTML = sum.toFixed(2).replace('.',',') + " &euro;";
        }

        console.log("Tarne hind on arvutatud");
    }

})();

// map

let mapAPIKey = "AqLLRE37SJGqIxXEYxezPUa6fF2oCzl3cvG4n05FtFIVBrotBYxchpMYYpwuxBak";

let map;
let infobox;

function GetMap() {

    "use strict";

    let utPoint = new Microsoft.Maps.Location(
            58.38104,
            26.71992
    );
    let tluPoint = new Microsoft.Maps.Location(
            59.4392777,
            24.7721062
    );

    // Alternatiivne lahendus keskpunkti/zoomi paika panemiseks:
    // määrata kaardi piirid (max ja min longituud/latituud defineeritud punktide põhjal).
    // let box = new Microsoft.Maps.LocationRect.fromEdges(59.4392777,24.7721062,58.38104,26.71992);

    map = new Microsoft.Maps.Map("#map", {
        credentials: mapAPIKey,
        mapTypeId: Microsoft.Maps.MapTypeId.canvasDark,
        center: new Microsoft.Maps.Location(58.9904556, 25.5746765),
        zoom: 7
        // Alternatiivne lahendus keskpunkti+zoomi paika panemiseks:
        // kasutada loodud piire bounds sätte abil.
        // bounds: box
    });

    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false
    });
    infobox.setMap(map);

    let utPin = new Microsoft.Maps.Pushpin(utPoint, {
        title: 'Tartu Ülikool',
        description: 'Tartu Ülikool on Baltimaade juhtiv ülikool, kuuludes ainukesena regioonis maailma 1,2% parima sekka. TÜ maailmatasemel haridus annab eelise kogu eluks!'
    });
    Microsoft.Maps.Events.addHandler(utPin, 'click', pushpinClicked);
    map.entities.push(utPin);
    let tluPin = new Microsoft.Maps.Pushpin(tluPoint, {
        title: 'Tallinna Ülikool',
        description: 'Tallinna Ülikool (lühend TLÜ) on targa eluviisi eestvedaja. Meie siht on kujundada teadmistepõhist elukorraldust, kaalutletud otsustamist, ühiskonna ja riigi avatud arendamist.'
    });
    Microsoft.Maps.Events.addHandler(tluPin, 'click', pushpinClicked);
    map.entities.push(tluPin);
}

function pushpinClicked(e) {
    if (e.target.metadata) {
        infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.title,
            description: e.target.metadata.description,
            visible: true
        });
    }
}



// https://dev.virtualearth.net/REST/v1/Locations?q=1000 Vin Scully Ave, Los Angeles,CA&key=YOUR_KEY_HERE

