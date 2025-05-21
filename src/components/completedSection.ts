import { deleteTask, getTasksByUserId } from "../services/Firebase/TaksService";
import { TaskType } from "../utils/Types";

class CompletedSection extends HTMLElement {
    private tasks: TaskType[] = [];
    private taskCardElement: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.loadTasks();
        
        // Escuchar eventos globales
        window.addEventListener("task-updated", this.handleTaskUpdated.bind(this));
        window.addEventListener("complete-task", this.handleTaskUpdated.bind(this));
        window.addEventListener("delete-task", this.handleDeleteTask.bind(this));
    }

    disconnectedCallback() {
        // Remover event listeners cuando el componente se desmonta
        window.removeEventListener("task-updated", this.handleTaskUpdated.bind(this));
        window.removeEventListener("complete-task", this.handleTaskUpdated.bind(this));
        window.removeEventListener("delete-task", this.handleDeleteTask.bind(this));
    }

    async loadTasks() {
        try {
            const userId = localStorage.getItem("userId") || "default-user";
            const allTasks = await getTasksByUserId(userId);
            
            // Filtrar solo tareas completadas
            this.tasks = allTasks.filter(task => task.completed);
            
            this.updateTaskList();
        } catch (error) {
            console.error("Error al cargar tareas completadas:", error);
        }
    }

    updateTaskList() {
        const taskListContainer = this.shadowRoot?.querySelector(".task-list");
        if (!taskListContainer) return;

        // Limpiar lista actual
        taskListContainer.innerHTML = "";

        if (this.tasks.length === 0) {
            taskListContainer.innerHTML = "<p>No hay tareas completadas</p>";
            return;
        }

        // Crear componente de tarjeta de tareas
        this.taskCardElement = document.createElement("card-component");
        taskListContainer.appendChild(this.taskCardElement);

        // Enviar las tareas al componente card
        if (this.taskCardElement && 'setTasks' in this.taskCardElement) {
            (this.taskCardElement as any).setTasks(this.tasks);
        }
    }

    async handleDeleteTask(event: Event) {
        const taskId = (event as CustomEvent).detail;
        try {
            await deleteTask(taskId);
            // Actualizar la lista de tareas después de eliminar
            await this.loadTasks();
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    }

    handleTaskUpdated() {
        // Recargar tareas cuando se añade o completa una tarea
        this.loadTasks();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    max-width: 500px;
                    margin: 30px auto;
                    padding: 20px;
                    font-family: sans-serif;
                    background-color: #fafbff;
                    border: 1px solid #eee;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }

                h1 {
                    font-size: 22px;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .task-list {
                    min-height: 50px;
                }
                
                .task-list p {
                    text-align: center;
                    color: #777;
                    font-style: italic;
                }
            </style>

            <div class="container">
                <h1>Tareas Completadas</h1>
                <div class="task-list">
                    <p>Cargando tareas...</p>
                </div>
            </div>
        `;
    }
}

export default CompletedSection;