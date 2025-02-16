// src/types/timeline.ts
import type { Task, Project } from './index'

export interface TimelineTask extends Omit<Task, 'dueDate'> {
  date: Date  // Rename dueDate to date for timeline compatibility
}

export interface TimelineProject extends Omit<Project, 'tasks'> {
  tasks?: TimelineTask[]
}

export interface ProjectTimelineProps {
  project: TimelineProject
}