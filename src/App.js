import { useState } from 'react';
import { Calendar } from './Calendar';

const fakeEvents = [{
    date: new Date(),
    title: 'Trash day!',
    priority: 'home',
}, {
    date: new Date(),
    title: 'Other stuff',
}, {
    date: new Date(),
    title: 'have a nice day you cute puppy!!!!',
    priority: 'family',
}, {
    date: new Date(),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(),
    title: 'have a nice day you cute puppy!!!!',
    priority: 'family',
}, {
    date: new Date(),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,27),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,27),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,27),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,27),
    title: 'have a nice day you cute puppy!!!!',
    priority: 'family'
}, {
    date: new Date(2021,0,28),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,28),
    title: 'have a nice day you cute puppy!!!!'
}, {
    date: new Date(2021,0,28),
    title: 'have a nice day you cute puppy!!!!'
},
];

export const App = () => {
    const today = new Date();
    const [events, setEvents] = useState(fakeEvents);

    const onCreateEvent = (selectedDate, newEvent) => {
        // do something with selectdate later...
        setEvents([...events, newEvent]);
    }

    const onRemoveEvent = (i) => {
      setEvents([...events.slice(0, i), ...events.slice(i+1)]);
    }

    return (
        <div style={{ width: '400px', height: '400px', margin: '10% auto' }}>
            <Calendar
                events={events}
                onCreateEvent={onCreateEvent}
                onRemoveEvent={onRemoveEvent}
                startingDate={today} />
        </div>
    );
}
