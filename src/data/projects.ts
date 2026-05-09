import kitchen_gabinet from "../assets/kitchen-gabinet.png";

export type Project = {
  title: string;
  description: string;
  tech: string[];
  image: string;
  repo: string;
  page?: string;
  color?: string;
};

export const projects = [
  {
    title: "Kitchen Gabinet",
    description: "Asistente de cocina todo en uno: recetario, planificador semanal y gestor de despensa. App móvil para Android.",
    tech: ["Vue.js", "TypeScript", "Capacitor", "Tailwind CSS"],
    repo: "https://github.com/MrF3lipe/kitchen-gabinet",
    image: kitchen_gabinet,
    page: "",
    color: "#f9f9f9",
  },
  {
    title: "DKY Gold",
    description: "Plataforma de gestión de inventario y ventas para joyería fina.",
    tech: ["JavaScript", "HTML5", "CSS3"],
    image: "https://www.dkygold.com/assets/dky-logo.png",
    page: "https://www.dkygold.com",
    color: "#000000",
  },
];
