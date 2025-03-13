import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Schedule = () => {
    const [schedules, setSchedules] = useState([
        { id: 1, title: 'Doctor Appointment', date: '2025-03-15', time: '10:00 AM' },
        { id: 2, title: 'Meeting with Staff', date: '2025-03-16', time: '2:00 PM' },
    ]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Schedule</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((schedule) => (
                    <Card key={schedule.id} className="p-4">
                        <CardContent>
                            <h2 className="text-xl font-semibold">{schedule.title}</h2>
                            <p>Date: {schedule.date}</p>
                            <p>Time: {schedule.time}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button className="mt-4">Add New Schedule</Button>
        </div>
    );
};

export default Schedule;

