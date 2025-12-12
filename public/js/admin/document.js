let tb_document;
function initDocumentTable() {
    tb_document = $('#tb_document').DataTable({
        processing: true,
        serverSide: true,
        ajax: { url: "api/document/list", type: "POST" },
        columns: [      
            { 
                data: "document_icon",
                className: 'text-center',
                orderable: false,
                searchable: false,
                render: function(icon){
                    return icon;
                }
            },
            { data: "document_name" },
            { data: "document_type" },
            { data: "document_date" },
            { data: "document_size" },
            { data: "create_at" },
            { data: "create_by" },
            { 
                data: "status",
                render: function(status){
                    let badge = status === "Public" ? "success" : "secondary";
                    return `<span class="badge bg-${badge} text-${badge} bg-opacity-10" style="font-size: 13px; font-weight: 400;">${status}</span>`;
                }
            },
            {
                data: null,
                className: 'text-center',
                render: function(){
                    return `
                        <button class="btn btn-light text-secondary" data-id="1"><i class="fa-solid fa-folder-open"></i></button>
                        <button class="btn btn-light text-secondary manage-document" data-id="1"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-light text-secondary"><i class="fa-regular fa-trash-can"></i></button>
                    `;
                }
            }
        ],
        pageLength: pageLength,
        lengthMenu: lengthMenu,
        language: getTableLang(),
        initComplete: function(){
            var input = $('#tb_document_filter input').unbind();
            var self = this.api();
            input.bind('keypress', function(e){
                if(e.keyCode == 13) {
                    self.search(input.val()).draw();
                }
            });
        }
    });
}
$('.filter').on('change', function () {
    tb_document.ajax.reload();
});
function loadDocumentFilters() {
    $.ajax({
        url: "api/member/filterData",
        type: "POST",
        dataType: "json",
        success: function(res) {
            if(res.status === "success") {
                let company = res.data.company;
                company.forEach(c => {
                    $("#filter_company").append(`<option value="${c}">${c}</option>`);
                });
                let position = res.data.position;
                position.forEach(p => {
                    $("#filter_position").append(`<option value="${p}">${p}</option>`);
                });

            }
        }
    });
}
async function initApp() {
    await loadLang(currentLang); 
    initDocumentTable(); 
    loadDocumentFilters();
}
$(document).ready(function () {
    initApp();
});
$(document).on('click', '.manage-document', function () {
    let doc_id = $(this).data("id");
    $.ajax({
        url: 'api/document/get',
        method: 'POST',
        data: { id: doc_id },
        dataType: 'json',
        success: function(res){
            if (res.status === 'success') {
                let doc = res.data;
                let modalEl = $('#windModal');
                let modal = new bootstrap.Modal(modalEl[0]);
                modal.show();
                modalEl.find(".modal-header").html(`
                    <h5 class="modal-title" data-i18n="manageDocument"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                `);
                modalEl.find(".modal-footer").html(`
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="close"></button>
                    <button type="submit" class="btn btn-primary" data-i18n="save"></button>
                `);
                modalEl.find(".modal-body").html(`
                    <input type="hidden" name="document_id" id="document_id" value="${doc.id ?? ''}">
                    <div class="mb-3">
                        <label class="mb-2" data-i18n="documentName"></label>
                        <input type="text" class="form-control" id="doc_name" value="${doc.document_name ?? ''}">
                    </div>
                    <div class="mb-3">
                        <label class="mb-2" data-i18n="uploadFile"></label>
                        <input type="file" class="form-control" id="doc_file">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="mb-2" data-i18n="fileType"></label>
                            <input type="text" class="form-control" id="doc_type" readonly>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="mb-2" data-i18n="fileSize"></label>
                            <input type="text" class="form-control" id="doc_size" readonly>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="mb-2" data-i18n="startDate"></label>
                            <input type="date" class="form-control" id="doc_start" value="${doc.start_date ?? ''}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="mb-2" data-i18n="endDate"></label>
                            <input type="date" class="form-control" id="doc_end" value="${doc.end_date ?? ''}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="mb-2" data-i18n="privacy"></label>
                        <select id="doc_public" class="form-select">
                            <option value="public" ${(doc.status === "public" ? "selected" : "")} data-i18n="public"></option>
                            <option value="private" ${(doc.status === "private" ? "selected" : "")} data-i18n="private"></option>
                        </select>
                    </div>
                `);
                loadLang(currentLang);
            }
        }
    });
});
$(document).on("change", "#doc_file", function () {
    let file = this.files[0];
    if (!file) return;
    let ext = file.name.split('.').pop().toUpperCase();
    let sizeKB = (file.size / 1024).toFixed(1) + " KB";
    $("#doc_type").val(ext);
    $("#doc_size").val(sizeKB);
});