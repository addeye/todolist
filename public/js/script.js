const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    const list = document.getElementById("todo-list");

    console.log("running");

    // mengambil dari server
    async function fetchTodos() {
        const res = await fetch("/todos");
        const todos = await res.json();

        list.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${todo.title}</span>
                <button onclick="deleteTodo('${todo._id}')">Hapus</button>
            `;
            list.appendChild(li);
        })
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newTodo = {title: input.value, description: "-"};

        await fetch("/todos", {
            method: "POST",
            headers:{ "Content-Type": "application/json"},
            body: JSON.stringify(newTodo)
        });

        input.value = "";
        fetchTodos(); // refresh daftar todo
    })

    // fungsi delete
    window.deleteTodo = async (id) => {
        await fetch(`/todos/${id}`,{ method: "DELETE"});
        fetchTodos();
    }

    fetchTodos();