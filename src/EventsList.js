import { getEventPriority } from './utility';

export const EventsList = ({ events, arrowRight }) => {
  return (
    <div className="events-list-container">
      <div className="events-list">
        {
          events.map((event, i) => (
            <div className="event" key={i}>
              <div className="status-container">
                <span className="status" style={{ background: `${getEventPriority(event.priority)}`}}></span>
              </div>
              <div className="event-info">{event.title}</div>
            </div>
          ))
        }
      </div>
      <div className={`${arrowRight && 'right-arrow'} arrow arrow-bg`}>
      </div>
      <div className={`${arrowRight && 'right-arrow'} arrow arrow-tip`}>
      </div>
    </div>
  );
}
