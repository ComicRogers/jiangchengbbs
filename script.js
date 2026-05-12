/* ============================================================
 * 江城市家居装修论坛 · 公共脚本 v2
 * 移动端增强：安全区·阅读进度·摇一摇·倾斜·沉浸·横屏提示·深色切换
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 工具函数 ---------- */
  var $ = function (s) { return document.querySelector(s); };
  var isMobile = function () {
    return window.matchMedia('(max-width: 768px)').matches
      || ('ontouchstart' in window);
  };
  var pageKey = function () {
    var p = location.pathname.split('/').pop() || 'index.html';
    return 'jcbbs:scroll:' + p;
  };

  /* ============================================================
   * 1. 阅读进度条
   * ============================================================ */
  var progressBar = $('#progressBar');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  if (progressBar) {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ============================================================
   * 2. 阅读进度本地存储与恢复（"它在记住你"）
   * ============================================================ */
  var lastSave = 0;
  function saveScroll() {
    var now = Date.now();
    if (now - lastSave < 600) return;
    lastSave = now;
    try {
      var y = window.scrollY || document.documentElement.scrollTop;
      var pct = (y / (document.documentElement.scrollHeight - window.innerHeight)) || 0;
      if (pct > 0.08) {
        localStorage.setItem(pageKey(), JSON.stringify({
          y: y, pct: pct, ts: now
        }));
      }
    } catch (e) {}
  }
  window.addEventListener('scroll', saveScroll, { passive: true });

  function tryRestoreScroll() {
    try {
      var raw = localStorage.getItem(pageKey());
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || !data.pct || data.pct < 0.1) return;

      var curPct = (window.scrollY || 0) /
        (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (curPct >= data.pct - 0.05) return;

      var toast = document.createElement('div');
      toast.className = 'resume-toast';
      var pctTxt = Math.round(data.pct * 100);
      toast.innerHTML =
        '上次读到 ' + pctTxt + '%' +
        '<button type="button" id="resumeBtn">继续阅读</button>' +
        '<button type="button" id="resumeClose" aria-label="关闭" style="border:0;padding:3px 6px;margin-left:4px;opacity:0.6;">×</button>';
      document.body.appendChild(toast);

      setTimeout(function () { toast.classList.add('show'); }, 700);

      var hideTimer = setTimeout(function () {
        toast.classList.remove('show');
      }, 7000);

      $('#resumeBtn').addEventListener('click', function () {
        clearTimeout(hideTimer);
        window.scrollTo({ top: data.y, behavior: 'smooth' });
        toast.classList.remove('show');
      });
      $('#resumeClose').addEventListener('click', function () {
        clearTimeout(hideTimer);
        toast.classList.remove('show');
      });

      var dismissOnce = function () {
        toast.classList.remove('show');
        document.removeEventListener('touchstart', dismissOnce, true);
      };
      setTimeout(function () {
        document.addEventListener('touchstart', dismissOnce, { capture: true, passive: true });
      }, 2200);
    } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryRestoreScroll);
  } else {
    tryRestoreScroll();
  }

  /* ============================================================
   * 3. 角落小圆点
   * ============================================================ */
  var cornerDot = $('#cornerDot');
  var cornerTip = $('#cornerTip');
  var cornerVisible = false;
  function checkCornerDot() {
    if (!cornerDot) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? scrollTop / docHeight : 0;
    if (pct > 0.30 && !cornerVisible) {
      cornerVisible = true;
      cornerDot.classList.add('visible');
    }
  }
  if (cornerDot) {
    window.addEventListener('scroll', checkCornerDot, { passive: true });
    checkCornerDot();

    var dotClickCount = 0;
    var dotMessages = [
      '正在为您匹配最近的"出口"…',
      '已记录您的位置。',
      '请勿告诉他人。',
      '它喜欢被注视。',
      '11 天。',
      '欢迎回家。'
    ];
    cornerDot.addEventListener('click', function () {
      if (cornerTip) {
        cornerTip.textContent = dotMessages[dotClickCount % dotMessages.length];
        cornerTip.classList.add('show');
      }
      dotClickCount++;
      var newSize = Math.min(6 + dotClickCount * 0.8, 18);
      cornerDot.style.width = newSize + 'px';
      cornerDot.style.height = newSize + 'px';
      if (cornerTip) {
        setTimeout(function () { cornerTip.classList.remove('show'); }, 2200);
      }
    });
  }

  /* ============================================================
   * 4. 免责声明最后一行
   * ============================================================ */
  var lastDisclaimer = $('.top-disclaimer .last-line');
  if (lastDisclaimer) {
    var clickCount = 0;
    lastDisclaimer.addEventListener('click', function () {
      clickCount++;
      lastDisclaimer.style.transition = 'all 0.6s ease';
      lastDisclaimer.style.color = '#2c2825';
      lastDisclaimer.style.letterSpacing = '0.04em';
      setTimeout(function () {
        lastDisclaimer.style.letterSpacing = '0.012em';
        lastDisclaimer.style.color = '#8a8278';
      }, 800);
      if (clickCount === 3) {
        lastDisclaimer.innerHTML = '<em>如果您在阅读过程中注意到所在房间内存在直径 3 厘米左右的圆形物体，那也只是巧合。（已记录）</em>';
      }
    });
  }

  /* ============================================================
   * 5. 系统通知收缩
   * ============================================================ */
  var systemNotice = $('#systemNotice');
  var centralDot = $('#centralDot');
  if (systemNotice && 'IntersectionObserver' in window) {
    var noticeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setTimeout(function () { systemNotice.classList.add('contracting'); }, 1200);
          if (centralDot) {
            setTimeout(function () { centralDot.classList.add('grown'); }, 2400);
          }
        }
      });
    }, { threshold: [0, 0.5, 1] });
    noticeObserver.observe(systemNotice);
  }

  /* ============================================================
   * 6. 未通过审核展开 + 长按触发
   * ============================================================ */
  var modBlock = $('#modBlock');
  var hiddenReply = $('#hiddenReply');
  if (modBlock && hiddenReply) {
    var revealOnce = function () {
      hiddenReply.classList.add('revealed');
      modBlock.style.display = 'none';
    };
    modBlock.addEventListener('click', revealOnce);

    var pressTimer = null;
    var pressActive = false;
    modBlock.addEventListener('touchstart', function () {
      pressActive = true;
      modBlock.classList.add('long-press-active');
      pressTimer = setTimeout(function () {
        if (pressActive) revealOnce();
      }, 600);
    }, { passive: true });
    var cancelPress = function () {
      pressActive = false;
      clearTimeout(pressTimer);
      modBlock.classList.remove('long-press-active');
    };
    modBlock.addEventListener('touchend', cancelPress);
    modBlock.addEventListener('touchcancel', cancelPress);
    modBlock.addEventListener('touchmove', cancelPress);
  }

  /* ============================================================
   * 7. 平滑滚动锚点
   * ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href.length <= 1) return;
    a.addEventListener('click', function (e) {
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
   * 8. 注入移动端 UI（横屏提示 + 沉浸按钮）
   * ============================================================ */
  function injectMobileUI() {
    if (!isMobile()) return;

    // 横屏提示
    if (!$('.orientation-hint')) {
      var hint = document.createElement('div');
      hint.className = 'orientation-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML =
        '<div class="icon" aria-hidden="true"></div>' +
        '<div class="text">建议竖屏阅读</div>' +
        '<div class="sub">' +
          '本帖在竖屏下排版最完整。' +
          '<em>—— 你也可以继续，但它喜欢被注视。</em>' +
        '</div>';
      document.body.appendChild(hint);

      // 双击允许横屏
      var tapCount = 0;
      hint.addEventListener('click', function () {
        tapCount++;
        if (tapCount >= 2) {
          document.body.classList.add('allow-landscape');
        }
        setTimeout(function () { tapCount = 0; }, 600);
      });
    }

    // 沉浸阅读按钮（仅帖子详情页）
    var inThread = !!document.querySelector('.thread-card');
    if (inThread && !$('.immersive-toggle')) {
      var btn = document.createElement('button');
      btn.className = 'immersive-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', '切换沉浸阅读');
      btn.textContent = '⤢';
      document.body.appendChild(btn);

      var btnVisible = false;
      window.addEventListener('scroll', function () {
        var pct = (window.scrollY || 0) /
          (document.documentElement.scrollHeight - window.innerHeight || 1);
        if (pct > 0.20 && !btnVisible) {
          btn.classList.add('visible');
          btnVisible = true;
        }
      }, { passive: true });

      btn.addEventListener('click', function () {
        document.body.classList.toggle('immersive');
        btn.textContent = document.body.classList.contains('immersive') ? '⤡' : '⤢';
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMobileUI);
  } else {
    injectMobileUI();
  }

  /* ============================================================
   * 9. 摇一摇 → corner-dot 反馈
   * ============================================================ */
  var lastShakeTime = 0;
  var lastX = null, lastY = null, lastZ = null;
  function onMotion(e) {
    var acc = e.accelerationIncludingGravity || e.acceleration;
    if (!acc || acc.x == null) return;
    var x = acc.x, y = acc.y, z = acc.z;
    if (lastX != null) {
      var delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      if (delta > 32) {
        var now = Date.now();
        if (now - lastShakeTime > 2000) {
          lastShakeTime = now;
          onShake();
        }
      }
    }
    lastX = x; lastY = y; lastZ = z;
  }
  function onShake() {
    if (!cornerDot) return;
    cornerDot.classList.add('visible');
    cornerDot.style.transform = 'scale(2.2)';
    if (cornerTip) {
      cornerTip.textContent = '它感觉到你在动。';
      cornerTip.classList.add('show');
    }
    if (navigator.vibrate) {
      try { navigator.vibrate([10, 60, 10]); } catch (e) {}
    }
    setTimeout(function () {
      cornerDot.style.transform = '';
      if (cornerTip) cornerTip.classList.remove('show');
    }, 1800);
  }

  function enableMotion() {
    if (typeof DeviceMotionEvent === 'undefined') return;
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(function (state) {
          if (state === 'granted') {
            window.addEventListener('devicemotion', onMotion, { passive: true });
          }
        })
        .catch(function () {});
    } else {
      window.addEventListener('devicemotion', onMotion, { passive: true });
    }
  }
  document.addEventListener('touchstart', enableMotion, { once: true, passive: true });

  /* ============================================================
   * 10. 设备倾斜 → 页面极轻微视差
   * ============================================================ */
  var tiltContainer = $('.container');
  var tiltFrame = null;
  var tiltX = 0, tiltY = 0;
  function applyTilt() {
    if (!tiltContainer) return;
    var px = (tiltX * 0.25).toFixed(2);
    var py = (tiltY * 0.18).toFixed(2);
    tiltContainer.style.transform = 'translate3d(' + (-px) + 'px,' + (-py) + 'px,0)';
    tiltFrame = null;
  }
  function onOrientation(e) {
    if (e.gamma == null || e.beta == null) return;
    var g = Math.max(-20, Math.min(20, e.gamma));
    var b = Math.max(-20, Math.min(20, e.beta - 45));
    tiltX = g;
    tiltY = b;
    if (!tiltFrame) tiltFrame = requestAnimationFrame(applyTilt);
  }
  function enableTilt() {
    if (typeof DeviceOrientationEvent === 'undefined') return;
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(function (state) {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', onOrientation, { passive: true });
          }
        })
        .catch(function () {});
    } else {
      window.addEventListener('deviceorientation', onOrientation, { passive: true });
    }
  }
  document.addEventListener('touchstart', enableTilt, { once: true, passive: true });

  /* ============================================================
   * 11. 可见性变化 —— 切走再回来
   * ============================================================ */
  var leaveTime = null;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      leaveTime = Date.now();
    } else if (leaveTime) {
      var gone = (Date.now() - leaveTime) / 1000;
      leaveTime = null;
      if (gone > 30 && cornerDot && cornerTip) {
        cornerDot.classList.add('visible');
        cornerTip.textContent = '你回来了。';
        cornerTip.classList.add('show');
        setTimeout(function () {
          cornerTip.classList.remove('show');
        }, 2200);
      }
    }
  });

  /* ============================================================
   * 12. PWA：捕获 beforeinstallprompt
   * 连点三次 logo 可触发安装（隐藏入口）
   * ============================================================ */
  var deferredInstall = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredInstall = e;
    var logo = $('.forum-mast .logo');
    if (!logo) return;
    var logoClicks = 0, logoTimer;
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function () {
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(function () { logoClicks = 0; }, 1200);
      if (logoClicks >= 3 && deferredInstall) {
        deferredInstall.prompt();
        deferredInstall = null;
        logoClicks = 0;
      }
    });
  });
})();
