// ===== CHECK ID VÀ REDIRECT =====
// Nếu có id trong URL (?xxx hoặc ?id=xxx) → chuyển đến trang chủ để xem quà
(function () {
  function getGiftIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (id) return id;
    for (var key of params.keys()) {
      if (/^[a-f0-9]{24}$/i.test(key)) return key;
    }
    return null;
  }

  var womensId = getGiftIdFromUrl();
  if (womensId) {
    window.location.href = window.location.origin + '/index.html?' + womensId;
  }
})();

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqo1SRTW_egClnesFkDIjr-j15E8ShBAA",
  authDomain: "my-server-ec222.firebaseapp.com",
  projectId: "my-server-ec222",
  storageBucket: "my-server-ec222.firebasestorage.app",
  messagingSenderId: "492606733299",
  appId: "1:492606733299:web:89b751a576c1e3af1b3086",
  measurementId: "G-G4E0JXK4JX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ═══════════════════════════════════════════════════
// 🎵 MUSIC — API fetch + fallback (theo huong_dan_fetch_nhac)
// ═══════════════════════════════════════════════════
const API_MUSICS_URL = 'https://api.giftory.pro/api/musics';

// Bài tình yêu hiện ngoài dạng Featured cards
const FEATURED_MUSIC_IDS = [
  'daobuochongkong', 'loitutraitimanh', 'beautyandabeat', 'thanhtan',
  'iloveyou', 'noinaycoanh', 'yeuemratnhieu', 'athousandyears'
];

// Thời lượng bài hát mặc định để luôn hiển thị đủ thông tin
const FEATURED_DURATIONS = {
  'daobuochongkong': '2:45',
  'loitutraitimanh': '4:01',
  'beautyandabeat': '3:48',
  'thanhtan': '3:44',
  'iloveyou': '3:30',
  'noinaycoanh': '4:20',
  'yeuemratnhieu': '4:15',
  'athousandyears': '4:45'
};

// Category bỏ (trungthu không cần cho dự án này)
const EXCLUDED_CATEGORIES = ['trungthu'];

// Fallback: Nhạc local nếu API lỗi (chỉ giữ love)
const FALLBACK_FEATURED = [];
const FALLBACK_OTHERS = [
  { id: 'noinaycoanh', name: 'Nơi Này Có Anh', category: 'love', url: '/assets/musics/noinaycoanh.mp3' },
  { id: 'anhnangcuaanh', name: 'Ánh Nắng Của Anh', category: 'love', url: '/assets/musics/anhnangcuaanh.mp3' },
  { id: 'daobuochongkong', name: 'Dạo Bước Hongkong', category: 'love', url: '/assets/musics/daobuochongkong.mp3' },
  { id: 'iloveyou', name: 'I Love You_Bùi Công Nam', category: 'love', url: '/assets/musics/iloveyou.mp3' },
  { id: 'duchotanthe', name: 'Dù Cho Tận Thế', category: 'love', url: '/assets/musics/duchotanthe.mp3' },
  { id: 'dongiananhyeuem', name: 'Đơn Giản Anh Yêu Em', category: 'love', url: '/assets/musics/dongiananhyeuem.mp3' },
  { id: 'thuongemdengia', name: 'Thương Em Đến Già', category: 'love', url: '/assets/musics/thuongemdengia.mp3' },
  { id: 'votuyetvoinhat', name: 'Vợ Tuyệt Vời Nhất', category: 'love', url: '/assets/musics/votuyetvoinhat.mp3' },
  { id: 'yeuemhonmoingay', name: 'Yêu Em Hơn Mỗi Ngày', category: 'love', url: '/assets/musics/yeuemhonmoingay.mp3' },
  { id: 'yeuemratnhieu', name: 'Yêu Em Rất Nhiều', category: 'love', url: '/assets/musics/yeuemratnhieu.mp3' },
  { id: 'cochacyeuladay', name: 'Có Chắc Yêu Là Đây', category: 'love', url: '/assets/musics/cochacyeuladay.mp3' },
  { id: 'codoidieu', name: 'Có Đôi Điều', category: 'love', url: '/assets/musics/codoidieu.mp3' },
  { id: 'denbenanh', name: 'Đến Bên Anh', category: 'love', url: '/assets/musics/denbenanh.mp3' },
  { id: 'phepmau', name: 'Phép Màu', category: 'love', url: '/assets/musics/phepmau.mp3' },
  { id: '1000anhmat', name: '1000 Ánh Mắt', category: 'love', url: '/assets/musics/1000anhmat.mp3' },
  { id: 'danhchoem', name: 'Dành Cho Em', category: 'love', url: '/assets/musics/danhchoem.mp3' },
  { id: 'mienman', name: 'Miên Man', category: 'love', url: '/assets/musics/mienman.mp3' },
  { id: 'motdoi', name: 'Một đời', category: 'love', url: '/assets/musics/motdoi.mp3' },
  { id: 'tinhyeugiuamuadong', name: 'Tình Yêu Giữa Mùa Đông', category: 'love', url: '/assets/musics/tinhyeugiuamuadong.mp3' },
  { id: 'dancinginthedark', name: 'Dancing In The Dark', category: 'love', url: '/assets/musics/dancinginthedark.mp3' },
  { id: 'perfect', name: 'Perfect', category: 'love', url: '/assets/musics/perfect.mp3' },
  { id: 'athousandyears', name: 'A Thousand Years', category: 'love', url: '/assets/musics/athousandyears.mp3' },
  { id: 'givemeyourforever', name: 'Give Me Your Forever', category: 'love', url: '/assets/musics/givemeyourforever.mp3' },
  { id: 'digiuatroirucro', name: 'Đi giữa trời rực rỡ', category: 'love', url: '/assets/musics/digiuatroirucro.mp3' }
];

// State nhạc
var featuredMusics = FALLBACK_FEATURED;
var dropdownMusics = FALLBACK_OTHERS;
var selectedMusicUrl = '';
var playingSongId = null;
var previewAudioEl = null;

// State Voucher
const VOUCHER_API_BASE = 'https://api.giftory.pro/api/voucher';
let appliedVoucher = null; // { code: string, discountPercent: number }
let cachedActiveVouchers = [];
let cachedUserVouchers = [];

// Auth state observer
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    showUserInfo(user);
    showForm();
  } else {
    // User is signed out
    showLogin();
  }
});

// Show login section
function showLogin() {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('userInfoSection').style.display = 'none';
  document.getElementById('formContainer').classList.remove('show');
  cachedUserVouchers = [];
  if (typeof renderVoucherList === 'function') renderVoucherList();
}

// Show user info and form
function showUserInfo(user) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('userInfoSection').style.display = 'flex';
  document.getElementById('formContainer').classList.add('show');

  // Lưu uid và email vào localStorage khi login
  if (user && user.uid) {
    localStorage.setItem('user_uid', user.uid);
    if (user.email) {
      localStorage.setItem('customerEmail', user.email);
    }
  }

  var voucherCheckbox = document.getElementById('voucherCheckbox');
  if (voucherCheckbox && voucherCheckbox.checked && typeof loadVouchers === 'function') {
    loadVouchers(true);
  }

  // Update user info
  document.getElementById('userName').textContent = user.displayName || 'Người dùng';
  document.getElementById('userEmailText').textContent = user.email || '';
  document.getElementById('userAvatar').src = user.photoURL || 'https://via.placeholder.com/56';

  // Fallback avatar nếu không có photoURL
  if (!user.photoURL) {
    const avatar = document.getElementById('userAvatar');
    avatar.onerror = function () {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM2NjdlZWEiLz4KPHBhdGggZD0iTTEyIDhDMTMuMSA4IDE0IDguOSAxNCAxMEMxNCAxMS4xIDEzLjEgMTIgMTIgMTJDMTAuOSAxMiAxMCAxMS4xIDEwIDEwQzEwIDguOSAxMC45IDggMTIgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMgMTQgNyAxNS4zIDcuNSAxN0gxNi41QzE3IDE1LjMgMTQuNyAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
    };
  }
}

var DRAFT_STORAGE_KEY = 'womensdaypro_create_draft';
var draftSaveTimeout = null;
var restoredDraftThisSession = false;
window.restoredCustomMusicBase64 = null;

function dataURLToBlob(dataUrl) {
  return fetch(dataUrl).then(function (r) { return r.blob(); });
}

function saveDraftTextSync() {
  try {
    var introTextEl = document.getElementById('introText');
    var letterTitleEl = document.getElementById('letterTitle');
    var letterContentEl = document.getElementById('letterContent');
    var letterSignatureEl = document.getElementById('letterSignature');
    var musicTypeRadio = document.querySelector('input[name="musicType"]:checked');
    var sampleMusicEl = document.getElementById('sampleMusic');
    var vipGiftEl = document.getElementById('vipGift');
    var saveForeverEl = document.getElementById('saveForever');
    var voucherCheckboxEl = document.getElementById('voucherCheckbox');
    if (!letterTitleEl) return;
    var flowerColorEl = document.getElementById('flowerColor');
    var draft = {
      flowerColor: flowerColorEl ? (flowerColorEl.value || 'classic') : 'classic',
      introText: introTextEl ? (introTextEl.value || '') : '',
      letterTitle: letterTitleEl.value || '',
      letterContent: letterContentEl.value || '',
      letterSignature: letterSignatureEl ? letterSignatureEl.value || '' : '',
      musicType: musicTypeRadio ? musicTypeRadio.value : 'sample',
      sampleMusic: sampleMusicEl ? sampleMusicEl.value || '' : '',
      vipGift: vipGiftEl ? vipGiftEl.checked : false,
      saveForever: saveForeverEl ? saveForeverEl.checked : false,
      useVoucher: voucherCheckboxEl ? voucherCheckboxEl.checked : false,
      voucherCode: appliedVoucher ? (appliedVoucher.code || '') : ''
    };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) { console.warn('[Draft] saveDraftTextSync:', e); }
}

function saveDraft() {
  var introTextEl = document.getElementById('introText');
  var letterTitleEl = document.getElementById('letterTitle');
  if (!letterTitleEl) return;
  var letterContentEl = document.getElementById('letterContent');
  var letterSignatureEl = document.getElementById('letterSignature');
  var musicTypeRadio = document.querySelector('input[name="musicType"]:checked');
  var sampleMusicEl = document.getElementById('sampleMusic');
  var vipGiftEl = document.getElementById('vipGift');
  var saveForeverEl = document.getElementById('saveForever');
  var voucherCheckboxEl = document.getElementById('voucherCheckbox');
  var customMusicEl = document.getElementById('customMusic');
  var flowerColorEl = document.getElementById('flowerColor');
  var draft = {
    flowerColor: flowerColorEl ? (flowerColorEl.value || 'classic') : 'classic',
    introText: introTextEl ? (introTextEl.value || '') : '',
    letterTitle: letterTitleEl.value || '',
    letterContent: letterContentEl.value || '',
    letterSignature: letterSignatureEl ? letterSignatureEl.value || '' : '',
    musicType: musicTypeRadio ? musicTypeRadio.value : 'sample',
    sampleMusic: sampleMusicEl ? sampleMusicEl.value || '' : '',
    vipGift: vipGiftEl ? vipGiftEl.checked : false,
    saveForever: saveForeverEl ? saveForeverEl.checked : false,
    useVoucher: voucherCheckboxEl ? voucherCheckboxEl.checked : false,
    voucherCode: appliedVoucher ? (appliedVoucher.code || '') : '',
    vipPhotos: [],
    customMusicBase64: null
  };
  if (typeof fileToBase64 !== 'function') {
    saveDraftTextSync();
    return;
  }
  var hasVip = vipPhotoResults && vipPhotoResults.length > 0;
  var hasCustomMusic = musicTypeRadio && musicTypeRadio.value === 'custom' && customMusicEl && customMusicEl.files && customMusicEl.files[0];
  if (!hasVip && !hasCustomMusic) {
    if (typeof saveDraftData !== 'undefined') saveDraftData(draft).catch(function (e) { console.warn('[Draft] saveDraft:', e); });
    saveDraftTextSync();
    return;
  }
  var seq = Promise.resolve();
  if (hasVip) {
    vipPhotoResults.forEach(function (r, i) {
      seq = seq.then(function () {
        return fileToBase64(r.blob).then(function (base64) {
          draft.vipPhotos[i] = base64;
        });
      });
    });
  }
  if (hasCustomMusic) {
    seq = seq.then(function () {
      return fileToBase64(customMusicEl.files[0]).then(function (base64) {
        draft.customMusicBase64 = base64;
        draft.customMusicFileName = customMusicEl.files[0].name;
      });
    });
  }
  seq.then(function () {
    if (typeof saveDraftData !== 'undefined') return saveDraftData(draft);
  }).then(function () { saveDraftTextSync(); }).catch(function (e) { console.warn('[Draft] saveDraft:', e); });
}

