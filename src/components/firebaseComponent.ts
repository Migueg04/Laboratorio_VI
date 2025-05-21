import { fetchUsers } from "../services/Firebase/UserService";
import { TaskType, UserType } from "../utils/Types";

class FirebaseComponent extends HTMLElement{
    private users: UserType[] = [];
    private tasks: TaskType[] = [];

    constructor(){
        super()
        this.attachShadow({mode: 'open'})
    }

    async connectedCallback(){
        this.users = await fetchUsers();
        this.render();
    }

    render(){
        if (this.shadowRoot)
            this.shadowRoot.innerHTML = `

        `;
    }
}
export default FirebaseComponent