import { useEffect, useRef } from "react";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OBR from "@owlbear-rodeo/sdk";

import { InitiativeListItem } from "../InitiativeListItem/InitiativeListItem";
import { InitiativeItem } from "../InitiativeItem";

type InitiativeTrackerVerticalProps = {
  initiativeItems: InitiativeItem[];
  onHasActionChange: (initiativeId: string, hasAction: boolean) => void;
  isGm: boolean;
};
export function InitiativeTrackerVertical({
  initiativeItems,
  onHasActionChange: onHasActionChange,
  isGm: isGm,
}: InitiativeTrackerVerticalProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const visibleInitiative = initiativeItems.filter((initiative) => isGm || initiative.visible);

    if (visibleInitiative.length < 1) {
      
      const add = isGm ? 80 : 0;
      OBR.action.setHeight(129 + add);
      OBR.action.setWidth(200 + add);
    }
    else{
      // height
      OBR.action.setHeight(48 + visibleInitiative.length*80+24);
      // width
      const add = isGm ? 80 : 0;
      OBR.action.setWidth(150 + add);
    }
  }, [initiativeItems.length]);

  return (
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {initiativeItems
            .map((initiative) => (
              <InitiativeListItem
                key={initiative.id}
                initiative={initiative}
                onHasActionChange={onHasActionChange}
                isGm={isGm}
                isVertical= {true}
              />
            ))}
        </List>
      </Box>
  );
}
