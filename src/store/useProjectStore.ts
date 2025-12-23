"use client"

import { Project } from "@/lib/project/projectApi";
import { create } from "zustand";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

