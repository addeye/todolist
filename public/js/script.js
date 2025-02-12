const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

console.log("running");

function saveToLocal(todos){
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFromLocal(){
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function animateAdd(li){
    li.classList.add("added");
    setTimeout(() => li.classList.remove("added"), 300);
}

function animateRemove(li){
    li.classList.add("removed");
    setTimeout(() => li.remove(), 300);
}

// mengambil dari server
async function fetchTodos() {
  const res = await fetch("/todos");
  const todos = await res.json();

  saveToLocal(todos);
  renderTodos(todos);
}

function renderTodos(todos){
    list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
                <span>
                    <input type="checkbox" ${
                  todo.completed ? "checked" : ""
                } onclick="toggleTodo('${todo._id}', ${!todo.completed})">
                <span>${todo.title}</span>
                </span>
                <span>
                    <button onclick="editTodo('${todo._id}', '${todo.title}')">✏️</button>
                    <button onclick="deleteTodo('${todo._id}', this.parentElement)">❌</button>
                </span>
            `;
    list.appendChild(li);
    animateAdd(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTodo = { title: input.value, description: "-" };

  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });

  input.value = "";
  fetchTodos(); // refresh daftar todo
});

// fungsi delete
window.deleteTodo = async (id, liElement) => {
    animateRemove(liElement);
  await fetch(`/todos/${id}`, { method: "DELETE" });
  fetchTodos();
};

window.toggleTodo = async (id, completed) => {
  await fetch(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: completed }),
  });
  fetchTodos();
};

window.editTodo = async (id, oldTitle) => {
  const newTitle = prompt("Edit tugas: ", oldTitle);
  if (newTitle && newTitle !== oldTitle) {
    await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    fetchTodos();
  }
};

fetchTodos();

async function login(email, password) {
    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({ email, password})
    })

    const data = await res.json();
    if(data.token){
        localStorage.setItme("token", data.token);
        fetchTodos();
    } else {
        alert("Login gagal");
    }
}

function logout(){
    localStorage.removeItem("token");
    alert("Logout berhasil");
}