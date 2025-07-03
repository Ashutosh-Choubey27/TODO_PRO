const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const API_URL = "http://localhost:5000/api/todos";

function renderTodo(todo) {
  const li = document.createElement('li');
  li.classList.add('todo-item');

  // ✅ Create a custom complete button
  const completeBtn = document.createElement('span');
  completeBtn.classList.add('checkmark');
  if (todo.completed) completeBtn.classList.add('active');

  // 📝 Title of the task
  const span = document.createElement('span');
  span.textContent = todo.title;
  span.classList.add('task-title');
  if (todo.completed) span.classList.add('completed');

  // delete icon logic
 const deleteIcon = document.createElement('img');
  deleteIcon.src = 'images/deleteicon.webp'; // 👈 make sure file exists
  deleteIcon.alt = 'Delete';
  deleteIcon.classList.add('delete-btn');

  deleteIcon.addEventListener('click', () => {
    fetch(`${API_URL}/${todo._id}`, {
      method: 'DELETE'
    }).then(() => {
      li.remove();
    });
  });

  // edit button logic

  // ✏️ Edit icon
const editIcon = document.createElement('img');
editIcon.src = 'images/edit_button.png'; // ✅ apna path sahi dena
editIcon.classList.add('edit-icon');

// Edit functionality
editIcon.addEventListener('click', () => {
  console.log("edit button clicked");
  const input = document.createElement('input');
  input.type = 'text';
  input.value = todo.title;
  input.classList.add('edit-input');

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.classList.add('save-btn');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.classList.add('cancel-btn');

  li.innerHTML = ''; // old elements hatao
  li.appendChild(input);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);

  saveBtn.addEventListener('click', () => {
    const updatedTitle = input.value.trim();
    if (updatedTitle !== '') {
      fetch(`${API_URL}/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updatedTitle, 
                               completed : todo.completed 
                            })
                          }).then(() => {
                            
        todo.title = updatedTitle;
        li.innerHTML = ''; // clean up


    // code just added
    li.appendChild(completeBtn);
    span.textContent = updatedTitle;
    li.appendChild(span);
    li.appendChild(editIcon);
    li.appendChild(deleteIcon);
      });
    }
  });

  cancelBtn.addEventListener('click', () => {
    li.innerHTML = '';
    renderTodo(todo); // wapas original UI
  });
});

  // ✅ Toggle completed
  completeBtn.addEventListener('click', () => {
    fetch(`${API_URL}/${todo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    }).then(() => {
      completeBtn.classList.toggle('active');
      span.classList.toggle('completed');
      todo.completed = !todo.completed; // Update state locally
    });
  });

  // ❌ Right-click to delete
  li.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    fetch(`${API_URL}/${todo._id}`, {
      method: 'DELETE'
    }).then(() => {
      li.remove();
    });
  });


  li.appendChild(completeBtn);
  li.appendChild(span);
  taskList.appendChild(li);
  li.appendChild(editIcon);
  li.appendChild(deleteIcon);

};





// 🟢 On page load
window.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(todos => todos.forEach(renderTodo))
    .catch(err => console.error("Failed to fetch todos", err));
});

// 🟢 Add new todo
addBtn.addEventListener('click', () => {
   console.log("Add button clicked ✅");
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskText })
    })
      .then(res => res.json())
      .then(newTodo => {
        renderTodo(newTodo);
        taskInput.value = '';
      })
      .catch(err => console.error("Failed to add todo", err));
  }
});

// 🌙 DARK MODE TOGGLE
const themeSwitch = document.getElementById('themeSwitch');
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSwitch.checked);
});

// 🧹 FILTERS FUNCTIONALITY
const allBtn = document.getElementById('allBtn');
const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

function setActiveButton(button) {
  filterBtns.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function filterTasks(type) {
  const tasks = document.querySelectorAll('.todo-item');
  tasks.forEach(task => {
    const isCompleted = task.querySelector('.task-title').classList.contains('completed');

    if (
      type === 'all' ||
      (type === 'active' && !isCompleted) ||
      (type === 'completed' && isCompleted)
    ) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
}

allBtn.addEventListener('click', () => {
  setActiveButton(allBtn);
  filterTasks('all');
});
activeBtn.addEventListener('click', () => {
  setActiveButton(activeBtn);
  filterTasks('active');
});
completedBtn.addEventListener('click', () => {
  setActiveButton(completedBtn);
  filterTasks('completed');
});


const themeswitch = document.getElementById('themeSwitch');
const themeTransition = document.getElementById('themeTransition');
const sunImg = document.querySelector('.sun-img');
const moonImg = document.querySelector('.moon-img');

// 🌀 Animate theme switch
function animateThemeSwitch() {
  const isDark = document.body.classList.contains('dark');
  themeTransition.style.setProperty('--transition-color', isDark ? '#f2f2f2' : '#1a1a1a');
  themeTransition.style.clipPath = 'circle(200% at 0 50%)';

  
  setTimeout(() => {
    themeTransition.style.clipPath = 'circle(0% at 0% 0%)';
  }, 300);
}

// 🌗 Listen to checkbox toggle
themeswitch.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  animateThemeSwitch();

  // 🖼️ Update image visibility
  if (themeswitch.checked) {
    sunImg.style.display = 'none';
    moonImg.style.display = 'inline';
  } else {
    sunImg.style.display = 'inline';
    moonImg.style.display = 'none';
  }
});

// 🚀 Initial state set (to show only sun by default)
sunImg.style.display = 'inline';
moonImg.style.display = 'none';







