import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "./FirebaseConfig";
import { TaskType, UserType } from "../../utils/Types";

export async function getTasksByUserId(userId: string): Promise<TaskType[]> {
    
    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where('userId', '==', userId))
    const snapshot = await getDocs(q);
    const tasks: TaskType[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            taskDescription: data.taskDescription || "No hay una descripción especifica",
            userId: data.userId || userId,
            taskTitle: data.taskTitle || "No hay titulo para la tarea",
            completed: data.completed
        };
    });

    return tasks;
}

export const addTask = async (task: TaskType): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      userId: task.userId,
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      completed: task.completed,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding task to Firestore:", error);
    return null;
  }
};

export async function deleteTask(taskId: string): Promise<void> {
    try {
        const taskDoc = doc(db, "tasks", taskId);
        await deleteDoc(taskDoc);
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
    }
}

export async function markTaskAsCompleted(taskId: string): Promise<void> {
    try {
        const taskDoc = doc(db, "tasks", taskId);
        console.log(taskId)
        await updateDoc(taskDoc, { completed: true });
    } catch (error) {
        console.error("Error al marcar tarea como completada:", error);
    }
}
