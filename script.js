document.addEventListener('DOMContentLoaded', () => {
    // 1. Entry Handling
    const welcome = document.getElementById('welcome-screen');
    const app = document.getElementById('app-wrapper');
    const entryBtn = document.getElementById('entry-btn');

    entryBtn.addEventListener('click', () => {
        welcome.classList.add('fade-out');
        app.classList.remove('app-hidden');
    });

    // 2. Tab Navigation (Strict)
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // Cleanup current state
            navBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Set new state
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 3. JEE Countdown
    const targetDate = new Date("Jan 21, 2026 09:00:00").getTime();
    function updateCountdown() {
        const diff = targetDate - new Date().getTime();
        if (diff <= 0) return;
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerText = `${d}:${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. Pomodoro Logic
    let timer = null, timeLeft = 1500;
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const display = document.getElementById('timer-display');

    startBtn.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
            startBtn.innerText = "Resume";
        } else {
            startBtn.innerText = "Pause";
            timer = setInterval(() => {
                timeLeft--;
                const m = Math.floor(timeLeft / 60);
                const s = timeLeft % 60;
                display.innerText = `${m}:${s < 10 ? '0' + s : s}`;
                if (timeLeft <= 0) clearInterval(timer);
            }, 1000);
        }
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timer);
        timer = null;
        timeLeft = 1500;
        display.innerText = "25:00";
        startBtn.innerText = "Start";
    });

    // 5. Todo Management
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-task-btn');
    const list = document.getElementById('todo-list');
    const progress = document.getElementById('progress-percent');
    let tasks = [];

    addBtn.addEventListener('click', () => {
        if (!input.value.trim()) return;
        tasks.push({ text: input.value, done: false });
        input.value = "";
        renderTasks();
    });

    function renderTasks() {
        list.innerHTML = "";
        tasks.forEach((t, i) => {
            const item = document.createElement('div');
            item.className = 'todo-item';
            item.innerHTML = `
                <input type="checkbox" ${t.done ? 'checked' : ''}>
                <span style="${t.done ? 'text-decoration:line-through;opacity:0.5' : ''}">${t.text}</span>
            `;
            item.querySelector('input').addEventListener('change', () => {
                tasks[i].done = !tasks[i].done;
                renderTasks();
            });
            list.appendChild(item);
        });
        const done = tasks.filter(t => t.done).length;
        progress.innerText = tasks.length ? Math.round((done / tasks.length) * 100) + "%" : "0%";
    }
});
