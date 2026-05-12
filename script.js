/* ============================================================
 * 江城市家居装修论坛 · 公共脚本 · 沉浸增强版
 * 兼容并扩展原 script.js 的全部功能
 * ============================================================ */
(function () {
  'use strict';

  /* ===========================================================
   * 0. 注入增强样式（不需要改 styles.css）
   * =========================================================== */
  var STYLES = [
    '/* 极淡的"深读"对比度变化 */',
    'body { transition: filter 6s ease; }',
    'body.deep-mode { filter: contrast(1.02) brightness(0.985); }',
    '',
    '/* 跟随鼠标但滞后的观察者圆点 */',
    '.watcher-dot {',
    '  position: fixed; pointer-events: none;',
    '  background: #1a1815; border-radius: 50%;',
    '  width: 4px; height: 4px;',
    '  z-index: 99; opacity: 0;',
    '  transition: opacity 3s ease, transform 0.8s ease;',
    '}',
    '.watcher-dot.live { opacity: 0.65; }',
    '.watcher-dot.near { transform: scale(1.6); opacity: 0.85; }',
    '',
    '/* 选中关键词时的低语 */',
    '.whisper {',
    '  position: fixed; pointer-events: none;',
    '  font-family: "Noto Serif SC", serif;',
    '  font-style: italic;',
    '  color: #8a4a3a;',
    '  font-size: 0.78em;',
    '  letter-spacing: 0.04em;',
    '  opacity: 0;',
    '  z-index: 60;',
    '  max-width: 220px;',
    '  line-height: 1.6;',
    '  text-shadow: 0 0 6px rgba(255, 245, 230, 0.85);',
    '  transition: opacity 1.2s ease;',
    '  background: rgba(253, 250, 243, 0.85);',
    '  padding: 4px 8px; border-radius: 2px;',
    '  border-left: 2px solid #c47b54;',
    '}',
    '.whisper.show { opacity: 1; }',
    '',
    '/* 自查问卷触发按钮 */',
    '.self-check-trigger {',
    '  position: fixed; right: 16px; bottom: 60px;',
    '  background: #fdfaf3; border: 1px solid #d4c8ad;',
    '  color: #5a554d; padding: 8px 14px;',
    '  border-radius: 3px;',
    '  font-size: 0.78em;',
    '  font-family: "Noto Serif SC", serif;',
    '  cursor: pointer; z-index: 48;',
    '  opacity: 0; transform: translateY(8px);',
    '  transition: opacity 0.8s ease, transform 0.8s ease, background 0.3s, color 0.3s;',
    '  box-shadow: 0 2px 8px rgba(44,40,37,0.05);',
    '}',
    '.self-check-trigger.ready { opacity: 1; transform: translateY(0); }',
    '.self-check-trigger:hover { background: #f1eadc; color: #2c2825; }',
    '',
    '/* 自查问卷弹窗 */',
    '.modal-overlay {',
    '  position: fixed; inset: 0;',
    '  background: rgba(26, 24, 21, 0.55);',
    '  z-index: 200; display: none;',
    '  align-items: center; justify-content: center;',
    '  padding: 20px;',
    '  -webkit-backdrop-filter: blur(3px);',
    '  backdrop-filter: blur(3px);',
    '}',
    '.modal-overlay.open { display: flex; }',
    '.modal-box {',
    '  background: #fdfaf3; border: 1px solid #d4c8ad;',
    '  border-radius: 6px; max-width: 480px; width: 100%;',
    '  max-height: 90vh; overflow-y: auto;',
    '  padding: 1.4em 1.4em;',
    '  font-family: "Noto Serif SC", serif;',
    '  color: #2c2825;',
    '  animation: modalIn 0.5s ease;',
    '  box-shadow: 0 12px 40px rgba(0,0,0,0.18);',
    '}',
    '@keyframes modalIn {',
    '  from { opacity: 0; transform: translateY(16px) scale(0.97); }',
    '  to { opacity: 1; transform: translateY(0) scale(1); }',
    '}',
    '.modal-box h3 { font-size: 1.12em; margin: 0 0 0.4em; font-weight: 600; }',
    '.modal-box .sub {',
    '  font-size: 0.84em; color: #8a8278;',
    '  font-style: italic; margin-bottom: 1em;',
    '  padding-bottom: 0.8em; border-bottom: 1px dashed #d4c8ad;',
    '}',
    '.modal-box .q-item { margin: 1.1em 0; }',
    '.modal-box .q-item .q { font-size: 0.95em; margin-bottom: 0.5em; color: #2c2825; }',
    '.modal-box .opts { display: flex; flex-wrap: wrap; gap: 6px; }',
    '.modal-box .opts button {',
    '  background: #f1eadc; border: 1px solid #d8d0bd;',
    '  color: #5a554d; padding: 5px 12px; border-radius: 3px;',
    '  font-family: "Noto Serif SC", serif; font-size: 0.86em;',
    '  cursor: pointer; transition: all 0.25s;',
    '}',
    '.modal-box .opts button:hover { background: #ebe2cd; color: #2c2825; }',
    '.modal-box .opts button.picked { background: #2c2825; color: #f5f1ea; border-color: #2c2825; }',
    '.modal-box .result {',
    '  margin-top: 1.2em; padding: 1em 1.1em;',
    '  background: #f0eadd; border-left: 3px solid #c47b54;',
    '  font-size: 0.92em; line-height: 1.85; color: #5a554d;',
    '  display: none; border-radius: 2px;',
    '}',
    '.modal-box .result.show { display: block; }',
    '.modal-box .actions {',
    '  display: flex; justify-content: space-between;',
    '  align-items: center; gap: 10px; margin-top: 1.2em;',
    '}',
    '.modal-box .actions .submit-btn {',
    '  background: #2c2825; color: #f5f1ea; border: 0;',
    '  padding: 7px 16px; font-family: "Noto Serif SC", serif;',
    '  font-size: 0.88em; border-radius: 3px; cursor: pointer;',
    '}',
    '.modal-box .actions .submit-btn:disabled { background: #c4baa0; cursor: not-allowed; }',
    '.modal-box .actions .close-btn {',
    '  background: transparent; border: 0; color: #8a8278;',
    '  font-size: 0.84em; cursor: pointer;',
    '  font-family: "IBM Plex Mono", monospace;',
    '}',
    '',
    '/* 左下角浮窗（倒计时 + 当前直径） */',
    '.fixed-widget {',
    '  position: fixed; left: 16px;',
    '  background: rgba(253, 250, 243, 0.92);',
    '  border: 1px solid #d8d0bd; border-radius: 4px;',
    '  padding: 7px 11px;',
    '  font-family: "IBM Plex Mono", monospace;',
    '  font-size: 0.74em; color: #5a554d;',
    '  z-index: 49; opacity: 0;',
    '  transition: opacity 1.4s ease;',
    '  -webkit-backdrop-filter: blur(6px);',
    '  backdrop-filter: blur(6px);',
    '  box-shadow: 0 2px 8px rgba(44,40,37,0.05);',
    '  max-width: calc(100vw - 32px);',
    '  display: flex; align-items: center; gap: 8px;',
    '  white-space: nowrap;',
    '}',
    '.fixed-widget.live { opacity: 0.88; }',
    '.fixed-widget .lbl {',
    '  color: #8a8278; letter-spacing: 0.04em;',
    '  text-transform: uppercase; font-size: 0.86em;',
    '}',
    '.fixed-widget .val { color: #2c2825; }',
    '.countdown-widget { bottom: 18px; }',
    '.diameter-widget { bottom: 60px; }',
    '.diameter-widget .dot-vis {',
    '  display: inline-block; background: #1a1815;',
    '  border-radius: 50%; transition: width 1.2s ease, height 1.2s ease;',
    '  flex-shrink: 0;',
    '}',
    '',
    '@media (max-width: 640px) {',
    '  .fixed-widget { font-size: 0.68em; padding: 6px 9px; }',
    '  .countdown-widget { bottom: 14px; }',
    '  .diameter-widget { bottom: 52px; }',
    '  .self-check-trigger {',
    '    right: 14px; bottom: 96px;',
    '    font-size: 0.74em; padding: 7px 11px;',
    '  }',
    '  .modal-box { padding: 1.2em 1.1em; }',
    '}',
    '',
    '/* 已读主题暗化 */',
    '.thread-row.visited .tr-title { color: #8a8278; }',
    '.thread-row.visited .tr-title::after {',
    '  content: " ✓"; color: #b8975a; font-size: 0.8em; margin-left: 4px;',
    '}',
    '',
    '/* 全部读完后的"归位"态 */',
    'body.in-position .top-disclaimer { background: #f5efe2; }',
    'body.in-position .top-disclaimer .last-line::after {',
    '  content: " · 您已被登记";',
    '  color: #c47b54; letter-spacing: 0.04em; font-style: normal;',
    '}',
    '',
    '/* 三连 G 提示 */',
    '.g-hint {',
    '  position: fixed; top: 50%; left: 50%;',
    '  transform: translate(-50%, -50%);',
    '  background: #1a1815; color: #d8d0bd;',
    '  padding: 24px 30px; border-radius: 6px;',
    '  z-index: 300; font-family: "Noto Serif SC", serif;',
    '  font-size: 0.94em; text-align: center;',
    '  line-height: 1.85; max-width: 340px;',
    '  box-shadow: 0 8px 40px rgba(0,0,0,0.4);',
    '  opacity: 0; transition: opacity 0.6s;',
    '}',
    '.g-hint.show { opacity: 1; }',
    '',
    '/* selection 颜色稍微调整成"它"的颜色 */',
    '::selection { background: rgba(196,123,84,0.32); color: #2c2825; }'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  /* ===========================================================
   * 1. 跨会话状态（localStorage）
   * =========================================================== */
  var STORAGE_KEY = 'jiangcheng_immersion_v1';
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveState(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  var state = loadState();
  if (!state.firstVisit) {
    state.firstVisit = Date.now();
    state.visited = [];
    state.dotClicks = 0;
    state.surveyDone = false;
    state.inPosition = false;
    saveState(state);
  }
  if (!state.visited) state.visited = [];

  /* ===========================================================
   * 2. 阅读进度条（保留原功能 + 标记已读）
   * =========================================================== */
  var progressBar = document.getElementById('progressBar');
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    // 阅读到底部时记录该 thread 页
    if (pct > 92) {
      var pageName = location.pathname.split('/').pop();
      if (/^thread-\d+\.html$/.test(pageName) && state.visited.indexOf(pageName) === -1) {
        state.visited.push(pageName);
        saveState(state);
        maybeUnlockFinalState();
      }
    }
  }
  if (progressBar) {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ===========================================================
   * 3. 角落小圆点（保留 + 跨会话记忆）
   * =========================================================== */
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

    var dotMessages = [
      '正在为您匹配最近的"出口"…',
      '已记录您的位置。',
      '请勿告诉他人。',
      '它喜欢被注视。',
      '11 天。',
      '欢迎回家。',
      '我们一直在等您。',
      '您的呼吸频率已被记录。',
      '请仔细看，再仔细看。'
    ];
    // 跨会话恢复尺寸
    var initSize = Math.min(6 + (state.dotClicks || 0) * 0.8, 22);
    cornerDot.style.width = initSize + 'px';
    cornerDot.style.height = initSize + 'px';

    cornerDot.addEventListener('click', function () {
      if (cornerTip) {
        cornerTip.textContent = dotMessages[(state.dotClicks || 0) % dotMessages.length];
        cornerTip.classList.add('show');
      }
      state.dotClicks = (state.dotClicks || 0) + 1;
      saveState(state);
      var newSize = Math.min(6 + state.dotClicks * 0.8, 22);
      cornerDot.style.width = newSize + 'px';
      cornerDot.style.height = newSize + 'px';
      if (cornerTip) {
        setTimeout(function () { cornerTip.classList.remove('show'); }, 2400);
      }
    });
  }

  /* ===========================================================
   * 4. disclaimer 三连点（保留原功能）
   * =========================================================== */
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

  /* ===========================================================
   * 5. 系统通知收缩（保留原功能）
   * =========================================================== */
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

  /* ===========================================================
   * 6. 未通过审核展开（保留原功能）
   * =========================================================== */
  var modBlock = document.getElementById('modBlock');
  var hiddenReply = document.getElementById('hiddenReply');
  if (modBlock && hiddenReply) {
    modBlock.addEventListener('click', function () {
      hiddenReply.classList.add('revealed');
      modBlock.style.display = 'none';
    });
  }

  /* ===========================================================
   * 7. 平滑锚点滚动（保留原功能）
   * =========================================================== */
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

  /* ===========================================================
   * 8. 【新】归位倒计时浮窗 · 11 天
   * =========================================================== */
  var countdownEl = document.createElement('div');
  countdownEl.className = 'fixed-widget countdown-widget';
  countdownEl.innerHTML = '<span class="lbl">归位倒计时</span><span class="val">— 天 — 时 —</span>';
  document.body.appendChild(countdownEl);

  function updateCountdown() {
    var elapsed = Date.now() - state.firstVisit;
    var total = 11 * 24 * 60 * 60 * 1000;
    var remain = total - elapsed;
    var lbl = countdownEl.querySelector('.lbl');
    var val = countdownEl.querySelector('.val');
    if (remain < 0) {
      lbl.textContent = '它已为您备好';
      val.textContent = '请头先入';
      return;
    }
    var d = Math.floor(remain / (24 * 60 * 60 * 1000));
    var h = Math.floor(remain / (60 * 60 * 1000)) % 24;
    var m = Math.floor(remain / (60 * 1000)) % 60;
    var s = Math.floor(remain / 1000) % 60;
    val.textContent = d + ' 天 ' + h + ' 时 ' + m + ' 分 ' + s + ' 秒';
  }
  setTimeout(function () { countdownEl.classList.add('live'); }, 4000);
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===========================================================
   * 9. 【新】当前孔径浮窗 · 3mm → 180mm
   * =========================================================== */
  var diameterEl = document.createElement('div');
  diameterEl.className = 'fixed-widget diameter-widget';
  diameterEl.innerHTML =
    '<span class="dot-vis" style="width:4px;height:4px;"></span>' +
    '<span class="lbl">您的孔径</span>' +
    '<span class="val">3.0 毫米</span>';
  document.body.appendChild(diameterEl);

  function updateDiameter() {
    var elapsed = Date.now() - state.firstVisit;
    var total = 11 * 24 * 60 * 60 * 1000;
    var pct = Math.min(1, elapsed / total);
    var mm = 3 + pct * 177;            // 3 → 180
    var px = Math.min(28, mm / 6);     // 视觉尺寸有上限
    var dot = diameterEl.querySelector('.dot-vis');
    dot.style.width = Math.max(4, px) + 'px';
    dot.style.height = Math.max(4, px) + 'px';
    diameterEl.querySelector('.val').textContent = mm.toFixed(1) + ' 毫米';
  }
  setTimeout(function () { diameterEl.classList.add('live'); }, 4500);
  updateDiameter();
  setInterval(updateDiameter, 5000);

  /* ===========================================================
   * 10. 【新】选中关键词唤起低语
   * =========================================================== */
  var whisperMap = {
    '回来': '我们一直在等您。',
    '回家': '锅里有粥，等您回来吃。',
    '洞': '请仔细看。请再仔细看。',
    '妈妈': '妈妈在哼歌，您听得见吗？',
    '妈': '她也在那儿。',
    '镜': '镜子里的，还是您吗？',
    '听': '请闭上眼，用心听。',
    '哼歌': '听清楚那首歌了吗？',
    '完整': '完整了。',
    '舒适': '它是舒适的。',
    '温暖': '温的——像有人刚靠过。',
    '黑': '黑里有人。',
    '安静': '太安静了。',
    '空': '空里有东西。',
    '瞳孔': '瞳孔本身就是一个洞。',
    '粥': '粥还温着。',
    '鸡蛋': '这一句救过人。',
    '11': '只剩这么多了。',
    '归': '不必现在回去。'
  };
  var whisperEl = document.createElement('div');
  whisperEl.className = 'whisper';
  document.body.appendChild(whisperEl);

  var whisperTimer = null;
  document.addEventListener('mouseup', function (e) {
    var sel = window.getSelection();
    var text = sel ? sel.toString().trim() : '';
    if (!text || text.length > 30) return;
    var found = null;
    for (var k in whisperMap) {
      if (text.indexOf(k) !== -1) { found = whisperMap[k]; break; }
    }
    if (!found) return;
    whisperEl.textContent = found;
    var x = e.clientX + 14;
    var y = e.clientY - 32;
    if (x + 240 > window.innerWidth) x = window.innerWidth - 250;
    if (y < 10) y = e.clientY + 18;
    whisperEl.style.left = x + 'px';
    whisperEl.style.top = y + 'px';
    whisperEl.classList.add('show');
    clearTimeout(whisperTimer);
    whisperTimer = setTimeout(function () {
      whisperEl.classList.remove('show');
    }, 2800);
  });

  /* ===========================================================
   * 11. 【新】孔洞自查问卷弹窗
   * 故事性互动 + 收尾把读者推回现实
   * =========================================================== */
  var checkBtn = document.createElement('button');
  checkBtn.className = 'self-check-trigger';
  checkBtn.textContent = '· 孔洞自查问卷 ·';
  document.body.appendChild(checkBtn);
  setTimeout(function () { checkBtn.classList.add('ready'); }, 6500);

  var modalEl = document.createElement('div');
  modalEl.className = 'modal-overlay';
  modalEl.innerHTML = [
    '<div class="modal-box" role="dialog" aria-modal="true">',
    '  <h3>孔洞自查问卷 · v2026.05</h3>',
    '  <div class="sub">由【空间整理师·∞】整理 · 仅本人参考 · 您的答案不会被任何人看到</div>',
    '  <div class="q-item" data-q="q1">',
    '    <div class="q">1. 您当前是否独居？</div>',
    '    <div class="opts">',
    '      <button data-v="yes">是</button>',
    '      <button data-v="no">否</button>',
    '      <button data-v="not_yet">暂时不是</button>',
    '    </div>',
    '  </div>',
    '  <div class="q-item" data-q="q2">',
    '    <div class="q">2. 此刻，屋子里能听到几个人的呼吸声？</div>',
    '    <div class="opts">',
    '      <button data-v="1">1 个</button>',
    '      <button data-v="2">2 个</button>',
    '      <button data-v="more">多于 2 个</button>',
    '      <button data-v="0">0 个</button>',
    '    </div>',
    '  </div>',
    '  <div class="q-item" data-q="q3">',
    '    <div class="q">3. 您最近一次和家人通话，是几天前？</div>',
    '    <div class="opts">',
    '      <button data-v="today">今天</button>',
    '      <button data-v="week">一周内</button>',
    '      <button data-v="month">一个月内</button>',
    '      <button data-v="forget">记不清了</button>',
    '    </div>',
    '  </div>',
    '  <div class="q-item" data-q="q4">',
    '    <div class="q">4. 您此刻所在房间内，能数出几个圆形物体？</div>',
    '    <div class="opts">',
    '      <button data-v="0-3">0 ~ 3 个</button>',
    '      <button data-v="4-10">4 ~ 10 个</button>',
    '      <button data-v="11+">11 个以上</button>',
    '      <button data-v="too_many">数不过来</button>',
    '    </div>',
    '  </div>',
    '  <div class="q-item" data-q="q5">',
    '    <div class="q">5. 把这篇问卷读完之后，您打算做什么？</div>',
    '    <div class="opts">',
    '      <button data-v="eat">吃饭</button>',
    '      <button data-v="call">给家人打个电话</button>',
    '      <button data-v="sleep">睡觉</button>',
    '      <button data-v="look">再看一下那个圆点</button>',
    '    </div>',
    '  </div>',
    '  <div class="result" id="surveyResult"></div>',
    '  <div class="actions">',
    '    <button class="close-btn" data-action="close">关闭</button>',
    '    <button class="submit-btn" data-action="submit" disabled>提交问卷</button>',
    '  </div>',
    '</div>'
  ].join('\n');
  document.body.appendChild(modalEl);

  var answers = {};
  function updateSubmitBtn() {
    modalEl.querySelector('.submit-btn').disabled = Object.keys(answers).length < 5;
  }
  modalEl.querySelectorAll('.opts button').forEach(function (b) {
    b.addEventListener('click', function () {
      var qItem = b.closest('.q-item');
      qItem.querySelectorAll('.opts button').forEach(function (x) { x.classList.remove('picked'); });
      b.classList.add('picked');
      answers[qItem.dataset.q] = b.dataset.v;
      updateSubmitBtn();
    });
  });
  modalEl.querySelector('[data-action="close"]').addEventListener('click', function () {
    modalEl.classList.remove('open');
  });
  modalEl.addEventListener('click', function (e) {
    if (e.target === modalEl) modalEl.classList.remove('open');
  });
  modalEl.querySelector('[data-action="submit"]').addEventListener('click', function () {
    var resEl = modalEl.querySelector('#surveyResult');
    var result;
    // q5 决定结尾——每个分支都温柔地把读者推回现实
    if (answers.q5 === 'eat') {
      result = '<strong>评估完成。</strong><br/>建议：去吃饭。<br/><br/>"我饿了，给我煮个鸡蛋。"<br/>——这句话曾在 1998 年救过一个人。<br/><br/>请关闭此页面，去厨房。锅里也许真的有粥。';
    } else if (answers.q5 === 'call') {
      result = '<strong>评估完成。</strong><br/>建议：现在就打。<br/><br/>不是明天，不是"等我把这帖看完"——是现在。<br/><br/>那头的人也许会接，也许不会。但听筒里的声音是真的。它不是从墙里来的。';
    } else if (answers.q5 === 'sleep') {
      result = '<strong>评估完成。</strong><br/>建议：开一盏小灯睡。<br/><br/>不是因为黑里有东西，是因为半夜醒来时，那盏灯会提醒您——您还在自己家里。<br/><br/>这个论坛跑不掉的，明天再来也不迟。但您可以。';
    } else if (answers.q5 === 'look') {
      result = '<strong>评估完成。</strong><br/>建议：合上手机。站起来。走出这个房间。<br/><br/>它喜欢被注视。被注视的它会更温柔。<br/>越温柔，越像家。<br/><br/>所以请您现在——<strong>别看了</strong>。';
    } else {
      result = '<strong>评估完成。</strong><br/>请稍后再做一次。';
    }
    resEl.innerHTML = result;
    resEl.classList.add('show');
    state.surveyDone = true;
    saveState(state);
    var btn = modalEl.querySelector('.submit-btn');
    btn.textContent = '已记录';
    btn.disabled = true;
  });
  checkBtn.addEventListener('click', function () {
    modalEl.classList.add('open');
  });

  /* ===========================================================
   * 12. 【新】滞后跟随的观察者圆点
   * =========================================================== */
  var watcher = document.createElement('div');
  watcher.className = 'watcher-dot';
  document.body.appendChild(watcher);

  var mouseX = -100, mouseY = -100;
  var wX = -100, wY = -100;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  setTimeout(function () { watcher.classList.add('live'); }, 8000);

  function followLoop() {
    var dx = mouseX - wX;
    var dy = mouseY - wY;
    wX += dx * 0.020;
    wY += dy * 0.020;
    watcher.style.left = (wX - 2) + 'px';
    watcher.style.top = (wY + 28) + 'px';
    requestAnimationFrame(followLoop);
  }
  followLoop();

  /* ===========================================================
   * 13. 【新】已读主题标记
   * =========================================================== */
  document.querySelectorAll('.thread-row').forEach(function (row) {
    var link = row.querySelector('a[href*="thread-"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (state.visited.indexOf(href) !== -1) {
      row.classList.add('visited');
    }
  });

  /* ===========================================================
   * 14. 【新】全部读完触发"归位"态
   * =========================================================== */
  function maybeUnlockFinalState() {
    var required = [];
    for (var i = 1; i <= 9; i++) required.push('thread-' + i + '.html');
    var done = required.every(function (t) { return state.visited.indexOf(t) !== -1; });
    if (done && !state.inPosition) {
      state.inPosition = true;
      saveState(state);
      document.body.classList.add('in-position');
    }
  }
  if (state.inPosition) document.body.classList.add('in-position');

  /* ===========================================================
   * 15. 【新】"deep-mode" 极淡画面变化
   * =========================================================== */
  if ('IntersectionObserver' in window) {
    var deepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) document.body.classList.add('deep-mode');
      });
    });
    setTimeout(function () {
      var last = document.querySelector('.thread-card .reply:last-child');
      if (last) deepObserver.observe(last);
    }, 200);
  }

  /* ===========================================================
   * 16. 【新】三连 G 键彩蛋（"归"）
   * 主动给读者一个温柔的破壁结尾
   * =========================================================== */
  var gKeyCount = 0;
  var gKeyTimer = null;
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'g' && e.key !== 'G') return;
    // 在输入框里不响应
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    gKeyCount++;
    clearTimeout(gKeyTimer);
    gKeyTimer = setTimeout(function () { gKeyCount = 0; }, 1500);
    if (gKeyCount === 3) {
      gKeyCount = 0;
      var hint = document.createElement('div');
      hint.className = 'g-hint';
      hint.innerHTML =
        '您输入了三次"归"。<br/><br/>' +
        '但您不必现在回去。<br/>' +
        '外面也有锅，有粥，有人在等。<br/><br/>' +
        '<span style="color:#8a8278;font-size:0.84em;">—— 按任意键继续 ——</span>';
      document.body.appendChild(hint);
      requestAnimationFrame(function () { hint.classList.add('show'); });
      function dismiss() {
        hint.classList.remove('show');
        setTimeout(function () { hint.remove(); }, 700);
        document.removeEventListener('keydown', dismiss);
        document.removeEventListener('click', dismiss);
      }
      setTimeout(function () {
        document.addEventListener('keydown', dismiss);
        document.addEventListener('click', dismiss);
      }, 1000);
    }
  });

  /* ===========================================================
   * 17. 【新】页脚签名三连点 · 作者破壁话
   * =========================================================== */
  var smallSig = document.querySelector('footer.final .meta .small');
  if (smallSig) {
    var sigClicks = 0;
    smallSig.style.cursor = 'pointer';
    smallSig.addEventListener('click', function () {
      sigClicks++;
      if (sigClicks === 3) {
        smallSig.innerHTML =
          'JIANGCHENGBBS.COM · 2026 · by 芝士虾滑<br/>' +
          '<span style="color:#8a6f3a;display:inline-block;margin-top:6px;font-style:italic;">' +
          '谢谢您把这个故事读到这里。<br/>' +
          '它只是一篇小说。<br/>' +
          '但您注意到的那个圆点是真的——<br/>' +
          '请去看看它，然后忽视它。' +
          '</span>';
      }
    });
  }
})();
