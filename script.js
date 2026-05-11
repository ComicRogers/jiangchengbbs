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

  /* ---------- 角落小圆点 ---------- */
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
