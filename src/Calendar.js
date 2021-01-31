import { useState, useEffect, useRef } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Switch from '@material-ui/core/Switch';
import { DateCell } from './DateCell';

export const Calendar = ({ events, startingDate, onCreateEvent, onRemoveEvent }) => {
    const calRef = useRef(null);
    const [days, setDays] = useState([]);
    const [dayOne, setDayOne] = useState(startingDate);

    const getMonthName = (date) => {
      return date.toLocaleString('en-us', { month: 'long' });
    }

    const getYear = (date) => {
      return date.getFullYear();
    }

    const getFirstDay = (date) => {
      const month = getMonthName(date);
      const year = getYear(date);
      return new Date(`${month} 01, ${year}`).getDay();
    }

    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    }

    const isSameDay = (day1, day2) => {
      return (day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate());
    }

    // disable browser default right click
    useEffect(() => {
      if(!calRef.current) return;
      const preventRightClick = event => {
        event.preventDefault();
      }

      calRef.current.addEventListener("contextmenu", preventRightClick);
    }, [calRef]);

    useEffect(() => {
      const rows = 6;
      const cols = 7;
      const totalDays = rows * cols;
      let cal = new Array(totalDays).fill().map(
        // current: is in current month,
        day => ({ current: false, events: [] })
      );

      const firstDay = getFirstDay(dayOne);
      const curMonth = dayOne.getMonth();
      const curYear = getYear(dayOne);
      const prevMonth = (curMonth - 1 + 12) % 12;
      const curMonthNumDays = getDaysInMonth(curMonth, curYear);
      let prevMonthNumDays = getDaysInMonth(prevMonth, curYear);

      // fill up the days from previous month
      for(let i = firstDay - 1; i >= 0; i--) {
        cal[i].day = prevMonthNumDays;
        cal[i].date = new Date(curYear, curMonth-1, prevMonthNumDays);
        cal[i].key = cal[i].date +  `${i}`
        prevMonthNumDays--;
      }

      // fill up the days in current month
      let i, j;
      for(i = firstDay, j = 1; i < firstDay + curMonthNumDays; i++, j++) {
        cal[i].day = j;
        cal[i].current = true;
        cal[i].date = new Date(curYear, curMonth, j);
        cal[i].key = cal[i].date +  `${j}`
      }

      // fill up the days in next month
      for(j = 1; i < totalDays; i++, j++) {
        cal[i].day = j;
        cal[i].date = new Date(curYear, curMonth+1, j);
        cal[i].key = cal[i].date +  `${j}`
      }

      // map each event to its corresponding day
      let events_map = {};
      events.forEach((event, i) => {
        const key = event.date.toLocaleDateString("en-US"); // dd/mm/yy
        if(events_map[key]) {
          events_map[key].push({
            title: event.title,
            priority: event.priority,
            date: event.date,
            key: i
          });
        }
        else {
          events_map[key] = [{
            title: event.title,
            priority: event.priority,
            date: event.date,
            key: i
          }];
        }
      });

      // attach events
      for(let i = 0; i < totalDays; i++) {
        const key = cal[i].date.toLocaleDateString("en-US");
        if(events_map[key])
          cal[i].events = [...cal[i].events, ...events_map[key]];
      }

      setDays(cal);
    }, [dayOne, events]);


    const handleCur = () => {
      setDayOne(startingDate);
    }

    const handleNext = () => {
      const curMonth = dayOne.getMonth();
      const curYear = dayOne.getFullYear();
      setDayOne(new Date(curYear, curMonth+1, 1));
    }

    const handlePrev = () => {
      const curMonth = dayOne.getMonth();
      const curYear = dayOne.getFullYear();
      setDayOne(new Date(curYear, curMonth - 1, 1));
    }

    return (
        <div ref={calRef} className="calender-container">
          <div className="calender-header">
            <div className="title">
              <h2>{`${getMonthName(dayOne)} ${getYear(dayOne)}`}</h2>
            </div>
            <div className="control">
              <div>
                <span onClick={handlePrev}><ChevronLeftIcon /></span>
                <span onClick={handleCur}>Today</span>
                <span onClick={handleNext}><ChevronRightIcon /></span>
              </div>
              <div className="toggle">
                <Switch
                  size="small"
                  name="switch-mode"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
               />
              </div>
            </div>
          </div>
          <div className="calender-column-title">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="calender-body-container">
            <div className="calender-body">
              {
                days.length > 0 && days.map((day, i) =>
                  <DateCell
                    key={day.key}
                    day={day.day}
                    date={day.date}
                    current={day.current}
                    events={day.events}
                    onCreateEvent={onCreateEvent}
                    onRemoveEvent={onRemoveEvent}
                    today={day.date && isSameDay(day.date, startingDate)}
                  />
                )
              }
            </div>
          </div>
        </div>
    );
}
