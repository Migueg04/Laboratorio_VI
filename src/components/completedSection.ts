import { deleteTask, getTasksByUserId } from "../services/Firebase/TaksService";
import { TaskType } from "../utils/Types";

class CompletedSection extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    async render() {

        this.shadowRoot!.innerHTML = `
            <style>
                .container {
                    max-width: 500px;
                    margin: 30px auto;
                    padding: 20px;
                    font-family: sans-serif;
                    background-color: #fefefe;
                }

                h1 {
                    font-size: 22px;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                }
            </style>

            <div class="container">
                <h1>Tareas Completadas</h1>
                <div class="task-list"></div>
            </div>
        `;


    }
}

export default CompletedSection;
