import { getEventPriority } from './utility';

const default_priority = 'work';

export const ViewEvent = ({ event }) => {
  return event && (
    <div className="view-event-container" >
      <div
        className="view-event-priority"
        style={{ background: `${getEventPriority(event.priority)}`}}
      >
        <h2>{event.priority ? event.priority : default_priority}</h2>
      </div>
      <div className="view-event-content">
        <span>{event.title}</span>
      </div>
      <div className="view-event-date">
        <span>
          {event.date.toLocaleDateString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true })}
        </span>
      </div>
    </div>
  )
}
