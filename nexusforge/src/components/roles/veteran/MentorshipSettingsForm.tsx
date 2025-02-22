// src/components/roles/veteran/MentorshipSettingsForm.tsx
'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Award, BookOpen, Calendar, Users2 } from 'lucide-react';

interface VeteranMentorshipSettings {
  maxMentees: number;
  maxProfessionalMentees: number;
  maxStudentMentees: number;
  mentorshipLevels: {
    professional: boolean;
    student: boolean;
    groupSessions: boolean;
  };
  expertise: string[];
  availability: {
    weeklyHours: number;
    groupSessionsPerMonth: number;
  };
  knowledgeSharing: {
    workshops: boolean;
    publications: boolean;
    webinars: boolean;
  };
  legacyProgram: {
    active: boolean;
    description: string;
    focusAreas: string[];
  };
}

interface MentorshipSettingsFormProps {
  mentor: User & {
    settings?: VeteranMentorshipSettings;
  };
  onUpdateAction: (data: Partial<VeteranMentorshipSettings>) => void;
}

export function MentorshipSettingsForm({ mentor, onUpdateAction }: MentorshipSettingsFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<VeteranMentorshipSettings>(
    mentor.settings || {
      maxMentees: 10,
      maxProfessionalMentees: 5,
      maxStudentMentees: 5,
      mentorshipLevels: {
        professional: true,
        student: true,
        groupSessions: false
      },
      expertise: [],
      availability: {
        weeklyHours: 10,
        groupSessionsPerMonth: 2
      },
      knowledgeSharing: {
        workshops: true,
        publications: true,
        webinars: true
      },
      legacyProgram: {
        active: false,
        description: '',
        focusAreas: []
      }
    }
  );

  const handleSubmit = () => {
    onUpdateAction(settings);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users2 className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{settings.maxMentees}</span>
            </div>
            <p className="text-sm text-gray-500">Total Mentees</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{settings.maxProfessionalMentees}</span>
            </div>
            <p className="text-sm text-gray-500">Professional Mentees</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{settings.maxStudentMentees}</span>
            </div>
            <p className="text-sm text-gray-500">Student Mentees</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{settings.availability.weeklyHours}</span>
            </div>
            <p className="text-sm text-gray-500">Weekly Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Veteran Mentorship Settings</CardTitle>
          <Button onClick={() => setIsOpen(true)}>Edit Settings</Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Mentorship Levels */}
            <div>
              <h3 className="font-medium mb-2">Mentorship Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Professional Mentoring</span>
                  <Switch
                    checked={settings.mentorshipLevels.professional}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Student Mentoring</span>
                  <Switch
                    checked={settings.mentorshipLevels.student}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Group Sessions</span>
                  <Switch
                    checked={settings.mentorshipLevels.groupSessions}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Knowledge Sharing */}
            <div>
              <h3 className="font-medium mb-2">Knowledge Sharing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(settings.knowledgeSharing).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <Switch checked={value} disabled />
                  </div>
                ))}
              </div>
            </div>

            {/* Legacy Program */}
            {settings.legacyProgram.active && (
              <div>
                <h3 className="font-medium mb-2">Legacy Program</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{settings.legacyProgram.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {settings.legacyProgram.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white rounded-full text-xs text-gray-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="fixed inset-0 z-50 bg-black/50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Mentorship Settings</h2>
            
            {/* Dialog content here with all the settings fields */}
            <div className="space-y-6">
              {/* Capacity Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Professional Mentee Capacity
                  </label>
                  <Input
                    type="number"
                    value={settings.maxProfessionalMentees}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxProfessionalMentees: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student Mentee Capacity
                  </label>
                  <Input
                    type="number"
                    value={settings.maxStudentMentees}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxStudentMentees: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              {/* Availability Settings */}
              <div>
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Weekly Hours
                    </label>
                    <Input
                      type="number"
                      value={settings.availability.weeklyHours}
                      onChange={(e) => setSettings({
                        ...settings,
                        availability: {
                          ...settings.availability,
                          weeklyHours: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Group Sessions per Month
                    </label>
                    <Input
                      type="number"
                      value={settings.availability.groupSessionsPerMonth}
                      onChange={(e) => setSettings({
                        ...settings,
                        availability: {
                          ...settings.availability,
                          groupSessionsPerMonth: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Legacy Program Settings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Legacy Program</h3>
                  <Switch
                    checked={settings.legacyProgram.active}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      legacyProgram: {
                        ...settings.legacyProgram,
                        active: checked
                      }
                    })}
                  />
                </div>
                
                {settings.legacyProgram.active && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Program Description
                      </label>
                      <Textarea
                        value={settings.legacyProgram.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          legacyProgram: {
                            ...settings.legacyProgram,
                            description: e.target.value
                          }
                        })}
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}