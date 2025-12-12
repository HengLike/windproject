<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Gallery + 360° Viewer</title>

  <!-- Fancybox 5 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" />
  <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.umd.js"></script>

  <!-- PhotoSphereViewer (ต้องใช้ three.js) -->
  <link rel="stylesheet" href="https://unpkg.com/photo-sphere-viewer@4/dist/photo-sphere-viewer.min.css" />
  <script src="https://unpkg.com/three@0.136.0/build/three.min.js"></script>
  <script src="https://unpkg.com/photo-sphere-viewer@4/dist/photo-sphere-viewer.min.js"></script>

  <!-- Bootstrap 5 (ถ้าต้องการ styling เท่านั้น) -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .img-thumb { cursor: pointer; height:140px; object-fit:cover; width:100%; }
    .img360-thumb { cursor:pointer; height:160px; object-fit:cover; width:100%; }
    /* Fancybox: make thumbnails area a bit smaller */
    .psv-fancybox-content { width:100%; height:100vh; max-width:100vw; max-height:100vh; padding:0; }
    /* container for PhotoSphereViewer */
    #psv-root { width:100%; height:100vh; }
  </style>
</head>
<body class="p-3">

  <div class="container">
    <h5>Gallery รูปภาพ</h5>
    <div id="normal-gallery" class="row g-2 mb-4">
      <!-- ตัวอย่าง: replace ด้วย pole.images -->
      <!-- รูปธรรมดา / วิดีโอ ให้ใช้ data-fancybox="gallery" -->
    </div>

    <h5>Gallery รูป 360°</h5>
    <div id="pano-gallery" class="row g-2">
      <!-- ตัวอย่าง: replace ด้วย pole.images360 -->
    </div>

    <!-- ปุ่มโหลดรูปเพิ่ม (สำหรับกรณีมีรูปเยอะ) -->
    <div class="mt-3 text-center">
      <button id="load-more" class="btn btn-outline-primary">Load more</button>
    </div>
  </div>

  <!-- Template container สำหรับ PhotoSphereViewer ที่จะถูกแสดงโดย Fancybox -->
  <div style="display:none;">
    <div id="psv-template" class="psv-fancybox-content">
      <div id="psv-root"></div>
    </div>
  </div>

