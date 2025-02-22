// src\components\roles\student\StudentProjectList.tsx

import React from 'react';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  team: {
    user: {
      id: string;
      name: string;
      profileImage?: string | null;
    }
  }[];
}

interface StudentProjectListProps {
  projects: Project[];
}

export const StudentProjectList: React.FC<StudentProjectListProps> = ({ projects }) => {
  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No active projects yet
        </div>
      ) : (
        projects.map(project => (
          <Link 
            key={project.id} 
            href={`/projects/${project.id}`} 
            className="block"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{project.title}</h4>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'IN_PROGRESS' 
                        ? 'bg-blue-100 text-blue-800' 
                        : project.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Started {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {/* Team Members */}
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map(member => (
                    <div 
                      key={member.user.id} 
                      className="relative w-8 h-8 rounded-full border-2 border-white"
                    >
                      {member.user.profileImage ? (
                        <img 
                          src={member.user.profileImage} 
                          alt={member.user.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {member.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};