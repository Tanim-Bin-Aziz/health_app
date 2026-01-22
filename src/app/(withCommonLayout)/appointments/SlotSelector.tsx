"use client";

import { Box, Button } from "@mui/material";

type Props = {
  enabled: boolean;
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
};

const SlotSelector = ({ enabled, selectedSlot, onSelect }: Props) => {
  const slots = [
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  return (
    <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2}>
      {slots.map((slot) => (
        <Button
          key={slot}
          disabled={!enabled}
          variant={slot === selectedSlot ? "contained" : "outlined"}
          onClick={() => onSelect(slot)}
        >
          {slot}
        </Button>
      ))}
    </Box>
  );
};

export default SlotSelector;
