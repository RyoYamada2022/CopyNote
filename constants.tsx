
import type { Note, Folder, Tag } from './types';

export const NOTE_COLORS = [
  '#202124', // Default
  '#5C2B29', // Red
  '#614A19', // Orange
  '#635D19', // Yellow
  '#345920', // Green
  '#16504B', // Teal
  '#2D555E', // Blue
  '#1E3A5F', // Dark Blue
  '#42275E', // Purple
  '#5B2245', // Pink
  '#442F19', // Brown
  '#3C3F43', // Gray
];

export const ALL_FOLDERS: Folder[] = [
  {
    id: 1,
    name: 'General',
    color: '#4285F4',
    categories: [
      { id: 101, name: 'Notas', color: '#FBBC05' },
    ],
  },
];


export const ALL_NOTES: Note[] = [
  {
    id: Date.now() - 10000,
    createdAt: Date.now() - 10000,
    title: 'Lista de Tareas 📝',
    content: '',
    listItems: [
      { id: 1, text: 'Explorar las funciones de CopyNote', checked: true },
      { id: 2, text: 'Crear mi primera nota personal', checked: false },
      { id: 3, text: 'Organizar mis proyectos en carpetas', checked: false },
      { id: 4, text: 'Personalizar el tema en los ajustes (arriba a la derecha)', checked: false },
    ],
    pinned: true,
    status: 'active',
    color: '#635D19', // Yellow
    folderId: 1,
    categoryId: 101,
    tags: ['Personal', 'Idea'],
  },
  {
    id: Date.now() - 20000,
    createdAt: Date.now() - 20000,
    title: '¡Bienvenido a CopyNote! ✨',
    content: `Gracias por probar CopyNote. Aquí tienes un par de consejos para empezar:

• Crea notas de texto, listas o con imágenes desde el área superior.
• Organiza tus ideas usando carpetas, categorías y etiquetas de colores.
• Personaliza la apariencia con diferentes temas en el menú de la paleta.
• Usa la búsqueda rápida con Ctrl+K.

¡Esperamos que disfrutes organizando tus ideas!`,
    pinned: false,
    status: 'active',
    color: '#1E3A5F', // Dark Blue
    folderId: 1,
    categoryId: 101,
    tags: ['Importante'],
  },
  {
    id: Date.now() - 30000,
    createdAt: Date.now() - 30000,
    title: 'Inspiración Visual',
    content: "Una imagen para inspirar mi próximo proyecto. Las notas pueden contener tanto imágenes como texto.",
    images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDAsMjU1LDI1NSk7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcml6cmdiKDAsMCwyNTUpO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDI1NSwyNTUsMCk7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcml6cmdiKDI1NSwwLDApO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1clwoI2dyYWQxKSIgLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjE1MCIgZmlsbD0idXJsKCNncmFkMikiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJDYXZlYXQsIGN1cnNpdmUiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIj5Db3B5Tm90ZTwvdGV4dD48L3N2Zz4='],
    pinned: false,
    status: 'active',
    color: '#42275E', // Purple
    folderId: 1,
    categoryId: 101,
    tags: ['Idea', 'Trabajo'],
  },
];

export const DEFAULT_TAGS: Tag[] = [
    { name: 'Importante', color: '#E53935' },
    { name: 'Trabajo', color: '#1E88E5' },
    { name: 'Personal', color: '#43A047' },
    { name: 'Idea', color: '#FB8C00' },
];

export const MOTIVATIONAL_QUOTES: string[] = [
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "La única forma de hacer un gran trabajo es amar lo que haces. ¡Sigue así!",
  "No te detengas cuando estés cansado, detente cuando hayas terminado. ¡Tú puedes!",
  "La perseverancia no es una carrera larga; son muchas carreras cortas una tras otra.",
  "Tu futuro se crea por lo que haces hoy, no mañana.",
  "La disciplina es el puente entre las metas y los logros.",
  "Cree en ti mismo y en todo lo que eres. Eres más valiente de lo que crees, más talentoso de lo que sabes, y capaz de más de lo que imaginas.",
  "Cada logro comienza con la decisión de intentarlo.",
  "El trabajo duro vence al talento cuando el talento no trabaja duro.",
  "Recuerda que incluso la noche más oscura terminará y el sol saldrá. ¡Un pequeño descanso puede recargar grandes energías!"
];