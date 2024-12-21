const inputField = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

// Serverga `completed` holatini o'zgartirish so'rovi
const toggleTodoCompletion = async (id, completed) => {
  try {
    const response = await fetch(`http://localhost:3000/api/todos/${id}/check`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo completion status.");
    }

    console.log("Todo updated successfully:", id, completed);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

// Serverdan todoni o'chirish
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete todo.");
    }

    console.log("Todo deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

// Yangi todo elementini ro'yxatga qo'shish
const renderTodo = (todo) => {
  const li = document.createElement("li");
  li.className = "flex items-center space-x-2";

  li.innerHTML = `
    <input type="checkbox" class="h-5 w-5 text-orange-500" ${
      todo.completed ? "checked" : ""
    }>
    <label class="${todo.completed && 'line-through'} text-gray-700 line-clamp-1 flex-grow">${
      todo.title
    }</label>
    <button class="text-red-500 hover:text-red-700 font-semibold">Delete</button>
  `;

  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", (e) => {
    const label = e.target.nextElementSibling;
    label.classList.toggle("line-through", e.target.checked);

    // Serverga `completed` holatini yuborish
    toggleTodoCompletion(todo._id, e.target.checked);
  });

  const deleteButton = li.querySelector("button");
  deleteButton.addEventListener("click", () => {
    li.remove();

    // Serverdan todo-ni o'chirish
    deleteTodo(todo._id);
  });

  todoList.appendChild(li);
};

// Serverdan barcha todo-larni olish
const getTodos = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/todos");
    const todos = await response.json();

    todos.forEach((todo) => renderTodo(todo));
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

// Yangi todo qo'shish
const addTodo = async () => {
  const taskText = inputField.value.trim();

  if (taskText) {
    try {
      const response = await fetch(`http://localhost:3000/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskText,
          description: "NestJS framework adsfasf",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo.");
      }

      const newTodo = await response.json();
      console.log("Todo added successfully:", newTodo);

      // Yangi todo-ni ro'yxatga qo'shish
      renderTodo(newTodo);

      // Input maydonini tozalash
      inputField.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
};

// Hodisalar bog'lash
addButton.addEventListener("click", addTodo);

inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Barcha todolarni olish
getTodos();
