<div class="container-fluid mt-3 mb-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-3 rounded-3 shadow-sm" style="background: #ffffff; border-left: 4px solid #0d6efd;">
        <div class="mb-2 mb-md-0">
            <h4 class="fw-bold mb-1 d-flex align-items-center" style="font-size: 1.35rem;">
                <i class="fa-solid fa-wind me-2 text-primary" style="font-size: 1.5rem;"></i>
                <span data-i18n="wind_management"></span>
            </h4>
            <nav aria-label="breadcrumb" style="margin-left: 25px;">
                <ol class="breadcrumb mb-0 small">
                    <li class="breadcrumb-item">
                        <span data-i18n="admin"></span>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        <span data-i18n="import"></span>
                    </li>
                </ol>
            </nav>
        </div>
        <div class="ms-md-3 text-md-end align-items-end">
            <button class="btn btn-primary btn-sm manage-wind">
                <i class="fa-solid fa-cloud-arrow-up"></i> <span data-i18n="import"></span>
            </button>
        </div>
    </div>
</div>
<div class="container-fluid mt-3 mb-5">
    <div class="row g-2 mb-3">
        <div class="col-sm-3">
            <select id="filter_station" class="form-select filter">
                <option value="">-- Station --</option>
            </select>
        </div>
        <div class="col-sm-3">
            <input type="date" class="form-control filter" id="filter_date">
        </div>
        <div class="col-sm-3">
            <select id="filter_status" class="form-select filter">
                <option value="">-- Sensor Status --</option>
                <option value="Normal">Normal</option>
                <option value="Warning">Warning</option>
                <option value="Offline">Offline</option>
            </select>
        </div>
    </div>
</div>
<div class="container-fluid mt-3 mb-5">
    <div class="table-responsive">
        <table class="table table-hover" id="tb_wind">
            <thead>
                <tr>
                    <th></th>
                    <th data-i18n="station"></th>
                    <th><span data-i18n="wind_speed"></span> (m/s)</th>
                    <th data-i18n="direction"></th>
                    <th data-i18n="date"></th>
                    <th data-i18n="sensor_status"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
<script src="<?=BASE_URL?>/public/js/admin/import.js?v=<?=time()?>"></script>