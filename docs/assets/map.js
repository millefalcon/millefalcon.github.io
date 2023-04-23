// TODO: add filter for district ?

// set view to current location if geolocation is available
// else fallback to first cam location
function setView(map, fallBackCoords) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                map.setView([position.coords.latitude, position.coords.longitude], 9);
            },
            (error) => {
                // maybe access denied
                map.setView(fallBackCoords, 9);
            }
        );
    } else {
        /* geolocation IS NOT available */
        map.setView(fallBackCoords, 9);
    }
}

const icon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#4838cc;' class='marker-pin'></div><i class='material-icons'>photo_camera</i>",
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

var map = L.map('map');
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



const clusterGroup = L.markerClusterGroup.layerSupport({
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        let m = '';
        if (childCount < 10) {
            m = 'md-24';
        } else if (childCount < 100) {
            m = 'md-36';
        } else {
            m = 'md-48';
        }
        // return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>' + `<i class='material-icons ${m}'>photo_camera</i>`, className: 'custom-div-icon ' + c, iconSize: new L.Point(40, 40) });
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>' + `<i class='material-icons ${m}'>photo_camera</i>`, className: 'custom-div-icon md', iconSize: new L.Point(40, 40) });

    }
});
clusterGroup.addTo(map);


const control = L.control.layers(null, null, { collapsed: true });
Papa.parse('https://raw.githubusercontent.com/Open-Oven/mvd_kerala_ai/main/mvd_ai_cams.csv', {
    download: true,
    complete: ({ data: cams }) => {
        // ignore header, for now
        cams = cams.slice(1);
        // the data seems to have some empty rows. santize.
        cams = cams.filter(x => !!x[0].trim());
        const first_cam = cams[0];
        const first_cam_lat_lng = [Number(first_cam[3]), Number(first_cam[4])];
        setView(map, first_cam_lat_lng);

        const mapping = cams.reduce((mapping, cam_detail) => {
            let district = cam_detail[1];
            if (!mapping.get(district)) {
                mapping.set(district, [cam_detail]);
            } else {
                mapping.get(district).push(cam_detail);
            }
            return mapping;
        }, new Map());

        // console.log({ mapping });

        for ([district, cams] of mapping) {
            const layerGroup = L.layerGroup().addTo(map);
            cams.forEach(detail => {
                const lat_ng = [Number(detail[3]), Number(detail[4])];
                const marker = L.marker(lat_ng, { icon: icon, district: district });
                marker.bindPopup(`<b>Location!</b><br>${detail[2]},${detail[1]}`);
                layerGroup.addLayer(marker);
            });
            control.addOverlay(layerGroup, district);
            clusterGroup.checkIn(layerGroup);
        }
        control.addTo(map);
    }
});