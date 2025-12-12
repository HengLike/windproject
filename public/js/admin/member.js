let tb_member;
function initMemberTable() {
    tb_member = $('#tb_member').DataTable({
        processing: true,
        serverSide: true,
        responsive: true, 
        ajax: { 
            url: "api/member/list",
            type: "POST",
            data: function(d){
                d.company = $('#filter_company').val();
                d.position = $('#filter_position').val();
                d.role = $('#filter_role').val();
                d.status = $('#filter_status').val();
            }
        },
        columns: [         
            { 
                data: null, 
                className: 'text-center',
                render: function(row){
                    let initials = "";
                    if (row.firstname) initials += row.firstname.charAt(0).toUpperCase();
                    if (row.lastname)  initials += row.lastname.charAt(0).toUpperCase();
                    let colors = [
                        "#A3D8F4", "#F7B5CA", "#C4DFAA", "#F9D390", 
                        "#B5C7F2", "#E2A9F3", "#F5A7A7", "#A7E9AF"
                    ];
                    let bg = colors[Math.floor(Math.random() * colors.length)];
                    return `
                        <div class="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                            style="width:35px; height:35px; background:${bg}; font-size:0.85rem;">
                            ${initials}
                        </div>
                    `;
                } 
            }, 
            { 
                data: null,
                render: function(row){
                    return `${row.firstname} ${row.lastname}`;
                } 
            },
            { data: "company" },
            { data: "position" },
            { data: "email" },
            { data: "tel" },
            { data: "role" },
            { data: "create_at" },
            { data: "create_by" },
            { 
                data: "status",
                render: function(status){
                    let badge = status === "Active" ? "success" : "secondary";
                    return `<span class="badge bg-${badge} text-${badge} bg-opacity-10" style="font-size: 13px; font-weight: 400;">${status}</span>`;
                }
            },
            {
                data: null,
                className: 'text-center',
                render: function(){
                    return `
                        <button class="btn btn-light text-secondary manage-member" data-id="1"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-light text-secondary"><i class="fa-regular fa-trash-can"></i></button>
                    `;
                }
            }
        ],
        pageLength: pageLength,
        lengthMenu: lengthMenu,
        language: getTableLang(),
        initComplete: function(){
            var input = $('#tb_member_filter input').unbind();
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
    tb_member.ajax.reload();
});
function loadMemberFilters() {
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
    initMemberTable(); 
    loadMemberFilters();
}
$(document).ready(function () {
    initApp();
});
$(document).on('click', '.manage-member', function() {
    let member_id = $(this).data("id");
    $.ajax({
        url: 'api/member/get',
        method: 'POST',
        data: { id: member_id },
        dataType: 'json',
        success: function(res) {
            if(res.status === 'success'){
                let member = res.data;
                $('#edit_firstname').val(member.firstname);
                $('#edit_lastname').val(member.lastname);
                $('#edit_company').val(member.company);
                $('#edit_position').val(member.position);
                $('#edit_role').val(member.role);
                $('#edit_email').val(member.email);
                $('#edit_tel').val(member.tel);
                $('#edit_status').val(member.status);
                let modalEl = $('#windModal');
                let modal = new bootstrap.Modal(modalEl[0]);
                modal.show();
                modalEl.find(".modal-header").html(`
                    <h5 class="modal-title" data-i18n="manageMember"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                `);
                modalEl.find(".modal-footer").html(`
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="close"></button>
                    <button type="submit" class="btn btn-primary" data-i18n="save"></button>
                `);
                modalEl.find(".modal-body").html(`
                    <ul class="nav nav-tabs" id="memberTab">
                        <li class="nav-item">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#general" data-i18n="general"></button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#contact" data-i18n="contact"></button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#password" data-i18n="password"></button>
                        </li>
                    </ul>
                    <div class="tab-content pt-3">
                        <div class="tab-pane fade show active" id="general">
                            <input type="hidden" name="member_id" id="member_id">
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="firstname"></label>
                                <input type="text" class="form-control" name="firstname" id="edit_firstname">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="lastname"></label>
                                <input type="text" class="form-control" name="lastname" id="edit_lastname">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="company"></label>
                                <input type="text" class="form-control" name="company" id="edit_company">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="position"></label>
                                <input type="text" class="form-control" name="position" id="edit_position">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="role"></label>
                                <select class="form-select" name="role" id="edit_role">
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="contact">
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="email"></label>
                                <input type="email" class="form-control" name="email" id="edit_email">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="mobile"></label>
                                <input type="text" class="form-control" name="tel" id="edit_tel">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="status"></label>
                                <select class="form-select" name="status" id="edit_status">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="password">
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="newPassword"></label>
                                <input type="password" class="form-control" name="password" id="edit_password">
                            </div>
                            <div class="mb-3">
                                <label class="mb-2" data-i18n="confirmPassword"></label>
                                <input type="password" class="form-control" name="confirm_password" id="edit_confirm_password">
                            </div>
                        </div>
                    </div>
                `);
                loadLang(currentLang);
            } else {
                showError('Error', res.message || 'Cannot load member data');
            }
        },
        error: function(){
            showError('Error', 'Cannot load member data');
        }
    });
});