// 儲存代辦事項資料
let todos = [];
let selectedTag = '';

// 選擇顏色按鈕（建立時）
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTag = btn.dataset.color;
    });
});

// 新增代辦事項
function addTodo() {
    const todoText = document.getElementById('newTodo').value.trim();

    if (todoText === '') {
        alert('請輸入待辦事項');
        return;
    }

    const todo = {
        text: todoText,
        timestamp: new Date(),
        length: todoText.length,
        pinned: false,
        done: false,
        tag: selectedTag
    };

    todos.push(todo);
    renderTodos();
    document.getElementById('newTodo').value = '';
    selectedTag = '';
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
}

// 按下 Enter 也能新增
function checkEnter(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}

function removeTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

function pinTodo(index) {
    todos[index].pinned = !todos[index].pinned;
    renderTodos();
}

function toggleDone(index) {
    todos[index].done = !todos[index].done;
    renderTodos();
}

function changeTag(index, newColor) {
    todos[index].tag = newColor;
    renderTodos();
}

function sortTodos() {
    renderTodos();
}

function renderTodos() {
    document.getElementById('pinnedList').innerHTML = '<h2>📌 已釘選</h2>';
    document.getElementById('activeList').innerHTML = '<h2>📝 未完成</h2>';
    document.getElementById('completedList').innerHTML = '<h2>✅ 已完成</h2>';

    const todosWithIndex = todos.map((todo, index) => ({ ...todo, index }));
    const pinned = todosWithIndex.filter(t => t.pinned);
    const active = todosWithIndex.filter(t => !t.pinned && !t.done);
    const completed = todosWithIndex.filter(t => !t.pinned && t.done);

    const sortOption = document.getElementById('sortOptions').value;
    const sortFn = (a, b) => {
        if (sortOption === 'alphabetical') return a.text.localeCompare(b.text);
        if (sortOption === 'time') return a.timestamp - b.timestamp;
        if (sortOption === 'length') return a.length - b.length;
        return 0;
    };
    active.sort(sortFn);
    completed.sort(sortFn);

    [...pinned, ...active, ...completed].forEach(todo => {
        const li = document.createElement('div');
        li.className = `todo-item ${todo.tag || ''}`;

        const checkbox = `<input type="checkbox" onchange="toggleDone(${todo.index})" ${todo.done ? 'checked' : ''}>`;
        const deleteBtn = `<button class="delete-btn" onclick="removeTodo(${todo.index})">刪除</button>`;
        const pinBtn = `<button class="pin-button ${todo.pinned ? 'active' : ''}" onclick="pinTodo(${todo.index})">📌</button>`;
        const textSpan = `<span style="${todo.done ? 'text-decoration: line-through;' : ''}">${todo.text}</span>`;

        const tagDot = document.createElement('span');
        tagDot.className = `tag-dot ${todo.tag || ''}`;
        tagDot.onclick = () => {
            const existing = document.querySelector('.tag-picker');
            if (existing) existing.remove();

            const picker = document.createElement('div');
            picker.className = 'tag-picker';
            ['red','blue','green','yellow','purple',''].forEach(color => {
                const btn = document.createElement('button');
                btn.className = `color-btn ${color}`;
                btn.style.width = '14px';
                btn.style.height = '14px';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    changeTag(todo.index, color);
                    picker.remove();
                };
                picker.appendChild(btn);
            });
            tagDot.appendChild(picker);
        };

        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-left';
        leftDiv.appendChild(document.createRange().createContextualFragment(checkbox));
        leftDiv.appendChild(tagDot);
        leftDiv.appendChild(document.createRange().createContextualFragment(textSpan));

        const rightDiv = document.createElement('div');
        rightDiv.className = 'todo-right';
        rightDiv.innerHTML = deleteBtn + pinBtn;

        li.appendChild(leftDiv);
        li.appendChild(rightDiv);

        const containerId = todo.pinned
            ? 'pinnedList'
            : todo.done
                ? 'completedList'
                : 'activeList';

        document.getElementById(containerId).appendChild(li);
    });
}

document.addEventListener('click', e => {
    const openPicker = document.querySelector('.tag-picker');
    if (openPicker && !openPicker.contains(e.target)) {
        openPicker.remove();
    }
});
