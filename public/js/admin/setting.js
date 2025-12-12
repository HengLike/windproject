function previewLogo(input) {
    const preview = document.getElementById('logoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" class="preview-img" alt="Logo Preview">
                <button class="remove-btn" onclick="removeLogo()">
                    <i class="bi bi-x"></i>
                </button>
            `;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function removeLogo() {
    const preview = document.getElementById('logoPreview');
    document.getElementById('logoInput').value = '';
    preview.innerHTML = `
        <div class="text-center">
            <i class="bi bi-cloud-upload fs-1 text-muted"></i>
            <p class="mt-2 text-muted">คลิกเพื่อ อัปโหลดโลโก้</p>
            <small class="text-muted">PNG, JPG (แนะนำ 200x200px)</small>
        </div>
    `;
}
function previewBackground(id, input) {
    const preview = document.getElementById(id);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" class="preview-img" alt="Background Preview">
                <button class="remove-btn" onclick="removeBackground('${id}')">
                    <i class="bi bi-x"></i>
                </button>
            `;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
function removeBackground(id) {
    const preview = document.getElementById(id);
    const inputId = id + 'Input';
    document.getElementById(inputId).value = '';
    preview.innerHTML = `
        <div class="text-center">
            <i class="bi bi-image fs-2 text-muted"></i>
            <p class="mt-2 mb-0 text-muted">อัปโหลดพื้นหลัง</p>
        </div>
        <button class="remove-btn" onclick="removeBackground('${id}')">
            <i class="bi bi-x"></i>
        </button>
    `;
}
function toggleLanguage(lang) {
    const element = document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1));
    const isActive = element.classList.contains('active');
    const activeLanguages = document.querySelectorAll('.lang-toggle.active').length;
    if (isActive && activeLanguages === 1) {
        alert('ต้องเปิดใช้งานอย่างน้อย 1 ภาษา');
        return;
    }
    element.classList.toggle('active');
    const icon = element.querySelector('i.bi');
    if (element.classList.contains('active')) {
        icon.className = 'bi bi-check-circle-fill fs-4';
    } else {
        icon.className = 'bi bi-circle fs-4 text-muted';
    }
}
function saveSettings() {
    const settings = {
        websiteName: {
            th: document.getElementById('nameTh').value,
            en: document.getElementById('nameEn').value,
            lo: document.getElementById('nameLo').value
        },
        languages: {
            th: document.getElementById('langTh').classList.contains('active'),
            en: document.getElementById('langEn').classList.contains('active'),
            lo: document.getElementById('langLo').classList.contains('active')
        }
    };
    console.log('Settings saved:', settings);
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alert.style.zIndex = '9999';
    alert.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>บันทึกสำเร็จ!</strong> การตั้งค่าของคุณถูกบันทึกเรียบร้อยแล้ว
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}