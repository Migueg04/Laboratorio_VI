import { StorageActions } from "../flux/Actions";
import { isLoggedIn } from "../services/AuthService";

class Root extends HTMLElement {
    private isAuthenticated: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Verificar estado de autenticación
        this.isAuthenticated = isLoggedIn();
        
        // Renderizar según estado de autenticación
        this.render();
    }

    connectedCallback() {
        // Escuchar cambios en la autenticación
        window.addEventListener("auth-changed", this.handleAuthChanged.bind(this));
        
        // Cargar datos de storage si es necesario
        const storage = localStorage.getItem('flux:persist');
        if (storage) {
            const storageJson = JSON.parse(storage);
            StorageActions.load(storageJson);
        }
    }
    
    disconnectedCallback() {
        window.removeEventListener("auth-changed", this.handleAuthChanged.bind(this));
    }
    
    handleAuthChanged(event: Event) {
        const detail = (event as CustomEvent).detail;
        if (detail && typeof detail.isLoggedIn === 'boolean') {
            this.isAuthenticated = detail.isLoggedIn;
            this.render();
        }
    }

    render() {
        if (!this.shadowRoot) return;
        
        if (!this.isAuthenticated) {
            // Mostrar formulario de autenticación
            this.shadowRoot.innerHTML = `
                <auth-container></auth-container>
            `;
        } else {
            // Mostrar aplicación principal
            this.shadowRoot.innerHTML = `
                <header-component></header-component>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <form-component></form-component>
                    <task-section></task-section>
                    <completed-section></completed-section>
                </div>
            `;
            
            // Actualizar listener del botón de logout en el header
            setTimeout(() => {
                const header = this.shadowRoot?.querySelector('header-component');
                if (header && header.shadowRoot) {
                    const logoutBtn = header.shadowRoot.querySelector('.logout-btn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', () => {
                            window.dispatchEvent(new CustomEvent("auth-changed", { 
                                detail: { isLoggedIn: false } 
                            }));
                            localStorage.removeItem("userId");
                        });
                    }
                }
            }, 100);
        }
    }
}

export default Root;