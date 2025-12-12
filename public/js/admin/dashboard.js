flatpickr("#login_date_range", {
    mode: "range",
    dateFormat: "Y-m-d",
});
const windTrendCtx = document.getElementById('windTrendChart');
new Chart(windTrendCtx, {
    type: 'line',
    data: {
        labels: ["Dec 2", "Dec 3", "Dec 4", "Dec 5", "Dec 6", "Dec 7", "Dec 8"],
        datasets: [{
            label: 'เฉลี่ย',
            data: [10, 12, 8, 15, 11, 13, 12],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }, {
            label: 'สูงสุด',
            data: [18, 22, 16, 28, 20, 25, 23],
            borderColor: '#f5576c',
            backgroundColor: 'rgba(245, 87, 108, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'ความเร็วลม (km/h)'
                }
            }
        }
    }
});
const loginCtx = document.getElementById('loginChart');
new Chart(loginCtx, {
    type: 'bar',
    data: {
        labels: ["Dec 1", "Dec 2", "Dec 3", "Dec 4", "Dec 5", "Dec 6", "Dec 7", "Dec 8"],
        datasets: [{
            label: 'จำนวนการเข้าใช้งาน',
            data: [5, 7, 3, 9, 4, 6, 8, 10],
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: '#667eea',
            borderWidth: 2,
            borderRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 2
                }
            }
        }
    }
});
const windDirCtx = document.getElementById('windDirectionChart');
new Chart(windDirCtx, {
    type: 'polarArea',
    data: {
        labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        datasets: [{
            label: 'ความถี่ทิศทาง',
            data: [25, 15, 12, 8, 10, 18, 20, 22],
            backgroundColor: [
                'rgba(102, 126, 234, 0.7)',
                'rgba(245, 87, 108, 0.7)',
                'rgba(79, 172, 254, 0.7)',
                'rgba(67, 233, 123, 0.7)',
                'rgba(250, 112, 154, 0.7)',
                'rgba(48, 207, 208, 0.7)',
                'rgba(240, 147, 251, 0.7)',
                'rgba(254, 225, 64, 0.7)'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});
const map = L.map('windMap').setView([13.7563, 100.5018], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
const stations = [
    {name: 'WT-001', lat: 13.7563, lng: 100.5018, speed: 12.4, status: 'online'},
    {name: 'WT-002', lat: 13.7263, lng: 100.5318, speed: 18.7, status: 'online'},
    {name: 'WT-003', lat: 13.7863, lng: 100.4718, speed: 28.0, status: 'online'},
    {name: 'WT-004', lat: 13.7163, lng: 100.4818, speed: 15.2, status: 'online'},
    {name: 'WT-005', lat: 13.7663, lng: 100.5418, speed: 11.8, status: 'online'}
];
stations.forEach(station => {
    const color = station.speed > 20 ? 'red' : station.speed > 15 ? 'orange' : 'green';
    const marker = L.circleMarker([station.lat, station.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(`
        <strong>${station.name}</strong><br>
        ความเร็ว: ${station.speed} km/h<br>
        สถานะ: <span style="color: ${color}">${station.status}</span>
    `);
});