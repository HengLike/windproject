let tb_wind;
function initWindTable() {
    tb_wind = $('#tb_wind').DataTable({
        processing: true,
        serverSide: true,
        responsive: true, 
        ajax: {
            url: "api/wind/list",
            type: "POST",
            data: function (d) {
                d.station = $("#filter_station").val();
                d.date = $("#filter_date").val();
                d.status = $("#filter_status").val();
            }
        },
        columns: [
            { data: null, defaultContent: "" },
            { data: "station" },
            { 
                data: "wind_speed",
                render: speed => `<span class="fw-bold">${speed} m/s</span>`
            },
            { 
                data: "wind_direction",
                render: d => `<i class="fa-solid fa-location-arrow me-1 rotate-${d}"></i> ${d}°`
            },
            { data: "updated_at" },
            { 
                data: "status",
                render: function(s){
                    let badge = s === "Normal" ? "success" : (s === "warning" ? "warning" : "secondary");
                    return `<span class="badge bg-${badge} text-${badge} bg-opacity-10" style="font-size: 13px; font-weight: 400;">${s}</span>`;
                }
            },
            {
                data: null,
                className: "text-end",
                render: row => `
                    <button class="btn btn-light text-secondary manage-wind" data-id="${row.id}">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-light text-secondary delete-wind" data-id="${row.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                `
            }
        ],
        pageLength: pageLength,
        lengthMenu: lengthMenu,
        language: getTableLang(),
        initComplete: function(){
            var input = $('#tb_wind_filter input').unbind();
            var self = this.api();
            input.bind('keypress', function(e){
                if(e.keyCode == 13) {
                    self.search(input.val()).draw();
                }
            });
        }
    });
}
$(document).ready(function () {
    initWindTable();
    $(".filter").on("change", () => tb_wind.ajax.reload());
});
$(document).on('click', '.manage-wind', function () {
    let wind_id = $(this).data("id");
    let wind = window.windData || {}; 
    let modalEl = $('#windModal');
    let modal = new bootstrap.Modal(modalEl[0]);
    modal.show();
    modalEl.find(".modal-header").html(`
        <h5 class="modal-title" data-i18n="wind_management"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    `);
    modalEl.find(".modal-footer").html(`
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="close"></button>
        <button type="submit" class="btn btn-primary" data-i18n="import"></button>
    `);
    modalEl.find(".modal-body").html(`
        <input type="hidden" id="wind_id" value="${wind.id ?? ''}">
        <div class="mb-3">
            <label class="mb-2 fw-bold" data-i18n="uploadWindData"></label>
            <input type="file" id="wind_file" class="form-control" accept=".xlsx,.csv">
            <div class="alert alert-info rounded-3 mt-3">
                <h6 class="fw-bold mb-2" data-i18n="uploadGuideline"></h6>
                <ul class="mb-0 small">
                    <li data-i18n="uploadFormat1"></li>
                    <li data-i18n="uploadFormat2"></li>
                    <li data-i18n="uploadFormat3"></li>
                </ul>
            </div>
        </div>
    `);
    loadLang(currentLang);
});
