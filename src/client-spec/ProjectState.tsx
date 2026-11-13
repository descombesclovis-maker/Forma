import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
export type SiteType = "onepage" | "vitrine" | "ecommerce";
export type Project = {
  type: SiteType | null;
  name: string;
  photos: File[];
  notes: string;
  options: string[];
  step: number;
};
const initial: Project = {
  type: null,
  name: "",
  photos: [],
  notes: "",
  options: [],
  step: 0,
};
const Context = createContext<{
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
} | null>(null);
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project>(initial);
  return (
    <Context.Provider value={{ project, setProject }}>
      {children}
    </Context.Provider>
  );
}
export function useProject() {
  const state = useContext(Context);
  if (!state) throw Error("ProjectProvider absent");
  return state;
}
