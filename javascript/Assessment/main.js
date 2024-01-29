
const todoInput = document.querySelector('#todo-item-input');
const localStorageKey = 'my-todo-list';
let todoItemArr = [];
let todoItemObj = {};



function renderingTodoList() {
    const todoListContainer = document.querySelector('#todo-list');
    todoListContainer.innerHTML = '';

    todoItemArr.forEach((todo, idx) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        const currTodoItem = todoItemArr[idx];

        if (currTodoItem) {
            if (todo.editing) {
                //編輯模式
                todoItem.innerHTML = editingMode(todo, idx);
                const storeTodoBtn = todoItem.querySelector('.btn-store');
                const deleteTodoBtn = todoItem.querySelector('.btn-delete');
                deleteTodoBtn.onclick = () => {
                    deleteTodo(idx);
                };
                storeTodoBtn.onclick = () => {
                    storeTodo(idx);
                };
            } else {
                //儲存模式
                todoItem.innerHTML = storingMode(todo, idx);
                const editTodoBtn = todoItem.querySelector('.btn-edit');
                const deleteTodoBtn = todoItem.querySelector('.btn-delete');
                deleteTodoBtn.onclick = () => {
                    deleteTodo(idx);
                };
                editTodoBtn.onclick = () => {
                    editTodo(idx);
                };
            }
            //completed監聽事件
            const checkbox = todoItem.querySelector(`#check${idx}`);
            checkbox.onclick = () => {
                checkStateChange(idx);
            }
        }
        todoListContainer.appendChild(todoItem);
    })
}
function checkStateChange(idx) {
    todoItemArr[idx].completed = !todoItemArr[idx].completed;
    // console.log(todoItemArr[idx].completed)
    resetStorage();
}
//刪除 todoItem
function deleteTodo(idx) {
    todoItemArr.splice(idx, 1);
    resetStorage();
    renderingTodoList();
};
//編輯 todoItem
function editTodo(idx) {
    todoItemArr[idx].editing = true;
    renderingTodoList();
};
//儲存 todoItem
function storeTodo(idx) {
    const editedTodoItem = document.querySelector(`#todo-edit${idx}`)
    // console.log(editedTodoItem);
    const editedTodoContent = editedTodoItem.value;
    todoItemArr[idx].content = editedTodoContent;
    todoItemArr[idx].editing = false;
    resetStorage();
    renderingTodoList();
}
// todoItem 編輯模式
function editingMode(todo, index) {
    return `
        <div class="check-area border border-1  border-dark-subtle bg-secondary-subtle">
            <input class="check-input" type="checkbox" id="check${index}" ${todo.completed ? "checked" : ""}>
        </div>
        <textarea class="todo-edit border border-1 border-dark-subtle fs-5" id="todo-edit${index}" rows="1">${todo.content}</textarea>
        <div class="btns">
            <button class="btn btn-store btn-success">儲存</button>
            <button class="btn btn-delete btn-danger">刪除</button>
        </div>
        `;
}
// todoItem 儲存模式
function storingMode(todo, index) {
    return `
        <div class="check-area border border-1  border-dark-subtle bg-secondary-subtle">
            <input class="check-input" type="checkbox" id="check${index}" ${todo.completed ? "checked" : ""}>
        </div>
        <textarea class="todo-edit bg-secondary-subtle border border-1 border-dark-subtle fs-5" id="todo-edit${index}" rows="1" disabled>${todo.content}</textarea>
        <div class="btns">
            <button class="btn btn-edit btn-warning">編輯</button>
            <button class="btn btn-delete btn-danger">刪除</button>
        </div>
        `;
}
//更新 localStorage
function resetStorage() {
    const jsonStr = JSON.stringify(todoItemArr);
    localStorage.setItem(localStorageKey, jsonStr);
};
//更新 todo 陣列並更新 localStorage
function setTodoToStorage(contentObj) {
    //如果沒有陣列,新增一個陣列
    if (!Array.isArray(todoItemArr)) {
        todoItemArr = [];
    };
    //更新 todo 陣列
    todoItemArr.push(contentObj);
    //更新 localStorage
    resetStorage();
};
//取得 localStorage 資料並放入 todo 陣列
function getTodoFromStorage() {
    const todoArr = JSON.parse(localStorage.getItem(localStorageKey));
    if (todoArr) {
        todoItemArr = todoArr;
    };
};
//新增 todo
function createTodo() {
    const todoContent = todoInput.value.trim();
    if (todoContent === "") {
        return;
    };
    const newTodo = {
        content: todoContent,
        completed: false,
        editing: false,
    }
    setTodoToStorage(newTodo);
    renderingTodoList();
    todoInput.value = '';
}