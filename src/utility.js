const eventPriority = {
  work: '#00A5E0',
  home: '#E4CC37',
  family: '#8FC93A'
};

const getEventPriority = (priority) => {
  if(!priority || !eventPriority[priority]) return eventPriority.work
  return eventPriority[priority];
}

export { getEventPriority };
