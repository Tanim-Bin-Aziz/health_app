"use client";

import { Box } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  selectedDate: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
};

const CalendarSection = ({ selectedDate, onChange }: Props) => {
  return (
    <Box>
      <DateCalendar
        value={selectedDate}
        onChange={onChange}
        minDate={dayjs()}
      />
    </Box>
  );
};

export default CalendarSection;
