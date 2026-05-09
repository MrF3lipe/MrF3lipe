import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiVuedotjs,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiCapacitor,
  SiCplusplus,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type Tech = { name: string; color: string; Icon: IconType };

export const techStack: Tech[] = [
  { name: "JavaScript", color: "#f7df1e", Icon: SiJavascript },
  { name: "TypeScript", color: "#3178c6", Icon: SiTypescript },
  { name: "C++", color: "#00599C", Icon: SiCplusplus },
  { name: "Python", color: "#3776ab", Icon: SiPython },
  { name: "React", color: "#61dafb", Icon: SiReact },
  { name: "Vue.js", color: "#42b883", Icon: SiVuedotjs },
  { name: "HTML5", color: "#e34f26", Icon: SiHtml5 },
  { name: "CSS3", color: "#1572b6", Icon: SiCss },
  { name: "Node.js", color: "#5fa04e", Icon: SiNodedotjs },
  { name: "Express", color: "#888888", Icon: SiExpress },
  { name: "Capacitor", color: "#119eff", Icon: SiCapacitor },
];
