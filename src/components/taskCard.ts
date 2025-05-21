import { fetchUsers } from "../services/Firebase/UserService";
import { TaskType, UserType } from "../utils/Types";

class TaskCard extends HTMLElement {
  private tasks: TaskType[] = [];
  private users: UserType[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.users = await fetchUsers();
    this.render();
  }

  // Método para recibir las tareas desde fuera
  public setTasks(tasks: TaskType[]) {
    this.tasks = tasks;
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .task-card {
          max-width: 400px;
          margin: 20px auto;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background-color: #ffffff;
          font-family: sans-serif;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .task-card h3 {
          margin: 0 0 8px;
          font-size: 18px;
          color: #222;
        }

        .task-card p {
          margin: 0 0 12px;
          font-size: 14px;
          color: #555;
        }

        .task-actions {
          display: flex;
          gap: 10px;
        }

        .task-actions button {
          padding: 6px 12px;
          font-size: 13px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .complete-btn {
          background-color: #4caf50;
          color: white;
        }

        .complete-btn:hover {
          background-color: #449d48;
        }

        .delete-btn {
          background-color: #f44336;
          color: white;
        }

        .delete-btn:hover {
          background-color: #d7352b;
        }
      </style>

      ${this.tasks.map(task => {
        const user = this.users.find(u => u.id === task.userId);
        return `
          <div class="task-card">
            <h3>${task.taskTitle}</h3>
            <p>${task.taskDescription || 'Sin descripción'}</p>
            <div class="task-actions">
              ${!task.completed ? `<button class="complete-btn" data-id="${task.id}">Tarea Completada</button>` : ""}
              <button class="delete-btn" data-id="${task.id}">Eliminar tarea</button>
            </div>
          </div>
        `;
      }).join('')}
    `;

    // Escuchar clics en botones
    this.shadowRoot.querySelectorAll(".complete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = (e.target as HTMLElement).getAttribute("data-id");
        if (id) {
          window.dispatchEvent(new CustomEvent("complete-task", { detail: id }));
        }
      });
    });

    this.shadowRoot.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = (e.target as HTMLElement).getAttribute("data-id");
        if (id) {
          window.dispatchEvent(new CustomEvent("delete-task", { detail: id }));
        }
      });
    });
  }
}

export default TaskCard;
