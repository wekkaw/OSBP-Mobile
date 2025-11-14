import React from 'react';
import { Event } from '../types';
import Card from './common/Card';
import Header from './common/Header';
import EmptyState from './common/EmptyState';
import { ICONS } from '../constants';

const EventItem: React.FC<{ event: Event }> = ({ event }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  
  return (
    <Card className={`p-4 flex items-start space-x-4 transition-opacity ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex-shrink-0 text-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl p-2 w-20 shadow-lg">
        <p className="text-4xl font-bold">{eventDate.getDate()}</p>
        <p className="text-sm font-semibold tracking-wider">{eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</p>
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{event.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{event.location}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{event.description}</p>
        {isPast && (
           <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
             Past Event
           </span>
        )}
      </div>
    </Card>
  );
};

const EventsScreen: React.FC<{ events: Event[] }> = ({ events }) => {
  const now = new Date();
  
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastEvents = [...events]
    .filter(e => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <Header title="Events" />
      
      {events.length === 0 ? (
        <EmptyState 
            icon={ICONS.events}
            title="No Events"
            message="There are currently no scheduled events."
        />
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Upcoming</h2>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => <EventItem key={event.id} event={event} />)}
              </div>
            ) : (
              <EmptyState 
                  icon={ICONS.events}
                  title="No Upcoming Events"
                  message="Check back later for new events."
              />
            )}
          </div>

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Past Events</h2>
                <div className="space-y-4">
                  {pastEvents.map(event => <EventItem key={event.id} event={event} />)}
                </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsScreen;