import { useEffect, useRef } from "react";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OBR from "@owlbear-rodeo/sdk";

import { InitiativeListItem } from "../InitiativeListItem/InitiativeListItem";
import { InitiativeItem } from "../InitiativeItem";

type InitiativeTrackerVerticalProps = {
  initiativeItems: InitiativeItem[];
  onHasActionChange: (initiativeId: string, hasAction: boolean) => void;
  showHidden: boolean;
};
export function InitiativeTrackerVertical({
  initiativeItems,
  onHasActionChange: onHasActionChange,
  showHidden,
}: InitiativeTrackerVerticalProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const visibleInitiative = initiativeItems.filter((initiative) => showHidden || initiative.visible);

    if (visibleInitiative.length < 1) {
      OBR.action.setHeight(129);
      OBR.action.setWidth(200);
    }
    else{
      // height
      OBR.action.setHeight(visibleInitiative.length*94);
      // width
      const add = showHidden ? 80 : 0;
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
                showHidden={showHidden}
                isVertical= {true}
              />
            ))}
        </List>
      </Box>
  );
}
