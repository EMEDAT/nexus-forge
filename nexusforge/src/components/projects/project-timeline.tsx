// src/components/projects/project-timeline.tsx
import { CheckCircle, Circle } from 'lucide-react'
import { Project, Task } from '@/types'

// Define TimelineTask interface
export interface TimelineTask {
  id: string
  title: string
  completed: boolean
  date: Date | string
}

interface ProjectTimelineProps {
  project: Project
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  // Convert project tasks to timeline format
  const timelineTasks: TimelineTask[] = project.tasks ? 
    project.tasks.map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      date: task.dueDate
    })) : [
    { 
      id: '1', 
      title: 'Project Initiation', 
      completed: true, 
      date: '2024-02-01' 
    },
    { 
      id: '2', 
      title: 'Design Phase', 
      completed: true, 
      date: '2024-02-15' 
    },
    { 
      id: '3', 
      title: 'Development', 
      completed: false, 
      date: '2024-03-01' 
    },
    { 
      id: '4', 
      title: 'Review', 
      completed: false, 
      date: '2024-03-15' 
    },
    { 
      id: '5', 
      title: 'Completion', 
      completed: false, 
      date: '2024-04-01' 
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Project Timeline</h2>

        <div className="relative">
          {timelineTasks.map((task, index) => (
            <div key={task.id} className="flex items-start mb-8 last:mb-0">
              <div className="flex items-center">
                {task.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
                {index !== timelineTasks.length - 1 && (
                  <div className="h-16 w-0.5 bg-gray-200 ml-3 -mb-8" />
                )}
              </div>
              
              <div className="ml-4">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(task.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}