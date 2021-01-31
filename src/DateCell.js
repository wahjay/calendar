import { useState, useRef, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
import { EventsList } from './EventsList';
import { ViewEvent } from './ViewEvent';

import { getEventPriority } from './utility';

export const DateCell = ({ events, day, date, current, today, onCreateEvent, onRemoveEvent }) => {
    const eventsRef = useRef();   // reference to events container
    const cellRef = useRef();     // reference to date cell
    const inputRef = useRef();

    const [numsDisplay, setNumsDisplay] = useState(0);
    const [numsHidden, setNumsHidden] = useState(0);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [anchorNewEl, setAnchorNewEl] = useState(null);
    const [anchorViewEl, setAnchorViewEl] = useState(null);
    const [anchorMoreEl, setAnchorMoreEl] = useState(null);
    const [anchorDelEl, setAnchorDelEl] = useState(null);
    const [priority, setPriority] = useState(null);
    const btnClick = {
      btn: ''
    };

    useEffect(() => {
      if(!eventsRef.current) return;
      const container = document.querySelector(".events-container");
      const eventBarHeight = 25;

      let toDisplay = Math.floor(container.clientHeight / eventBarHeight);
      // save some space for 'see more' option
      if(container.clientHeight < eventsRef.current.offsetHeight)
        toDisplay -= 1;

      setNumsDisplay(toDisplay);
      setNumsHidden(events.length - toDisplay);

    }, [events]);


    const handleCreateNew = (e) => {
      setAnchorNewEl(e.currentTarget);
    }

    const handleCloseNew = () => {
      setPriority(null);
      setAnchorNewEl(null);
    }

    const handleView = (e, event) => {
      setAnchorViewEl(e.currentTarget);
      setCurrentEvent(event);
    }

    const handleCloseView = () => {
      setAnchorViewEl(null);
      setCurrentEvent(null);
    }

    const handleClickMore = (e) => {
      setAnchorMoreEl(e.currentTarget);
    }

    const handleCloseMore = () => {
      setAnchorMoreEl(null);
    }

    const handleClickDel = (e, event) => {
      e.stopPropagation();
      setAnchorDelEl(e.currentTarget);
      setCurrentEvent(event);
    }

    const handleCloseDel = () => {
      setAnchorDelEl(null);
      setCurrentEvent(null);
    }

    const handleRemoveEvent = () => {
      onRemoveEvent(currentEvent.key);
      handleCloseDel();
    }

    const openNew = Boolean(anchorNewEl);
    const openView = Boolean(anchorViewEl);
    const openMore = Boolean(anchorMoreEl);
    const delEvent = Boolean(anchorDelEl);

    const overEdge = () => {
      const cell = cellRef.current && cellRef.current.getBoundingClientRect();
      const popover = 200;  // fixed width for popover modal

      if(cell && popover && (popover + cell.right > window.innerWidth)) {
        return true;
      }

      return false;
    }

    const autoGrow = (e) => {
      if(!inputRef.current) return;

      if(e.target.scrollHeight <= inputRef.current.offsetHeight) return;
      inputRef.current.style.height = `${e.target.scrollHeight}px`;
    }

    const autoShrink = (e) => {
      if(!inputRef.current) return;
      // del key
      if(e.keyCode === 8) {
        inputRef.current.style.height = 'auto';
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      if(e.target[0].value.trim() !== '' && btnClick.btn === 'confirm') {
        const newEvent = {
          date,
          title: e.target[0].value,
          priority: priority
        }
        onCreateEvent(date, newEvent);
      }

      handleCloseNew();
    }

    const popoverProps = {
      marginThreshold: 10,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: overEdge() ? 'left' : 'right',
      },
      transformOrigin: {
        vertical: 'bottom',
        horizontal: overEdge() ? 'right' : 'left',
      }
    };

    const priorities = ["work", "home", "family"].map(pri => (
      <div
        key={pri}
        className={pri}
        onClick={() => setPriority(pri)}
        style={{ transform: `scale(${priority === pri ? 1.4 : 1})`}}>
        <span></span>
      </div>
    ));

    const newEventBtns = ["cancel", "confirm"].map(btn => (
      <input
        key={btn}
        type="submit"
        name={btn}
        value={btn[0].toUpperCase() + btn.slice(1)}
        onClick={(e) => { btnClick.btn = btn }}
      />
    ));

    return (
        <div
          ref={cellRef}
          className={`date-cell-container ${!current && 'non-current'} ${today && 'today'}`}
          onDoubleClick={handleCreateNew}
          onContextMenu={handleCreateNew}
          style={{...(anchorNewEl && { background: '#2C363F' })}}
        >
          <div className="day"><span>{day}</span></div>
          <div className="events-container">
            <div ref={eventsRef} className="events">
              {
                events.length > 0 &&
                events.map((event, i) => (
                  (i < numsDisplay) &&
                  <span
                    key={i}
                    className="event"
                    style={{ background: `${getEventPriority(event.priority)}`}}
                    onClick={(e) => handleView(e, event)}
                    onContextMenu={(e) => handleClickDel(e, event)}
                  >
                    {event.title}
                  </span>
                ))
              }
            </div>
            {
              numsHidden > 0 &&
              <div className="more" onClick={handleClickMore}>{`${numsHidden} more...`}</div>
            }
            <Popover
              open={openNew}
              anchorEl={anchorNewEl}
              {...popoverProps}
            >
              <div className="new-event">
                <form onSubmit={handleSubmit}>
                  <textarea
                    ref={inputRef}
                    placeholder="New Event"
                    rows={1}
                    onChange={autoGrow}
                    onKeyDown={autoShrink}
                  />
                  <div className="priority">
                    <div className="name">
                      <h3 style={{ margin: 0, padding: 0 }}>{priority}</h3>
                    </div>
                    {priorities}
                  </div>
                  <div className="new-event-btns">
                    {newEventBtns}
                  </div>
                </form>
              </div>
            </Popover>
            <Popover
              open={openView}
              anchorEl={anchorViewEl}
              onClose={handleCloseView}
              {...popoverProps}
            >
              <ViewEvent event={currentEvent} />
            </Popover>
            <Popover
              style={{ left: overEdge() ? '-12px' : '5px', top: '25px'}}
              open={openMore}
              onClose={handleCloseMore}
              anchorEl={anchorMoreEl}
              {...popoverProps}
            >
              <EventsList events={events} arrowRight={overEdge()}/>
            </Popover>
            <Popover
              open={delEvent}
              anchorEl={anchorDelEl}
              onClose={handleCloseDel}
              {...popoverProps}
            >
              <div className="delete-event-container">
                <span onClick={handleRemoveEvent}>Delete</span>
              </div>
            </Popover>
          </div>
        </div>
    );
}
