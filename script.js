/* ============================================================
 * 江城市家居装修论坛 · 公共脚本
 * ============================================================ */
(function () {
  'use strict';

  /* ---------- 阅读进度条 ---------- */
  var progressBar = document.getElementById('progressBar');
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

  /* ---------- 角落小圆点（无大小限制） ---------- */
  var cornerDot = document.getElementById('cornerDot');
  var cornerTip = document.getElementById('cornerTip');
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
      '欢迎回家。',
      '再近一点。',
      '不要停。',
      '它已经看见你了。',
      '不要回头。',
      '马上就到了。',
      '······'
    ];
    cornerDot.addEventListener('click', function () {
      dotClickCount++;
      if (cornerTip) {
        cornerTip.textContent = dotMessages[Math.min(dotClickCount - 1, dotMessages.length - 1)];
        cornerTip.classList.add('show');
      }

      /* 乘法增长：起始 6px，每次点击 ×1.55，无上限 */
      var newSize = 6 * Math.pow(1.55, dotClickCount);
      var maxDim = Math.max(window.innerWidth, window.innerHeight);

      cornerDot.style.width = newSize + 'px';
      cornerDot.style.height = newSize + 'px';

      if (newSize > 80) {
        cornerDot.classList.add('engulfing');
      }
      if (newSize > maxDim * 1.6) {
        cornerDot.classList.add('fullscreen');
        document.body.classList.add('engulfed');
      }

      if (cornerTip) {
        setTimeout(function () { cornerTip.classList.remove('show'); }, 2200);
      }
    });
  }

  /* ---------- 免责声明最后一行 ---------- */
  var lastDisclaimer = document.querySelector('.top-disclaimer .last-line');
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

  /* ---------- 系统通知收缩效果 ---------- */
  var systemNotice = document.getElementById('systemNotice');
  var centralDot = document.getElementById('centralDot');
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

  /* ---------- 未通过审核回复展开 ---------- */
  var modBlock = document.getElementById('modBlock');
  var hiddenReply = document.getElementById('hiddenReply');
  if (modBlock && hiddenReply) {
    modBlock.addEventListener('click', function () {
      hiddenReply.classList.add('revealed');
      modBlock.style.display = 'none';
    });
  }

  /* ---------- 可点击放大的黑洞（无大小限制） ---------- */
  function setupGrowableHole(el, opts) {
    opts = opts || {};
    if (!el || el.dataset.growableInit === '1') return;
    el.dataset.growableInit = '1';

    var initial = parseFloat(el.getAttribute('data-initial'));
    if (isNaN(initial) || initial <= 0) {
      initial = opts.initial || 80;
    }
    if (!opts.skipInitialSize) {
      el.style.width = initial + 'px';
      el.style.height = initial + 'px';
    }
    el.style.cursor = 'pointer';

    var clicks = 0;
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      clicks++;

      /* 第一次点击起，将过渡切换为响应灵敏的曲线
         （对 thread-9 的 centralDot 尤其重要——它默认有 4s 缓慢过渡） */
      el.style.transition =
        'width 0.55s cubic-bezier(0.34, 0, 0.2, 1), ' +
        'height 0.55s cubic-bezier(0.34, 0, 0.2, 1), ' +
        'box-shadow 0.6s ease';

      /* 每次点击 ×1.5，可无限增长 */
      var size = initial * Math.pow(1.5, clicks);
      var maxDim = Math.max(window.innerWidth, window.innerHeight);

      el.style.width = size + 'px';
      el.style.height = size + 'px';

      /* 大到一定程度时，脱离文档流并固定到屏幕中央 */
      if (size > 180) {
        el.classList.add('hole-fixed');
      }
      /* 完全吞没视口 */
      if (size > maxDim * 1.6) {
        el.classList.add('hole-fullscreen');
        document.body.classList.add('engulfed');
      }
    });
  }

  /* 把所有 .growable-hole 接管 */
  document.querySelectorAll('.growable-hole').forEach(function (el) {
    setupGrowableHole(el);
  });

  /* thread-9 的系统通知中心点（#centralDot）也变为可点击放大 */
  /* 但保留它原本"3px→18px"的进入动画，因此跳过初始尺寸写入 */
  if (centralDot && centralDot.dataset.growableInit !== '1') {
    centralDot.classList.add('central-hole');
    setupGrowableHole(centralDot, { skipInitialSize: true, initial: 18 });
  }

  /* ---------- 实时回复 · 逐字打字机效果 ---------- */
  function startTypewriter(feed) {
    if (!feed || feed.dataset.tw === '1') return;
    feed.dataset.tw = '1';

    var items = Array.prototype.slice.call(feed.querySelectorAll('.item'));
    var moreEl = feed.querySelector('.more');

    /* 先隐藏所有 item 和末尾的"更多"提示 */
    items.forEach(function (item) { item.classList.add('tw-hidden'); });
    if (moreEl) moreEl.classList.add('tw-hidden');

    /* 缓存每条 item 的原文 */
    items.forEach(function (item) {
      var t = item.querySelector('.text');
      if (t) {
        item.dataset.fullText = t.textContent;
        t.textContent = '';
      }
    });

    var iIndex = 0;
    function nextItem() {
      if (iIndex >= items.length) {
        if (moreEl) {
          setTimeout(function () { moreEl.classList.remove('tw-hidden'); }, 400);
        }
        return;
      }
      var item = items[iIndex++];
      item.classList.remove('tw-hidden');
      var textEl = item.querySelector('.text');
      var full = item.dataset.fullText || '';
      if (!textEl || !full) {
        setTimeout(nextItem, 280);
        return;
      }
      textEl.classList.add('tw-typing');
      var ci = 0;
      function typeChar() {
        if (ci < full.length) {
          textEl.textContent = full.slice(0, ++ci);
          var ch = full.charAt(ci - 1);
          var delay = 22 + Math.random() * 38;
          if (ch === '●' || ch === ' ') delay = 14 + Math.random() * 18;
          if (ch === '。' || ch === '，' || ch === '？' || ch === '！') delay = 80 + Math.random() * 80;
          setTimeout(typeChar, delay);
        } else {
          textEl.classList.remove('tw-typing');
          setTimeout(nextItem, 220 + Math.random() * 300);
        }
      }
      setTimeout(typeChar, 90 + Math.random() * 120);
    }
    setTimeout(nextItem, 300);
  }

  /* 滚动到实时 feed 时再启动 */
  var feeds = document.querySelectorAll('.realtime-feed');
  if (feeds.length) {
    if ('IntersectionObserver' in window) {
      var feedObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
            startTypewriter(entry.target);
            feedObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      feeds.forEach(function (f) { feedObs.observe(f); });
    } else {
      feeds.forEach(startTypewriter);
    }
  }

  /* ---------- 平滑滚动到锚点 ---------- */
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
})();
