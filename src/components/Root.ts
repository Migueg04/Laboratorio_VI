import { StorageActions } from "../flux/Actions";

class Root extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})

        if (!localStorage.getItem("userId")) {
            localStorage.setItem("userId", "user-1234"); // o el que prefieras
        }

        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <header-component></header-component>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <form-component></form-component>
            <task-section></task-section>
            <completed-section></completed-section>
            </div>
    `
    }

    connectedCallback(){
        const storage = localStorage.getItem('flux:persist')

        if (storage){
            const storageJson = JSON.parse (storage)
            StorageActions.load(storageJson)
        }
    }

}

export default Root