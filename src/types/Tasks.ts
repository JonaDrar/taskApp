import { Timestamp } from "firebase/firestore"; 

export interface TaskInterface {
  id: string; // El ID del documento en Firestore
  title: string;
  description: string;
  status: 'todo' | 'wip' | 'done'; // Asumiendo que los estados posibles son estos tres
  expirationDate?: Timestamp; // Opcional si no todas las tareas tienen fecha de expiración
  createdAt: Timestamp; // Firebase Timestamp para la fecha de creación
  updatedAt: Timestamp; // Firebase Timestamp para la fecha de actualización
}