document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');
    const appContainer = document.getElementById('app-container');
    let channelCount = 0;

    const root = document.documentElement;
    const defaultTheme = {
        bg: '#121212', card: '#2d2d2d', font: '#ffffff', hl1: '#4da6ff', hl2: '#ff4d4d'
    };

    const colorBg = document.getElementById('color-bg');
    const colorCard = document.getElementById('color-card');
    const colorFont = document.getElementById('color-font');
    const colorHl1 = document.getElementById('color-hl1');
    const colorHl2 = document.getElementById('color-hl2');

    function applyTheme(theme) {
        root.style.setProperty('--bg-color', theme.bg);
        root.style.setProperty('--card-color', theme.card);
        root.style.setProperty('--font-color', theme.font);
        root.style.setProperty('--hl1-color', theme.hl1);
        root.style.setProperty('--hl2-color', theme.hl2);
        
        colorBg.value = theme.bg;
        colorCard.value = theme.card;
        colorFont.value = theme.font;
        colorHl1.value = theme.hl1;
        colorHl2.value = theme.hl2;
    }

    function saveTheme() {
        const theme = {
            bg: colorBg.value, card: colorCard.value, font: colorFont.value, hl1: colorHl1.value, hl2: colorHl2.value
        };
        applyTheme(theme);
        localStorage.setItem('modularTimerTheme', JSON.stringify(theme));
    }

    const savedTheme = JSON.parse(localStorage.getItem('modularTimerTheme')) || defaultTheme;
    applyTheme(savedTheme);

    [colorBg, colorCard, colorFont, colorHl1, colorHl2].forEach(input => {
        input.addEventListener('input', saveTheme);
    });

    document.getElementById('reset-theme-btn').addEventListener('click', () => {
        applyTheme(defaultTheme);
        localStorage.removeItem('modularTimerTheme');
    });

    const modal = document.getElementById('settings-modal');
    document.getElementById('settings-btn').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();

    let currentMelody = 'm1';
    let currentWaveform = 'square';
    const volumeSlider = document.getElementById('volume-slider');
    
    const melodyBtns = document.querySelectorAll('.melody-btn');
    melodyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            melodyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMelody = btn.dataset.melody;
        });
    });

    const waveBtns = document.querySelectorAll('.wave-btn');
    waveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            waveBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWaveform = btn.dataset.wave;
        });
    });

    const melodies = {
        m1: [ { f: 523.25, d: 0.08 }, { f: 659.25, d: 0.08 }, { f: 783.99, d: 0.18 } ],
        m2: [ { f: 440.00, d: 0.07 }, { f: 554.37, d: 0.07 }, { f: 659.25, d: 0.07 }, { f: 880.00, d: 0.22 } ],
        m3: [ { f: 587.33, d: 0.12 }, { f: 493.88, d: 0.18 } ],
        m4: [ { f: 659.25, d: 0.10 }, { f: 0, d: 0.05 }, { f: 659.25, d: 0.10 } ],
        m5: [ { f: 440.00, d: 0.09 }, { f: 523.25, d: 0.12 } ],
        m6: [ { f: 784.00, d: 0.06 }, { f: 659.25, d: 0.06 }, { f: 784.00, d: 0.18 } ],
        m7: [ { f: 392.00, d: 0.06 }, { f: 523.25, d: 0.06 }, { f: 659.25, d: 0.06 }, { f: 1046.50, d: 0.16 } ],
        m8: [ { f: 523.25, d: 0.08 }, { f: 783.99, d: 0.16 } ],
        m9: [ { f: 783.99, d: 0.08 }, { f: 523.25, d: 0.16 } ],
        m10: [ { f: 900.00, d: 0.025 } ]
    };

    function playSound() {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const vol = volumeSlider.value / 100;
        if(vol === 0) return;

        const melody = melodies[currentMelody];
        let startTime = audioCtx.currentTime;

        melody.forEach(note => {
            if (note.f > 0) {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = currentWaveform;
                osc.frequency.value = note.f;
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(vol * 0.5, startTime + 0.01);
                gain.gain.setValueAtTime(vol * 0.5, startTime + note.d - 0.01);
                gain.gain.linearRampToValueAtTime(0, startTime + note.d);
                
                osc.start(startTime);
                osc.stop(startTime + note.d);
            }
            startTime += note.d;
        });
    }

    document.getElementById('add-hms-btn').addEventListener('click', () => createHMSCard(++channelCount));
    document.getElementById('add-sec-btn').addEventListener('click', () => createSecCard(++channelCount));
    document.getElementById('add-sw-btn').addEventListener('click', () => createSWCard(++channelCount));

    function createHMSCard(id) {
        const card = document.createElement('div');
        card.className = 'timer-channel';
        card.id = `channel-${id}`;
        card.innerHTML = `
            <div class="channel-header">
                <input type="text" class="channel-name" value="00:00" title="이름 수정">
                <div class="header-icons hide-in-pip">
                    <button class="icon-btn sound-btn" title="알림음 켜기/끄기"><span class="material-symbols-outlined">notifications_off</span></button>
                    <button class="icon-btn loop-btn" title="반복 설정"><span class="material-symbols-outlined">autorenew</span></button>
                </div>
            </div>
            <div class="time-setting">
                <input type="number" class="time-input small input-hh" value="00" min="0" max="99">
                <span class="colon">:</span>
                <input type="number" class="time-input small input-mm" value="00" min="0" max="59">
                <span class="colon">:</span>
                <input type="number" class="time-input small input-ss" value="00" min="0" max="59">
            </div>
            <div class="control-panel">
                <button class="icon-btn rewind-btn" title="상태 유지 초기화"><span class="material-symbols-outlined">fast_rewind</span></button>
                <button class="icon-btn play-btn" title="시작/일시정지"><span class="material-symbols-outlined">play_arrow</span></button>
                <button class="icon-btn stop-btn hide-in-pip" title="정지 및 설정 수정"><span class="material-symbols-outlined">stop</span></button>
                <button class="icon-btn delete-btn hide-in-pip" title="카드 삭제"><span class="material-symbols-outlined">delete</span></button>
            </div>
        `;
        cardsContainer.appendChild(card);
        bindTimerEvents(card, 'hms');
    }

    function createSecCard(id) {
        const card = document.createElement('div');
        card.className = 'timer-channel';
        card.id = `channel-${id}`;
        card.innerHTML = `
            <div class="channel-header">
                <input type="text" class="channel-name" value="0s" title="이름 수정">
                <div class="header-icons hide-in-pip">
                    <button class="icon-btn sound-btn" title="알림음 켜기/끄기"><span class="material-symbols-outlined">notifications_off</span></button>
                    <button class="icon-btn loop-btn" title="반복 설정"><span class="material-symbols-outlined">autorenew</span></button>
                </div>
            </div>
            <div class="time-setting">
                <input type="number" class="time-input large input-ss" value="0" min="0" max="99999">
            </div>
            <div class="control-panel">
                <button class="icon-btn rewind-btn" title="상태 유지 초기화"><span class="material-symbols-outlined">fast_rewind</span></button>
                <button class="icon-btn play-btn" title="시작/일시정지"><span class="material-symbols-outlined">play_arrow</span></button>
                <button class="icon-btn stop-btn hide-in-pip" title="정지 및 설정 수정"><span class="material-symbols-outlined">stop</span></button>
                <button class="icon-btn delete-btn hide-in-pip" title="카드 삭제"><span class="material-symbols-outlined">delete</span></button>
            </div>
        `;
        cardsContainer.appendChild(card);
        bindTimerEvents(card, 'sec');
    }

    function bindTimerEvents(card, type) {
        const inputs = card.querySelectorAll('.time-input');
        const channelName = card.querySelector('.channel-name');
        const playBtn = card.querySelector('.play-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const rewindBtn = card.querySelector('.rewind-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const loopBtn = card.querySelector('.loop-btn');
        const soundBtn = card.querySelector('.sound-btn');
        const playIcon = playBtn.querySelector('.material-symbols-outlined');
        const soundIcon = soundBtn.querySelector('.material-symbols-outlined');

        let isRunning = false, isAlarming = false;
        let totalSeconds = 0, initialSeconds = 0, timerInterval = null;
        let soundEnabled = false, userTitleEdited = false; 

        channelName.addEventListener('input', () => userTitleEdited = true);

        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            soundBtn.classList.toggle('active', soundEnabled);
            soundIcon.innerText = soundEnabled ? 'notifications_active' : 'notifications_off';
        });

        function updateTitle() {
            if (userTitleEdited) return; 
            if (type === 'hms') {
                const h = parseInt(card.querySelector('.input-hh').value) || 0;
                const m = parseInt(card.querySelector('.input-mm').value) || 0;
                const s = parseInt(card.querySelector('.input-ss').value) || 0;
                let titleStr = h > 0 ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                if (h === 0 && m === 0 && s === 0) titleStr = "00:00";
                channelName.value = titleStr;
            } else {
                const s = parseInt(card.querySelector('.input-ss').value) || 0;
                channelName.value = `${s}s`;
            }
        }

        inputs.forEach(input => {
            input.addEventListener('focus', function() { this.select(); });
            input.addEventListener('wheel', function(e) {
                if(isRunning || isAlarming) return;
                e.preventDefault();
                let val = parseInt(this.value) || 0;
                const max = parseInt(this.getAttribute('max'));
                if (type === 'hms') {
                    if (e.deltaY < 0) { val = val >= max ? 0 : val + 1; } else { val = val <= 0 ? max : val - 1; }
                    this.value = val.toString().padStart(2, '0');
                } else {
                    if (e.deltaY < 0) val++; else val = val <= 0 ? 0 : val - 1;
                    this.value = val;
                }
                updateTitle();
            });
            input.addEventListener('change', function() {
                let val = parseInt(this.value) || 0;
                if (val < 0) val = 0;
                this.value = type === 'hms' ? val.toString().padStart(2, '0') : val;
                updateTitle();
            });
        });

        function updateInputUI(seconds) {
            if (type === 'hms') {
                card.querySelector('.input-hh').value = Math.floor(seconds / 3600).toString().padStart(2, '0');
                card.querySelector('.input-mm').value = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                card.querySelector('.input-ss').value = (seconds % 60).toString().padStart(2, '0');
            } else {
                card.querySelector('.input-ss').value = seconds;
            }
        }

        function clearAlarm() {
            isAlarming = false;
            card.classList.remove('is-alarming', 'is-active');
            playIcon.innerText = "play_arrow";
            playBtn.style.color = "";
            updateInputUI(initialSeconds); 
        }

        function triggerComplete() {
            if (soundEnabled) playSound();
            if(loopBtn.classList.contains('active')) {
                totalSeconds = initialSeconds;
                updateInputUI(totalSeconds);
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                isAlarming = true;
                card.classList.add('is-alarming');
                playIcon.innerText = "play_arrow";
                playBtn.style.color = "";
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isAlarming) clearAlarm();
            if (!isRunning) {
                if (type === 'hms') {
                    totalSeconds = (parseInt(card.querySelector('.input-hh').value) || 0) * 3600 + (parseInt(card.querySelector('.input-mm').value) || 0) * 60 + (parseInt(card.querySelector('.input-ss').value) || 0);
                } else {
                    totalSeconds = parseInt(card.querySelector('.input-ss').value) || 0;
                }
                if(totalSeconds > 0) initialSeconds = totalSeconds;
                if(totalSeconds === 0) return;
            }
            isRunning = !isRunning;
            if (isRunning) {
                card.classList.add('is-active');
                playIcon.innerText = "pause";
                playBtn.style.color = "var(--hl1-color)";
                timerInterval = setInterval(() => {
                    if(totalSeconds > 0) {
                        totalSeconds--;
                        updateInputUI(totalSeconds);
                        if(totalSeconds === 0) triggerComplete();
                    }
                }, 1000);
            } else {
                clearInterval(timerInterval);
                playIcon.innerText = "play_arrow";
                playBtn.style.color = "";
            }
        });

        stopBtn.addEventListener('click', (e) => { e.stopPropagation(); clearInterval(timerInterval); isRunning = false; totalSeconds = 0; clearAlarm(); });
        rewindBtn.addEventListener('click', (e) => { e.stopPropagation(); if (isAlarming) clearAlarm(); if (initialSeconds > 0) { totalSeconds = initialSeconds; updateInputUI(totalSeconds); } });
        deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); clearInterval(timerInterval); card.remove(); });
        loopBtn.addEventListener('click', function(e) { e.stopPropagation(); this.classList.toggle('active'); if (isAlarming && this.classList.contains('active')) { clearAlarm(); playBtn.click(); } });
        card.addEventListener('click', () => { if (isAlarming) clearAlarm(); });
    }

    function createSWCard(id) {
        const card = document.createElement('div');
        card.className = 'timer-channel';
        card.id = `channel-${id}`;
        card.innerHTML = `
            <div class="channel-header">
                <input type="text" class="channel-name" value="Stopwatch #${id}" title="이름 수정">
                <div class="header-icons hide-in-pip"></div>
            </div>
            <div class="time-display-wrapper">
                <div class="sw-display">00:00:00</div>
                <div class="sw-ms">.00</div>
            </div>
            <div class="control-panel">
                <button class="icon-btn play-btn" title="시작/일시정지"><span class="material-symbols-outlined">play_arrow</span></button>
                <button class="icon-btn stop-btn hide-in-pip" title="정지 및 초기화"><span class="material-symbols-outlined">stop</span></button>
                <button class="icon-btn delete-btn hide-in-pip" title="카드 삭제"><span class="material-symbols-outlined">delete</span></button>
            </div>
        `;
        cardsContainer.appendChild(card);
        bindSWCardEvents(card);
    }

    function bindSWCardEvents(card) {
        const playBtn = card.querySelector('.play-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const playIcon = playBtn.querySelector('.material-symbols-outlined');
        const display = card.querySelector('.sw-display');
        const displayMs = card.querySelector('.sw-ms');

        let isRunning = false, startTime = 0, elapsedBeforePause = 0, swInterval = null;

        function updateSW() {
            const now = Date.now();
            const totalMs = elapsedBeforePause + (isRunning ? (now - startTime) : 0);
            const ms = Math.floor((totalMs % 1000) / 10);
            const totalS = Math.floor(totalMs / 1000);
            const h = Math.floor(totalS / 3600);
            const m = Math.floor((totalS % 3600) / 60);
            const s = totalS % 60;
            display.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            displayMs.innerText = `.${ms.toString().padStart(2, '0')}`;
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isRunning = !isRunning;
            if (isRunning) {
                card.classList.add('is-active');
                playIcon.innerText = "pause";
                playBtn.style.color = "var(--hl1-color)";
                startTime = Date.now();
                swInterval = setInterval(updateSW, 10);
            } else {
                clearInterval(swInterval);
                elapsedBeforePause += Date.now() - startTime;
                playIcon.innerText = "play_arrow";
                playBtn.style.color = "";
                updateSW();
            }
        });

        stopBtn.addEventListener('click', (e) => { e.stopPropagation(); clearInterval(swInterval); isRunning = false; elapsedBeforePause = 0; card.classList.remove('is-active'); playIcon.innerText = "play_arrow"; playBtn.style.color = ""; display.innerText = "00:00:00"; displayMs.innerText = ".00"; });
        deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); clearInterval(swInterval); card.remove(); });
    }

    const pipBtn = document.getElementById('pip-btn');
    if ('documentPictureInPicture' in window) {
        pipBtn.addEventListener('click', async () => {
            const activeCount = document.querySelectorAll('.timer-channel.is-active, .timer-channel.is-alarming').length;
            if (activeCount === 0) { alert("현재 실행 중인 모듈이 없습니다."); return; }
            
            try {
                const reqWidth = 260;
                const reqHeight = (activeCount * 75);

                const pipWindow = await documentPictureInPicture.requestWindow({ width: reqWidth, height: reqHeight });
                
                try { pipWindow.resizeTo(reqWidth, reqHeight); } 
                catch (e) {  }

                pipWindow.document.documentElement.style.cssText = document.documentElement.style.cssText;
                pipWindow.document.body.style.backgroundColor = root.style.getPropertyValue('--bg-color') || '#121212';
                pipWindow.document.body.style.margin = "0";
                
                pipWindow.document.body.classList.add('pip-active');
                document.body.classList.add('pip-active');
                appContainer.classList.add('pip-active');
                pipWindow.document.body.appendChild(appContainer);

                Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).forEach(node => {
                    pipWindow.document.head.appendChild(node.cloneNode(true));
                });

                pipWindow.addEventListener('pagehide', () => {
                    document.body.classList.remove('pip-active');
                    appContainer.classList.remove('pip-active');
                    document.body.appendChild(appContainer);
                });
            } catch (error) { console.error("PIP Error:", error); }
        });
    } else {
        document.querySelector('.pip-wrapper').style.display = "none";
    }
});