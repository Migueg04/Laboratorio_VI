import { isLoggedIn } from "../services/AuthService";

class Root extends HTMLElement {
    private isAuthenticated: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Verificar estado de autenticación
        this.isAuthenticated = isLoggedIn();
    }

    connectedCallback() {
        this.render();
        
        // Escuchar cambios en la autenticación
        window.addEventListener("auth-changed", this.handleAuthChanged.bind(this));

        // Configurar el header después del render inicial
        this.setupHeader();
    }
    
    disconnectedCallback() {
        window.removeEventListener("auth-changed", this.handleAuthChanged.bind(this));
    }
    
    handleAuthChanged(event: Event) {
        const detail = (event as CustomEvent).detail;
        if (detail && typeof detail.isLoggedIn === 'boolean') {
            this.isAuthenticated = detail.isLoggedIn;
            
            // Si se desautentica, limpiar storage
            if (!detail.isLoggedIn) {
                localStorage.removeItem("userId");
            }
            
            // Solo actualizar el contenido, no todo el componente
            this.updateContent();
            this.setupHeader(); // Reconfigurar header según nuevo estado
        }
    }

    updateContent() {
        const contentArea = this.shadowRoot?.querySelector('#content');
        if (!contentArea) return;

        if (!this.isAuthenticated) {
            
            contentArea.innerHTML = `<auth-container></auth-container>`;
        } else {
            
            contentArea.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px;">
                    <form-component></form-component>
                    <task-section></task-section>
                    <completed-section></completed-section>
                </div>
            `;
        }
    }

    setupHeader() {
        setTimeout(() => {
            const header = this.shadowRoot?.querySelector('header-component');
            if (header && header.shadowRoot) {
                const logoutBtn = header.shadowRoot.querySelector('.logout-btn');
                if (logoutBtn) {
                    // Remover listener anterior si existe
                    logoutBtn.removeEventListener('click', this.handleLogout.bind(this));
                    // Agregar nuevo listener
                    logoutBtn.addEventListener('click', this.handleLogout.bind(this));
                }
            }
        }, 100);
    }

    handleLogout() {
        window.dispatchEvent(new CustomEvent("auth-changed", { 
            detail: { isLoggedIn: false } 
        }));
    }

    render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100vh;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    overflow: hidden;
                }

                #root {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-sizing: border-box;
                }

                #content {
                    flex: 1;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                
                .auth-layout {
                    min-height: calc(100vh - 80px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            <div id="root">
                <header-component></header-component>
                <div id="content" ${!this.isAuthenticated ? 'class="auth-layout"' : ''}></div>
            </div>
        `;
        
        // Actualizar contenido después del render
        this.updateContent();
    }
}

export default Root;