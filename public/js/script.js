// const User = require("../models/User");

// const { cookie } = require("express-validator");

const form = document.getElementById("todo-form");
const formLogin = document.getElementById("login-form");
const formRegister = document.getElementById("register-form");
const formLogout = document.getElementById("logout-form");

const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

const inputNamelogin = document.getElementById("login-input-name");
const inputPasswordlogin = document.getElementById("login-input-password");
const inputEmaillogin = document.getElementById("login-input-email");

const inputNameRegister = document.getElementById("register-input-name");
const inputPasswordRegister = document.getElementById("register-input-password");
const inputEmailRegister = document.getElementById("register-input-email");

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
  const res = await fetch("/todos",{
    headers: {
      contentType: "application/json",
    },
    credentials: "include",
  });
  const todos = await res.json();

  saveToLocal(todos);
  renderTodos(todos);
}

function renderTodos(todos){
    list.innerHTML = "";

  if(todos.length === 0){
    list.innerHTML = "<p>Belum ada tugas</p>";
  } else {
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
      console.log(list);
      animateAdd(li);
    });
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTodo = { title: input.value, description: "-" };

  await fetch("/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: JSON.stringify(newTodo),
  });

  input.value = "";
  fetchTodos(); // refresh daftar todo
});

// fungsi delete
window.deleteTodo = async (id, liElement) => {
    animateRemove(liElement);
  await fetch(`/todos/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } });
  fetchTodos();
};

window.toggleTodo = async (id, completed) => {
  await fetch(`/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
    body: JSON.stringify({ completed: completed }),
  });
  fetchTodos();
};

window.editTodo = async (id, oldTitle) => {
  const newTitle = prompt("Edit tugas: ", oldTitle);
  if (newTitle && newTitle !== oldTitle) {
    await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ title: newTitle }),
    });
    fetchTodos();
  }
};

fetchTodos();

formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            name: inputNameRegister.value,
            email: inputEmailRegister.value,
            password: inputPasswordRegister.value
        })
    })

    const data = await res.json();
    if(data.token){
        saveToken(data.token);
        fetchTodos();
    } else {
        alert("Register gagal");
    }
});

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
            email: inputEmaillogin.value,
            password: inputPasswordlogin.value
        }),
        credentials: "include"
    });

    const data = await res.json();
    if (res.ok) {
      alert("Login sukses!");
    } else {
      alert("Login gagal!");
    }
});

formLogout.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
    });
    const data = await res.json();
    if (res.ok) {
      alert("Logout sukses!");
    } else {
      alert("Logout gagal!");
    }
});

async function login(email, password) {
    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({ email, password})
    })

    const data = await res.json();
    if(data.token){
      console.log(data.token);
        localStorage.setItme("token", data.token);
        fetchTodos();
    } else {
        alert("Login gagal");
    }
}