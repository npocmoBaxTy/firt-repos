const todoInput = document.querySelector(".todo-input"),
    todoList = document.querySelector(".todolist-ul"),
    todoForm = document.querySelector(".todo-form"),
    completeList = document.querySelector('.completetodolist-ul');

const count = document.querySelector('.count-wrapper');

let todos = [];
if (!localStorage.getItem("todos")) {
    localStorage.setItem("todos", "[]");
}

if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
    renderTodos(todos);
}

function getTodos() {
    return JSON.parse(localStorage.getItem('todos'));
}

if (JSON.parse(localStorage.getItem("todos")).length === 0) {
    todoList.innerHTML = `
        <li class="notodo">
            <span>No todos. please add</span>
        </li>
        `;
}

function noTodos() {
    if (JSON.parse(localStorage.getItem("todos")).length === 0) {
        todoList.innerHTML = `
        <li class="notodo">
            <span>No todos. please add</span>
        </li>
        `;
    }
}

   count.innerHTML = `${todos.length}`;
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = {
        name: todoInput.value,
        complete: false,
    };

     if (!todo.name.trim()) {
            todoForm.reset()
            todoInput.focus();
            return;
        }
    
    todos.unshift(todo);
    count.innerHTML = `${todos.length}`;
    todoForm.reset();
    renderTodos(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
});

function todosHtml(todo, i) {
    todo.id = `item_${i}`;
    return `
		<li>
         <input type="checkbox" value="${i}" id='item_${i}' class="check" ${todo.complete ? "checked" : ""}>
         <input type="text" class="todolist-hidden" style="display:none" value="${todo.name}" data-id="item_${i}">
         <label for="item_${i}" data-id = item_${i} class="${todo.complete ? "active" : ""}">${todo.name}</label>
         <i class="fas fa-pencil-alt edit"></i>
         <button data-id="item_${i}" type="button" class="todolist-delete">x</button>
      </li>
		 `;
}

function renderTodos(arr) {
    let html = "";
    if (todos.length === 0)
        todoList.innerHTML = `
        <li class="notodo">
            <span>No todos. please add</span>
        </li>
        `;
    arr.forEach((todo, i) => {
        html += todosHtml(todo, i);
        todoList.innerHTML = html;
    });
}

todoList.addEventListener("click", (e) => {
    let id = e.target.getAttribute("id");
    if(e.target.closest(`.check`)){
    	let forLabel = todoList.querySelector(`[for='${id}']`);
    todos.forEach((todo, i) => {
        if (todo.name === forLabel.innerHTML) {
            todo.complete = !todo.complete;
            forLabel.classList.toggle("active");
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    }
});


todoList.addEventListener("click", (e) => {
    if (e.target.closest(".todolist-delete")) {
        todos.forEach((todo, i) => {
            if (todo.name === e.target.previousElementSibling.previousElementSibling.innerHTML) {
                todos.splice(i, 1);
                count.innerHTML = `${todos.length}`;
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos(todos)
    }
});


todoList.addEventListener('click',(e)=> {
	if(e.target.closest('.edit')) {
		const hiddenInput = e.target.previousElementSibling.previousElementSibling;
		const label = e.target.previousElementSibling;
		hiddenInput.style.display = 'block';
		label.style.display = 'none';
		hiddenInput.focus();
        hiddenInput.addEventListener('keyup',(e)=> {
            if(e.keyCode === 13) {
                label.innerHTML = e.target.value;
                hiddenInput.style.display = 'none';
                label.style.display = 'block';
                const todos = getTodos();
                todos.forEach(todo=> {
                if(e.target.dataset.id === todo.id) {
                    todo.name = e.target.value;
                    localStorage.setItem('todos',JSON.stringify(todos));
                }
            })
            }
        });
		e.target.style.opacity = 0;
	}
})


todoList.addEventListener('blur',(e)=> {
	if(e.target.closest('.todolist-hidden')) {
		const label = e.target.nextElementSibling;
		const edit = e.target.nextElementSibling.nextElementSibling;

		label.style.display = 'block';
		e.target.style.display = 'none';
		edit.style.opacity = 1;

	}
},{capture: true})


const clearBtn = document.querySelector('.clear_btn');

clearBtn.addEventListener('click',(e)=> {
	localStorage.setItem('todos','[]');
	todos.length = 0;
	todoList.innerHTML = `
	<li class="notodo">
	   <span>No todos. please add</span>
   </li>
	`
	count.innerHTML = `${todos.length}`;
})


const completeLink = document.querySelector('#complete'),
		uncompleteLink = document.querySelector('#Uncompleted'),
		all = document.querySelector('#all');

completeLink.addEventListener('click',(e)=> {
	e.preventDefault();
    const todos = getTodos().filter(todo=> todo.complete);
    renderTodos(todos);
    count.innerHTML = todos.length
})

all.addEventListener('click',(e)=> {
	e.preventDefault();
	renderTodos(todos);
	count.innerHTML = getTodos().length;
});

uncompleteLink.addEventListener('click',(e)=> {
	e.preventDefault();
    const todos = getTodos().filter(todo=>!todo.complete);
    renderTodos(todos);
    count.innerHTML = todos.length

})