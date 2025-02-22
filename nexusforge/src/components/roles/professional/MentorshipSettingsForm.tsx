// src\components\roles\professional\MentorshipSettingsForm.tsx

import { useState } from 'react'
import { User } from '@/types'
import { MentorshipRequest } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type MentorshipRequestStatus = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'

interface MentorshipSettingsFormProps {
 mentor: User & { 
    name: string;
    maxMentees?: number, 
    mentorshipDuration?: string 
 }
 onUpdate: (data: { 
   maxMentees?: number, 
   mentorshipDuration?: string 
 }) => void
 mentorshipRequests: (MentorshipRequest & { 
   mentee: User 
 })[]
}

export function MentorshipSettingsForm({ 
 mentor,
 onUpdate,
 mentorshipRequests
}: MentorshipSettingsFormProps) {
 const [isOpen, setIsOpen] = useState(false)
 const [maxMentees, setMaxMentees] = useState(mentor.maxMentees || 0)
 const [mentorshipDuration, setMentorshipDuration] = useState(mentor.mentorshipDuration || '')
 const [selectedFilters, setSelectedFilters] = useState<MentorshipRequestStatus[]>(['ALL'])

 const handleSubmit = () => {
   onUpdate({ maxMentees, mentorshipDuration })
   setIsOpen(false)
 }

 const toggleFilter = (filter: MentorshipRequestStatus) => {
   if (filter === 'ALL') {
     setSelectedFilters(['ALL'])
   } else if (selectedFilters.includes('ALL')) {
     setSelectedFilters([filter])
   } else if (selectedFilters.includes(filter)) {
     setSelectedFilters(selectedFilters.filter(f => f !== filter))
   } else {
     setSelectedFilters([...selectedFilters, filter])
   }
 }

 const filteredRequests = mentorshipRequests.filter(request =>
   selectedFilters.includes('ALL') || selectedFilters.includes(request.status as MentorshipRequestStatus)
 )

 return (
   <Card>
     <CardHeader>
       <CardTitle>Mentorship Settings</CardTitle>
       <Button onClick={() => setIsOpen(true)}>Edit</Button>
     </CardHeader>
     <CardContent>
       <div className="space-y-2">
         <div>
           <div className="font-medium">Max Mentees:</div>
           <div>{mentor.maxMentees}</div>
         </div>
         <div>
           <div className="font-medium">Mentorship Duration:</div> 
           <div>{mentor.mentorshipDuration}</div>
         </div>
       </div>
     </CardContent>

     <CardHeader>
       <CardTitle>Mentorship Requests</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="flex space-x-4 mb-4">
         {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map(filter => (
           <Button
             key={filter}
             variant={selectedFilters.includes(filter) ? 'primary' : 'secondary'}
             onClick={() => toggleFilter(filter)}
           >
             {filter}
           </Button>
         ))}
       </div>
       <div className="space-y-4">
         {filteredRequests.map(request => (
           <div key={request.id} className="flex justify-between items-center">
             <div>
               <div className="font-medium">{request.message}</div>
               <div className="text-sm text-gray-500">From: {request.mentee.name}</div>
             </div>
             <div>
               {request.status === 'PENDING' ? (
                 <>
                   <Button size="sm" variant="primary" className="mr-2">Accept</Button>
                   <Button size="sm" variant="destructive">Reject</Button>
                 </>
               ) : (
                 <div className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
                   {request.status}
                 </div>
               )}
             </div>
           </div>
         ))}
       </div>
     </CardContent>

     <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <DialogContent>
         <DialogHeader>
           <DialogTitle>Edit Mentorship Settings</DialogTitle>
         </DialogHeader>
         <CardContent>
           <div className="space-y-4">
             <div>
               <label htmlFor="maxMentees" className="block text-sm font-medium mb-1">
                 Max Number of Mentees
               </label>
               <Input
                 type="number"
                 id="maxMentees"
                 value={maxMentees}
                 onChange={e => setMaxMentees(Number(e.target.value))}
               />
             </div>
             <div>
               <label htmlFor="mentorshipDuration" className="block text-sm font-medium mb-1">
                 Mentorship Duration
               </label>
               <Input
                 id="mentorshipDuration"
                 value={mentorshipDuration}
                 onChange={e => setMentorshipDuration(e.target.value)}
               />
             </div>
           </div>
         </CardContent>
         <div className="flex justify-end space-x-2 p-4">
           <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
           <Button variant="primary" onClick={handleSubmit}>Save</Button>
         </div>
       </DialogContent>
     </Dialog>
   </Card>
 )
}