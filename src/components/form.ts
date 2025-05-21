import { addTask } from "../services/Firebase/TaksService";
import { TaskType } from "../utils/Types";

class Form extends HTMLElement {
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback(){
        this.render()
    }

    render(){
        if(this.shadowRoot)
            this.shadowRoot.innerHTML = `
            <style>
                .form-container {
                    width: fit-content;
                    max-width: 400px;
                    margin: 30px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #fafafa;
                    font-family: sans-serif;
                }

                .form-container h2 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #222;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group label {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 6px;
                    color: #333;
                }

                .form-group .required {
                    color: red;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 8px 10px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    background-color: #fff;
                    box-sizing: border-box;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #4a90e2;
                    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
                }

                .form-actions {
                    text-align: right;
                }

                .form-actions button {
                    background-color: #4a90e2;
                    color: white;
                    padding: 8px 14px;
                    font-size: 14px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .form-actions button:hover {
                    background-color: #3b78c2;
                }

            </style>

                <div class="form-container">
                    <h2>Agregar nueva tarea</h2>
                    <form id="taskForm">
                        
                        <div class="form-group">
                        <label for="title">Título <span class="required">*</span></label>
                        <input type="text" id="title" name="title" required placeholder="Ej. Estudiar Algoritmos">
                        </div>

                        <div class="form-group">
                        <label for="description">Descripción (opcional)</label>
                        <textarea id="description" name="description" rows="3" ></textarea>
                        </div>

                        <div class="form-actions">
                        <button type="submit">Agregar tarea</button>
                        </div>

                    </form>
                </div>
        `;

        const taskForm = this.shadowRoot?.querySelector("#taskForm") as HTMLFormElement;
        if (taskForm) {
            taskForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const userId = localStorage.getItem("userId") || "default-user";
                const formData = new FormData(taskForm);
                const title = formData.get("title")?.toString() || "";
                const description = formData.get("description")?.toString() || "";

                if (title.trim() !== "") {
                    const taskId = await addTask({
                        userId,
                        taskTitle: title,
                        taskDescription: description,
                        completed: false,
                        id: "" // Firestore lo asignará
                    });

                    taskForm.reset();

                    if (taskId) {
                        console.log("Tarea añadida con ID:", taskId);

                        // Disparar evento para recargar secciones
                        window.dispatchEvent(new Event("task-updated"));
                    } else {
                        console.error("Error al guardar la tarea");
                    }
                }
            });
        }
    }
}
export default Form