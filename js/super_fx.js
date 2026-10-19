/**
 * ===================================================================
 * SUPER FX - BỘ HIỆU ỨNG THẾ HỆ MỚI CHO BÓ HOA TULIP & THƯ 9X
 * Tác giả: Trikundepzaicutephpmaique
 * Tính năng:
 *  1. Khung ảnh Polaroid 3D + Washi Tape + Shimmer + Chữ viết tay dán ảnh
 *  2. Lightbox xem ảnh phóng to 3D Parallax Tilt theo chuột
 *  3. Vệt bụi sao ma thuật (Magic Sparkle Trail) theo con trỏ chuột/tay chạm
 *  4. Mưa cánh hoa Tulip 3D & Đom đóm hoàng kim (Canvas 60fps)
 *  5. Web Audio API Crystal Chime (Âm thanh chuông pha lê)
 *  6. Nút điều khiển nhạc, thả tim ngập trời & xem lại
 * ===================================================================
 */

(function () {
  'use strict';

  // --- A. WEB AUDIO API: TẠO ÂM THANH PHA LÊ MA THUẬT ---
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Phát tiếng chuông pha lê lấp lánh (Crystal Twinkle Chime)
  function playCrystalChime(freqs, stagger) {
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var notes = freqs || [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      var step = stagger || 0.08;

      notes.forEach(function (f, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * step);

        // Chuông ngân vang êm dịu
        gain.gain.setValueAtTime(0, now + i * step);
        gain.gain.linearRampToValueAtTime(0.08, now + i * step + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * step + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * step);
        osc.stop(now + i * step + 0.9);
      });
    } catch (e) {}
  }

  // --- B. DANH SÁCH CAPTION NHÃN DÁN CUTE CHO ẢNH THƯ 9X ---
  var PHOTO_LABELS = [
    "Thư 9x nè ✨",
    "Xinh xắn rạng ngời 🌸",
    "Cho Trikun xoa đầu 🥰",
    "Nhớ ăn nhiều vô nha 🍕",
    "Nụ cười triệu like 💖",
    "20/10 siêu hạnh phúc 🌷"
  ];

  // --- C. NÂNG CẤP KHUNG ẢNH POLAROID BAY ---
  function decoratePhotoFloat(el) {
    if (el.dataset.decorated) return;
    el.dataset.decorated = 'true';

    // 1. Thêm miếng băng dính washi tape
    var washi = document.createElement('div');
    washi.className = 'photo-float-washi';
    el.appendChild(washi);

    // 2. Thêm hiệu ứng tia sáng óng ánh (Shimmer)
    var shimmer = document.createElement('div');
    shimmer.className = 'photo-float-shimmer';
    el.appendChild(shimmer);

    // 3. Gán nhãn chữ dán nghệ thuật
    var labelText = el.dataset.label;
    if (!labelText) {
      var img = el.querySelector('img');
      var src = img ? img.getAttribute('src') || '' : '';
      var idx = 0;
      var match = src.match(/thu_(\d+)/) || src.match(/photo_(\d+)/);
      if (match) {
        idx = (parseInt(match[1], 10) - 1) % PHOTO_LABELS.length;
      } else {
        idx = Math.floor(Math.random() * PHOTO_LABELS.length);
      }
      labelText = PHOTO_LABELS[idx];
      el.dataset.label = labelText;
    }

    var labelEl = document.createElement('div');
    labelEl.className = 'photo-float-label';
    labelEl.textContent = labelText;
    el.appendChild(labelEl);

    // 4. Click vào ảnh để mở Lightbox phóng to 3D
    el.addEventListener('click', function (e) {
      // Nếu đang kéo thả thì không mở
      if (el.classList.contains('is-dragging')) return;
      var img = el.querySelector('img');
      if (img && img.src) {
        openPhotoLightbox(img.src, labelText, e.clientX, e.clientY);
      }
    });
  }

  // Lắng nghe container khi có ảnh bay mới được tạo ra
  function observeFlyingPhotos() {
    var container = document.getElementById('photoFloatContainer');
    if (!container) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList.contains('photo-float')) {
            decoratePhotoFloat(node);
          }
        });
      });
    });

    observer.observe(container, { childList: true });
    // Decorate các ảnh đang có sẵn
    container.querySelectorAll('.photo-float').forEach(decoratePhotoFloat);
  }

  // --- D. MODAL PHÓNG TO ẢNH 3D PARALLAX TILT (LIGHTBOX) ---
  var photoModalEl = null;
  var photoModalCard = null;
  var photoModalImg = null;
  var photoModalCaption = null;

  function createPhotoModal() {
    photoModalEl = document.createElement('div');
    photoModalEl.className = 'fx-photo-modal';
    photoModalEl.innerHTML = [
      '<div class="fx-photo-card-wrap">',
      '  <div class="fx-photo-card" id="fxPhotoCard">',
      '    <button type="button" class="fx-photo-card-close" id="fxPhotoClose" aria-label="Đóng">&times;</button>',
      '    <img id="fxPhotoImg" src="" alt="Ảnh kỷ niệm Thư 9x">',
      '    <div class="fx-photo-card-caption" id="fxPhotoCaption">Thư 9x nè ✨</div>',
      '  </div>',
      '  <div class="fx-photo-actions">',
      '    <button type="button" class="fx-btn-action" id="fxBtnHeart">Thả tim 💕</button>',
      '    <button type="button" class="fx-btn-action" id="fxBtnCloseAction">Tiếp tục ngắm 🌷</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(photoModalEl);

    photoModalCard = document.getElementById('fxPhotoCard');
    photoModalImg = document.getElementById('fxPhotoImg');
    photoModalCaption = document.getElementById('fxPhotoCaption');

    // Đóng khi bấm nút x hoặc bấm nền
    document.getElementById('fxPhotoClose').addEventListener('click', closePhotoLightbox);
    document.getElementById('fxBtnCloseAction').addEventListener('click', closePhotoLightbox);
    photoModalEl.addEventListener('click', function (e) {
      if (e.target === photoModalEl) closePhotoLightbox();
    });

    // Bấm nút Thả tim
    document.getElementById('fxBtnHeart').addEventListener('click', function (e) {
      e.stopPropagation();
      playCrystalChime([783.99, 987.77, 1174.66, 1567.98]); // G5, B5, D6, G6
      var rect = this.getBoundingClientRect();
      burstHearts(rect.left + rect.width / 2, rect.top, 25);
    });

    // 3D Parallax Tilt theo di chuyển chuột
    var cardWrap = photoModalEl.querySelector('.fx-photo-card-wrap');
    cardWrap.addEventListener('mousemove', function (e) {
      if (!photoModalCard) return;
      var rect = photoModalCard.getBoundingClientRect();
      var x = e.clientX - (rect.left + rect.width / 2);
      var y = e.clientY - (rect.top + rect.height / 2);
      var rotY = (x / (rect.width / 2)) * 14;
      var rotX = -(y / (rect.height / 2)) * 14;
      photoModalCard.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
    });

    cardWrap.addEventListener('mouseleave', function () {
      if (photoModalCard) {
        photoModalCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    });
  }

  function openPhotoLightbox(src, caption, originX, originY) {
    if (!photoModalEl) createPhotoModal();
    photoModalImg.src = src;
    photoModalCaption.textContent = caption || 'Thư 9x ✨';

    photoModalEl.classList.add('is-open');
    playCrystalChime();

    // Nổ tim tại điểm click
    burstHearts(originX || window.innerWidth / 2, originY || window.innerHeight / 2, 20);
  }

  function closePhotoLightbox() {
    if (photoModalEl) {
      photoModalEl.classList.remove('is-open');
      if (photoModalCard) {
        photoModalCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    }
  }

  // --- E. PHÁO HOA TRÁI TIM BÙNG NỔ (BURST HEARTS) ---
  var HEART_EMOJIS = ['💖', '💕', '✨', '🌸', '🌷', '🥰', '🧀', '⭐'];

  function burstHearts(originX, originY, count) {
    var total = count || 20;
    var x = originX || window.innerWidth / 2;
    var y = originY || window.innerHeight / 2;

    for (var i = 0; i < total; i++) {
      var h = document.createElement('div');
      h.className = 'fx-flying-heart';
      h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

      var angle = Math.random() * Math.PI * 2;
      var dist = 80 + Math.random() * 220;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist - 80;
      var tr = (Math.random() * 60 - 30);
      var size = 18 + Math.random() * 22;

      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.fontSize = size + 'px';
      h.style.setProperty('--tx', tx.toFixed(1) + 'px');
      h.style.setProperty('--ty', ty.toFixed(1) + 'px');
      h.style.setProperty('--tr', tr.toFixed(1) + 'deg');

      document.body.appendChild(h);
      (function (node) {
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 2200);
      })(h);
    }
  }

  // --- F. VỆT BỤI SAO MA THUẬT (SPARKLE TRAIL CANVAS 60FPS) ---
  function initSparkleTrail() {
    var canvas = document.createElement('canvas');
    canvas.id = 'fxSparkleCanvas';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    var particles = [];
    var MAX_PARTICLES = 120;
    var colors = [
      'rgba(255, 235, 150, ',
      'rgba(255, 182, 193, ',
      'rgba(255, 255, 255, ',
      'rgba(244, 114, 182, ',
      'rgba(186, 230, 253, '
    ];

    function addSparkles(x, y, count) {
      for (var i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) particles.shift();
        var angle = Math.random() * Math.PI * 2;
        var speed = 0.5 + Math.random() * 3.2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          size: 2.5 + Math.random() * 4.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          isStar: Math.random() < 0.45,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() * 0.2 - 0.1)
        });
      }
    }

    // Lắng nghe chuột & cảm ứng
    var lastX = -1, lastY = -1;
    function handlePointer(x, y) {
      if (lastX === -1) {
        lastX = x;
        lastY = y;
        addSparkles(x, y, 4);
        return;
      }
      var dx = x - lastX;
      var dy = y - lastY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        addSparkles(x, y, Math.min(6, Math.floor(dist / 6)));
        lastX = x;
        lastY = y;
      }
    }

    window.addEventListener('mousemove', function (e) {
      handlePointer(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('click', function (e) {
      // Nổ sao lấp lánh khi click bất kỳ đâu
      addSparkles(e.clientX, e.clientY, 15);
    }, { passive: true });

    // Vẽ sao 4 cánh ma thuật
    function drawStar(c, cx, cy, spikes, outerRadius, innerRadius) {
      var rot = Math.PI / 2 * 3;
      var step = Math.PI / spikes;
      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (var i = 0; i < spikes; i++) {
        var x = cx + Math.cos(rot) * outerRadius;
        var y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowColor = p.color + '0.8)';
        ctx.shadowBlur = 8;

        if (p.isStar) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          drawStar(ctx, 0, 0, 4, p.size * 1.5, p.size * 0.4);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(render);
    }
    render();
  }

  // --- G. MƯA CÁNH HOA TULIP 3D & ĐOM ĐÓM HOÀNG KIM (CANVAS) ---
  function initFallingPetalsAndStardust() {
    var canvas = document.createElement('canvas');
    canvas.id = 'fxPetalCanvas';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // 1. Cánh hoa Tulip
    var petals = [];
    var NUM_PETALS = 28;
    for (var i = 0; i < NUM_PETALS; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: 10 + Math.random() * 14,
        speedY: 1.1 + Math.random() * 1.6,
        speedX: Math.random() * 1.2 - 0.6,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        speedRotX: 0.015 + Math.random() * 0.02,
        speedRotY: 0.02 + Math.random() * 0.025,
        speedRotZ: 0.01 + Math.random() * 0.015,
        color: Math.random() < 0.6 ? '#f472b6' : (Math.random() < 0.5 ? '#fb7185' : '#fbcfe8'),
        alpha: 0.55 + Math.random() * 0.35,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    // 2. Đom đóm hoàng kim (Fireflies / Stardust)
    var fireflies = [];
    var NUM_FIREFLIES = 35;
    for (var f = 0; f < NUM_FIREFLIES; f++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.5,
        alpha: Math.random(),
        alphaSpeed: 0.01 + Math.random() * 0.02,
        color: Math.random() < 0.6 ? '#fde047' : '#fef08a'
      });
    }

    function renderWorld() {
      ctx.clearRect(0, 0, width, height);

      // Vẽ đom đóm
      for (var f = 0; f < fireflies.length; f++) {
        var ff = fireflies[f];
        ff.x += ff.vx;
        ff.y += ff.vy;
        ff.alpha += ff.alphaSpeed;

        if (ff.alpha > 0.95 || ff.alpha < 0.1) {
          ff.alphaSpeed = -ff.alphaSpeed;
        }
        if (ff.y < -10) {
          ff.y = height + 10;
          ff.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = ff.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, ff.alpha));
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Vẽ cánh hoa Tulip 3D
      for (var p = 0; p < petals.length; p++) {
        var pt = petals[p];
        pt.swayPhase += 0.025;
        pt.x += pt.speedX + Math.sin(pt.swayPhase) * 1.2;
        pt.y += pt.speedY;

        pt.rotX += pt.speedRotX;
        pt.rotY += pt.speedRotY;
        pt.rotZ += pt.speedRotZ;

        if (pt.y > height + 20) {
          pt.y = -20;
          pt.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotZ);
        ctx.scale(Math.cos(pt.rotX), Math.sin(pt.rotY));
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.shadowColor = 'rgba(244, 114, 182, 0.5)';
        ctx.shadowBlur = 6;

        // Vẽ hình cánh hoa Tulip hình elip nhọn
        ctx.beginPath();
        ctx.moveTo(0, -pt.size);
        ctx.bezierCurveTo(pt.size * 0.8, -pt.size * 0.5, pt.size * 0.9, pt.size * 0.6, 0, pt.size);
        ctx.bezierCurveTo(-pt.size * 0.9, pt.size * 0.6, -pt.size * 0.8, -pt.size * 0.5, 0, -pt.size);
        ctx.fill();

        ctx.restore();
      }

      requestAnimationFrame(renderWorld);
    }
    renderWorld();
  }

  // --- H. THANH ĐIỀU KHIỂN NỔI GÓC MÀN HÌNH ---
  function initTopControls() {
    var topBar = document.createElement('div');
    topBar.className = 'fx-top-bar';
    topBar.innerHTML = [
      '<button type="button" class="fx-pill-btn" id="fxBtnMusic" aria-label="Bật/Tắt nhạc">',
      '  <span class="fx-music-disc" id="fxMusicDisc">🎵</span> <span id="fxMusicText">Nhạc: Đang phát</span>',
      '</button>',
      '<button type="button" class="fx-pill-btn" id="fxBtnBurstHeart" aria-label="Thả tim ngập tràn">',
      '  <span>💖 Thả tim</span>',
      '</button>',
      '<button type="button" class="fx-pill-btn" id="fxBtnReplay" aria-label="Xem lại từ đầu">',
      '  <span>🔄 Xem lại</span>',
      '</button>'
    ].join('');

    document.body.appendChild(topBar);

    var audio = document.getElementById('audio-para-ti');
    var btnMusic = document.getElementById('fxBtnMusic');
    var disc = document.getElementById('fxMusicDisc');
    var musicText = document.getElementById('fxMusicText');

    if (btnMusic && audio) {
      btnMusic.addEventListener('click', function () {
        if (audio.paused) {
          audio.play();
          disc.classList.remove('is-paused');
          musicText.textContent = 'Nhạc: Đang phát';
          playCrystalChime([659.25, 783.99, 1046.50]);
        } else {
          audio.pause();
          disc.classList.add('is-paused');
          musicText.textContent = 'Nhạc: Đã tắt';
        }
      });

      // Đồng bộ trạng thái nhạc
      audio.addEventListener('play', function () {
        disc.classList.remove('is-paused');
        musicText.textContent = 'Nhạc: Đang phát';
      });
      audio.addEventListener('pause', function () {
        disc.classList.add('is-paused');
        musicText.textContent = 'Nhạc: Đã tắt';
      });
    }

    // Nút thả tim ngập trời
    document.getElementById('fxBtnBurstHeart').addEventListener('click', function (e) {
      playCrystalChime([523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]);
      burstHearts(window.innerWidth * 0.2, window.innerHeight * 0.6, 20);
      burstHearts(window.innerWidth * 0.5, window.innerHeight * 0.5, 30);
      burstHearts(window.innerWidth * 0.8, window.innerHeight * 0.6, 20);
    });

    // Nút xem lại từ đầu
    document.getElementById('fxBtnReplay').addEventListener('click', function () {
      window.location.reload();
    });
  }

  // --- I. KHỞI TẠO TẤT CẢ HIỆU ỨNG KHI TRANG TẢI XONG ---
  function initAllSuperFX() {
    initSparkleTrail();
    initFallingPetalsAndStardust();
    createPhotoModal();
    observeFlyingPhotos();
    initTopControls();

    // Thêm âm thanh khi click nút vân tay
    var fpBtn = document.getElementById('fingerprintBtn');
    if (fpBtn) {
      fpBtn.addEventListener('click', function () {
        playCrystalChime();
      });
    }

    // Thêm âm thanh khi click mở phong bì thư & quản lý banner chỉ dẫn chạm
    var letterEl = document.querySelector('.letter');
    var letterOpenPrompt = document.getElementById('letterOpenPrompt');
    var letterModal = document.getElementById('letterModal');

    function hideOpenPrompt() {
      if (letterOpenPrompt) {
        letterOpenPrompt.classList.remove('is-visible');
        letterOpenPrompt.classList.add('is-hidden');
      }
    }

    if (letterOpenPrompt) {
      letterOpenPrompt.addEventListener('click', function (e) {
        e.stopPropagation();
        playCrystalChime([440, 554.37, 659.25, 880]);
        hideOpenPrompt();
        if (letterEl) {
          letterEl.click();
        }
      });
    }

    if (letterEl) {
      letterEl.addEventListener('click', function () {
        playCrystalChime([440, 554.37, 659.25, 880]); // A chord
        letterEl.classList.add('is-opened');
        hideOpenPrompt();
      });
    }

    // Tự động bật hiện banner mở thư sau khi bó hoa đã xuất hiện (~4s)
    setTimeout(function () {
      if (letterOpenPrompt && (!letterModal || !letterModal.classList.contains('is-open'))) {
        letterOpenPrompt.classList.add('is-visible');
      }
    }, 4000);

    // Khởi tạo Dây đèn đom đóm Fairy Lights
    initFairyLights();

    // Khởi tạo Tương tác 2 chú mèo
    initCatInteractions();

    // Khởi tạo Tương tác bấm vào bông hoa
    initTulipInteractions();

    console.log('✨ [SuperFX] Đã kích hoạt toàn bộ hiệu ứng thế hệ mới: Polaroid 3D, Fairy Lights, Letter Open Prompt!');
  }

  // --- J. DÂY ĐÈN ĐOM ĐÓM FAIRY LIGHTS ---
  function initFairyLights() {
    var wrap = document.getElementById('fairyLightsSystem');
    if (!wrap) return;
    var coords = [
      { top: 26, left: 32 }, { top: 34, left: 46 }, { top: 24, left: 60 },
      { top: 44, left: 28 }, { top: 48, left: 40 }, { top: 45, left: 56 },
      { top: 36, left: 70 }, { top: 60, left: 34 }, { top: 62, left: 50 },
      { top: 56, left: 66 }, { top: 72, left: 44 }, { top: 74, left: 58 },
      { top: 82, left: 50 }, { top: 30, left: 76 }
    ];
    coords.forEach(function (pos, idx) {
      var bulb = document.createElement('div');
      bulb.className = 'fairy-bulb';
      bulb.style.top = pos.top + '%';
      bulb.style.left = pos.left + '%';
      bulb.style.animationDelay = (idx * 0.24) + 's';
      bulb.style.animationDuration = (2.0 + (idx % 4) * 0.5) + 's';
      wrap.appendChild(bulb);
    });
  }

  // --- K. TƯƠNG TÁC 2 CHÚ MÈO MEWMEW DỄ THƯƠNG ---
  function initCatInteractions() {
    var cats = document.querySelectorAll('.rabbit');
    cats.forEach(function (cat) {
      cat.style.cursor = 'pointer';
      cat.addEventListener('click', function (e) {
        e.stopPropagation();
        playCrystalChime([880, 1108.73, 1318.51], 0.05); // high cute chime
        var rect = cat.getBoundingClientRect();
        burstHearts(rect.left + rect.width / 2, rect.top, 10);

        cat.classList.remove('is-jumping');
        void cat.offsetWidth; // reset anim
        cat.classList.add('is-jumping');
      });
    });
  }

  // --- L. TƯƠNG TÁC CHẠM VÀO TỪNG BÔNG HOA TULIP ---
  function initTulipInteractions() {
    var flowers = document.querySelectorAll('.flower');
    flowers.forEach(function (fl) {
      fl.style.cursor = 'pointer';
      fl.addEventListener('click', function (e) {
        e.stopPropagation();
        playCrystalChime([659.25, 830.61, 987.77, 1318.51], 0.06);
        var rect = fl.getBoundingClientRect();
        burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

        // Hiệu ứng bừng sáng
        fl.style.filter = 'drop-shadow(0 0 16px rgba(255, 105, 180, 0.95)) brightness(1.2)';
        setTimeout(function () {
          fl.style.filter = '';
        }, 600);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSuperFX);
  } else {
    initAllSuperFX();
  }

})();
