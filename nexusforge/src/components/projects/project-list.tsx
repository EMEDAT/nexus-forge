// src\components\projects\project-list.tsx

import { Project } from '@/types'

export const ProjectList = ({ projects }: { projects: Project[] }) => (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  )