function restoreDraft() {
  function applyTextAndOptions(data) {
    var introTextEl = document.getElementById('introText');
    var letterTitleEl = document.getElementById('letterTitle');
    var letterContentEl = document.getElementById('letterContent');
    var letterSignatureEl = document.getElementById('letterSignature');
    var sampleMusicEl = document.getElementById('sampleMusic');
    var vipGiftEl = document.getElementById('vipGift');
    var saveForeverEl = document.getElementById('saveForever');
    if (data.flowerColor && typeof window.selectFlowerColor === 'function') {
      window.selectFlowerColor(data.flowerColor);
    }
    if (introTextEl && data.introText != null) {
      introTextEl.value = data.introText;
      introTextEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (letterTitleEl && data.letterTitle != null) {
      letterTitleEl.value = data.letterTitle;
      letterTitleEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (letterContentEl && data.letterContent != null) {
      letterContentEl.value = data.letterContent;
      letterContentEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (letterSignatureEl && data.letterSignature != null) {
      letterSignatureEl.value = data.letterSignature;
      letterSignatureEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (data.musicType) {
      var radio = document.querySelector('input[name="musicType"][value="' + data.musicType + '"]');
      if (radio) radio.checked = true;
    }
    if (sampleMusicEl && data.sampleMusic != null) {
      sampleMusicEl.value = data.sampleMusic;
      selectedMusicUrl = data.sampleMusic;
    }
    if (vipGiftEl != null && data.vipGift !== undefined) {
      vipGiftEl.checked = !!data.vipGift;
      document.getElementById('vipPhotosContainer').style.display = data.vipGift ? 'block' : 'none';
    }
    if (saveForeverEl != null && data.saveForever !== undefined) saveForeverEl.checked = !!data.saveForever;
    var voucherCheckboxEl = document.getElementById('voucherCheckbox');
    if (voucherCheckboxEl != null && data.useVoucher !== undefined) {
      voucherCheckboxEl.checked = !!data.useVoucher;
      var vContainer = document.getElementById('voucherContainer');
      if (vContainer) vContainer.style.display = data.useVoucher ? 'block' : 'none';
      if (data.useVoucher && typeof loadVouchers === 'function') {
        loadVouchers();
        if (data.voucherCode && typeof applyVoucherCode === 'function') {
          applyVoucherCode(data.voucherCode);
        }
      }
    }
    var customMusicContainer = document.getElementById('customMusicContainer');
    var sampleMusicContainer = document.getElementById('sampleMusicContainer');
    if (data.musicType === 'custom' && customMusicContainer) customMusicContainer.style.display = 'block';
    if (data.musicType === 'sample' && sampleMusicContainer) sampleMusicContainer.style.display = 'block';

    // Đồng bộ UI nhạc (featured cards + dropdown + audio preview) với bài đã lưu từ bản nháp
    if (selectedMusicUrl) {
      syncMusicSelectionUI();
    }
  }
  function restoreFromData(data) {
    if (!data) return Promise.resolve(false);
    applyTextAndOptions(data);
    if (typeof calculatePrice === 'function') calculatePrice();
    if (typeof validateVipPhotos === 'function') validateVipPhotos();
    if (data.customMusicBase64) {
      window.restoredCustomMusicBase64 = data.customMusicBase64;
      // Chuyển base64 thành File thật và gán vào input #customMusic
      try {
        var customMusicInput = document.getElementById('customMusic');
        if (customMusicInput) {
          var dataUrl = data.customMusicBase64;
          // Tách mime type và tên file từ base64
          var mimeMatch = dataUrl.match(/^data:(audio\/[^;]+)/);
          var mime = mimeMatch ? mimeMatch[1] : 'audio/mpeg';
          var extMap = { 'audio/mpeg': '.mp3', 'audio/wav': '.wav', 'audio/x-m4a': '.m4a', 'audio/aac': '.aac', 'audio/ogg': '.ogg', 'audio/flac': '.flac', 'audio/webm': '.webm' };
          var ext = extMap[mime] || '.mp3';
          // Decode base64 → blob → File
          var fileName = data.customMusicFileName || ('nhac-ban-nhap' + ext);
          fetch(dataUrl).then(function (res) { return res.blob(); }).then(function (blob) {
            var restoredFile = new File([blob], fileName, { type: mime });
            var dt = new DataTransfer();
            dt.items.add(restoredFile);
            customMusicInput.files = dt.files;
            // Cập nhật audio preview
            if (typeof updateAudioPreview === 'function') updateAudioPreview();
          }).catch(function (e) {
            console.warn('[Draft] Không thể khôi phục file nhạc:', e);
          });
        }
      } catch (e) {
        console.warn('[Draft] Lỗi khôi phục file nhạc:', e);
      }
    }
    if (data.vipPhotos && data.vipPhotos.length > 0) {
      var promises = data.vipPhotos.map(function (dataUrl) {
        return dataURLToBlob(dataUrl).then(function (blob) {
          var previewUrl = URL.createObjectURL(blob);
          return { blob: blob, previewUrl: previewUrl, isOriginal: false };
        });
      });
      return Promise.all(promises).then(function (results) {
        vipPhotoResults.length = 0;
        results.forEach(function (r) { vipPhotoResults.push(r); });
        if (typeof renderVipPhotoPreview === 'function') renderVipPhotoPreview();
        if (typeof calculatePrice === 'function') calculatePrice();
        if (typeof validateVipPhotos === 'function') validateVipPhotos();
        return true;
      }).catch(function (e) { console.warn('[Draft] restore vipPhotos:', e); return true; });
    }
    return Promise.resolve(true);
  }
  if (typeof loadDraftData !== 'undefined') {
    loadDraftData().then(function (data) {
      if (data) return restoreFromData(data);
      var raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) try { return restoreFromData(JSON.parse(raw)); } catch (e) { return false; }
      return false;
    }).then(function (restored) {
      var data = restored ? null : (function () { try { var r = localStorage.getItem(DRAFT_STORAGE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } })();
      if (data && !restored) applyTextAndOptions(data);
      if (typeof calculatePrice === 'function') calculatePrice();
      if (typeof validateVipPhotos === 'function') validateVipPhotos();
      var hasContent = (data && data.letterTitle && data.letterTitle.trim()) || (data && data.letterContent && data.letterContent.trim());
      if (restored && typeof showToast === 'function') showToast('Đã khôi phục bản nháp (chưa thanh toán).', 'info');
      else if (hasContent && !restored && typeof showToast === 'function') showToast('Đã khôi phục bản nháp. File nhạc/ảnh cần chọn lại.', 'info');
    }).catch(function (e) {
      var raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) try { var data = JSON.parse(raw); applyTextAndOptions(data); calculatePrice(); validateVipPhotos(); } catch (err) { }
    });
  } else {
    var raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      applyTextAndOptions(data);
      if (typeof calculatePrice === 'function') calculatePrice();
      if (typeof validateVipPhotos === 'function') validateVipPhotos();
      var hasContent = (data.letterTitle && data.letterTitle.trim()) || (data.letterContent && data.letterContent.trim());
      if (hasContent && typeof showToast === 'function') showToast('Đã khôi phục bản nháp. File nhạc/ảnh cần chọn lại.', 'info');
    } catch (e) { console.warn('[Draft] restoreDraft:', e); }
  }
}

function clearDraft() {
  try {
    window.restoredCustomMusicBase64 = null;
    if (typeof clearDraftData !== 'undefined') clearDraftData().catch(function (e) { console.warn('[Draft] clearDraft:', e); });
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (e) { console.warn('[Draft] clearDraft:', e); }
}

function scheduleSaveDraft() {
  if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
  draftSaveTimeout = setTimeout(saveDraft, 600);
}
window.addEventListener('beforeunload', function () {
  saveDraftTextSync();
  saveDraft();
});

function showForm() {
  document.getElementById('formContainer').classList.add('show');
  if (!restoredDraftThisSession) {
    restoredDraftThisSession = true;
    restoreDraft();
  }
}

// Login with Google
document.getElementById('btnLogin').addEventListener('click', function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');

  auth.signInWithPopup(provider)
    .then(function (result) {
      // Login successful, auth state will be updated by onAuthStateChanged
    })
    .catch(function (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại: ' + error.message);
    });
});

// Custom Modal Functions
function showConfirmModal() {
  const modal = document.getElementById('confirmModal');
  modal.classList.add('show');
}

function hideConfirmModal() {
  const modal = document.getElementById('confirmModal');
  modal.classList.remove('show');
}

let saveForeverModalShownThisSession = false;
var pendingSubmitAfterSaveForever = false;

function showSaveForeverModal() {
  document.getElementById('saveForeverConfirmModal').classList.add('show');
}

function hideSaveForeverModal() {
  document.getElementById('saveForeverConfirmModal').classList.remove('show');
}

// Order History Functions
const GIFT_PRODUCT_TYPE = 'womensdaypro-gift';
const PENDING_ORDER_MAX_AGE_MS = 60 * 60 * 1000; // 1 giờ — khớp thời hạn link thanh toán

function getNormalizedOrderStatus(order) {
  var raw = order.status || order.paymentStatus || order.payment_status || '';
  return String(raw).trim().toUpperCase();
}

function isPaidOrderStatus(status) {
  return status === 'PAID' || status === 'SUCCESS' || status === 'COMPLETED';
}

function isPendingOrderStatus(status) {
  return status === 'PENDING' || status === 'PROCESSING' || status === 'UNPAID';
}

function isOrderWithinPendingWindow(order) {
  var createdAt = new Date(order.createdAt || order.created_at);
  if (isNaN(createdAt.getTime())) return true;
  return (Date.now() - createdAt.getTime()) <= PENDING_ORDER_MAX_AGE_MS;
}

function isValidOrderForHistory(order) {
  var status = getNormalizedOrderStatus(order);
  if (isPaidOrderStatus(status)) return true;
  if (isPendingOrderStatus(status)) return isOrderWithinPendingWindow(order);
  // BE đôi khi chưa gán status cho đơn mới tạo — coi là PENDING nếu còn trong cửa sổ thời gian
  if (!status && order.orderCode) return isOrderWithinPendingWindow(order);
  return false;
}

async function fetchOrderHistory(page = 1, limit = 20) {
  const uid = localStorage.getItem('user_uid');
  if (!uid) {
    console.error('Không tìm thấy UID');
    return { orders: [], pagination: null };
  }

  try {
    const SERVER_URL = 'https://api.giftory.pro';
    const response = await fetch(`${SERVER_URL}/api/products/user/${uid}/type/${GIFT_PRODUCT_TYPE}?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=-1`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      var validOrders = result.data.filter(isValidOrderForHistory);
      return {
        orders: validOrders,
        pagination: result.pagination || null
      };
    }
    return { orders: [], pagination: null };
  } catch (error) {
    console.error('Lỗi khi fetch lịch sử đơn hàng:', error);
    return { orders: [], pagination: null };
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatPrice(price) {
  if (price === null || price === undefined || price === '' || isNaN(Number(price))) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(price));
}

function getStatusClass(status) {
  if (!status) return 'pending'; // Mặc định là pending nếu không có status
  const statusLower = status.toLowerCase();
  if (statusLower === 'paid' || statusLower === 'success' || statusLower === 'completed') {
    return 'paid';
  } else if (statusLower === 'pending' || statusLower === 'processing') {
    return 'pending';
  } else if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'canceled') {
    return 'failed';
  } else {
    return 'pending'; // Mặc định là pending cho các status khác
  }
}

function getStatusText(status) {
  if (!status) return 'Đang chờ'; // Mặc định là đang chờ nếu không có status
  const statusLower = status.toLowerCase();
  if (statusLower === 'paid' || statusLower === 'success' || statusLower === 'completed') {
    return 'Đã thanh toán';
  } else if (statusLower === 'pending' || statusLower === 'processing') {
    return 'Đang chờ';
  } else if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'canceled') {
    return 'Thất bại';
  } else {
    return 'Đang chờ'; // Mặc định là đang chờ cho các status khác
  }
}

function renderOrderHistory(orders, pagination) {
  const content = document.getElementById('orderHistoryContent');

  if (!orders || orders.length === 0) {
    content.innerHTML = `
          <div class="order-history-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div>Chưa có đơn hàng nào</div>
          </div>
        `;
    return;
  }

  let html = orders.map(order => {
    const normalizedStatus = getNormalizedOrderStatus(order);
    const orderStatus = normalizedStatus || null;
    const statusClass = getStatusClass(orderStatus);
    const statusText = getStatusText(orderStatus);
    const shareLink = order.linkproduct || '';
    const orderId = order.orderCode || order._id;

    // PAID + có link: Xem ngay, Sao chép, Tạo QR. PENDING: Thanh toán ngay (nếu có checkoutUrl)
    const isPaid = isPaidOrderStatus(normalizedStatus);
    const isPending = !isPaid && (isPendingOrderStatus(normalizedStatus) || (!normalizedStatus && !!order.orderCode));
    const canInteract = isPaid && shareLink;
    const checkoutUrl = order.checkoutUrl || '';
    const hasCheckoutUrl = isPending && checkoutUrl;

    var actionsHTML = '';
    if (canInteract) {
      actionsHTML = `
              <div class="order-actions" onclick="event.stopPropagation();">
                <button class="order-action-btn order-action-view" onclick="openShareLink('${shareLink}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Xem ngay
                </button>
                <button class="order-action-btn order-action-copy" onclick="copyShareLink('${shareLink}', 'shareLink_${orderId}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Sao chép
                </button>
                <button class="order-action-btn order-action-qr" onclick="openHeartQR('${shareLink}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="5" height="5"></rect>
                    <rect x="16" y="3" width="5" height="5"></rect>
                    <rect x="3" y="16" width="5" height="5"></rect>
                    <line x1="8" y1="5.5" x2="16" y2="5.5"></line>
                    <line x1="8" y1="18.5" x2="16" y2="18.5"></line>
                    <line x1="5.5" y1="8" x2="5.5" y2="16"></line>
                    <line x1="18.5" y1="8" x2="18.5" y2="16"></line>
                  </svg>
                  Tạo QR
                </button>
              </div>
            `;
    } else if (isPending) {
      if (hasCheckoutUrl) {
        var encUrl = encodeURIComponent(checkoutUrl);
        actionsHTML = `
              <div class="order-actions" onclick="event.stopPropagation();">
                <button class="order-action-btn order-action-pay" data-checkout-url="${encUrl}" onclick="var u=this.getAttribute('data-checkout-url'); if(u) window.open(decodeURIComponent(u), '_blank');">
                  Thanh toán ngay
                </button>
              </div>
            `;
      } else {
        actionsHTML = `
              <div class="order-actions" onclick="event.stopPropagation();">
                <button class="order-action-btn order-action-pay" disabled>Không thể tải thông tin thanh toán</button>
              </div>
            `;
      }
    }

    return `
          <div class="order-item">
            <div class="order-item-header">
              <div class="order-code" style="display:flex;align-items:center;gap:6px;">
                <span>Mã đơn: ${order.orderCode || 'N/A'}</span>
                ${order.orderCode ? `<button type="button" onclick="event.stopPropagation();copyToClipboard('${order.orderCode}',this)" title="Sao chép mã đơn" style="
                  background:none;border:1px solid #ccc;border-radius:4px;padding:1px 7px;
                  font-size:11px;cursor:pointer;color:#666;line-height:1.4;
                  transition:all 0.15s;flex-shrink:0;
                " onmouseover="this.style.borderColor='#a855f7';this.style.color='#a855f7'" onmouseout="this.style.borderColor='#ccc';this.style.color='#666'">Copy</button>` : ''}
              </div>
              <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            <div class="order-details">
              <div class="order-detail-item">
                <div class="order-detail-label">Ngày tạo</div>
                <div class="order-detail-value">${formatDate(order.createdAt || order.created_at)}</div>
              </div>
              <div class="order-detail-item">
                <div class="order-detail-label">Giá tiền</div>
                <div class="order-detail-value">${formatPrice(order.price != null ? order.price : (order.amount != null ? order.amount : order.totalPrice))}</div>
              </div>
              <div class="order-detail-item">
                <div class="order-detail-label">Tên sản phẩm</div>
                <div class="order-detail-value">${'Bó hoa kỉ niệm'}</div>
              </div>
            </div>
            ${actionsHTML}
          </div>
        `;
  }).join('');

  // Thêm pagination nếu có
  if (pagination && pagination.totalPages > 1) {
    html += `
          <div class="order-pagination">
            <button class="pagination-btn" ${!pagination.hasPrevPage ? 'disabled' : ''} onclick="loadOrderHistoryPage(${pagination.currentPage - 1})">← Trước</button>
            <span class="pagination-info">Trang ${pagination.currentPage} / ${pagination.totalPages}</span>
            <button class="pagination-btn" ${!pagination.hasNextPage ? 'disabled' : ''} onclick="loadOrderHistoryPage(${pagination.currentPage + 1})">Sau →</button>
          </div>
        `;
  }

  content.innerHTML = html;
}

// Function để load trang khác
window.loadOrderHistoryPage = async function (page) {
  const content = document.getElementById('orderHistoryContent');
  content.innerHTML = '<div class="order-history-loading"><div>Đang tải...</div></div>';

  try {
    var result = await fetchOrderHistory(page);
    if (result.orders.length > 0) {
      if (typeof getPaymentByOrderCode !== 'function') {
        const paymentModule = await import('../lib/payment.js');
        getPaymentByOrderCode = paymentModule.getPaymentByOrderCode;
      }
      for (var i = 0; i < result.orders.length; i++) {
        var order = result.orders[i];
        if (!isPaidOrderStatus(getNormalizedOrderStatus(order))) {
          try {
            var res = await getPaymentByOrderCode(order.orderCode);
            order.checkoutUrl = (res && res.data && res.data.checkoutUrl) ? res.data.checkoutUrl : (res && res.checkoutUrl) || null;
          } catch (e) {
            order.checkoutUrl = null;
          }
        }
      }
    }
    renderOrderHistory(result.orders, result.pagination);
    content.scrollTop = 0;
  } catch (err) {
    console.error('Lỗi tải trang đơn hàng:', err);
    content.innerHTML = '<div class="order-history-empty"><div>Lỗi khi tải lịch sử đơn hàng</div></div>';
  }
};

function copyShareLink(link, inputId) {
  try {
    // Sử dụng Clipboard API nếu có
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        showToast('Đã sao chép link!', 'success');
      }).catch(() => {
        // Fallback cho trình duyệt cũ
        fallbackCopy(link);
      });
    } else {
      // Fallback cho trình duyệt cũ
      fallbackCopy(link);
    }
  } catch (error) {
    console.error('Lỗi khi sao chép:', error);
    showToast('Không thể sao chép link!', 'error');
  }
}

function fallbackCopy(link) {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showToast('Đã sao chép link!', 'success');
}

var pendingQrLink = null;

function redirectToQr(link) {
  if (!link) return;
  var qrPageUrl = 'https://dlove.vn/createqr?link=' + encodeURIComponent(link);
  window.open(qrPageUrl, '_blank');
}

function closeQrModal(shouldRedirect) {
  var qrModal = document.getElementById('qrNoticeModal');
  if (qrModal) qrModal.classList.remove('show');
  if (shouldRedirect && pendingQrLink) {
    var link = pendingQrLink;
    pendingQrLink = null;
    redirectToQr(link);
  }
}

function openHeartQR(link) {
  // Đóng modal lịch sử đơn hàng nếu đang mở
  hideOrderHistoryModal();

  var firstQrNoticeKey = 'firstQrNotice_' + (link || 'default');
  var alreadySeen = localStorage.getItem(firstQrNoticeKey) === 'true';

  if (alreadySeen) {
    redirectToQr(link);
    return;
  }

  pendingQrLink = link;
  var modal = document.getElementById('qrNoticeModal');
  if (modal) {
    modal.classList.add('show');
    return;
  }
  // Fallback nếu không có modal
  redirectToQr(link);
}
window.openHeartQR = openHeartQR;

function openShareLink(shareLink) {
  if (shareLink) {
    window.open(shareLink, '_blank');
  }
}

async function showOrderHistoryModal() {
  const modal = document.getElementById('orderHistoryModal');
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  const content = document.getElementById('orderHistoryContent');
  content.innerHTML = '<div class="order-history-loading"><div>Đang tải...</div></div>';

  try {
    var result = await fetchOrderHistory(1);
    if (result.orders.length > 0) {
      if (typeof getPaymentByOrderCode !== 'function') {
        const paymentModule = await import('../lib/payment.js');
        getPaymentByOrderCode = paymentModule.getPaymentByOrderCode;
      }
      for (var i = 0; i < result.orders.length; i++) {
        var order = result.orders[i];
        if (!isPaidOrderStatus(getNormalizedOrderStatus(order))) {
          try {
            var res = await getPaymentByOrderCode(order.orderCode);
            order.checkoutUrl = (res && res.data && res.data.checkoutUrl) ? res.data.checkoutUrl : (res && res.checkoutUrl) || null;
          } catch (e) {
            order.checkoutUrl = null;
          }
        }
      }
    }
    renderOrderHistory(result.orders, result.pagination);
  } catch (err) {
    console.error('Lỗi tải lịch sử đơn hàng:', err);
    content.innerHTML = '<div class="order-history-empty"><div>Lỗi khi tải lịch sử đơn hàng</div></div>';
  }
}

function hideOrderHistoryModal() {
  const modal = document.getElementById('orderHistoryModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Order History Button Event
document.getElementById('btnOrderHistory').addEventListener('click', function () {
  showOrderHistoryModal();
});

// Link "Lịch sử đơn hàng" dưới nút Thanh toán: scroll lên nút Lịch sử đơn hàng
var linkOrderHistory = document.getElementById('linkOrderHistory');
if (linkOrderHistory) {
  linkOrderHistory.addEventListener('click', function (e) {
    e.preventDefault();
    var btn = document.getElementById('btnOrderHistory');
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// QR Notice Modal - nút OK
var confirmQrBtn = document.getElementById('btnConfirmQrRedirect');
if (confirmQrBtn) {
  confirmQrBtn.addEventListener('click', function () {
    var firstQrNoticeKey = 'firstQrNotice_' + (pendingQrLink || 'default');
    var firstQrNotice = localStorage.getItem(firstQrNoticeKey) !== 'true';

    if (firstQrNotice) {
      localStorage.setItem(firstQrNoticeKey, 'true');
      window.open('https://www.tiktok.com/@vanquyet1504', '_blank');
      closeQrModal(false);
    } else {
      closeQrModal(true);
    }
  });
}

// Close Order History Modal
document.getElementById('btnCloseOrderHistory').addEventListener('click', function () {
  hideOrderHistoryModal();
});

// Close modal when clicking overlay
document.getElementById('orderHistoryModal').addEventListener('click', function (e) {
  if (e.target === this) {
    hideOrderHistoryModal();
  }
});

// Logout with custom confirmation modal
document.getElementById('btnLogout').addEventListener('click', function () {
  showConfirmModal();
});

// Confirm logout
document.getElementById('btnConfirmLogout').addEventListener('click', function () {
  hideConfirmModal();
  auth.signOut()
    .then(function () {
      // Xóa user info khỏi localStorage khi logout
      localStorage.removeItem('user_uid');
      localStorage.removeItem('customerEmail');
    })
    .catch(function (error) {
      console.error('Lỗi đăng xuất:', error);
      alert('Đăng xuất thất bại: ' + error.message);
    });
});

// Cancel logout
document.getElementById('btnCancelLogout').addEventListener('click', function () {
  hideConfirmModal();
});

// Close modal when clicking overlay
document.getElementById('confirmModal').addEventListener('click', function (e) {
  if (e.target === this) {
    hideConfirmModal();
  }
});

// Modal gia hạn vĩnh viễn: Không → chỉ đóng
document.getElementById('btnSaveForeverNo').addEventListener('click', function () {
  hideSaveForeverModal();
  pendingSubmitAfterSaveForever = false;
});

// Modal gia hạn vĩnh viễn: Có → tích checkbox, đóng, thông báo, cập nhật giá
document.getElementById('btnSaveForeverYes').addEventListener('click', function () {
  document.getElementById('saveForever').checked = true;
  hideSaveForeverModal();
  if (typeof showToast === 'function') {
    showToast('Bạn đã chọn gia hạn vĩnh viễn với giá 30.000 ₫', 'success');
  } else {
    alert('Bạn đã chọn gia hạn vĩnh viễn với giá 30.000 ₫');
  }
  if (typeof calculatePrice === 'function') calculatePrice();
  if (pendingSubmitAfterSaveForever) {
    pendingSubmitAfterSaveForever = false;
    document.getElementById('customForm').requestSubmit();
  }
});

document.getElementById('saveForeverConfirmModal').addEventListener('click', function (e) {
  if (e.target === this) {
    hideSaveForeverModal();
    pendingSubmitAfterSaveForever = false;
  }
});

// Close modal with ESC key (ưu tiên đóng modal lịch sử hoặc gia hạn nếu đang mở)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var orderHistoryModal = document.getElementById('orderHistoryModal');
    if (orderHistoryModal && orderHistoryModal.classList.contains('show')) {
      hideOrderHistoryModal();
    } else if (document.getElementById('saveForeverConfirmModal').classList.contains('show')) {
      hideSaveForeverModal();
      pendingSubmitAfterSaveForever = false;
    } else {
      hideConfirmModal();
    }
  }
});

// Existing code...
// Validation functions
function validateText(value, fieldName, errorElement) {
  if (!value || value.trim() === '') {
    errorElement.textContent = `${fieldName} không được để trống`;
    errorElement.style.display = 'block';
    return false;
  }
  if (value.trim().length < 2) {
    errorElement.textContent = `${fieldName} phải có ít nhất 2 ký tự`;
    errorElement.style.display = 'block';
    return false;
  }
  errorElement.style.display = 'none';
  return true;
}

function getFileExt(file) {
  var name = String((file && file.name) || '').toLowerCase();
  var dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot) : '';
}

/** Kiểm tra file có phải video (theo mime hoặc đuôi) — dùng cho nhạc & ảnh, tránh .mp4/.mov lọt khi type rỗng */
function isVideoFile(file) {
  if (file.type && file.type.startsWith('video/')) return true;
  var name = (file.name || '').toLowerCase();
  return ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.m4v', '.3gp'].some(function (ext) { return name.endsWith(ext); });
}

function validateVipPhotoFile(file) {
  if (!(file instanceof File)) return { ok: false, reason: 'not_file' };
  if (!Number.isFinite(file.size) || file.size <= 0) return { ok: false, reason: 'empty' };
  if (file.size > MAX_FILE_SIZE) return { ok: false, reason: 'too_large' };

  var ext = getFileExt(file);
  var mime = String(file.type || '').toLowerCase();
  if (mime.indexOf('video/') === 0 || BLOCKED_VIP_IMAGE_EXT[ext]) return { ok: false, reason: 'video_or_blocked' };
  if (mime && mime.indexOf('image/') !== 0) return { ok: false, reason: 'not_image' };
  if (!ALLOWED_VIP_IMAGE_EXT[ext]) return { ok: false, reason: 'unsupported_ext' };
  return { ok: true };
}

function validateCustomMusicFile(file) {
  if (!(file instanceof File)) return { ok: false, reason: 'not_file' };
  if (!Number.isFinite(file.size) || file.size <= 0) return { ok: false, reason: 'empty' };
  if (file.size > MAX_FILE_SIZE) return { ok: false, reason: 'too_large' };

  var ext = getFileExt(file);
  var mime = String(file.type || '').toLowerCase();
  if (mime.indexOf('video/') === 0 || ext === '.mp4' || ext === '.mov' || ext === '.mkv') {
    return { ok: false, reason: 'video_not_allowed' };
  }
  if (mime && mime.indexOf('audio/') !== 0 && !ALLOWED_AUDIO_EXT[ext]) {
    return { ok: false, reason: 'unsupported_audio' };
  }
  if (!mime && !ALLOWED_AUDIO_EXT[ext]) {
    return { ok: false, reason: 'unsupported_audio' };
  }
  return { ok: true };
}

function getMusicValidationMessage(reason) {
  if (reason === 'video_not_allowed') return 'Đây là file video (.mp4, .mov, .mkv), không phải nhạc. Vui lòng chọn file âm thanh.';
  if (reason === 'too_large') return 'File nhạc tối đa 10MB. Vui lòng chọn file khác.';
  if (reason === 'empty') return 'File nhạc bị rỗng (0 byte). Vui lòng chọn lại.';
  return 'File nhạc không hợp lệ. Chỉ chấp nhận mp3, wav, m4a, aac, ogg, flac, webm (audio).';
}

function validateVipPhotos() {
  const vipGift = document.getElementById('vipGift').checked;
  const vipPhotosInput = document.getElementById('vipPhotos');
  const errEl = document.getElementById('vipPhotosError');
  if (!vipGift) {
    errEl.style.display = 'none';
    vipPhotosInput.classList.remove('error');
    return true;
  }
  if (vipPhotoResults.length === 0) {
    errEl.textContent = 'Quà VIP: tối thiểu 1 ảnh, tối đa 30 ảnh. Vui lòng chọn từ 1 đến 30 ảnh.';
    errEl.style.display = 'block';
    vipPhotosInput.classList.add('error');
    return false;
  }
  if (vipPhotoResults.length > 30) {
    errEl.textContent = 'Chỉ được chọn tối đa 30 ảnh.';
    errEl.style.display = 'block';
    vipPhotosInput.classList.add('error');
    return false;
  }
  errEl.style.display = 'none';
  vipPhotosInput.classList.remove('error');
  return true;
}

function clearError(element, inputElement) {
  element.style.display = 'none';
  if (inputElement) {
    inputElement.classList.remove('error');
  }
}

// --- Xử lý ảnh theo NOTE_IMAGE_UPLOAD_FLOW.md ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB cho mỗi ảnh / file nhạc
const ALLOWED_VIP_IMAGE_EXT = { '.jpg': true, '.jpeg': true, '.png': true, '.webp': true };
const BLOCKED_VIP_IMAGE_EXT = { '.heic': true, '.heif': true, '.mov': true, '.mp4': true, '.mkv': true };
const ALLOWED_AUDIO_EXT = { '.mp3': true, '.wav': true, '.m4a': true, '.aac': true, '.ogg': true, '.flac': true, '.webm': true };

/**
 * Nén ảnh thông minh phía client (theo PLAN_CLIENT_IMAGE_COMPRESSION_AND_UPLOAD_FIX.md):
 * - Giữ nguyên file nếu dung lượng <= 500KB và kích thước <= 1500px.
 * - Resize cạnh dài nhất về tối đa 1500px, chất lượng JPEG 0.85 (chuẩn sắc nét Retina, dung lượng nhẹ ~200-350KB).
 * - Tự động chuẩn hóa góc xoay (EXIF orientation) nhờ Image/Canvas HTML5.
 * - Fallback an toàn về file gốc nếu canvas gặp sự cố.
 */
function compressImage(file, maxWidth = 1500, quality = 0.85) {
  return new Promise(function (resolve) {
    if (!file || !(file instanceof Blob)) {
      resolve({ blob: file, previewUrl: '', isOriginal: true });
      return;
    }

    var objectUrl = URL.createObjectURL(file);
    var img = new Image();

    img.onload = function () {
      var w = img.naturalWidth || img.width;
      var h = img.naturalHeight || img.height;

      // Nếu file đã nhẹ (<= 500KB) và kích thước đã nằm trong giới hạn maxWidth
      if (file.size <= 500 * 1024 && w <= maxWidth && h <= maxWidth) {
        resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
        return;
      }

      // Tính kích thước thu nhỏ theo tỷ lệ cạnh dài nhất
      var targetW = w;
      var targetH = h;
      if (w > maxWidth || h > maxWidth) {
        if (w >= h) {
          targetW = maxWidth;
          targetH = Math.round((h * maxWidth) / w);
        } else {
          targetH = maxWidth;
          targetW = Math.round((w * maxWidth) / h);
        }
      }

      try {
        var canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        var ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        canvas.toBlob(function (blob) {
          if (!blob || blob.size === 0) {
            resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
            return;
          }
          // Nếu ảnh sau nén thậm chí nặng hơn file gốc (hiếm gặp), giữ file gốc
          if (blob.size >= file.size && w <= maxWidth && h <= maxWidth) {
            resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
            return;
          }
          var previewUrl = URL.createObjectURL(blob);
          URL.revokeObjectURL(objectUrl);
          resolve({ blob: blob, previewUrl: previewUrl, isOriginal: false });
        }, 'image/jpeg', quality);
      } catch (e) {
        console.warn('[COMPRESS] Canvas compress failed, using original file:', e);
        resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
      }
    };

    img.onerror = function () {
      console.warn('[COMPRESS] Image load failed, using original file');
      resolve({ blob: file, previewUrl: objectUrl, isOriginal: true });
    };

    img.src = objectUrl;
  });
}

/**
 * Kiểm tra tính toàn vẹn (Integrity Check) của file trước khi gửi:
 * Đọc thử 512 bytes đầu để đảm bảo file còn nguyên vẹn, không bị mất cache tạm thời từ hệ điều hành.
 */
async function checkFileIntegrity(file, label = 'Tệp') {
  if (!file) {
    return { ok: false, message: `${label} không tồn tại.` };
  }
  if (file.size === 0) {
    return { ok: false, message: `${label} bị rỗng (0 byte). Vui lòng chọn lại.` };
  }
  try {
    const slice = file.slice(0, 512);
    const buffer = await slice.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      return { ok: false, message: `${label} bị lỗi đọc dữ liệu tạm. Vui lòng chọn lại file.` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, message: `${label} bị gián đoạn truy cập. Vui lòng chọn lại file.` };
  }
}

/** Materialize blob (fix iOS/Safari upload 0 bytes + sai MIME), trả về File.
 *  Luôn force image/jpeg vì canvas.toBlob() luôn xuất JPEG.
 *  Nếu isOriginal=true (canvas fail), cố gắng giữ đúng type ảnh gốc,
 *  fallback image/jpeg nếu type rỗng hoặc không phải image/*.
 */
async function blobToFile(blob, filename, isOriginal) {
  filename = filename || 'vip-1.jpg';
  var safeType = 'image/jpeg';
  if (isOriginal && blob.type && blob.type.startsWith('image/')) {
    safeType = blob.type;
  }
  try {
    var ab = await blob.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return new File([blob], filename, { type: safeType });
    }
    var fixedBlob = new Blob([ab], { type: safeType });
    return new File([fixedBlob], filename, { type: safeType });
  } catch (e) {
    return new File([blob], filename, { type: safeType });
  }
}

/** Kết quả ảnh VIP đã nén (blob + previewUrl), dùng khi submit. */
var vipPhotoResults = [];
var vipPhotoCompressionPromise = Promise.resolve();
var vipPhotoCompressionGeneration = 0;
var isPreparingCheckout = false;

function setCheckoutPreparing(isPreparing, text) {
  var btnSubmit = document.getElementById('btnSubmit');
  if (!btnSubmit) return;
  isPreparingCheckout = isPreparing;
  if (isPreparing) {
    if (!btnSubmit._originalText) btnSubmit._originalText = btnSubmit.innerHTML;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="btn-spinner"></span> ' + (text || 'Đang chuẩn bị ảnh...');
  } else {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = btnSubmit._originalText || '📋 Thanh toán';
  }
}

// Quà VIP: bật/tắt khu vực chọn ảnh
document.getElementById('vipGift').addEventListener('change', function () {
  const container = document.getElementById('vipPhotosContainer');
  const input = document.getElementById('vipPhotos');
  const preview = document.getElementById('vipPhotosPreview');
  const errEl = document.getElementById('vipPhotosError');
  if (this.checked) {
    container.style.display = 'block';
  } else {
    vipPhotoCompressionGeneration++;
    container.style.display = 'none';
    input.value = '';
    preview.innerHTML = '';
    vipPhotoResults.forEach(function (r) { if (r.previewUrl) URL.revokeObjectURL(r.previewUrl); });
    vipPhotoResults.length = 0;
    clearError(errEl, input);
  }
  calculatePrice();
  scheduleSaveDraft();
});

// Quà VIP: chọn ảnh — validate NGAY khi chọn (change), không chờ submit
document.getElementById('vipPhotos').addEventListener('change', function (e) {
  var generation = ++vipPhotoCompressionGeneration;
  const files = Array.from(e.target.files || []);
  const maxFiles = 30;
  const errEl = document.getElementById('vipPhotosError');
  const previewEl = document.getElementById('vipPhotosPreview');
  const inputEl = this;
  previewEl.innerHTML = '';
  vipPhotoResults.forEach(function (r) { if (r.previewUrl) URL.revokeObjectURL(r.previewUrl); });
  vipPhotoResults.length = 0;
  if (files.length === 0) {
    clearError(errEl, inputEl);
    calculatePrice();
    return;
  }
  if (files.length > maxFiles) {
    errEl.textContent = '❌ Chỉ được chọn tối đa 30 ảnh. Bạn đã chọn ' + files.length + ' ảnh, vui lòng chọn lại.';
    errEl.style.display = 'block';
    inputEl.classList.add('error');
    inputEl.value = '';
    calculatePrice();
    return;
  }
  var validFiles = [];
  var invalidIndexes = [];
  var hasBlockedOrVideo = false;
  var hasTooLarge = false;
  var hasEmpty = false;
  var hasUnsupported = false;
  files.forEach(function (f, idx) {
    var check = validateVipPhotoFile(f);
    if (check.ok) {
      validFiles.push(f);
      return;
    }
    invalidIndexes.push(idx + 1);
    if (check.reason === 'video_or_blocked') hasBlockedOrVideo = true;
    else if (check.reason === 'too_large') hasTooLarge = true;
    else if (check.reason === 'empty') hasEmpty = true;
    else hasUnsupported = true;
  });
  if (invalidIndexes.length > 0) {
    var reasonText = 'định dạng không hỗ trợ';
    if (hasBlockedOrVideo) reasonText = 'video/live photo hoặc HEIC/HEIF không hỗ trợ';
    else if (hasTooLarge) reasonText = 'vượt quá 10MB';
    else if (hasEmpty) reasonText = 'file rỗng (0 byte)';
    else if (hasUnsupported) reasonText = 'không phải jpg/jpeg/png/webp';
    errEl.textContent = '❌ Ảnh #' + invalidIndexes.join(', #') + ' không hợp lệ (' + reasonText + '). Chỉ chấp nhận JPG/JPEG/PNG/WEBP.';
    errEl.style.display = 'block';
    inputEl.classList.add('error');
  }
  if (validFiles.length === 0) {
    inputEl.value = '';
    calculatePrice();
    return;
  }
  if (validFiles.length > maxFiles) {
    validFiles = validFiles.slice(0, maxFiles);
    errEl.textContent = '⚠️ Chỉ giữ tối đa 30 ảnh hợp lệ đầu tiên. Ảnh vượt giới hạn đã bị bỏ qua.';
    errEl.style.display = 'block';
    inputEl.classList.add('error');
  } else if (invalidIndexes.length === 0) {
    clearError(errEl, inputEl);
  }
  vipPhotoCompressionPromise = (async function () {
    errEl.style.display = 'block';
    errEl.style.color = 'var(--create-accent, #6366f1)';
    for (let i = 0; i < validFiles.length; i++) {
      errEl.textContent = `⏳ Đang tối ưu nén ảnh (${i + 1}/${validFiles.length})...`;
      const compressed = await compressImage(validFiles[i], 1500, 0.85);
      if (generation !== vipPhotoCompressionGeneration) {
        if (compressed.previewUrl) URL.revokeObjectURL(compressed.previewUrl);
        return;
      }
      vipPhotoResults.push(compressed);
      renderVipPhotoPreview();
    }
    errEl.style.display = 'none';
    errEl.style.color = '';
    validateVipPhotos();
    calculatePrice();
    scheduleSaveDraft();
  })().catch(function (err) {
    console.error('[COMPRESS] Lỗi nén ảnh:', err);
    errEl.style.display = 'none';
    errEl.style.color = '';
    validateVipPhotos();
    calculatePrice();
  });
});

function renderVipPhotoPreview() {
  var previewEl = document.getElementById('vipPhotosPreview');
  previewEl.innerHTML = '';
  vipPhotoResults.forEach(function (r, idx) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;display:inline-block;width:66px;height:66px;flex-shrink:0;';

    // Ảnh
    var img = document.createElement('img');
    img.src = r.previewUrl;
    img.alt = '';
    img.title = 'Nhấn để thay ảnh';
    img.style.cssText = 'width:66px;height:66px;object-fit:cover;border-radius:8px;border:2px solid #ddd;cursor:pointer;display:block;';
    img.addEventListener('click', function () { triggerReplacePhoto(idx); });

    // Nút xóa
    var del = document.createElement('button');
    del.type = 'button';
    del.textContent = '×';
    del.title = 'Xóa ảnh này';
    del.style.cssText = 'position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#e74c3c;color:#fff;border:none;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 1px 4px rgba(0,0,0,0.3);';
    del.addEventListener('click', function () { removeVipPhoto(idx); });

    wrap.appendChild(img);
    wrap.appendChild(del);
    previewEl.appendChild(wrap);
  });
}

function removeVipPhoto(idx) {
  if (vipPhotoResults[idx] && vipPhotoResults[idx].previewUrl) {
    URL.revokeObjectURL(vipPhotoResults[idx].previewUrl);
  }
  vipPhotoResults.splice(idx, 1);
  renderVipPhotoPreview();
  validateVipPhotos();
  calculatePrice();
}

// Input ẩn để thay thế ảnh từng cái
var replaceInput = document.createElement('input');
replaceInput.type = 'file';
replaceInput.accept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
replaceInput.style.display = 'none';
document.body.appendChild(replaceInput);
var replaceTargetIdx = -1;

function triggerReplacePhoto(idx) {
  replaceTargetIdx = idx;
  replaceInput.value = '';
  replaceInput.click();
}

replaceInput.addEventListener('change', function () {
  var file = this.files[0];
  if (!file || replaceTargetIdx < 0) return;
  var targetIdx = replaceTargetIdx;
  var targetItem = vipPhotoResults[targetIdx];
  var check = validateVipPhotoFile(file);
  if (!check.ok) {
    var msg = 'Ảnh thay thế không hợp lệ. Chỉ nhận JPG/JPEG/PNG/WEBP, tối đa 10MB.';
    if (check.reason === 'video_or_blocked') msg = 'Ảnh thay thế không hợp lệ: HEIC/HEIF hoặc file video không được hỗ trợ.';
    else if (check.reason === 'too_large') msg = 'Ảnh thay thế vượt quá 10MB.';
    else if (check.reason === 'empty') msg = 'Ảnh thay thế bị rỗng (0 byte).';
    showToast(msg, 'error');
    return;
  }
  var generation = vipPhotoCompressionGeneration;
  vipPhotoCompressionPromise = vipPhotoCompressionPromise.then(function () {
    return compressImage(file, 1500, 0.85);
  }).then(function (result) {
    if (generation !== vipPhotoCompressionGeneration) {
      if (result.previewUrl) URL.revokeObjectURL(result.previewUrl);
      return;
    }
    targetIdx = vipPhotoResults.indexOf(targetItem);
    if (targetIdx < 0) {
      if (result.previewUrl) URL.revokeObjectURL(result.previewUrl);
      return;
    }
    if (vipPhotoResults[targetIdx] && vipPhotoResults[targetIdx].previewUrl) {
      URL.revokeObjectURL(vipPhotoResults[targetIdx].previewUrl);
    }
    vipPhotoResults[targetIdx] = result;
    renderVipPhotoPreview();
    validateVipPhotos();
    calculatePrice();
    replaceTargetIdx = -1;
    scheduleSaveDraft();
  }).catch(function (err) {
    console.error('[COMPRESS] Lỗi nén ảnh thay thế:', err);
    showToast('Không thể xử lý ảnh thay thế. Vui lòng thử lại.', 'error');
  }).finally(function () {
    replaceTargetIdx = -1;
  });
});

// Tiêu đề thư tùy chọn — không validate, chỉ clear lỗi
document.getElementById('letterTitle').addEventListener('blur', function () {
  clearError(document.getElementById('errorLetterTitle'), this);
  this.classList.remove('error');
});

document.getElementById('letterContent').addEventListener('blur', function () {
  const error = document.getElementById('errorLetterContent');
  const isValid = validateText(this.value, 'Nội dung thư', error);
  if (!isValid) {
    this.classList.add('error');
    // Scroll đến textarea nếu có lỗi
    setTimeout(() => {
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.focus();
    }, 100);
  } else {
    this.classList.remove('error');
  }
});

document.getElementById('letterSignature').addEventListener('blur', function () {
  clearError(document.getElementById('errorLetterSignature'), this);
  this.classList.remove('error');
});

var introTextInput = document.getElementById('introText');
if (introTextInput) {
  introTextInput.addEventListener('input', function () {
    scheduleSaveDraft();
  });
}

document.getElementById('letterTitle').addEventListener('input', function () {
  clearError(document.getElementById('errorLetterTitle'), this);
  scheduleSaveDraft();
});
document.getElementById('letterContent').addEventListener('input', function () {
  if (this.value.trim().length >= 2) clearError(document.getElementById('errorLetterContent'), this);
  scheduleSaveDraft();
});
document.getElementById('letterSignature').addEventListener('input', function () {
  clearError(document.getElementById('errorLetterSignature'), this);
  scheduleSaveDraft();
});

// Letter Templates - Mẫu cho mẹ & người yêu (8/3)
const letterTemplates = {
  // Mẫu cho mẹ
  me_1: {
    title: 'Gửi mẹ yêu quý,',
    content: `Nhân ngày 8/3, con xin gửi đến mẹ lời cảm ơn chân thành nhất.

Mẹ đã hy sinh cả đời để nuôi con khôn lớn, dạy con từng bước đi, từng lời nói. Những bữa cơm mẹ nấu, những đêm thức trắng khi con ốm, con không bao giờ quên.

Con biết mẹ đã vất vả rất nhiều. Con chỉ mong mẹ luôn khỏe mạnh, vui vẻ và được nghỉ ngơi nhiều hơn.

Chúc mẹ ngày 8/3 tràn ngập niềm vui và hạnh phúc. Con yêu mẹ!`,
    signature: 'Con của mẹ ❤️'
  },
  me_2: {
    title: 'Mẹ ơi,',
    content: `Ngày 8/3 đến, lòng con tràn ngập tình yêu và lòng biết ơn dành cho mẹ.

Con nhớ từng lời mẹ dạy, từng cái ôm ấm áp khi con buồn. Mẹ là điểm tựa vững chắc nhất đời con, là nơi con luôn tìm về khi mệt mỏi.

Dù con có lớn đến đâu, trong mắt mẹ con vẫn là đứa con bé bỏng cần được che chở. Con cảm ơn mẹ đã luôn ở bên con.

Chúc mẹ luôn mạnh khỏe, an vui. Con mãi yêu mẹ!`,
    signature: 'Con yêu của mẹ 💕'
  },
  me_3: {
    title: 'Gửi người phụ nữ tuyệt vời nhất của con,',
    content: `8/3 này con chúc mẹ thật nhiều sức khỏe, nụ cười và bình yên.

Mẹ là người phụ nữ đẹp nhất trong mắt con - không phải vì ngoại hình mà vì tấm lòng nhân hậu, sự hy sinh thầm lặng và tình yêu vô bờ dành cho gia đình.

Con mong mẹ đừng quá vất vả, hãy dành thời gian cho bản thân. Con sẽ cố gắng để mẹ tự hào và được an lòng.

Chúc mẹ ngày 8/3 thật ý nghĩa!`,
    signature: 'Con trai / Con gái của mẹ 💕'
  },
  me_4: {
    title: 'Kính gửi mẹ,',
    content: `Nhân ngày Quốc tế Phụ nữ 8/3, con xin gửi đến mẹ những lời tri ân sâu sắc từ tận đáy lòng.

Mẹ đã cho con sự sống, cho con tình yêu thương vô điều kiện và dạy con cách làm người. Công ơn sinh thành dưỡng dục, con không thể đền đáp hết.

Con nhớ mãi bàn tay mẹ chai sạn vì lao động, mái tóc mẹ đã điểm bạc vì lo toan. Tất cả vì con, vì gia đình.

Chúc mẹ luôn dồi dào sức khỏe, an khang và hạnh phúc. Con sẽ cố gắng trở thành người con ngoan để mẹ vui lòng.`,
    signature: 'Người con luôn biết ơn ✨'
  },
  // Mẫu cho người yêu (anh gửi em nhân 8/3)
  nguoiyeu_1: {
    title: 'Gửi em yêu,',
    content: `Nhân ngày 8/3, anh muốn gửi đến em những lời chúc chân thành nhất.

Cảm ơn em đã đến bên anh, cho anh những ngày tháng ngọt ngào và đầy ý nghĩa. Em là món quà quý giá nhất mà cuộc đời dành tặng cho anh.

Chúc em - người phụ nữ tuyệt vời của anh - luôn xinh đẹp, khỏe mạnh và hạnh phúc. Mong chúng mình sẽ cùng nhau đi qua thật nhiều mùa 8/3 nữa.

Yêu em!`,
    signature: 'Anh của em ❤️'
  },
  nguoiyeu_2: {
    title: 'Gửi người anh nhớ nhất,',
    content: `8/3 này dù có thể không được ở bên nhau, nhưng lòng anh luôn hướng về em.

Anh nhớ từng nụ cười, từng ánh mắt của em. Nhớ những lúc cùng nhau đi dạo, cùng nhau ăn một bữa cơm đơn giản. Những điều bình dị ấy với anh là quý giá vô cùng.

Chúc em ngày 8/3 thật vui, luôn rạng rỡ và nhớ đến anh nhé. Sớm gặp lại em!

Yêu thương,`,
    signature: 'Người luôn nhớ em 🌹'
  },
  nguoiyeu_3: {
    title: 'Em thân yêu,',
    content: `Chúc em ngày 8/3 ngọt ngào như chính em vậy!

Em là người khiến anh muốn trở nên tốt hơn mỗi ngày. Cảm ơn em đã tin tưởng, đã sát cánh và cho anh cảm giác được yêu thương.

Mong em luôn giữ được nụ cười tươi, luôn mạnh mẽ và hạnh phúc. Anh sẽ cố gắng để em không phải thất vọng.

Chúc em 8/3 vui vẻ! Anh yêu em nhiều lắm. 💕`,
    signature: 'Anh yêu em 💕'
  },
  nguoiyeu_4: {
    title: 'Gửi tình yêu của anh,',
    content: `Nhân ngày 8/3 - ngày của những người phụ nữ tuyệt vời - anh muốn nói với em rằng: em là điều tuyệt vời nhất trong cuộc đời anh.

Từ khi có em, mỗi ngày đều ý nghĩa hơn. Em cho anh động lực, cho anh niềm vui và cho anh một mái ấm để trở về.

Chúc em luôn xinh đẹp, tràn đầy năng lượng và mãi bên anh. Cảm ơn em đã là một nửa hoàn hảo của anh.

Yêu em mãi!`,
    signature: 'Một nửa của em ✨'
  },
  // Mẫu lớp học (các bạn nam tặng chung cho các bạn nữ, khác vibe)
  lophoc_1: {
    title: 'Gửi các bạn nữ nhân ngày 8/3 💐',
    content: `Nhân ngày Quốc tế Phụ nữ 8/3, các bạn nam trong lớp muốn gửi đến tất cả các bạn nữ lời chúc thật chân thành.

Cảm ơn các bạn đã luôn mang lại niềm vui và sự sống động cho lớp học của chúng mình. Các bạn vừa giỏi giang, vừa dễ thương — thật sự làm cho cả lớp tự hào!

Chúc các bạn nữ ngày 8/3 thật vui vẻ, hạnh phúc và mãi toả sáng nhé!`,
    signature: 'Các bạn nam lớp mình 🏫💐'
  },
  lophoc_2: {
    title: 'Kính gửi các bạn nữ — Lời tri ân từ các bạn nam',
    content: `Nhân dịp ngày Quốc tế Phụ nữ 8/3, thay mặt các bạn nam trong lớp, chúng mình xin gửi đến các bạn nữ những lời chúc mừng trân trọng nhất.

Trong suốt thời gian học tập cùng nhau, các bạn nữ không chỉ là những người bạn đồng hành tuyệt vời mà còn là nguồn cảm hứng, động lực để chúng mình cố gắng hơn mỗi ngày.

Chúc các bạn luôn mạnh khoẻ, thành công và hạnh phúc. Chúng mình tự hào được học chung lớp với các bạn!`,
    signature: 'Tập thể các bạn nam 🎓✨'
  },
  lophoc_3: {
    title: 'Ơ thì... chúc mừng 8/3 các bạn nữ ơi! 😄',
    content: `Thú thật là tụi mình — đội nam của lớp — không giỏi viết thư lắm. Nhưng ngày 8/3 mà không nói gì thì... kỳ lắm!

Nên thôi, mình xin phép nói thẳng: các bạn nữ trong lớp thật sự rất tuyệt! Vừa học giỏi, vừa dễ thương, vừa chịu chơi với đám con trai ồn ào này — thật không dễ chút nào đâu nhé.

Chúc các bạn ngày 8/3 vui vẻ, nhận được thật nhiều quà và... nhớ tha thứ cho đám bọn mình vì đôi khi hơi ồn ào quá! 😅`,
    signature: 'Đội nam lớp mình (hơi ồn nhưng tốt bụng 😁)'
  },
  lophoc_4: {
    title: 'Ngày 8/3 — Lời nhắn từ trái tim các bạn nam 💌',
    content: `Các bạn nữ ơi, ngày 8/3 này tụi mình muốn nói một điều thật lòng:

Lớp học của chúng mình đẹp hơn, vui hơn, ý nghĩa hơn rất nhiều vì có các bạn. Mỗi buổi sáng đến lớp, tiếng cười của các bạn là điều khiến tụi mình cảm thấy ngày hôm đó thật sự đáng sống.

Chúc các bạn nữ ngày 8/3 tràn ngập niềm vui, luôn xinh đẹp và tự tin. Các bạn xứng đáng được nhận tất cả những điều tốt đẹp nhất!`,
    signature: 'Những người bạn nam luôn ủng hộ các bạn 💪💐'
  }
};

// Nút ẩn/hiện mẫu thư (mặc định ẩn)
(function () {
  var btn = document.getElementById('toggleLetterTemplates');
  var content = document.getElementById('letterTemplatesContent');
  var textEl = btn && btn.querySelector('.btn-toggle-text');
  if (!btn || !content) return;
  btn.addEventListener('click', function () {
    var isHidden = content.style.display === 'none' || !content.style.display;
    content.style.display = isHidden ? 'block' : 'none';
    content.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    if (textEl) textEl.textContent = isHidden ? 'Ẩn mẫu thư' : 'Xem mẫu thư có sẵn';
  });
})();

// Apply template
document.querySelectorAll('.template-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const templateId = this.getAttribute('data-template');
    const template = letterTemplates[templateId];

    if (template) {
      document.getElementById('letterTitle').value = template.title;
      document.getElementById('letterContent').value = template.content;
      document.getElementById('letterSignature').value = template.signature;

      // Clear errors
      clearError(document.getElementById('errorLetterTitle'), document.getElementById('letterTitle'));
      clearError(document.getElementById('errorLetterContent'), document.getElementById('letterContent'));
      clearError(document.getElementById('errorLetterSignature'), document.getElementById('letterSignature'));

      // Remove error classes
      document.getElementById('letterTitle').classList.remove('error');
      document.getElementById('letterContent').classList.remove('error');
      document.getElementById('letterSignature').classList.remove('error');

      // Tính lại giá (nếu cần)
      if (typeof calculatePrice === 'function') {
        calculatePrice();
      }

      // Scroll to form
      document.getElementById('letterTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

// Function để cập nhật audio preview
let currentBlobUrl = null; // Lưu blob URL hiện tại để cleanup

function updateAudioPreview() {
  const audioPreview = document.getElementById('audioPreview');
  const audioPreviewContainer = document.getElementById('audioPreviewContainer');
  const musicType = document.querySelector('input[name="musicType"]:checked')?.value;

  // Cleanup blob URL cũ nếu có
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  if (!musicType) {
    audioPreviewContainer.style.display = 'none';
    audioPreview.pause();
    audioPreview.src = '';
    return;
  }

  if (musicType === 'sample') {
    const sampleMusic = document.getElementById('sampleMusic').value;
    if (sampleMusic) {
      audioPreview.src = sampleMusic;
      audioPreviewContainer.style.display = 'block';
    } else {
      audioPreviewContainer.style.display = 'none';
      audioPreview.pause();
      audioPreview.src = '';
    }
  } else if (musicType === 'custom') {
    const customMusic = document.getElementById('customMusic').files[0];
    if (customMusic) {
      currentBlobUrl = URL.createObjectURL(customMusic);
      audioPreview.src = currentBlobUrl;
      audioPreviewContainer.style.display = 'block';
    } else if (window.restoredCustomMusicBase64) {
      // File nhạc đã khôi phục từ bản nháp (base64)
      audioPreview.src = window.restoredCustomMusicBase64;
      audioPreviewContainer.style.display = 'block';
    } else {
      audioPreviewContainer.style.display = 'none';
      audioPreview.pause();
      audioPreview.src = '';
    }
  }
}

// Chuyển radio musicType + show/hide container tương ứng
function switchMusicType(type) {
  var radio = document.querySelector('input[name="musicType"][value="' + type + '"]');
  if (radio && !radio.checked) {
    radio.checked = true;
    var sampleMusicContainer = document.getElementById('sampleMusicContainer');
    var customMusicContainer = document.getElementById('customMusicContainer');
    if (type === 'sample') {
      if (sampleMusicContainer) sampleMusicContainer.style.display = 'block';
      if (customMusicContainer) customMusicContainer.style.display = 'none';
    } else {
      if (sampleMusicContainer) sampleMusicContainer.style.display = 'none';
      if (customMusicContainer) customMusicContainer.style.display = 'block';
    }
  }
}

// Toggle music input
document.querySelectorAll('input[name="musicType"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const sampleMusicContainer = document.getElementById('sampleMusicContainer');
    const customMusicContainer = document.getElementById('customMusicContainer');
    const sampleMusic = document.getElementById('sampleMusic');
    const customMusic = document.getElementById('customMusic');

    if (this.value === 'sample') {
      sampleMusicContainer.style.display = 'block';
      customMusicContainer.style.display = 'none';
      customMusic.value = '';
    } else {
      sampleMusicContainer.style.display = 'none';
      customMusicContainer.style.display = 'block';
      sampleMusic.value = '';
    }
    // Tính lại giá khi chuyển đổi loại nhạc
    calculatePrice();
    updateAudioPreview();
    scheduleSaveDraft();
  });
});

// ═══════════════════════════════════════════════════
// 🎵 FETCH NHẠC TỪ API + RENDER UI
// ═══════════════════════════════════════════════════

// Tạo element audio ẩn cho preview nhạc
previewAudioEl = document.createElement('audio');
previewAudioEl.preload = 'none';
previewAudioEl.addEventListener('ended', function () {
  playingSongId = null;
  renderFeaturedMusics();
});
// Cập nhật progress bar real-time khi phát nhạc
previewAudioEl.addEventListener('timeupdate', function () {
  if (!playingSongId) return;
  var fill = document.getElementById('music-progress-fill-' + playingSongId);
  var timeEl = document.getElementById('music-time-' + playingSongId);
  if (fill && previewAudioEl.duration) {
    var pct = (previewAudioEl.currentTime / previewAudioEl.duration) * 100;
    fill.style.width = pct + '%';
  }
  if (timeEl) {
    timeEl.textContent = formatDuration(previewAudioEl.currentTime) + ' / ' + formatDuration(previewAudioEl.duration || 0);
  }
});

// Chọn bài featured → sync vào hidden input
function handleSelectFeatured(url) {
  switchMusicType('sample');
  selectedMusicUrl = url;
  var hidden = document.getElementById('sampleMusic');
  if (hidden) hidden.value = url;
  // Bỏ chọn ở dropdown
  var ddEl = document.getElementById('dropdownMusicSelect');
  if (ddEl) ddEl.value = '';
  renderFeaturedMusics();
  var err = document.getElementById('errorMusic');
  if (err && url) err.style.display = 'none';
  updateAudioPreview();
  scheduleSaveDraft();
}

// Chọn bài từ dropdown → dừng bài cũ, phát bài mới, sync hidden input
function handleSelectDropdown(url, songId) {
  if (!url) return;
  switchMusicType('sample');
  selectedMusicUrl = url;
  var hidden = document.getElementById('sampleMusic');
  if (hidden) hidden.value = url;

  // Dừng bài featured đang phát (nếu có)
  if (previewAudioEl) {
    previewAudioEl.pause();
  }
  playingSongId = null;

  renderFeaturedMusics(); // cập nhật icon play/pause featured
  var err = document.getElementById('errorMusic');
  if (err && url) err.style.display = 'none';

  // Cập nhật player hiển thị + auto-play
  updateAudioPreview();
  var audioPreview = document.getElementById('audioPreview');
  if (audioPreview && audioPreview.src) {
    audioPreview.play().catch(function (e) {
      console.warn('[Dropdown Preview] Play failed:', e);
    });
  }

  scheduleSaveDraft();
}

// Toggle play/pause preview
function handleTogglePlay(song, e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  if (!previewAudioEl) return;
  if (playingSongId === song.id) {
    previewAudioEl.pause();
    playingSongId = null;
  } else {
    previewAudioEl.src = song.url;
    previewAudioEl.currentTime = 0;
    previewAudioEl.play().catch(function (err) {
      console.warn('[Music Preview] Play failed:', err);
    });
    playingSongId = song.id;
  }
  renderFeaturedMusics();
}

// Render danh sách Featured (chips ngang + progress bar bên trong)
function renderFeaturedMusics() {
  var container = document.getElementById('featuredMusicList');
  if (!container) return;
  container.innerHTML = '';
  if (!featuredMusics || featuredMusics.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  featuredMusics.forEach(function (song) {
    var isActive = selectedMusicUrl === song.url;
    var isPlaying = playingSongId === song.id;
    var item = document.createElement('div');
    item.className = 'create-music-item' + (isActive ? ' create-music-item--active' : '');
    item.addEventListener('click', function () { handleSelectFeatured(song.url); });

    // Nút Play/Pause
    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'create-music-item__play';
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    playBtn.setAttribute('aria-label', isPlaying ? 'Dừng' : 'Nghe thử');
    playBtn.addEventListener('click', function (e) { handleTogglePlay(song, e); });
    item.appendChild(playBtn);

    // Info block: tên + progress bar
    var info = document.createElement('div');
    info.className = 'create-music-item__info';

    // Tên bài
    var nameSpan = document.createElement('span');
    nameSpan.className = 'create-music-item__name';
    nameSpan.textContent = song.name;
    info.appendChild(nameSpan);

    // Progress bar row (hiện khi đang phát hoặc hiện duration tĩnh)
    var progressRow = document.createElement('div');
    progressRow.className = 'create-music-item__progress-row';

    if (isPlaying) {
      // Thanh progress
      var track = document.createElement('div');
      track.className = 'create-music-item__progress-track';
      var fill = document.createElement('div');
      fill.className = 'create-music-item__progress-fill';
      fill.id = 'music-progress-fill-' + song.id;
      // Set initial progress
      if (previewAudioEl.duration) {
        fill.style.width = (previewAudioEl.currentTime / previewAudioEl.duration * 100) + '%';
      }
      track.appendChild(fill);
      progressRow.appendChild(track);

      // Thời gian: current / total
      var timeSpan = document.createElement('span');
      timeSpan.className = 'create-music-item__time';
      timeSpan.id = 'music-time-' + song.id;
      timeSpan.textContent = formatDuration(previewAudioEl.currentTime || 0) + ' / ' + formatDuration(previewAudioEl.duration || song.duration || 0);
      progressRow.appendChild(timeSpan);
    } else {
      // Chỉ hiện tổng thời lượng
      var durStr = song.durationStr || (song.duration ? formatDuration(song.duration) : (FEATURED_DURATIONS[song.id] || ''));
      if (durStr) {
        var durSpan = document.createElement('span');
        durSpan.className = 'create-music-item__time';
        durSpan.id = 'music-dur-' + song.id;
        durSpan.textContent = '♪ ' + durStr;
        progressRow.appendChild(durSpan);
      }
    }

    info.appendChild(progressRow);
    item.appendChild(info);

    // Tick khi chọn
    if (isActive) {
      var tick = document.createElement('span');
      tick.style.cssText = 'color:var(--create-accent);font-weight:700;flex-shrink:0;margin-left:2px';
      tick.textContent = '✓';
      item.appendChild(tick);
    }
    container.appendChild(item);
  });
}

// Hàm format giây → "m:ss"
function formatDuration(sec) {
  if (!sec || sec <= 0) return '0:00';
  var m = Math.floor(sec / 60);
  var s = Math.round(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// Render dropdown "Xem thêm" (grouped by category)
function renderDropdownMusics() {
  var select = document.getElementById('dropdownMusicSelect');
  if (!select) return;
  select.innerHTML = '';
  var defOpt = document.createElement('option');
  defOpt.value = '';
  defOpt.textContent = '🎵 Chọn bài hát...';
  select.appendChild(defOpt);

  // Gom nhóm theo category
  var groups = {};
  var categoryLabels = {
    love: '💖 Nhạc Tình Yêu',
    birthday: '🎂 Nhạc Sinh Nhật',
    mother: '💐 Nhạc Về Mẹ',
    other: '✨ Thể Loại Khác'
  };
  dropdownMusics.forEach(function (m) {
    var cat = categoryLabels[m.category] ? m.category : 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(m);
  });

  // Render từng group
  Object.keys(categoryLabels).forEach(function (key) {
    var items = groups[key];
    if (!items || items.length === 0) return;
    var optgroup = document.createElement('optgroup');
    optgroup.label = categoryLabels[key];
    items.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.url;
      var durLabel = m.durationStr || (m.duration ? formatDuration(m.duration) : '');
      opt.textContent = m.name + (durLabel ? ' (' + durLabel + ')' : '');
      opt.dataset.songId = m.id;
      optgroup.appendChild(opt);
    });
    select.appendChild(optgroup);
  });

  // Đồng bộ dropdown với bài đã chọn (từ draft hoặc featured click)
  if (selectedMusicUrl) {
    select.value = selectedMusicUrl;
  }

  select.addEventListener('change', function () {
    var selectedOpt = this.options[this.selectedIndex];
    var songId = selectedOpt ? selectedOpt.dataset.songId : null;
    handleSelectDropdown(this.value, songId);
  });
}

// ═══════════════════════════════════════════════════
// 🔥 FETCH NHẠC TỪ API (pattern từ huong_dan_fetch_nhac)
// ═══════════════════════════════════════════════════
function fetchMusicsFromAPI() {
  fetch(API_MUSICS_URL)
    .then(function (res) { return res.json(); })
    .then(function (res) {
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        // 1️⃣ Lọc bỏ category không cần
        var validMusics = res.data.filter(function (m) {
          return EXCLUDED_CATEGORIES.indexOf(m.category) === -1;
        });

        // 2️⃣ Tách Featured vs Others
        var featured = [];
        var others = [];
        FEATURED_MUSIC_IDS.forEach(function (tid) {
          var found = validMusics.find(function (m) { return m.id === tid; });
          if (found) featured.push(found);
        });
        validMusics.forEach(function (m) {
          var isFeatured = featured.some(function (f) { return f.id === m.id; });
          if (!isFeatured) others.push(m);
        });

        // 3️⃣ Cập nhật state
        if (featured.length > 0) {
          featuredMusics = featured;
          featuredMusics.forEach(function (s) {
            if (!s.durationStr && FEATURED_DURATIONS[s.id]) {
              s.durationStr = FEATURED_DURATIONS[s.id];
            }
            try {
              var a = new Audio();
              a.preload = 'metadata';
              a.src = s.url;
              a.addEventListener('loadedmetadata', function () {
                if (a.duration && !isNaN(a.duration) && a.duration > 0) {
                  s.duration = a.duration;
                  s.durationStr = formatDuration(a.duration);
                  var el = document.getElementById('music-dur-' + s.id);
                  if (el && playingSongId !== s.id) {
                    el.textContent = '♪ ' + s.durationStr;
                  }
                }
              });
            } catch (e) { }
          });
        }
        if (others.length > 0) dropdownMusics = others;

        // 4️⃣ Giữ selection hợp lệ
        if (selectedMusicUrl) {
          var allAvailable = featured.concat(others);
          var exists = allAvailable.some(function (s) { return s.url === selectedMusicUrl; });
          if (!exists) selectedMusicUrl = '';
        }
      }
    })
    .catch(function (err) {
      console.warn('[Music] API unavailable, using local fallback:', err);
    })
    .finally(function () {
      // Render UI dù API thành công hay thất bại
      renderFeaturedMusics();
      renderDropdownMusics();
    });
}

// Hàm đồng bộ UI nhạc: featured cards + dropdown + audio preview
// Gọi sau khi restore draft hoặc khi cần cập nhật hiển thị nhạc đã chọn
function syncMusicSelectionUI() {
  if (typeof renderFeaturedMusics === 'function') renderFeaturedMusics();
  var ddEl = document.getElementById('dropdownMusicSelect');
  if (ddEl && selectedMusicUrl) {
    ddEl.value = selectedMusicUrl;
  }
  if (typeof updateAudioPreview === 'function') updateAudioPreview();
}

// Khởi chạy
fetchMusicsFromAPI();

// Modal hướng dẫn tải file nhạc (chuyển video/link sang MP3)
import('./music-help.js').then(function (module) {
  module.setupMusicHelpDialog();
}).catch(function (err) {
  console.warn('Music help dialog not loaded:', err);
});

// Function tính giá
function calculatePrice() {
  const basePrice = 49000;
  let totalPrice = basePrice;

  // Quà VIP (ảnh bay): checkbox bật
  const vipGiftEl = document.getElementById('vipGift');
  const vipGift = vipGiftEl ? vipGiftEl.checked : false;
  const vipPhotosCount = vipPhotoResults.length;
  const hasVip = vipGift;

  // Nhạc nền đã bao gồm trong giá gốc (49.000 ₫) — không cộng thêm

  // Kiểm tra có chọn lưu vĩnh viễn không
  const saveForeverEl = document.getElementById('saveForever');
  const saveForever = saveForeverEl ? saveForeverEl.checked : false;

  // Tính giá VIP: 20k cơ bản + 5k/ảnh từ ảnh thứ 6 trở đi
  let vipPrice = 0;
  if (hasVip) {
    vipPrice = 20000;
    const extraPhotos = Math.max(0, vipPhotosCount - 5);
    vipPrice += extraPhotos * 5000;
    totalPrice += vipPrice;
  }

  if (saveForever) {
    totalPrice += 30000;
  }

  // Tính giảm giá từ Voucher (nếu có áp dụng)
  let voucherDiscount = 0;
  if (appliedVoucher && appliedVoucher.discountPercent > 0) {
    voucherDiscount = Math.round(totalPrice * (appliedVoucher.discountPercent / 100));
    totalPrice = Math.max(0, totalPrice - voucherDiscount);
  }

  // Cập nhật UI
  const vipPriceItem = document.getElementById('vipPriceItem');
  const vipPriceValue = vipPriceItem ? vipPriceItem.querySelector('.price-value') : null;
  const saveForeverPriceItem = document.getElementById('saveForeverPriceItem');
  const voucherPriceItem = document.getElementById('voucherPriceItem');
  const voucherPriceLabel = document.getElementById('voucherPriceLabel');
  const voucherPriceValue = document.getElementById('voucherPriceValue');
  const totalPriceElement = document.getElementById('totalPrice');

  if (hasVip) {
    if (vipPriceItem) vipPriceItem.style.display = 'flex';
    if (vipPriceValue) {
      const extraPhotos = Math.max(0, vipPhotosCount - 5);
      vipPriceValue.textContent = '+' + new Intl.NumberFormat('vi-VN').format(vipPrice) + ' ₫'
        + (extraPhotos > 0 ? ' (' + extraPhotos + ' ảnh thêm)' : '');
    }
  } else {
    if (vipPriceItem) vipPriceItem.style.display = 'none';
  }

  if (saveForever) {
    if (saveForeverPriceItem) saveForeverPriceItem.style.display = 'flex';
  } else {
    if (saveForeverPriceItem) saveForeverPriceItem.style.display = 'none';
  }

  if (voucherPriceItem) {
    if (appliedVoucher && appliedVoucher.discountPercent > 0) {
      voucherPriceItem.style.display = 'flex';
      if (voucherPriceLabel) {
        voucherPriceLabel.textContent = `Mã giảm giá (${appliedVoucher.code} -${appliedVoucher.discountPercent}%):`;
      }
      if (voucherPriceValue) {
        voucherPriceValue.textContent = '-' + new Intl.NumberFormat('vi-VN').format(voucherDiscount) + ' ₫';
      }
    } else {
      voucherPriceItem.style.display = 'none';
    }
  }

  // Format và hiển thị tổng giá
  totalPriceElement.textContent = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(totalPrice);

  const btnSubmit = document.getElementById('btnSubmit');
  if (btnSubmit && !btnSubmit.disabled) {
    if (totalPrice === 0) {
      btnSubmit.innerHTML = '🎁 Tạo quà ngay (0 đ)';
    } else {
      btnSubmit.innerHTML = '💳 Thanh toán';
    }
  }

  return totalPrice;
}

// Cập nhật giá khi thay đổi (vipPhotos đã gọi calculatePrice trong listener)
document.getElementById('sampleMusic').addEventListener('change', function () {
  const err = document.getElementById('errorMusic');
  if (this.value) { err.style.display = 'none'; }
  calculatePrice();
  updateAudioPreview();
  scheduleSaveDraft();
});
// Nhạc tùy chọn: validate NGAY khi chọn file (change), không chờ submit
document.getElementById('customMusic').addEventListener('change', function () {
  const err = document.getElementById('errorMusic');
  // Tự động chuyển radio sang "Tải file nhạc" khi chọn file
  if (this.files.length > 0) switchMusicType('custom');

  if (this.files.length === 0) {
    err.style.display = 'none';
    calculatePrice();
    updateAudioPreview();
    return;
  }
  var f = this.files[0];
  var musicCheck = validateCustomMusicFile(f);
  if (!musicCheck.ok) {
    err.textContent = getMusicValidationMessage(musicCheck.reason);
    err.style.display = 'block';
    this.value = '';
    updateAudioPreview();
    calculatePrice();
    return;
  }
  err.style.display = 'none';
  calculatePrice();
  updateAudioPreview();
});
document.getElementById('saveForever').addEventListener('change', function () {
  calculatePrice();
  scheduleSaveDraft();
});

// ===== VOUCHER CONTROLLER =====
let voucherStatusTimer = null;
function showVoucherStatus(msg, type = 'info') {
  const el = document.getElementById('voucherStatusMsg');
  if (!el) return;
  if (voucherStatusTimer) {
    clearTimeout(voucherStatusTimer);
    voucherStatusTimer = null;
  }
  if (!msg) {
    el.style.display = 'none';
    el.className = '';
    el.textContent = '';
    return;
  }
  el.style.display = 'block';
  el.className = `voucher-msg-${type}`;
  el.textContent = msg;

  if (type === 'success' || type === 'info') {
    voucherStatusTimer = setTimeout(() => {
      if (el) el.style.display = 'none';
    }, 3500);
  }
}

async function loadVouchers(forceRefresh = false) {
  const container = document.getElementById('voucherListContainer');
  if (!container) return;

  const uid = localStorage.getItem('user_uid') || auth.currentUser?.uid || '';

  if (!forceRefresh && (cachedActiveVouchers.length > 0 && (!uid || cachedUserVouchers.length > 0))) {
    renderVoucherList();
    return;
  }

  container.innerHTML = '<div style="text-align: center; color: var(--create-muted); font-size: 0.84rem; padding: 12px;">⏳ Đang tải danh sách mã giảm giá...</div>';

  try {
    const activeUrl = uid ? `${VOUCHER_API_BASE}/active?uid=${encodeURIComponent(uid)}` : `${VOUCHER_API_BASE}/active`;
    const promises = [
      fetch(activeUrl).then(r => r.json()).catch(() => ({ success: false, data: [] }))
    ];
    if (uid) {
      promises.push(
        fetch(`${VOUCHER_API_BASE}/user/${encodeURIComponent(uid)}/saved-unused`).then(r => r.json()).catch(() => ({ success: false, data: [] }))
      );
    }

    const [activeRes, userRes] = await Promise.all(promises);

    cachedActiveVouchers = (activeRes && activeRes.success && Array.isArray(activeRes.data)) ? activeRes.data : [];
    cachedUserVouchers = (userRes && userRes.success && Array.isArray(userRes.data)) ? userRes.data : [];

    renderVoucherList();
  } catch (err) {
    console.error('Lỗi tải voucher:', err);
    container.innerHTML = '<div style="text-align: center; color: #dc2626; font-size: 0.82rem; padding: 10px;">Không thể tải danh sách mã giảm giá lúc này.</div>';
  }
}

function formatVoucherExpiry(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `HSD: ${day}/${month}/${year}`;
  } catch (e) {
    return '';
  }
}

function renderVoucherList() {
  const container = document.getElementById('voucherListContainer');
  if (!container) return;

  const voucherMap = new Map();

  // Đưa voucher đã lưu của user vào trước
  cachedUserVouchers.forEach(v => {
    if (v && v.code) {
      voucherMap.set(v.code, { ...v, isSaved: true });
    }
  });

  // Đưa voucher active công khai vào
  cachedActiveVouchers.forEach(v => {
    if (v && v.code) {
      if (!voucherMap.has(v.code)) {
        voucherMap.set(v.code, { ...v, isSaved: false });
      }
    }
  });

  const list = Array.from(voucherMap.values());

  if (list.length === 0) {
    container.innerHTML = `
          <div style="text-align: center; color: var(--create-muted); font-size: 0.82rem; padding: 12px; background: rgba(253, 242, 248, 0.4); border-radius: 8px;">
            Chưa có mã công khai hiển thị.<br>Nếu bạn có mã bí mật / riêng, vui lòng nhập vào ô bên trên nhé!
          </div>
        `;
    return;
  }

  container.innerHTML = list.map(v => {
    const isApplied = appliedVoucher && (appliedVoucher.code === v.code);
    const expText = formatVoucherExpiry(v.validTo);
    const remaining = (v.quantity != null && v.usedCount != null) ? (v.quantity - v.usedCount) : null;
    const remainText = remaining != null ? `Còn ${Math.max(0, remaining)} lượt` : '';
    const isSecret = v.isSaved && !cachedActiveVouchers.some(a => a.code === v.code);
    const metaParts = [];
    if (v.isSaved) metaParts.push('✓ Đã lưu');
    if (isSecret) metaParts.push('Mã riêng');
    if (v.usageType === 'ONE_PER_USER') metaParts.push('1 lần/tài khoản');
    if (remainText) metaParts.push(remainText);
    if (expText) metaParts.push(expText);
    const metaString = metaParts.join(' • ');

    return `
          <div class="voucher-card ${isApplied ? 'is-applied' : ''}" data-code="${v.code}">
            <div class="voucher-card__main">
              <div class="voucher-card__tags">
                <span class="voucher-card__discount">Giảm ${v.discountPercent}%</span>
                <span class="voucher-card__code">${v.code}</span>
              </div>
              ${metaString ? `<div class="voucher-card__meta-line">${metaString}</div>` : ''}
            </div>
            <div class="voucher-card__actions">
              ${isApplied
        ? `<button type="button" class="btn-voucher-action btn-voucher-remove" data-action="remove" data-code="${v.code}">Bỏ chọn</button>`
        : `<button type="button" class="btn-voucher-action btn-voucher-apply" data-action="apply" data-code="${v.code}" data-discount="${v.discountPercent}">Áp dụng</button>`
      }
            </div>
          </div>
        `;
  }).join('');

  container.querySelectorAll('.btn-voucher-action').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const action = this.dataset.action;
      const code = this.dataset.code;
      const discount = Number(this.dataset.discount) || 0;

      if (action === 'apply') {
        applyVoucherCode(code, discount);
      } else if (action === 'remove') {
        removeAppliedVoucher();
      }
    });
  });
}

async function applyVoucherCode(inputCode, explicitDiscount = null) {
  const code = (inputCode || '').trim().toUpperCase();
  if (!code) {
    showVoucherStatus('Vui lòng nhập mã giảm giá', 'error');
    return;
  }

  if (appliedVoucher && appliedVoucher.code === code) {
    showVoucherStatus(`Mã ${code} đang được áp dụng rồi`, 'info');
    return;
  }

  showVoucherStatus('⏳ Đang kiểm tra mã giảm giá...', 'info');

  const uid = localStorage.getItem('user_uid') || auth.currentUser?.uid || '';

  // Trường hợp 1: Có sẵn discount (user click áp dụng từ danh sách)
  if (explicitDiscount != null && explicitDiscount > 0) {
    const alreadySaved = cachedUserVouchers.some(v => v && v.code && v.code.toUpperCase() === code);
    if (!alreadySaved && uid) {
      try {
        const res = await fetch(`${VOUCHER_API_BASE}/${encodeURIComponent(code)}/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid })
        });
        const json = await res.json().catch(() => ({}));
        if (!json.success && json.message && !json.message.toLowerCase().includes('đã lưu')) {
          showVoucherStatus(json.message, 'error');
          loadVouchers(true);
          return;
        }
      } catch (e) {
        console.warn('Lỗi khi lưu voucher:', e);
      }
    }

    appliedVoucher = { code, discountPercent: explicitDiscount };
    updateVoucherAppliedUI();
    calculatePrice();
    showVoucherStatus(`✅ Đã áp dụng mã ${code}: Giảm ${explicitDiscount}%`, 'success');
    renderVoucherList();
    scheduleSaveDraft();
    return;
  }

  // Trường hợp 2: User nhập tay vào ô input (bao gồm mã công khai hoặc mã bí mật / private)
  // 2.1. Đã có trong danh sách voucher đã lưu của user
  const savedVoucher = cachedUserVouchers.find(v => v && v.code && v.code.toUpperCase() === code);
  if (savedVoucher && savedVoucher.discountPercent > 0) {
    appliedVoucher = { code: savedVoucher.code, discountPercent: savedVoucher.discountPercent };
    updateVoucherAppliedUI();
    calculatePrice();
    showVoucherStatus(`✅ Đã áp dụng mã ${savedVoucher.code}: Giảm ${savedVoucher.discountPercent}%`, 'success');
    renderVoucherList();
    scheduleSaveDraft();
    return;
  }

  // 2.2. User đã đăng nhập: Gọi POST /api/voucher/:code/save để lưu vào ví và lấy thông tin chiết khấu
  if (uid) {
    try {
      const res = await fetch(`${VOUCHER_API_BASE}/${encodeURIComponent(code)}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      });
      const json = await res.json().catch(() => ({}));

      if (json.success && json.data) {
        const discount = json.data.discountPercent || 0;
        appliedVoucher = { code: json.data.code || code, discountPercent: discount };
        updateVoucherAppliedUI();
        calculatePrice();
        showVoucherStatus(`✅ Đã lưu và áp dụng mã ${appliedVoucher.code}: Giảm ${discount}%`, 'success');
        await loadVouchers(true);
        scheduleSaveDraft();
        return;
      }

      // Xử lý thông báo lỗi từ server
      if (!json.success && json.message) {
        if (json.message.toLowerCase().includes('đã lưu')) {
          await loadVouchers(true);
          const foundAfterRefresh = cachedUserVouchers.find(v => v && v.code && v.code.toUpperCase() === code);
          if (foundAfterRefresh && foundAfterRefresh.discountPercent > 0) {
            appliedVoucher = { code: foundAfterRefresh.code, discountPercent: foundAfterRefresh.discountPercent };
            updateVoucherAppliedUI();
            calculatePrice();
            showVoucherStatus(`✅ Đã áp dụng mã ${appliedVoucher.code}: Giảm ${foundAfterRefresh.discountPercent}%`, 'success');
            renderVoucherList();
            scheduleSaveDraft();
            return;
          }
        }
        showVoucherStatus(json.message, 'error');
        return;
      }

      showVoucherStatus('Mã giảm giá không hợp lệ hoặc đã hết hạn', 'error');
    } catch (e) {
      showVoucherStatus('Lỗi kết nối khi áp dụng voucher', 'error');
    }
  } else {
    // 2.3. Chưa đăng nhập: Kiểm tra trong danh sách voucher công khai
    try {
      if (cachedActiveVouchers.length === 0) {
        const res = await fetch(`${VOUCHER_API_BASE}/active`).then(r => r.json()).catch(() => ({ data: [] }));
        cachedActiveVouchers = res.data || [];
      }

      const found = cachedActiveVouchers.find(v => v.code && v.code.toUpperCase() === code);
      if (found && found.discountPercent) {
        appliedVoucher = { code: found.code, discountPercent: found.discountPercent };
        updateVoucherAppliedUI();
        calculatePrice();
        showVoucherStatus(`✅ Đã áp dụng mã ${code} (-${found.discountPercent}%). Đăng nhập để lưu mã vào tài khoản nhé!`, 'success');
        renderVoucherList();
        scheduleSaveDraft();
      } else {
        showVoucherStatus('Mã không tồn tại hoặc bạn cần đăng nhập để dùng mã bí mật / riêng.', 'error');
      }
    } catch (e) {
      showVoucherStatus('Lỗi kiểm tra mã giảm giá', 'error');
    }
  }
}

function removeAppliedVoucher() {
  appliedVoucher = null;
  updateVoucherAppliedUI();
  calculatePrice();
  showVoucherStatus('Đã bỏ chọn mã giảm giá', 'info');
  renderVoucherList();
  scheduleSaveDraft();
}

function updateVoucherAppliedUI() {
  const badge = document.getElementById('voucherBadgeApplied');
  const input = document.getElementById('voucherCodeInput');
  const bar = document.querySelector('.voucher-bar');
  if (badge) {
    if (appliedVoucher) {
      badge.style.display = 'inline-block';
      badge.textContent = `-${appliedVoucher.discountPercent}% (${appliedVoucher.code})`;
      if (bar) bar.classList.add('has-voucher');
    } else {
      badge.style.display = 'none';
      if (bar) bar.classList.remove('has-voucher');
    }
  }
  if (input) {
    input.value = appliedVoucher ? appliedVoucher.code : '';
  }
}

function initVoucherFeature() {
  const checkbox = document.getElementById('voucherCheckbox');
  const container = document.getElementById('voucherContainer');
  const btnApply = document.getElementById('btnApplyVoucher');
  const codeInput = document.getElementById('voucherCodeInput');
  const btnRefresh = document.getElementById('btnRefreshVouchers');

  if (!checkbox || !container) return;

  checkbox.addEventListener('change', function () {
    var bar = checkbox.closest('.voucher-bar') || document.querySelector('.voucher-bar');
    if (bar) bar.classList.toggle('is-open', this.checked);
    if (this.checked) {
      container.style.display = 'block';
      loadVouchers();
    } else {
      container.style.display = 'none';
      if (appliedVoucher) {
        removeAppliedVoucher();
      }
      showVoucherStatus('');
    }
    scheduleSaveDraft();
  });

  if (btnApply && codeInput) {
    btnApply.addEventListener('click', function () {
      applyVoucherCode(codeInput.value);
    });
    codeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnApply.click();
      }
    });
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', function () {
      loadVouchers(true);
    });
  }
}

initVoucherFeature();

// Tính giá ban đầu
calculatePrice();

// Module payment: flow checkout 1 API + socket/iframe
let checkoutGift83, getPaymentByOrderCode;
(async function () {
  try {
    const paymentModule = await import('../lib/payment.js');
    checkoutGift83 = paymentModule.checkoutGift83;
    getPaymentByOrderCode = paymentModule.getPaymentByOrderCode;
    if (typeof paymentModule.initWebSocket === 'function') paymentModule.initWebSocket();
    if (typeof paymentModule.createPaymentModal === 'function') paymentModule.createPaymentModal();
  } catch (error) {
    console.error('❌ Error loading payment module:', error);
  }
})();

// Function để hiển thị shareLink sau khi thanh toán thành công
function displayShareLink(giftId, shareLink, isFree = false) {
  const previewSection = document.getElementById('previewSection');
  const previewData = document.getElementById('previewData');

  let resultHTML = '<div style="padding: 20px;">';
  const successTitle = isFree ? '🎉 Tạo quà thành công!' : '✅ Thanh toán thành công!';
  resultHTML += '<div style="color: #28a745; font-size: 18px; font-weight: 600; margin-bottom: 20px;">' + successTitle + '</div>';

  // Tạo item giống như trong lịch sử đơn hàng
  resultHTML += '<div class="order-item" onclick="openShareLink(\'' + shareLink + '\')" style="cursor: pointer;">';
  resultHTML += '<div class="order-item-header">';
  resultHTML += '<div class="order-code">ID: ' + giftId + '</div>';
  resultHTML += '<div class="order-status paid">' + (isFree ? 'Miễn phí' : 'Đã thanh toán') + '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="order-details">';
  resultHTML += '<div class="order-detail-item" style="grid-column: 1 / -1;">';
  resultHTML += '<div class="order-detail-label">Link share</div>';
  resultHTML += '<div class="order-detail-value" style="word-break: break-all; font-size: 13px; color: #667eea;">' + shareLink + '</div>';
  resultHTML += '</div>';
  resultHTML += '</div>';
  resultHTML += '<div class="order-actions" onclick="event.stopPropagation();">';
  resultHTML += '<button class="order-action-btn order-action-view" onclick="openShareLink(\'' + shareLink + '\')">';
  resultHTML += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
  resultHTML += '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>';
  resultHTML += '<polyline points="15 3 21 3 21 9"></polyline>';
  resultHTML += '<line x1="10" y1="14" x2="21" y2="3"></line>';
  resultHTML += '</svg>';
  resultHTML += 'Xem ngay';
  resultHTML += '</button>';
  resultHTML += '<button class="order-action-btn order-action-copy" onclick="copyShareLink(\'' + shareLink + '\', \'shareLink_' + giftId + '\')">';
  resultHTML += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
  resultHTML += '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>';
  resultHTML += '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
  resultHTML += '</svg>';
  resultHTML += 'Sao chép';
  resultHTML += '</button>';
  resultHTML += '<button class="order-action-btn order-action-qr" onclick="openHeartQR(\'' + shareLink + '\')">';
  resultHTML += '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
  resultHTML += '<rect x="3" y="3" width="5" height="5"></rect>';
  resultHTML += '<rect x="16" y="3" width="5" height="5"></rect>';
  resultHTML += '<rect x="3" y="16" width="5" height="5"></rect>';
  resultHTML += '<line x1="8" y1="5.5" x2="16" y2="5.5"></line>';
  resultHTML += '<line x1="8" y1="18.5" x2="16" y2="18.5"></line>';
  resultHTML += '<line x1="5.5" y1="8" x2="5.5" y2="16"></line>';
  resultHTML += '<line x1="18.5" y1="8" x2="18.5" y2="16"></line>';
  resultHTML += '</svg>';
  resultHTML += 'Tạo QR';
  resultHTML += '</button>';
  resultHTML += '</div>';
  resultHTML += '</div>';
  resultHTML += '</div>';

  previewData.innerHTML = resultHTML;
  previewSection.style.display = 'block';
  previewSection.scrollIntoView({ behavior: 'smooth' });
}

// Lắng nghe sự kiện thanh toán thành công
window.addEventListener('payment_success', async function (event) {
  const isFree = !!event?.detail?.isFree;

  // Ghi nhận sử dụng voucher khi thanh toán thành công hoặc miễn phí
  if (appliedVoucher && appliedVoucher.code) {
    const voucherCodeToUse = appliedVoucher.code;
    const uid = localStorage.getItem('user_uid') || auth.currentUser?.uid || '';
    if (uid) {
      try {
        const useRes = await fetch(`${VOUCHER_API_BASE}/${encodeURIComponent(voucherCodeToUse)}/use`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid })
        });
        const useJson = await useRes.json().catch(() => ({}));
        console.log('[VOUCHER] Ghi nhận áp dụng voucher sau thanh toán:', useJson);
      } catch (e) {
        console.warn('[VOUCHER] Lỗi gọi API /use voucher:', e);
      }
    }
    appliedVoucher = null;
    if (typeof loadVouchers === 'function') {
      loadVouchers(true);
    }
  }

  // Lấy giftId và shareLink từ biến global đã lưu hoặc event detail
  const savedGiftId = window.savedGiftId || event.detail?.recordId;
  const savedShareLink = window.savedShareLink || (savedGiftId ? `${window.location.origin}/?id=${savedGiftId}` : null);

  if (savedGiftId && savedShareLink) {
    displayShareLink(savedGiftId, savedShareLink, isFree);
    window.savedGiftId = null;
    window.savedShareLink = null;
  }
  clearDraft();
});

// Function để hiển thị toast (đơn giản)
function showToast(message, type = 'info') {
  // Tạo toast nếu chưa có
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #667eea; color: white; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.2); max-width: 300px; word-wrap: break-word;';
    document.body.appendChild(toast);
  }

  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#667eea'
  };

  toast.style.background = colors[type] || colors.info;
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// ===== DROPDOWN MẪU THƯ GỢI Ý =====
var letterTemplateSelect = document.getElementById('letterTemplate');
if (letterTemplateSelect) {
  letterTemplateSelect.addEventListener('change', function () {
    var key = this.value;
    if (!key || !letterTemplates[key]) return;
    var tpl = letterTemplates[key];
    var titleEl = document.getElementById('letterTitle');
    var contentEl = document.getElementById('letterContent');
    var signatureEl = document.getElementById('letterSignature');
    if (titleEl) { titleEl.value = tpl.title; titleEl.classList.remove('error'); document.getElementById('errorLetterTitle').style.display = 'none'; }
    if (contentEl) { contentEl.value = tpl.content; contentEl.classList.remove('error'); document.getElementById('errorLetterContent').style.display = 'none'; }
    if (signatureEl) signatureEl.value = tpl.signature;
    showToast('✅ Đã điền mẫu thư! Bạn có thể chỉnh sửa lại.', 'success');
  });
}

// Validate toàn bộ ô bắt buộc (dùng chung cho Xem trước và Thanh toán)
function validateAllRequiredFields(options) {
  // Validate all fields
  const introText = (document.getElementById('introText')?.value || '').trim();
  const letterTitle = document.getElementById('letterTitle').value.trim();
  const letterContent = document.getElementById('letterContent').value.trim();
  const letterSignature = document.getElementById('letterSignature').value.trim();

  const errorTitle = document.getElementById('errorLetterTitle');
  const errorContent = document.getElementById('errorLetterContent');
  const errorSignature = document.getElementById('errorLetterSignature');

  // Chỉ nội dung thư bắt buộc; tiêu đề và chữ ký tùy chọn
  let isValid = true;
  errorTitle.style.display = 'none';
  document.getElementById('letterTitle').classList.remove('error');

  if (!validateText(letterContent, 'Nội dung thư', errorContent)) {
    document.getElementById('letterContent').classList.add('error');
    isValid = false;
  } else {
    document.getElementById('letterContent').classList.remove('error');
  }

  // Chữ ký tùy chọn, không validate
  errorSignature.style.display = 'none';
  document.getElementById('letterSignature').classList.remove('error');

  // Validate Quà VIP (ảnh bay)
  if (!(options && options.skipVipPhotoCheck) && !validateVipPhotos()) {
    isValid = false;
  }

  // Validate bắt buộc chọn nhạc + giới hạn 10MB cho file nhạc
  const musicType = document.querySelector('input[name="musicType"]:checked')?.value;
  const sampleMusicVal = document.getElementById('sampleMusic').value;
  const customMusicFiles = document.getElementById('customMusic').files;
  const hasMusic = (musicType === 'sample' && sampleMusicVal) || (musicType === 'custom' && (customMusicFiles.length > 0 || window.restoredCustomMusicBase64));
  const errorMusic = document.getElementById('errorMusic');
  if (!hasMusic) {
    errorMusic.textContent = 'Vui lòng chọn nhạc nền (từ danh sách mẫu hoặc tải file nhạc của bạn).';
    errorMusic.style.display = 'block';
    isValid = false;
  } else if (musicType === 'custom' && customMusicFiles.length > 0) {
    var customFile = customMusicFiles[0];
    var customMusicCheck = validateCustomMusicFile(customFile);
    if (!customMusicCheck.ok) {
      errorMusic.textContent = getMusicValidationMessage(customMusicCheck.reason);
      errorMusic.style.display = 'block';
      document.getElementById('customMusic').value = '';
      isValid = false;
    } else {
      errorMusic.style.display = 'none';
    }
  } else {
    errorMusic.style.display = 'none';
  }

  if (!isValid) {
    // Tìm và scroll đến lỗi đầu tiên
    let firstErrorElement = null;
    let firstErrorInput = null;

    // Kiểm tra từng field theo thứ tự (tiêu đề không validate nên bỏ qua)
    if (errorContent.style.display === 'block') {
      firstErrorElement = errorContent;
      firstErrorInput = document.getElementById('letterContent');
    } else if (errorSignature && errorSignature.style.display === 'block') {
      firstErrorElement = errorSignature;
      firstErrorInput = document.getElementById('letterSignature');
    } else if (errorMusic && errorMusic.style.display === 'block') {
      firstErrorElement = errorMusic;
      firstErrorInput = document.getElementById('sampleMusic');
    } else {
      const vipErr = document.getElementById('vipPhotosError');
      if (vipErr && vipErr.style.display === 'block') {
        firstErrorElement = vipErr;
        firstErrorInput = document.getElementById('vipPhotos');
      }
    }

    // Scroll đến element lỗi
    if (firstErrorInput) {
      firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus vào input để người dùng biết
      setTimeout(() => {
        firstErrorInput.focus();
      }, 300);
    } else if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: tìm bất kỳ element có class error
      const errorInput = document.querySelector('input.error, textarea.error');
      if (errorInput) {
        errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          errorInput.focus();
        }, 300);
      }
    }

    return false;
  }
  return true;
}

// Form submit
document.getElementById('btnSubmit').addEventListener('click', function (e) {
  var musicType = document.querySelector('input[name="musicType"]:checked')?.value;
  var sampleMusic = document.getElementById('sampleMusic').value;
  var customMusic = document.getElementById('customMusic');
  var hasMusic = (musicType === 'sample' && sampleMusic) ||
    (musicType === 'custom' && (customMusic.files.length > 0 || window.restoredCustomMusicBase64));

  if (!hasMusic) {
    e.preventDefault();
    var errorMusic = document.getElementById('errorMusic');
    errorMusic.textContent = 'Bạn chưa chọn nhạc nền. Hãy chọn một bài trong danh sách hoặc tải file nhạc lên rồi thử lại.';
    errorMusic.style.display = 'block';
    showToast('Bạn chưa chọn nhạc nền. Vui lòng chọn nhạc trước khi thanh toán.', 'error');
    errorMusic.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

document.getElementById('customForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  if (isPreparingCheckout) {
    showToast('Đang chuẩn bị ảnh, vui lòng đợi hoàn tất rồi thử lại.', 'info');
    return;
  }
  if (!validateAllRequiredFields({ skipVipPhotoCheck: true })) return;

  // Nếu chưa tích "Lưu vĩnh viễn" → hiện popup hỏi tối đa 1 lần mỗi phiên, chưa gọi API
  const saveForeverCheckbox = document.getElementById('saveForever');
  if (!saveForeverCheckbox.checked && !saveForeverModalShownThisSession) {
    saveForeverModalShownThisSession = true;
    pendingSubmitAfterSaveForever = true;
    showSaveForeverModal();
    return;
  }

  // Chờ hàng đợi nén ảnh hoàn tất trước khi tạo FormData hoặc gọi API.
  if (document.getElementById('vipGift').checked) {
    setCheckoutPreparing(true, 'Đang chuẩn bị ảnh...');
    try {
      var compressionJob;
      do {
        compressionJob = vipPhotoCompressionPromise;
        await compressionJob;
      } while (compressionJob !== vipPhotoCompressionPromise);
    } catch (compressionError) {
      console.error('[COMPRESS] Không thể hoàn tất hàng đợi nén:', compressionError);
      setCheckoutPreparing(false);
      showToast('Không thể xử lý ảnh. Vui lòng chọn lại ảnh rồi thử lại.', 'error');
      return;
    }
    if (!validateVipPhotos()) {
      setCheckoutPreparing(false);
      showToast('Ảnh chưa sẵn sàng. Vui lòng chờ nén xong hoặc chọn lại ảnh.', 'error');
      return;
    }
  }
  try {

  const introText = (document.getElementById('introText')?.value || '').trim();
  const letterTitle = document.getElementById('letterTitle').value.trim();
  const letterContent = document.getElementById('letterContent').value.trim();
  const letterSignature = document.getElementById('letterSignature').value.trim();
  const musicType = document.querySelector('input[name="musicType"]:checked')?.value;
  const hasMusic = !!musicType;

  const formData = new FormData();

  // Câu mở đầu (Intro)
  formData.append('introText', introText);

  // Tông màu bó hoa (Flower Color Tone) — đồng thời quyết định màu phong bì
  const flowerColor = (document.getElementById('flowerColor')?.value || 'classic');
  formData.append('flowerColor', flowerColor);

  // Tiêu đề thư
  formData.append('letterTitle', letterTitle);

  // Nội dung thư - tách thành các paragraph
  const paragraphs = letterContent.split('\n\n').filter(p => p.trim());
  formData.append('letterContent', JSON.stringify(paragraphs));

  // Chữ ký
  formData.append('letterSignature', letterSignature);

  // Quà VIP (ảnh bay) — gửi ảnh vào một mảng (cùng field name)
  const vipGift = document.getElementById('vipGift').checked;
  if (vipGift && vipPhotoResults.length > 0) {
    for (var vi = 0; vi < vipPhotoResults.length; vi++) {
      var item = vipPhotoResults[vi];
      var fixedFile = await blobToFile(item.blob, 'vip-' + (vi + 1) + '.jpg', item.isOriginal);
      var vipSubmitCheck = validateVipPhotoFile(fixedFile);
      if (!vipSubmitCheck.ok) {
        throw new Error('Ảnh VIP #' + (vi + 1) + ' không hợp lệ trước khi upload. Vui lòng chọn lại ảnh.');
      }
      var integrity = await checkFileIntegrity(fixedFile, 'Ảnh VIP #' + (vi + 1));
      if (!integrity.ok) {
        throw new Error(integrity.message);
      }
      formData.append('vipPhotos', fixedFile);
    }
  }

  // Nhạc (đã validate có chọn ở trên)
  if (musicType === 'sample') {
    const sampleMusic = document.getElementById('sampleMusic').value;
    if (sampleMusic) {
      formData.append('musicType', 'Sample');
      formData.append('musicPath', sampleMusic);
    }
  } else if (musicType === 'custom') {
    const customMusicInput = document.getElementById('customMusic');
    var customMusic = customMusicInput && customMusicInput.files[0];
    if (customMusic) {
      var customSubmitCheck = validateCustomMusicFile(customMusic);
      if (!customSubmitCheck.ok) {
        showToast('❌ ' + getMusicValidationMessage(customSubmitCheck.reason), 'error');
        customMusicInput.value = '';
        return;
      }
      var musicIntegrity = await checkFileIntegrity(customMusic, 'File nhạc tải lên');
      if (!musicIntegrity.ok) {
        throw new Error(musicIntegrity.message);
      }
      formData.append('musicType', 'Custom');
      formData.append('musicFile', customMusic);
    } else if (window.restoredCustomMusicBase64) {
      var dataUrl = window.restoredCustomMusicBase64;
      var blob = await fetch(dataUrl).then(function (r) { return r.blob(); });
      var musicFile = new File([blob], 'restored-music.mp3', { type: blob.type || 'audio/mpeg' });
      var restoredMusicCheck = validateCustomMusicFile(musicFile);
      if (!restoredMusicCheck.ok) {
        throw new Error(getMusicValidationMessage(restoredMusicCheck.reason));
      }
      var restoredIntegrity = await checkFileIntegrity(musicFile, 'File nhạc khôi phục');
      if (!restoredIntegrity.ok) {
        throw new Error(restoredIntegrity.message);
      }
      formData.append('musicType', 'Custom');
      formData.append('musicFile', musicFile);
    }
  }

  // Lưu vĩnh viễn
  const saveForever = document.getElementById('saveForever').checked;
  if (saveForever) {
    formData.append('isSavePermanent', 'true');
  }

  // Hiển thị preview
  const previewSection = document.getElementById('previewSection');
  const previewData = document.getElementById('previewData');

  let previewText = '=== FORMDATA PREVIEW ===\n\n';

  // Text fields
  previewText += '📝 Text Fields:\n';
  previewText += `- flowerColor: ${flowerColor}\n`;
  previewText += `- introText: ${introText}\n`;
  previewText += `- letterTitle: ${letterTitle}\n`;
  previewText += `- letterContent (JSON): ${JSON.stringify(paragraphs, null, 2)}\n`;
  previewText += `- letterSignature: ${letterSignature}\n\n`;

  // Files - Quà VIP (ảnh bay)
  previewText += '📁 Quà VIP (ảnh bay):\n';
  if (vipGift && vipPhotoResults.length > 0) {
    previewText += '- vipPhotos: [' + vipPhotoResults.length + ' ảnh] ';
    vipPhotoResults.forEach(function (r, i) {
      var sizeKb = r.blob && r.blob.size ? (r.blob.size / 1024).toFixed(2) : '?';
      previewText += (i ? ', ' : '') + sizeKb + ' KB';
    });
    previewText += '\n';
  } else {
    previewText += '- (không chọn)\n';
  }

  // Music
  previewText += '\n🎵 Music:\n';
  if (hasMusic) {
    if (musicType === 'sample') {
      const sampleMusic = document.getElementById('sampleMusic').value;
      previewText += `- Type: Sample\n`;
      previewText += `- Path: ${sampleMusic}\n`;
    } else if (musicType === 'custom') {
      const customMusic = document.getElementById('customMusic').files[0];
      previewText += `- Type: Custom\n`;
      previewText += customMusic
        ? `- File: ${customMusic.name} (${(customMusic.size / 1024).toFixed(2)} KB)\n`
        : `- File: (nhạc đã khôi phục)\n`;
    }
  } else {
    previewText += '- (Không chọn nhạc)\n';
  }

  // Lưu vĩnh viễn
  previewText += '\n💾 Lưu vĩnh viễn:\n';
  if (saveForever) {
    previewText += '- isSavePermanent: true (+30.000 ₫)\n';
  } else {
    previewText += '- isSavePermanent: false\n';
  }

  previewText += '\n=== END PREVIEW ===\n';
  previewText += '\n💡 Lưu ý: FormData thực tế sẽ chứa binary data cho các file.\n';
  previewText += 'Để xem đầy đủ, bạn cần kiểm tra trong Network tab khi gọi API.';

  previewData.textContent = previewText;
  previewSection.style.display = 'block';

  // Scroll to preview
  previewSection.scrollIntoView({ behavior: 'smooth' });

  // Hiển thị loading trên nút thanh toán
  var btnSubmit = document.getElementById('btnSubmit');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    if (!btnSubmit._originalText) btnSubmit._originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<span class="btn-spinner"></span> Đang tạo đơn...';
  }

  // Gọi API để tạo bản ghi
  createGift83(formData);
  } catch (prepareError) {
    console.error('[CREATE] Lỗi chuẩn bị dữ liệu trước khi gửi:', prepareError);
    setCheckoutPreparing(false);
    showToast(prepareError.message || 'Không thể chuẩn bị dữ liệu. Vui lòng thử lại.', 'error');
  }
});

// Function để gọi API tạo Gift83
async function createGift83(formData) {
  const previewSection = document.getElementById('previewSection');
  const previewData = document.getElementById('previewData');

  // Hiển thị loading
  previewData.innerHTML = '<div style="text-align: center; padding: 20px; color: #667eea;">⏳ Đang tạo bản ghi...</div>';
  previewSection.style.display = 'block';
  previewSection.scrollIntoView({ behavior: 'smooth' });

  try {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'PAYOS';
    const totalPrice = calculatePrice();
    const polarAmount = (appliedVoucher && appliedVoucher.discountPercent > 0)
      ? Math.max(1, Math.round(5 * (1 - appliedVoucher.discountPercent / 100)))
      : 5;
    const paymentAmount = totalPrice === 0 ? 0 : (selectedMethod === 'POLAR' ? polarAmount : totalPrice);
    const uid = localStorage.getItem('user_uid') || '';
    const customerEmail = localStorage.getItem('customerEmail') || '';
    const letterTitle = (document.getElementById('letterTitle')?.value || '').trim();

    // Flow mới: chỉ 1 API checkout, FE gửi đủ dữ liệu payment + product + record.
    formData.set('uid', uid);
    formData.set('amount', String(paymentAmount));
    if (appliedVoucher && appliedVoucher.code) {
      formData.set('voucherCode', appliedVoucher.code);
      formData.set('discountPercent', String(appliedVoucher.discountPercent));
    }
    formData.set('description', 'Bó hoa kỉ niệm');
    formData.set('paymentMethod', paymentAmount === 0 ? 'FREE' : selectedMethod);
    // forceNew: false = BE tự kiểm tra đơn PENDING cũ và trả lại nếu còn hạn
    // forceNew: true  = bỏ qua check, luôn tạo đơn mới (dùng khi user sửa nội dung)
    if (!formData.has('forceNew')) formData.set('forceNew', 'false');
    formData.set('customerEmail', customerEmail);
    formData.set('name', letterTitle || 'Bó hoa kỉ niệm');
    formData.set('type', GIFT_PRODUCT_TYPE);
    formData.set('linkBase', window.location.origin);

    // Lấy Firebase token để xác thực
    const user = auth.currentUser;
    let idToken = null;

    if (user) {
      idToken = await user.getIdToken();
    }

    // Chuẩn bị headers
    const headers = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    if (typeof checkoutGift83 !== 'function') {
      throw new Error('Payment module chưa sẵn sàng. Vui lòng thử lại.');
    }

    // Gọi API checkout 1 bước (đã xử lý mở iframe + socket trong lib/payment.js)
    const checkoutResult = await checkoutGift83(formData, idToken, showToast, null);
    if (!checkoutResult || !checkoutResult.success) {
      throw new Error(checkoutResult?.error || 'Checkout thất bại');
    }

    const giftId = checkoutResult.data.recordId;
    const orderCode = checkoutResult.data.orderCode;
    if (checkoutResult.isExistingOrder) {
      console.log('[CREATE] Đã mở lại đơn hàng cũ, recordId:', giftId, 'orderCode:', orderCode);
    }
    const origin = window.location.origin;
    const shareLink = `${origin}/?id=${giftId}`;
    window.savedGiftId = giftId;
    window.savedShareLink = shareLink;
    window.savedOrderCode = String(orderCode);
    if (checkoutResult.isFree) {
      // Xử lý trực tiếp cho đơn hàng 100% miễn phí
      if (appliedVoucher && appliedVoucher.code) {
        const voucherCodeToUse = appliedVoucher.code;
        const uidToUse = uid || (typeof auth !== 'undefined' && auth.currentUser?.uid) || '';
        if (uidToUse) {
          try {
            console.log(`[VOUCHER] Gọi API /use cho voucher 100%: ${voucherCodeToUse}, uid: ${uidToUse}`);
            const useRes = await fetch(`${VOUCHER_API_BASE}/${encodeURIComponent(voucherCodeToUse)}/use`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ uid: uidToUse })
            });
            const useJson = await useRes.json().catch(() => ({}));
            console.log('[VOUCHER] Kết quả API /use voucher:', useJson);
            if (!useJson.success) {
              console.warn('[VOUCHER] Sử dụng voucher không thành công:', useJson.message || useJson.error);
            }
          } catch (e) {
            console.error('[VOUCHER] Lỗi mạng khi gọi /use voucher:', e);
          }
        }
        appliedVoucher = null;
        if (typeof loadVouchers === 'function') {
          loadVouchers(true);
        }
      }
      displayShareLink(giftId, shareLink, true);
      clearDraft();
      return;
    } else {
      previewData.innerHTML = '<div style="text-align: center; padding: 20px; color: #667eea;">⏳ Đang mở trang thanh toán...</div>';
    }

  } catch (error) {
    console.error('❌ Error creating Gift83:', error);

    let rawMsg = error.message || 'Lỗi không xác định';
    if (/unexpected end of form|network error|failed to fetch|timeout|econnreset/i.test(rawMsg)) {
      rawMsg = 'Kết nối mạng bị gián đoạn trong quá trình gửi dữ liệu. Bạn vui lòng kiểm tra lại đường truyền mạng và thử lại nhé!';
    }

    let errorHTML = '<div style="padding: 20px;">';
    errorHTML += '<div style="color: #dc3545; font-size: 18px; font-weight: 600; margin-bottom: 15px;">❌ Không thể hoàn tất đơn hàng</div>';
    errorHTML += '<div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; border: 1px solid #f5c6cb; line-height: 1.5;">';
    errorHTML += '<strong>Thông báo:</strong><br>';
    errorHTML += rawMsg;
    errorHTML += '</div>';
    errorHTML += '</div>';

    previewData.innerHTML = errorHTML;
    if (typeof showToast === 'function') {
      showToast(rawMsg, 'error');
    }
  } finally {
    // Bật lại nút thanh toán
    var btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
      setCheckoutPreparing(false);
    }
  }
}

// Function để copy link
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function () {
    if (!btn) return;
    const originalText = btn.textContent;
    const originalBorder = btn.style.borderColor;
    const originalColor = btn.style.color;
    btn.textContent = '✅';
    btn.style.borderColor = '#28a745';
    btn.style.color = '#28a745';
    setTimeout(function () {
      btn.textContent = originalText;
      btn.style.borderColor = originalBorder;
      btn.style.color = originalColor;
    }, 2000);
  }).catch(function (err) {
    console.error('Lỗi copy:', err);
    showToast('Không thể copy. Vui lòng copy thủ công.', 'error');
  });
}

// Expose function globally để dùng trong onclick
window.copyToClipboard = copyToClipboard;

// ═══════════════════════════════════════════════════
// 📱 PHONE MOCKUP PREVIEW CONTROLLER (docs/PHONE_MOCKUP_PREVIEW_PATTERN.md)
// ═══════════════════════════════════════════════════
let previewScaleObserver = null;
const PREVIEW_HIDE_ISLAND_KEY = 'app-preview-hide-island';

function layoutPreviewPhoneScale() {
  const modal = document.getElementById('previewModal');
  if (!modal || !modal.classList.contains('show')) return;

  const wrap = document.getElementById('previewModalPhoneWrap');
  const clip = document.getElementById('previewPhoneScaleClip');
  const inner = document.getElementById('previewPhoneScaleInner');
  const phone = inner?.querySelector('.theme-detail-phone');
  if (!wrap || !clip || !inner || !phone) return;

  // 1. Reset sạch inline styles trước khi đo
  inner.style.transform = 'none';
  clip.style.width = '';
  clip.style.height = '';
  inner.style.width = '';
  inner.style.height = '';

  // 2. Kích thước tự nhiên của khung điện thoại
  const nw = phone.offsetWidth;
  const nh = phone.offsetHeight;
  if (!nw || !nh) return;

  // 3. Tính cả padding của inner (chứa bóng đổ và các nút bấm thò ra ngoài)
  const csInner = getComputedStyle(inner);
  const padX = parseFloat(csInner.paddingLeft) + parseFloat(csInner.paddingRight);
  const padY = parseFloat(csInner.paddingTop) + parseFloat(csInner.paddingBottom);
  const totalW = nw + padX;
  const totalH = nh + padY;

  // 4. Kích thước thực tế của vùng hiển thị
  const pw = wrap.clientWidth;
  const ph = wrap.clientHeight;
  if (pw <= 0 || ph <= 0) return;

  // 5. Tỉ lệ scale (giới hạn tối đa 1 để tránh vỡ font/viền)
  const scale = Math.min(pw / totalW, ph / totalH, 1);

  // 6. Gán kích thước cho hộp bố cục và hộp hiển thị transform
  clip.style.width = `${totalW * scale}px`;
  clip.style.height = `${totalH * scale}px`;
  inner.style.width = `${totalW}px`;
  inner.style.height = `${totalH}px`;
  inner.style.transformOrigin = 'center center';
  inner.style.transform = `scale(${scale})`;
}

function schedulePreviewPhoneLayout() {
  requestAnimationFrame(function () {
    layoutPreviewPhoneScale();
    requestAnimationFrame(layoutPreviewPhoneScale);
  });
}

function bindPreviewPhoneScaleListeners() {
  schedulePreviewPhoneLayout();
  window.addEventListener('resize', schedulePreviewPhoneLayout);

  const wrap = document.getElementById('previewModalPhoneWrap');
  if (wrap && typeof ResizeObserver !== 'undefined') {
    if (previewScaleObserver) previewScaleObserver.disconnect();
    previewScaleObserver = new ResizeObserver(schedulePreviewPhoneLayout);
    previewScaleObserver.observe(wrap);
  }
}

function unbindPreviewPhoneScaleListeners() {
  window.removeEventListener('resize', schedulePreviewPhoneLayout);
  if (previewScaleObserver) {
    previewScaleObserver.disconnect();
    previewScaleObserver = null;
  }
  const clip = document.getElementById('previewPhoneScaleClip');
  const inner = document.getElementById('previewPhoneScaleInner');
  if (clip && inner) {
    inner.style.transform = 'none';
    clip.style.width = '';
    clip.style.height = '';
    inner.style.width = '';
    inner.style.height = '';
  }
}

function isPreviewDynamicIslandHidden() {
  try {
    return localStorage.getItem(PREVIEW_HIDE_ISLAND_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function applyPreviewDynamicIslandVisibility(hidden) {
  const screen = document.querySelector('#previewModal .theme-detail-phone-screen');
  const island = document.getElementById('previewModalDynamicIsland');
  const toggle = document.getElementById('previewModalToggleIsland');

  if (screen) screen.classList.toggle('island-hidden', hidden);
  if (island) island.setAttribute('aria-hidden', 'true');
  if (toggle) {
    toggle.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    const label = hidden ? 'Hiện Dynamic Island' : 'Ẩn Dynamic Island';
    toggle.textContent = label;
    toggle.setAttribute('aria-label', label);
  }
}

function openPreviewModal(options) {
  const url = options && options.url;
  const title = (options && options.title) || 'Món quà 8/3';
  const fallbackImage = options && options.fallbackImage;

  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('previewModalIframe');
  const fallback = document.getElementById('previewModalFallback');
  const fallbackImg = document.getElementById('previewModalFallbackImg');
  const hint = document.getElementById('previewModalHint');
  const openTab = document.getElementById('previewModalOpenTab');
  const safariDomain = document.getElementById('previewModalSafariDomain');

  if (!modal || !iframe || !fallback || !fallbackImg || !hint) return;

  modal.setAttribute('aria-label', 'Xem thử: ' + title);
  iframe.title = 'Xem thử: ' + title;

  const hasEmbed = Boolean(url && String(url).trim());

  if (hasEmbed) {
    iframe.hidden = false;
    fallback.hidden = true;
    iframe.src = url;
    fallbackImg.removeAttribute('src');
    fallbackImg.onload = null;
    hint.hidden = false;
    hint.textContent = 'Nếu trang chưa kịp tải, hãy bấm nút Tải lại hoặc "Mở trong tab mới".';
    if (openTab) {
      openTab.dataset.previewUrl = url;
      openTab.hidden = false;
    }

    if (safariDomain) {
      try {
        const parsed = new URL(url, window.location.origin);
        safariDomain.textContent = parsed.hostname.replace(/^www\./, '');
      } catch (e) {
        safariDomain.textContent = 'bouquet.giftory.pro';
      }
    }
  } else {
    iframe.hidden = true;
    iframe.removeAttribute('src');
    fallback.hidden = false;
    if (fallbackImage) {
      fallbackImg.src = fallbackImage;
      fallbackImg.alt = title;
      fallbackImg.onload = schedulePreviewPhoneLayout;
    }
    hint.hidden = false;
    hint.textContent = 'Mẫu này chỉ hiển thị ảnh minh họa.';
    if (openTab) {
      openTab.hidden = true;
      delete openTab.dataset.previewUrl;
    }
    if (safariDomain) safariDomain.textContent = 'bouquet.giftory.pro';
  }

  modal.classList.add('show');
  document.body.classList.add('modal-open');

  applyPreviewDynamicIslandVisibility(isPreviewDynamicIslandHidden());
  bindPreviewPhoneScaleListeners();
}

function closePreviewModal() {
  unbindPreviewPhoneScaleListeners();

  const modal = document.getElementById('previewModal');
  if (modal) modal.classList.remove('show');
  document.body.classList.remove('modal-open');

  // CỰC KỲ QUAN TRỌNG: Gỡ thuộc tính src để dừng phát nhạc, video, JS timer
  const iframe = document.getElementById('previewModalIframe');
  if (iframe) {
    iframe.removeAttribute('src');
    iframe.hidden = true;
  }

  const fallback = document.getElementById('previewModalFallback');
  if (fallback) fallback.hidden = true;

  const fallbackImg = document.getElementById('previewModalFallbackImg');
  if (fallbackImg) fallbackImg.removeAttribute('src');

  const hint = document.getElementById('previewModalHint');
  if (hint) {
    hint.hidden = true;
    hint.textContent = '';
  }

  const openTab = document.getElementById('previewModalOpenTab');
  if (openTab) {
    openTab.hidden = true;
    delete openTab.dataset.previewUrl;
  }

  if (modal) modal.removeAttribute('aria-label');
  if (iframe) iframe.title = 'Xem trước món quà';
}

function initPhonePreviewControls() {
  const openTab = document.getElementById('previewModalOpenTab');
  if (openTab && openTab.dataset.bound !== '1') {
    openTab.dataset.bound = '1';
    openTab.addEventListener('click', function () {
      const url = openTab.dataset.previewUrl;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  const toggleIsland = document.getElementById('previewModalToggleIsland');
  if (toggleIsland && toggleIsland.dataset.bound !== '1') {
    toggleIsland.dataset.bound = '1';
    applyPreviewDynamicIslandVisibility(isPreviewDynamicIslandHidden());
    toggleIsland.addEventListener('click', function () {
      const hidden = !isPreviewDynamicIslandHidden();
      try {
        localStorage.setItem(PREVIEW_HIDE_ISLAND_KEY, hidden ? '1' : '0');
      } catch (e) { }
      applyPreviewDynamicIslandVisibility(hidden);
    });
  }

  const reloadBtn = document.getElementById('previewModalSafariReload');
  if (reloadBtn && reloadBtn.dataset.bound !== '1') {
    reloadBtn.dataset.bound = '1';
    reloadBtn.addEventListener('click', function () {
      const iframe = document.getElementById('previewModalIframe');
      if (iframe && iframe.src) {
        reloadBtn.classList.add('is-spinning');
        const currentSrc = iframe.src;
        iframe.src = 'about:blank';
        setTimeout(function () {
          iframe.src = currentSrc;
          setTimeout(function () {
            reloadBtn.classList.remove('is-spinning');
          }, 600);
        }, 50);
      }
    });
  }

  const urlWrap = document.getElementById('previewModalSafariUrlWrap');
  if (urlWrap && urlWrap.dataset.bound !== '1') {
    urlWrap.dataset.bound = '1';
    urlWrap.addEventListener('click', function () {
      const openTab = document.getElementById('previewModalOpenTab');
      if (openTab && !openTab.hidden && openTab.dataset.previewUrl) {
        openTab.click();
      }
    });
  }

  const closeBtn = document.getElementById('previewModalCloseBtn');
  if (closeBtn && closeBtn.dataset.bound !== '1') {
    closeBtn.dataset.bound = '1';
    closeBtn.addEventListener('click', closePreviewModal);
  }

  const modal = document.getElementById('previewModal');
  if (modal && modal.dataset.bound !== '1') {
    modal.dataset.bound = '1';
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePreviewModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('previewModal');
      if (modal && modal.classList.contains('show')) {
        closePreviewModal();
      }
    }
  });

  const iframe = document.getElementById('previewModalIframe');
  if (iframe && iframe.dataset.bound !== '1') {
    iframe.dataset.bound = '1';
    iframe.addEventListener('load', schedulePreviewPhoneLayout);
  }

  // Khung xem trước modal iPhone hoàn tất gắn sự kiện
}

// Expose ra window để tái sử dụng
window.openPreviewModal = openPreviewModal;
window.closePreviewModal = closePreviewModal;
window.layoutPreviewPhoneScale = layoutPreviewPhoneScale;

// ===== XEM TRƯỚC TRÊN KHUNG IPHONE =====
async function handlePreview() {
  // Bắt buộc nhập đủ các ô bắt buộc mới được xem trước
  if (!validateAllRequiredFields()) {
    showToast('⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc để xem trước!', 'error');
    return;
  }
  const titleEl = document.getElementById('letterTitle');
  const contentEl = document.getElementById('letterContent');
  const signatureEl = document.getElementById('letterSignature');

  // Lấy nội dung thư, nếu chưa nhập thì điền nội dung mẫu để xem thử ngay hoa mà không bị chặn
  const rawContent = (contentEl && contentEl.value.trim()) || '';
  const contentLines = rawContent
    ? rawContent.split('\n').filter(function (l) { return l.trim(); })
    : [
      "Chúc bạn một ngày 8/3 tràn ngập niềm vui, hạnh phúc và luôn rạng rỡ như những đóa hoa tươi thắm này! 💖",
      "Mỗi khoảnh khắc trong cuộc sống đều là một món quà đặc biệt dành riêng cho bạn. ✨",
      "Yêu thương gửi trao! 🌸"
    ];

  const musicSampleRadio = document.querySelector('input[name="musicType"][value="sample"]');
  const musicCustomRadio = document.querySelector('input[name="musicType"][value="custom"]');
  const sampleSelect = document.getElementById('sampleMusic');
  const customMusicFile = document.getElementById('customMusic');
  const hasSampleMusic = musicSampleRadio && musicSampleRadio.checked && sampleSelect && sampleSelect.value;
  const hasCustomMusic = musicCustomRadio && musicCustomRadio.checked && customMusicFile && customMusicFile.files && customMusicFile.files[0];

  // VIP photos
  const vipCheckbox = document.getElementById('vipGift');

  // Gom previewData
  const previewData = {
    introText: (document.getElementById('introText')?.value || "Happy Women's Day").trim(),
    flowerColor: (document.getElementById('flowerColor')?.value || 'classic'),
    letterTitle: (titleEl && titleEl.value.trim()) || "Gửi người phụ nữ tuyệt vời nhất ✨",
    letterContent: contentLines,
    letterSignature: (signatureEl && signatureEl.value.trim()) || "Người luôn yêu quý bạn ❤️",
    musicType: 'Sample',
    musicPath: './assets/music/chuyen-tinh-nang-tho.mp3',
    customMusic: null,
    vipPhotos: []
  };

  if (hasSampleMusic) {
    previewData.musicType = 'Sample';
    previewData.musicPath = sampleSelect.value;
  } else if (hasCustomMusic) {
    try {
      const base64 = await fileToBase64(customMusicFile.files[0]);
      previewData.musicType = 'Custom';
      previewData.customMusic = base64;
    } catch (e) { /* bỏ qua nếu lỗi encode */ }
  }

  if (vipCheckbox && vipCheckbox.checked && typeof vipPhotoResults !== 'undefined' && vipPhotoResults.length > 0) {
    for (var i = 0; i < vipPhotoResults.length; i++) {
      try {
        const base64 = await fileToBase64(vipPhotoResults[i].blob);
        previewData.vipPhotos.push(base64);
      } catch (e) { /* bỏ qua */ }
    }
  }

  // Lưu dữ liệu vào IndexedDB và mở modal xem trước trực tiếp
  try {
    await savePreviewData(previewData);
    const currentColor = document.getElementById('flowerColor')?.value || 'classic';
    if (typeof openPreviewModal === 'function') {
      openPreviewModal({
        url: 'index.html?preview=1&color=' + currentColor + '&t=' + Date.now(),
        title: 'Xem trước món quà 8/3'
      });
    }
  } catch (e) {
    console.error('Lỗi lưu preview data:', e);
    showToast('⚠️ Không thể lưu dữ liệu xem trước. Vui lòng thử lại!', 'error');
  }
}

function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (e) { resolve(e.target.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

var btnPreview = document.getElementById('btnPreview');
if (btnPreview) {
  btnPreview.addEventListener('click', handlePreview);
}

// Khởi tạo các sự kiện điều khiển Phone Preview
initPhonePreviewControls();

// ═══════════════════════════════════════════════════
// ✉️ MẪU THƯ THEO CHỦ ĐỀ
// ═══════════════════════════════════════════════════
const LETTER_TEMPLATES_BY_THEME = {
  chung: {
    name: '💞 Dịp chung',
    items: [
      {
        name: '💞 Nhẹ nhàng & Chân thành',
        title: 'Gửi em, người anh thương ❤️',
        content: 'Anh thích những ngày có em bên cạnh, được nghe em kể chuyện, được cùng em đi ăn rồi loanh quanh chẳng cần vội về. Những điều nhỏ vậy thôi mà anh cứ mong có mãi. Đôi khi anh nghĩ lại và thấy mình may mắn vì có em trong cuộc sống, vì được là người em chọn để chia sẻ mọi thứ. Gửi em chút bất ngờ này, để nhắc em rằng có một người thương em nhiều lắm.',
        signature: 'Anh người yêu của em ❤️'
      },
      {
        name: '☀️ Vui tươi & Đáng yêu',
        title: 'Có người đang nghĩ đến em nè 💛',
        content: 'Thấy món gì ngon anh cũng muốn rủ em ăn, gặp chuyện gì vui lại muốn kể em nghe ngay. Từ ngày có em, anh có thêm bao nhiêu cái cớ để mong đến cuối tuần. Mỗi lần nhắn tin cho em mà thấy em rep nhanh là anh vui cả buổi, đơn giản vậy thôi mà anh cũng trân trọng lắm. Hôm nay chẳng có gì đặc biệt đâu, chỉ là anh muốn làm em cười một chút thôi.',
        signature: 'Người hay kiếm cớ gặp em ☀️'
      },
      {
        name: '🤍 Dịu dàng & Quan tâm',
        title: 'Hôm nay em có mệt không? 🤍',
        content: 'Nếu hôm nay có gì không vui, em cứ kể anh nghe nhé. Không cần phải đợi hết buồn hay bình tĩnh rồi mới tìm anh đâu. Anh muốn được ở cạnh cả những lúc em mệt, nghe em than thở một chút rồi tìm cách làm em vui lại. Em không cần phải gồng hay giấu đi những lúc yếu lòng, vì với anh em lúc nào cũng xứng đáng được quan tâm. Cứ để anh lo cho em thêm một chút nhé.',
        signature: 'Có anh ở đây mà ❤️'
      },
      {
        name: '🌙 Lãng mạn & Gần gũi',
        title: 'Một điều anh chưa nói hết 🌙',
        content: 'Có những lúc ngồi cạnh em, anh chỉ muốn thời gian trôi chậm lại một chút. Để được nắm tay em lâu hơn, nghe em nói thêm vài câu, và chưa phải chào nhau về. Mỗi lần chia tay em cuối ngày, anh đều về mà vẫn nhớ mãi mùi hương và nụ cười của em. Chắc là anh thương em nhiều hơn những gì anh vẫn hay nói mất rồi.',
        signature: 'Người vẫn chưa muốn buông tay em 🤍'
      },
      {
        name: '🫶 Ấm áp & Đồng hành',
        title: 'Mình còn nhiều cuộc hẹn lắm đó 🫶',
        content: 'Còn nhiều nơi anh muốn đi cùng em, nhiều món muốn cùng em thử, nhiều chuyện muốn hai đứa cùng trải qua. Anh không biết sau này mọi thứ sẽ thế nào, nhưng anh thật lòng muốn có em trong những dự định của mình. Anh tin là nếu hai đứa cùng chân thành với nhau, thì dù có khó khăn gì mình cũng sẽ vượt qua được. Tụi mình cứ thương nhau và cùng cố gắng nhé.',
        signature: 'Người muốn cùng em đi tiếp ❤️'
      }
    ]
  },
  '8thang3': {
    name: '🌷 Ngày 8/3',
    items: [
      {
        name: '🌷 Dịu dàng & Yêu thương',
        title: 'Mừng 8/3, cô gái anh thương 🌷',
        content: 'Hôm nay anh chúc em có một ngày thật vui, được nhận những điều dễ thương và làm những gì mình thích. Cảm ơn em vì đã ở bên anh, quan tâm anh từ những chuyện nhỏ nhất. Em xứng đáng được yêu thương và trân trọng không chỉ riêng ngày hôm nay mà là mỗi ngày. Anh cũng muốn em cảm nhận được rằng mình đang được thương và chăm sóc như thế.',
        signature: 'Thương em nhiều lắm ❤️'
      },
      {
        name: '💗 Ngọt ngào & Chân thành',
        title: 'Một chút bất ngờ dành cho em 💗',
        content: 'Anh đã nghĩ một lúc xem 8/3 nên tặng em điều gì để em vui. Cuối cùng anh gửi thêm cả những lời này, vì có những điều gặp em anh lại ngại nói. Anh muốn em biết rằng mỗi ngày được ở cạnh em đều là một ngày anh thấy ý nghĩa, dù là ngày bận rộn hay chỉ ngồi im bên nhau. Anh vui vì được làm người yêu em, và vẫn luôn mong mình sẽ có thêm thật nhiều ngày bên nhau.',
        signature: 'Anh người yêu hơi ít nói của em ❤️'
      },
      {
        name: '☀️ Vui tươi & Đáng yêu',
        title: '8/3 này, em chọn nhé! ☀️',
        content: 'Hôm nay em thích ăn gì, đi đâu, cứ nói anh nghe nhé. Anh muốn có một buổi hẹn chỉ để chiều em, nghe em kể chuyện và chụp cho em vài tấm ảnh thật xinh. Anh hứa sẽ không phàn nàn dù em bắt chụp lại bao nhiêu lần, miễn là em thấy vui là được. Chúc bạn người yêu của anh 8/3 vui thật vui, còn thương em thì anh làm mỗi ngày rồi!',
        signature: 'Bạn đồng hành kiêm thợ chụp ảnh của em 📸'
      },
      {
        name: '🤍 Ấm áp & Quan tâm',
        title: 'Dành chút dịu dàng cho em 🤍',
        content: '8/3 rồi, anh mong em bớt lo một chút và dành thời gian cho bản thân nhiều hơn. Mua món em thích, nghỉ ngơi khi thấy mệt, có chuyện gì khó thì để anh cùng lo. Đừng ôm hết mọi thứ một mình nhé, vì anh ở đây cũng muốn được san sẻ cùng em mà. Với anh, được thấy em thoải mái và vui vẻ vẫn là điều anh mong nhất.',
        signature: 'Người luôn muốn em vui 🌷'
      },
      {
        name: '🌹 Lãng mạn & Gần gũi',
        title: 'Muốn được ôm em một cái 🌹',
        content: 'Nếu đang ở cạnh em lúc này, anh sẽ ôm em một cái rồi nói chúc em 8/3 thật vui. Viết ra thì dễ hơn, nhưng anh vẫn muốn tự nói để được nhìn em cười. Anh thích nhất là khoảnh khắc em bất ngờ rồi cười tươi lên, lúc đó anh thấy mọi cố gắng đều đáng. Mong món quà nhỏ này làm ngày hôm nay của em vui thêm một chút. Anh thương em.',
        signature: 'Gửi em một cái ôm thật lâu ❤️'
      }
    ]
  },
  '20thang10': {
    name: '💐 Ngày 20/10',
    items: [
      {
        name: '🌷 Nhẹ nhàng & Chân thành',
        title: '20/10 vui vẻ, em nhé 🌷',
        content: 'Có em rồi, những ngày bình thường của anh cũng có thêm nhiều điều để mong đợi. Một tin nhắn, một cuộc gọi, một buổi hẹn với em đều làm anh vui. Anh thấy mình thay đổi nhiều từ khi có em, biết quan tâm hơn, biết kiên nhẫn hơn và cũng biết trân trọng những điều giản dị hơn. Hôm nay anh cũng muốn dành cho em một niềm vui nho nhỏ như thế. Chúc cô gái anh thương có một ngày thật đẹp.',
        signature: 'Người mong tin nhắn của em ❤️'
      },
      {
        name: '💐 Trân trọng & Yêu thương',
        title: 'Cảm ơn em vì những điều nhỏ bé 💐',
        content: 'Anh vẫn nhớ những lần em hỏi anh đã ăn chưa, nhắc anh nghỉ sớm, hay ngồi nghe anh kể chuyện không đầu không cuối. Có thể anh ít nói cảm ơn, nhưng anh đều thấy và quý lắm. Những điều em làm tưởng chừng bình thường nhưng lại là thứ khiến anh thấy ấm lòng nhất mỗi ngày. Nhân ngày 20/10, cho anh được chiều chuộng người đã luôn quan tâm anh nhé. Anh hứa sẽ cố gắng nói thương em nhiều hơn.',
        signature: 'Thương cô gái chu đáo của anh 🤍'
      },
      {
        name: '🥰 Vui tươi & Đáng yêu',
        title: 'Quà cho bạn người yêu đây 🥰',
        content: 'Anh chuẩn bị chút bất ngờ này và đang tò mò không biết lúc mở ra em có cười không. Nếu có thì nhớ kể anh nghe nhé, để anh còn vui lây cả ngày. Lần nào chuẩn bị quà cho em anh cũng hồi hộp lắm, cứ sợ em không thích rồi lại thay đổi mấy lần. Chúc em 20/10 thật vui, ăn ngon, mặc đẹp, và nhớ để dành cho anh một cuộc hẹn nữa đó!',
        signature: 'Người đang chờ em khen quà 💛'
      },
      {
        name: '🤍 Dịu dàng & Thấu hiểu',
        title: 'Em cứ là em thôi 🤍',
        content: 'Anh thương cả lúc em rạng rỡ lẫn những hôm em chỉ muốn nằm dài, chẳng muốn làm gì. Ở cạnh anh, em không cần lúc nào cũng phải vui vẻ hay chỉn chu đâu. Anh thích em khi em là chính mình nhất, không cần phải cố tỏ ra hoàn hảo hay gượng cười khi chưa sẵn sàng. 20/10 này, anh mong em được nghỉ ngơi, được chiều chuộng và thấy thoải mái khi là chính mình.',
        signature: 'Anh thương em như thế đó ❤️'
      },
      {
        name: '🌙 Lãng mạn & Bền lâu',
        title: 'Thêm một ngày được làm em vui 🌙',
        content: '20/10 là một cái cớ thật dễ thương để anh nói những lời bình thường còn ngại. Anh thương em, thích cuộc sống có em, và muốn tiếp tục cùng em có thêm nhiều kỷ niệm. Anh hay tưởng tượng về những năm sau, mình vẫn bên nhau, vẫn cùng đi ăn rồi cùng cười vì những chuyện chẳng ai hiểu ngoài hai đứa. Mong những năm sau anh vẫn được nghĩ quà tặng em, rồi hồi hộp chờ xem em có thích không.',
        signature: 'Vẫn muốn hẹn hò với em thật lâu ❤️'
      }
    ]
  },
  '20thang11': {
    name: '🎓 Ngày 20/11',
    items: [
      {
        name: '🌷 Dịu dàng & Chân thành',
        title: 'Chúc mừng 20/11, cô giáo của anh 🌷',
        content: 'Anh biết phía sau những giờ lên lớp là bao nhiêu công việc em còn mang về nhà. Chúc em hôm nay nhận được thật nhiều tình cảm và có những khoảnh khắc khiến em thấy vui với nghề mình đã chọn. Anh tự hào vì em luôn hết mình với công việc, dù đôi khi điều đó khiến em kiệt sức. Tan làm rồi, để anh dành cho em thêm một chút yêu thương nhé.',
        signature: 'Người thương cô giáo nhiều lắm ❤️'
      },
      {
        name: '🤍 Quan tâm & Chăm sóc',
        title: 'Hôm nay cô giáo nghỉ ngơi chút nhé 🤍',
        content: '20/11 rồi, anh chúc em có một ngày ấm áp bên học trò và đồng nghiệp. Nếu hôm nay bận quá, nhớ ăn uống đầy đủ và nghỉ một chút khi có thể nhé. Anh biết em hay quên chăm sóc bản thân khi lo cho người khác, nên hôm nay anh muốn nhắc em điều đó. Anh muốn nghe em kể những chuyện vui ở trường, còn chuyện gì làm em mệt thì cứ kể anh nghe luôn.',
        signature: 'Tan làm nhớ nhắn anh nhé ❤️'
      },
      {
        name: '🥰 Vui tươi & Đáng yêu',
        title: 'Cô giáo ơi, anh có quà nè! 🥰',
        content: 'Hôm nay chắc cô giáo của anh nhận được nhiều lời chúc lắm, nhưng nhớ dành chỗ cho lời chúc này nữa nha. Chúc em lên lớp thật vui, gặp nhiều học trò đáng yêu và bớt những hôm phải thức khuya soạn bài. Anh sẽ cố gắng làm trợ lý đắc lực cho cô giáo, từ pha trà đến ngồi nghe em tập giảng bài. Còn tan trường thì cho anh xin một cuộc hẹn nhé!',
        signature: 'Người đang chờ cô giáo tan làm 💛'
      },
      {
        name: '💐 Trân trọng & Tự hào',
        title: 'Anh thích nghe em kể chuyện đi dạy 💐',
        content: 'Anh thích cách em vui khi kể về một học trò tiến bộ, hay một chuyện dễ thương trong lớp. Nghe em kể, anh hiểu hơn vì sao em dành nhiều tâm sức cho công việc này. Có lẽ chính sự tận tụy và tấm lòng ấy của em là điều khiến anh ngưỡng mộ và yêu em thêm mỗi ngày. Chúc em 20/11 thật vui và có thêm nhiều ngày đi dạy về với những câu chuyện khiến em mỉm cười.',
        signature: 'Người luôn thích nghe em kể 🤍'
      },
      {
        name: '🌙 Lãng mạn & Đồng hành',
        title: 'Gửi người anh thương trong ngày 20/11 🌙',
        content: 'Anh không giúp em đứng lớp được, nhưng có thể nghe em kể chuyện, nhắc em ăn đúng bữa và ở cạnh những hôm em mệt. Anh muốn cùng em chia sẻ cả niềm vui lẫn những vất vả của nghề. Dù con đường em chọn có lúc gian nan, anh vẫn muốn là người đi cùng em qua tất cả. Chúc em một ngày 20/11 thật ấm áp. Anh thương và tự hào về em.',
        signature: 'Có anh cùng em mà ❤️'
      }
    ]
  }
};

function initAnniversaryLetterTemplates() {
  var btn = document.getElementById('letterTemplateBtn');
  var list = document.getElementById('letterTemplateList');
  var wrap = document.getElementById('letterTemplateWrap');
  var contentEl = document.getElementById('letterContent');
  var itemsWrap = document.getElementById('letterTemplateItemsWrap');
  var tabsContainer = document.getElementById('letterTemplateTabs');
  if (!btn || !list) return;

  var currentCat = 'chung';

  function renderItems(catKey) {
    if (!itemsWrap) return;
    var group = LETTER_TEMPLATES_BY_THEME[catKey];
    if (!group) return;

    itemsWrap.innerHTML = '';
    group.items.forEach(function (item) {
      var el = document.createElement('div');
      el.className = 'letter-template-item';

      var nameEl = document.createElement('div');
      nameEl.className = 'letter-template-item__name';
      nameEl.textContent = item.name;

      var prevEl = document.createElement('div');
      prevEl.className = 'letter-template-item__preview';
      prevEl.textContent = item.content;

      el.appendChild(nameEl);
      el.appendChild(prevEl);

      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        applyTemplate(item);
      });

      itemsWrap.appendChild(el);
    });
  }

  // Xử lý chuyển tab
  if (tabsContainer) {
    var tabs = tabsContainer.querySelectorAll('.template-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var cat = tab.getAttribute('data-cat');
        currentCat = cat;
        renderItems(cat);
      });
    });
  }

  // Render danh mục mặc định ban đầu
  renderItems(currentCat);

  function openDropdown() {
    list.style.display = 'flex';
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    list.style.display = 'none';
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var isVisible = list.style.display === 'flex' || list.style.display === 'block';
    if (isVisible) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  btn.addEventListener('click', toggleDropdown);

  function applyTemplate(tpl) {
    if (!tpl) return;

    var titleEl = document.getElementById('letterTitle');
    var sigEl = document.getElementById('letterSignature');

    // 1. Áp dụng tiêu đề thư
    if (titleEl && tpl.title) {
      titleEl.value = tpl.title;
      titleEl.classList.remove('error');
      var errTitle = document.getElementById('errorLetterTitle');
      if (errTitle) {
        errTitle.style.display = 'none';
        errTitle.textContent = '';
      }
      titleEl.dispatchEvent(new Event('input', { bubbles: true }));
      titleEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 2. Áp dụng nội dung thư
    if (contentEl && tpl.content) {
      contentEl.value = tpl.content;
      contentEl.classList.remove('error');
      var errContent = document.getElementById('errorLetterContent');
      if (errContent) {
        errContent.style.display = 'none';
        errContent.textContent = '';
      }
      contentEl.dispatchEvent(new Event('input', { bubbles: true }));
      contentEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. Áp dụng chữ ký thư
    if (sigEl && tpl.signature) {
      sigEl.value = tpl.signature;
      sigEl.classList.remove('error');
      var errSig = document.getElementById('errorLetterSignature');
      if (errSig) {
        errSig.style.display = 'none';
        errSig.textContent = '';
      }
      sigEl.dispatchEvent(new Event('input', { bubbles: true }));
      sigEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Tính lại giá nếu có
    if (typeof calculatePrice === 'function') {
      calculatePrice();
    }

    closeDropdown();

    // Focus & scroll mượt đến ô nội dung
    if (contentEl) {
      contentEl.focus();
      contentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Hiệu ứng viền phát sáng hồng nhẹ xác nhận đã áp dụng
      [titleEl, contentEl, sigEl].forEach(function (el) {
        if (!el) return;
        el.style.transition = 'box-shadow 0.25s ease, border-color 0.25s ease';
        el.style.borderColor = 'var(--create-accent)';
        el.style.boxShadow = '0 0 0 3px rgba(232, 69, 122, 0.3)';
        setTimeout(function () {
          el.style.boxShadow = '';
          el.style.borderColor = '';
        }, 1200);
      });
    }

    if (typeof showToast === 'function') {
      showToast('✨ Đã áp dụng mẫu: ' + tpl.name, 'success');
    }
  }

  // Đóng dropdown khi click ra ngoài
  document.addEventListener('click', function (e) {
    if (wrap && !wrap.contains(e.target)) {
      closeDropdown();
    }
  });

  // Đóng dropdown khi bấm Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Expose globally
  window.toggleLetterTemplates = toggleDropdown;
  window.applyLetterTemplate = applyTemplate;
  window.LETTER_TEMPLATES_BY_THEME = LETTER_TEMPLATES_BY_THEME;
}

initAnniversaryLetterTemplates();

// ═══════════════════════════════════════════════════
// ✕ CLEARABLE INPUTS (Nút xóa nhanh nội dung ô nhập)
// ═══════════════════════════════════════════════════
function initClearableInputs() {
  var wrappers = document.querySelectorAll('.input-clearable-wrapper');
  wrappers.forEach(function (wrap) {
    var input = wrap.querySelector('input[type="text"], textarea');
    var btn = wrap.querySelector('.btn-clear-input');
    if (!input || !btn) return;

    // Xử lý khi click vào nút X: xóa sạch ô nhập và focus lại
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      input.value = '';

      // Kích hoạt sự kiện để lưu nháp và tính toán lại
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      // Xóa thông báo lỗi nếu có
      input.classList.remove('error');
      var errId = 'error' + input.id.charAt(0).toUpperCase() + input.id.slice(1);
      var errEl = document.getElementById(errId);
      if (errEl) {
        errEl.style.display = 'none';
        errEl.textContent = '';
      }

      // Focus lại ô nhập để người dùng có thể gõ ngay
      input.focus();
    });
  });
}

initClearableInputs();

// ═══════════════════════════════════════════════════
// 🌸 TÙY CHỌN TÔNG MÀU BÓ HOA (FLOWER COLOR PICKER)
// ═══════════════════════════════════════════════════
var FLOWER_COLOR_DATA = {
  'classic': {
    label: 'Hồng Tulip (Cổ điển)',
    img: './assets/images/demo_flower_classic.png',
    tag: '🌸 Ảnh minh họa: Hồng Tulip',
    desc: 'Bó hoa phong cách Hồng Tulip cổ điển kết hợp phong thư và bầu trời đêm lung linh.'
  },
  'pastel': {
    label: 'Hồng Phấn (Dịu ngọt)',
    img: './assets/images/demo_flower_pastel.png',
    tag: '🌸 Ảnh minh họa: Hồng Phấn',
    desc: 'Bó hoa phong cách Hồng Phấn nhạt dịu dàng, tạo cảm giác nhẹ nhàng, ấm áp và lãng mạn.'
  },
  'peach': {
    label: 'Hồng Đào (Tươi tắn)',
    img: './assets/images/demo_flower_peach.png',
    tag: '🌸 Ảnh minh họa: Hồng Đào',
    desc: 'Bó hoa phong cách Hồng Đào tươi tắn ánh cam nhẹ, tràn đầy năng lượng tươi mới và trẻ trung.'
  },
  'magenta': {
    label: 'Hồng Sen Đậm (Rực rỡ)',
    img: './assets/images/demo_flower_magenta.png',
    tag: '🌸 Ảnh minh họa: Hồng Sen Đậm',
    desc: 'Bó hoa phong cách Hồng Sen Đậm (Fuchsia) nổi bật rực rỡ, sắc hoa sắc sảo và cuốn hút trên nền trời đêm.'
  },
  'vintage': {
    label: 'Đỏ Hồng Nhung (Ruby)',
    img: './assets/images/demo_flower_vintage.png',
    tag: '🌸 Ảnh minh họa: Đỏ Hồng Nhung',
    desc: 'Bó hoa phong cách Đỏ Hồng Nhung (Ruby) sâu lắng, đằm thắm sang trọng và mang hơi hướng cổ điển.'
  },
  'mix': {
    label: 'Mix Candy (Đa sắc)',
    img: './assets/images/demo_flower_mix.png',
    tag: '🍭 Ảnh minh họa: Mix Candy',
    desc: 'Bó hoa phối màu kẹo ngọt ngào đa sắc: Hồng phấn, Trắng kem, Xanh baby và Cam đào.'
  },
  'pink_mix': {
    label: 'Mix Hồng (Ngọt ngào)',
    img: './assets/images/demo_flower_pink_mix.png',
    tag: '🌸 Ảnh minh họa: Mix Hồng Pastel',
    desc: 'Bó hoa phối nhiều sắc thái hồng: Hồng phấn, hồng tulip, cam đào và hồng sen kiêu sa.'
  },
  'pink_tulip_mix': {
    label: 'Mix Hồng Tulip (Chủ đạo)',
    img: './assets/images/demo_flower_pink_tulip_mix.png',
    tag: '🌷 Ảnh minh họa: Mix Hồng Tulip',
    desc: 'Bó hoa phối riêng các sắc thái hồng (không hồng sen): Hồng tulip chủ đạo, Hồng phấn, Hồng đỏ và Hồng đào.'
  },
  'raspberry_pink': {
    label: 'Hồng Mâm Xôi & Phấn (Mẫu 2)',
    img: './assets/images/demo_flower_raspberry_pink.png',
    tag: '🌺 Ảnh minh họa: Hồng Mâm Xôi & Phấn',
    desc: 'Bó hoa 11 bông phối xen kẽ chuẩn 3 hàng: Hồng mâm xôi đậm (#D93175) và Hồng phấn (#F5B7CE).'
  },
  'coral_champagne': {
    label: 'Hồng San Hô & Champagne (Mẫu 3)',
    img: './assets/images/demo_flower_coral_champagne.png',
    tag: '🪸 Ảnh minh họa: Hồng San Hô & Champagne',
    desc: 'Bó hoa 11 bông phối xen kẽ chuẩn 3 hàng: Hồng san hô (#F16A72) và Kem champagne (#FFE4BC).'
  },
  'purple': {
    label: 'Tím Mộng Mơ (Lavender)',
    img: './assets/images/demo_flower_purple.png',
    tag: '💜 Ảnh minh họa: Tím Mộng Mơ',
    desc: 'Bó hoa phong cách Tím Lavender mộng mơ, kiêu sa, lãng mạn và quý phái.'
  },
  'blue': {
    label: 'Xanh Lam Đêm (Midnight)',
    img: './assets/images/demo_flower_blue.png',
    tag: '💙 Ảnh minh họa: Xanh Lam Đêm',
    desc: 'Bó hoa phong cách Xanh Lam Đêm (Midnight Blue) trầm lắng, huyền ảo, hòa quyện đồng điệu với bầu trời đêm lung linh.'
  },
  'white': {
    label: 'Trắng Tinh Khôi (Pure White)',
    img: './assets/images/demo_flower_white.png',
    tag: '🤍 Ảnh minh họa: Trắng Tinh Khôi',
    desc: 'Bó hoa phong cách Trắng Tinh Khôi thuần khiết viền ánh ngọc trai sang trọng.'
  }
};
window.FLOWER_COLOR_DATA = FLOWER_COLOR_DATA;

window.selectFlowerColor = function (color) {
  if (!FLOWER_COLOR_DATA[color]) color = 'classic';
  var data = FLOWER_COLOR_DATA[color];
  var input = document.getElementById('flowerColor');
  var badge = document.getElementById('flowerColorBadge');
  var cards = document.querySelectorAll('.flower-color-grid .color-card');

  if (input) input.value = color;
  if (badge) badge.textContent = data.label || 'Hồng Tulip';

  cards.forEach(function (card) {
    var isThis = card.getAttribute('data-color') === color;
    card.classList.toggle('is-active', isThis);
    card.setAttribute('aria-checked', isThis ? 'true' : 'false');
  });

  var previewIframe = document.getElementById('previewModalIframe');
  if (previewIframe && previewIframe.contentWindow) {
    try {
      previewIframe.contentWindow.postMessage({ type: 'UPDATE_FLOWER_COLOR', color: color }, '*');
    } catch (err) { }
  }
};

function initFlowerColorPicker() {
  var cards = document.querySelectorAll('.flower-color-grid .color-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var color = card.getAttribute('data-color');
      var clickedThumb = e.target.closest('.color-card-thumb');

      if (typeof window.selectFlowerColor === 'function') {
        window.selectFlowerColor(color);
      }
      if (typeof saveDraft === 'function') saveDraft();

      // Khi người dùng bấm vào ảnh mẫu thì mở modal xem ảnh lớn
      if (clickedThumb && typeof window.openFlowerDemoModal === 'function') {
        window.openFlowerDemoModal(color);
      }
    });
  });
  var curColor = document.getElementById('flowerColor')?.value || 'classic';
  if (typeof window.selectFlowerColor === 'function') {
    window.selectFlowerColor(curColor);
  }
}

initFlowerColorPicker();
