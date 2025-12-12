<div class="container-fluid mt-3 mb-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-3 rounded-3 shadow-sm" style="background: #ffffff; border-left: 4px solid #0d6efd;">
        <div class="mb-2 mb-md-0">
            <h4 class="fw-bold mb-1 d-flex align-items-center" style="font-size: 1.35rem;">
                <i class="fa-regular fa-circle-down me-2 text-primary" style="font-size: 1.5rem;"></i>
                <span data-i18n="shortcut_management"></span>
            </h4>
            <nav aria-label="breadcrumb" style="margin-left: 25px;">
                <ol class="breadcrumb mb-0 small">
                    <li class="breadcrumb-item">
                        <span data-i18n="admin"></span>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        <span data-i18n="shortcut"></span>
                    </li>
                </ol>
            </nav>
        </div>
    </div>
</div>
<div class="container-fluid mt-4 mb-5">
    <div class="border-0">
        <div class="row g-4">
            <div class="col-md-6">
                <div class="p-3 border rounded-3 shadow-sm bg-white h-100">
                    <h6 class="fw-bold mb-3 text-primary">
                        <i class="fa-brands fa-apple me-1"></i> iOS Settings
                    </h6>
                    <div class="mb-3">
                        <label class="form-label">iOS Icon (180x180)</label>
                        <input type="file" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">App Name (iOS)</label>
                        <input type="text" class="form-control" placeholder="Shortcut Name">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status Bar Style</label>
                        <select class="form-select">
                            <option value="default">Default</option>
                            <option value="black">Black</option>
                            <option value="black-translucent">Black Translucent</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Apple Web App Capable</label>
                        <select class="form-select">
                            <option value="yes">Yes (Standalone)</option>
                            <option value="no">No (Browser)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="p-3 border rounded-3 shadow-sm bg-white h-100">
                    <h6 class="fw-bold mb-3 text-success">
                        <i class="fa-brands fa-android me-1"></i> Android Settings
                    </h6>
                    <div class="mb-3">
                        <label class="form-label">Icon (512x512)</label>
                        <input type="file" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">App Name (Android)</label>
                        <input type="text" class="form-control" placeholder="Shortcut Name">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Theme Color</label>
                            <input type="color" class="form-control form-control-color">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Background Color</label>
                            <input type="color" class="form-control form-control-color">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Display Mode</label>
                        <select class="form-select">
                            <option value="standalone">Standalone</option>
                            <option value="browser">Browser</option>
                            <option value="fullscreen">Fullscreen</option>
                            <option value="minimal-ui">Minimal UI</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Orientation</label>
                        <select class="form-select">
                            <option value="any">Any</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-end mt-4">
            <button class="btn btn-primary px-4">
                <i class="fa-solid fa-floppy-disk me-1"></i> Save Settings
            </button>
        </div>
    </div>
</div>