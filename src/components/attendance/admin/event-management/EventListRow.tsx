import { Button, Td, Tr, useDisclosure } from '@chakra-ui/react';
import { AttendanceEvent } from '@prisma/client';
import { MdEdit } from 'react-icons/md';
import { EditEventModal } from './EditEventModal';

interface EventListRowProps {
  event: AttendanceEvent;
  num: number;
  editEvent: (event: AttendanceEvent) => void;
  deleteEvent: (eventId: string) => void;
}

export const EventListRow = ({
  event,
  num,
  editEvent,
  deleteEvent
}: EventListRowProps) => {
  const startTime = [
    event.startTime.getHours() > 9
      ? event.startTime.getHours().toString()
      : '0' + event.startTime.getHours().toString(),
    event.startTime.getMinutes() > 9
      ? event.startTime.getMinutes().toString()
      : '0' + event.startTime.getMinutes().toString()
  ];
  const endTime = [
    event.endTime.getHours() > 9
      ? event.endTime.getHours().toString()
      : '0' + event.endTime.getHours().toString(),
    event.endTime.getMinutes() > 9
      ? event.endTime.getMinutes().toString()
      : '0' + event.endTime.getMinutes().toString()
  ];

  const editEventPipe = (
    EventName: string,
    EventStartTime: [number, number],
    EventEndTime: [number, number]
  ) => {
    const newStartDate = new Date(event.startTime);
    newStartDate.setHours(EventStartTime[0], EventStartTime[1]);
    const newEndDate = new Date(event.endTime);
    newEndDate.setHours(EventEndTime[0], EventEndTime[1]);

    editEvent({
      id: event.id,
      dayId: event.dayId,
      title: EventName,
      startTime: newStartDate,
      endTime: newEndDate
    });
  };

  const deleteEventPipe = () => {
    deleteEvent(event.id);
  };
  return (
    <Tr key={event.id}>
      <Td>{num}</Td>
      <Td>{event.title}</Td>
      <Td>{event.startTime.toLocaleDateString()}</Td>
      <Td>{startTime.join(':')}</Td>
      <Td>{endTime.join(':')}</Td>
      <Td>
        <EditEventModal
          editEvent={editEventPipe}
          deleteEvent={deleteEventPipe}
          event={event}
        />
      </Td>
    </Tr>
  );
};
