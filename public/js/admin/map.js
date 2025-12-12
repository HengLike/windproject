mapboxgl.accessToken = 'pk.eyJ1IjoiamFra3JpdGd1aSIsImEiOiJjbWgzazI4ZmwzNHpiMmpvZWlrcGVuZWJzIn0.hM4EeFAT3ytiy5F69sTGDg';
let map;
let draw;
let currentMode = 'view';
let polygons = [];
let poles = [];
let markers = {};
let settingBounds = false;
let tempMinZoom = 5;
let tempMaxZoom = 18;
function initMap() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [100.5018, 13.7563], // กรุงเทพฯ
        zoom: 12,
        maxZoom: 18,
        minZoom: 5
    });
    draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: false,
            trash: false
        }
    });
    map.addControl(draw);
    map.addControl(new mapboxgl.NavigationControl());
    map.on('load', function() {
        loadSampleData();
        renderPolygonList();
        renderPoleList();
    });
    map.on('zoom', function() {
        document.getElementById('currentZoom').textContent = Math.round(map.getZoom() * 10) / 10;
    });
    map.on('click', function(e) {
        if (currentMode === 'marker') {
            addPoleAtLocation(e.lngLat);
        }
    });
}
function loadSampleData() {
    polygons = [
        { id: 1, name: 'พื้นที่ A', coordinates: [[100.5018, 13.7563], [100.5118, 13.7563], [100.5118, 13.7663], [100.5018, 13.7663]], color: '#3B82F6' },
        { id: 2, name: 'พื้นที่ B', coordinates: [[100.5218, 13.7463], [100.5318, 13.7463], [100.5318, 13.7563], [100.5218, 13.7563]], color: '#10B981' }
    ];
    poles = [
        { id: 1, name: 'เสา 001', lat: 13.7563, lng: 100.5018, description: 'เสาไฟฟ้าหลัก', image360: null },
        { id: 2, name: 'เสา 002', lat: 13.7463, lng: 100.5218, description: 'เสาสื่อสาร', image360: null }
    ];
    displayPolygons();
    displayPoles();
}
function displayPolygons() {
    polygons.forEach(polygon => {
        if (map.getLayer('polygon-' + polygon.id)) {
            map.removeLayer('polygon-' + polygon.id);
            map.removeSource('polygon-' + polygon.id);
        }
        map.addSource('polygon-' + polygon.id, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [polygon.coordinates]
                }
            }
        });
        map.addLayer({
            'id': 'polygon-' + polygon.id,
            'type': 'fill',
            'source': 'polygon-' + polygon.id,
            'paint': {
                'fill-color': polygon.color,
                'fill-opacity': 0.3
            }
        });
        map.addLayer({
            'id': 'polygon-outline-' + polygon.id,
            'type': 'line',
            'source': 'polygon-' + polygon.id,
            'paint': {
                'line-color': polygon.color,
                'line-width': 2
            }
        });
    });
}
function displayPoles() {
    poles.forEach(pole => {
        if (markers[pole.id]) {
            markers[pole.id].remove();
        }
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = '<i class="fas fa-map-pin" style="color: #dc3545; font-size: 24px;"></i>';
        el.style.cursor = 'pointer';
        const marker = new mapboxgl.Marker(el)
            .setLngLat([pole.lng, pole.lat])
            .setPopup(new mapboxgl.Popup().setHTML(
                `<strong>${pole.name}</strong><br>${pole.description || ''}<br>
                <button class="btn btn-sm btn-primary mt-2" onclick="editPole(${pole.id})">แก้ไข</button>`
            ))
            .addTo(map);
        markers[pole.id] = marker;
    });
}
function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.btn-mode').forEach(btn => {
        btn.classList.remove('btn-primary', 'btn-success', 'btn-warning');
        btn.classList.add('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
    });
    if (mode === 'view') {
        document.getElementById('btnView').classList.remove('btn-outline-primary');
        document.getElementById('btnView').classList.add('btn-primary');
        draw.changeMode('simple_select');
        document.getElementById('btnSave').style.display = 'none';
        map.getCanvas().style.cursor = '';
    } else if (mode === 'polygon') {
        document.getElementById('btnPolygon').classList.remove('btn-outline-success');
        document.getElementById('btnPolygon').classList.add('btn-success');
        draw.changeMode('draw_polygon');
        document.getElementById('btnSave').style.display = 'inline-block';
        map.getCanvas().style.cursor = 'crosshair';
    } else if (mode === 'marker') {
        document.getElementById('btnMarker').classList.remove('btn-outline-warning');
        document.getElementById('btnMarker').classList.add('btn-warning');
        draw.changeMode('simple_select');
        document.getElementById('btnSave').style.display = 'none';
        map.getCanvas().style.cursor = 'crosshair';
    }
}
function clearDrawing() {
    draw.deleteAll();
}
function saveDrawing() {
    const data = draw.getAll();
    if (data.features.length === 0) {
        alert('กรุณาวาดพื้นที่ก่อน');
        return;
    }
    data.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
            const newPolygon = {
                id: Date.now(),
                name: `พื้นที่ ${polygons.length + 1}`,
                coordinates: feature.geometry.coordinates[0],
                color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
            };
            polygons.push(newPolygon);
        }
    });
    draw.deleteAll();
    displayPolygons();
    renderPolygonList();
    setMode('view');
    alert('บันทึกพื้นที่สำเร็จ');
}
function addPoleAtLocation(lngLat) {
    const newPole = {
        id: Date.now(),
        name: `เสา ${poles.length + 1}`,
        lat: lngLat.lat,
        lng: lngLat.lng,
        description: '',
        image360: null
    };
    poles.push(newPole);
    displayPoles();
    renderPoleList();
    editPole(newPole.id);
}
function renderPolygonList() {
    const list = document.getElementById('polygonList');
    list.innerHTML = polygons.slice(-3).map(p => `
        <div class="polygon-item">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <span class="color-indicator" style="background-color: ${p.color}"></span>
                    <strong>${p.name}</strong>
                </div>
                <button class="btn btn-sm btn-danger" onclick="deletePolygon(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}
function renderPoleList() {
    const list = document.getElementById('poleList');
    list.innerHTML = poles.slice(-3).map(p => `
        <div class="pole-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${p.name}</strong><br>
                    <small class="text-muted">${p.description || 'ไม่มีรายละเอียด'}</small>
                </div>
                <button class="btn btn-sm btn-primary" onclick="editPole(${p.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
    `).join('');
}
function showPolygonList() {
    const list = document.getElementById('polygonListFull');
    list.innerHTML = polygons.map(p => `
        <div class="polygon-item mb-3">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <span class="color-indicator" style="background-color: ${p.color}"></span>
                    <div>
                        <strong>${p.name}</strong><br>
                        <small class="text-muted">จุด: ${p.coordinates.length}</small>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-info me-2" onclick="flyToPolygon(${p.id})">
                        <i class="fas fa-crosshairs"></i> ดู
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePolygon(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    new bootstrap.Modal(document.getElementById('polygonModal')).show();
}
function showPoleList() {
    const list = document.getElementById('poleListFull');
    list.innerHTML = poles.map(p => `
        <div class="pole-item mb-3">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <strong>${p.name}</strong><br>
                    <small class="text-muted">${p.description || 'ไม่มีรายละเอียด'}</small><br>
                    <small class="text-muted">ตำแหน่ง: ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</small>
                </div>
                <div class="col-md-3">
                    ${p.image360 ? `<img src="${p.image360}" class="img-thumbnail" style="height: 60px;">` : '<span class="text-muted">ไม่มีรูป</span>'}
                </div>
                <div class="col-md-3 text-end">
                    <button class="btn btn-sm btn-info me-2" onclick="flyToPole(${p.id})">
                        <i class="fas fa-crosshairs"></i>
                    </button>
                    <button class="btn btn-sm btn-primary me-2" onclick="editPole(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePole(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    new bootstrap.Modal(document.getElementById('poleModal')).show();
}
function editPole(id) {
    const pole = poles.find(p => p.id === id);
    if (!pole) return;
    document.getElementById('editPoleId').value = pole.id;
    document.getElementById('editPoleName').value = pole.name;
    document.getElementById('editPoleLat').value = pole.lat;
    document.getElementById('editPoleLng').value = pole.lng;
    document.getElementById('editPoleDesc').value = pole.description || '';
    const preview = document.getElementById('imagePreview');
    if (pole.image360) {
        preview.innerHTML = `<img src="${pole.image360}" class="image-360-preview">`;
    } else {
        preview.innerHTML = '';
    }
    new bootstrap.Modal(document.getElementById('editPoleModal')).show();
}
function savePoleEdit() {
    const id = parseInt(document.getElementById('editPoleId').value);
    const pole = poles.find(p => p.id === id);
    pole.name = document.getElementById('editPoleName').value;
    pole.lat = parseFloat(document.getElementById('editPoleLat').value);
    pole.lng = parseFloat(document.getElementById('editPoleLng').value);
    pole.description = document.getElementById('editPoleDesc').value;
    const fileInput = document.getElementById('editPoleImage');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            pole.image360 = e.target.result;
            displayPoles();
            renderPoleList();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        displayPoles();
        renderPoleList();
    }
    bootstrap.Modal.getInstance(document.getElementById('editPoleModal')).hide();
    alert('บันทึกข้อมูลเสาสำเร็จ');
}
function deletePolygon(id) {
    if (!confirm('ต้องการลบพื้นที่นี้?')) return;
    
    if (map.getLayer('polygon-' + id)) {
        map.removeLayer('polygon-' + id);
        map.removeLayer('polygon-outline-' + id);
        map.removeSource('polygon-' + id);
    }
    polygons = polygons.filter(p => p.id !== id);
    renderPolygonList();
    showPolygonList();
}
function deletePole(id) {
    if (!confirm('ต้องการลบเสานี้?')) return;
    
    if (markers[id]) {
        markers[id].remove();
        delete markers[id];
    }
    poles = poles.filter(p => p.id !== id);
    renderPoleList();
    showPoleList();
}
function flyToPolygon(id) {
    const polygon = polygons.find(p => p.id === id);
    if (!polygon) return;
    const bounds = new mapboxgl.LngLatBounds();
    polygon.coordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds, { padding: 50 });
    
    bootstrap.Modal.getInstance(document.getElementById('polygonModal')).hide();
}
function flyToPole(id) {
    const pole = poles.find(p => p.id === id);
    if (!pole) return;
    map.flyTo({
        center: [pole.lng, pole.lat],
        zoom: 16
    });
    bootstrap.Modal.getInstance(document.getElementById('poleModal')).hide();
    setTimeout(() => {
        markers[pole.id].togglePopup();
    }, 1000);
}
function startSetBounds() {
    if (!settingBounds) {
        settingBounds = true;
        tempMinZoom = Math.floor(map.getZoom());
        tempMaxZoom = Math.ceil(map.getZoom());
        document.getElementById('btnSetBounds').innerHTML = '<i class="fas fa-check"></i> บันทึกขอบเขต';
        document.getElementById('btnSetBounds').classList.remove('btn-primary');
        document.getElementById('btnSetBounds').classList.add('btn-success');
        const Toast = createToast('กำลังกำหนดขอบเขต', 'ย่อ-ขยายแผนที่เพื่อกำหนดระยะ Zoom ต่ำสุดและสูงสุด แล้วกด "บันทึกขอบเขต"', 'info');
        map.on('zoom', updateTempBounds);
    } else {
        settingBounds = false;
        map.off('zoom', updateTempBounds);
        map.setMaxZoom(tempMaxZoom);
        map.setMinZoom(tempMinZoom);
        document.getElementById('btnSetBounds').innerHTML = '<i class="fas fa-compress-arrows-alt"></i> กำหนดขอบเขต';
        document.getElementById('btnSetBounds').classList.remove('btn-success');
        document.getElementById('btnSetBounds').classList.add('btn-primary');
        document.getElementById('zoomLimits').textContent = `${tempMinZoom} - ${tempMaxZoom}`;
        createToast('บันทึกสำเร็จ', `กำหนดขอบเขต Zoom: ${tempMinZoom} - ${tempMaxZoom}`, 'success');
    }
}
function updateTempBounds() {
    const currentZoom = Math.round(map.getZoom());
    tempMinZoom = Math.min(tempMinZoom, currentZoom);
    tempMaxZoom = Math.max(tempMaxZoom, currentZoom);
    document.getElementById('zoomLimits').textContent = `${tempMinZoom} - ${tempMaxZoom}`;
}
function createToast(title, message, type) {
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'info' ? 'primary' : 'warning'} border-0" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHtml;
    document.body.appendChild(toastElement.firstElementChild);
    const toast = new bootstrap.Toast(toastElement.firstElementChild, { delay: 3000 });
    toast.show();
    setTimeout(() => toastElement.remove(), 4000);
}
initMap();