<script>
  // --- ตัวอย่างข้อมูล (แทน pole.images / pole.images360) ---
  const images = [
    'https://picsum.photos/id/1015/1200/800',
    'https://picsum.photos/id/1016/1200/800',
    'https://www.w3schools.com/html/pic_trulli.jpg',
    // เพิ่ม url รูปหรือ video
    // ตัวอย่างวิดีโอ YouTube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  ];
  const images360 = [
    // ต้องเป็นภาพพาโนรามา (equirectangular)
    'https://photo-sphere-viewer.js.org/assets/sphere.jpg',
    // เพิ่ม URL พาโนรามาอื่น ๆ
  ];

  // --- ฟังก์ชันสร้าง gallery DOM (normal images + video) ---
  function renderNormalGallery(list) {
    const wrap = document.getElementById('normal-gallery');
    wrap.innerHTML = '';
    list.forEach((url, i) => {
      // ตรวจสอบถ้าเป็น video (YouTube / Vimeo) ให้ใช้ data-fancybox ตรง ๆ
      const isVideo = /youtube\.com|youtu\.be|vimeo\.com/.test(url);
      const thumb = isVideo ? `https://img.youtube.com/vi/${youtubeId(url)}/hqdefault.jpg` : url;
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4';
      col.innerHTML = `
        <a data-fancybox="gallery" data-thumb="${thumb}" href="${url}">
          <img loading="lazy" src="${thumb}" class="img-thumb rounded" alt="thumb ${i+1}">
        </a>
      `;
      wrap.appendChild(col);
    });
  }

  function youtubeId(url) {
    // ดึง id แบบง่ายๆ (ไม่ครอบคลุมทุกรูปแบบ)
    const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    return m ? m[1] : '';
  }

  // --- ฟังก์ชันสร้าง 360 gallery (เรียก openPSV เมื่อคลิก) ---
  function renderPanoGallery(list) {
    const wrap = document.getElementById('pano-gallery');
    wrap.innerHTML = '';
    list.forEach((url, i) => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-3';
      col.innerHTML = `
        <div class="position-relative">
          <img loading="lazy" src="${url}" class="img360-thumb rounded" data-psv="${url}" alt="360 ${i+1}">
          <div class="position-absolute top-50 start-50 translate-middle">
            <i class="bi bi-arrow-clockwise text-white" style="font-size: 1.8rem; text-shadow:0 0 8px rgba(0,0,0,0.7)"></i>
          </div>
        </div>
      `;
      wrap.appendChild(col);
    });

    // bind click
    wrap.querySelectorAll('[data-psv]').forEach(el => {
      el.addEventListener('click', (ev) => {
        const url = el.getAttribute('data-psv');
        openPSVInFancybox(url);
      });
    });
  }

  // --- เปิด PhotoSphereViewer ภายใน Fancybox ---
  let currentPSV = null;
  function openPSVInFancybox(imageUrl) {
    Fancybox.show([{
      src: document.getElementById('psv-template').innerHTML,
      type: "html",
      mainClass: "psv-fancybox-content",
    }], {
      on: {
        ready: (f) => {
          // สร้าง element root ใหม่ (Fancybox จะสร้าง DOM จาก template)
          const root = document.querySelector('.psv-fancybox-content #psv-root') || document.getElementById('psv-root');
          // ถ้ามี instance เก่า ให้ทำลายก่อน
          if (currentPSV) { currentPSV.destroy(); currentPSV = null; }
          // สร้าง PhotoSphereViewer
          currentPSV = new PhotoSphereViewer.PhotoSphereViewer({
            container: root,
            panorama: imageUrl,          // URL รูปพาโนรามา
            defaultYaw: '130deg',
            navbar: [
              'fullscreen',
              'zoom',
              'download',
              'select',
            ],
            mousewheel: true,
            moveSpeed: 1.0,
            zoom: {
              max: 90,
              min: 30
            },
            loadingImg: 'https://photo-sphere-viewer.js.org/assets/photosphere-logo.gif',
            caption: '360° Viewer',
          });
        },
        closing: () => {
          if (currentPSV) { currentPSV.destroy(); currentPSV = null; }
        }
      },
      // Fancybox options: ปรับ UI ให้เต็มหน้าจอ
      dragToClose: false,
      Toolbar: false,
      animated: false,
      showClass: false,
      hideClass: false,
      placeFocusBack: false,
    });
  }

  // --- Fancybox global bind (สำหรับรูป/วิดีโอ ธรรมดา) ---
  Fancybox.bind("[data-fancybox]", {
    Thumbs: {
      autoStart: true,
    },
    Image: {
      zoom: true,
      click: "toggleZoom"
    },
    Carousel: {
      preload: 2, // preload จำนวนภาพด้านหน้า/หลัง (ปรับสำหรับ performance)
    },
    // enable lazy load for fancybox images
    lazy: true,
  });

  // --- Lazy-thumbnail improvement: IntersectionObserver example (โหลด src จริงเมื่อเข้ามาใน viewport) ---
  function enableLazyThumbnails() {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const img = e.target;
            // ถ้าใช้ data-src pattern -> img.src = img.dataset.src;
            // แต่ ในตัวอย่างเราใส่ src ไว้แล้ว (picsum) จึงไม่ต้องเปลี่ยน
            obs.unobserve(img);
          }
        });
      }, {rootMargin: '200px'});
      imgs.forEach(i => io.observe(i));
    }
  }

  // --- Load more (สำหรับรูปเยอะ ๆ) ---
  let page = 1;
  function loadMore() {
    // ตัวอย่าง: สมมติมี API / server ที่คืนรูป batch ละ 12
    // ในตัวอย่างนี้เราจะดึงจาก array เดิม (จำลอง)
    page++;
    // TODO: replace with real fetch('/api/images?page=' + page)
    // หลัง load ใหม่ ให้เรียก render functions เพิ่มเติม
    // สำหรับตัวอย่างนี้ทำ nothing
    alert('ให้ implement load-more กับ backend หรือโหลดข้อมูลเพิ่มที่นี่ (page=' + page + ')');
  }

  document.getElementById('load-more').addEventListener('click', loadMore);

  // --- เริ่มต้น render ---
  renderNormalGallery(images);
  renderPanoGallery(images360);
  enableLazyThumbnails();

</script>

<!-- Bootstrap JS (ถ้าจำเป็น) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
