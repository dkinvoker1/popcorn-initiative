import { useEffect, useRef } from "react";

import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OBR from "@owlbear-rodeo/sdk";

import { InitiativeListItem } from "../InitiativeListItem/InitiativeListItem";
import { InitiativeItem } from "../InitiativeItem";

type InitiativeTrackerVerticalProps = {
  initiativeItems: InitiativeItem[];
  onHasActionChange: (initiativeId: string, hasAction: boolean, index: number)=> void;
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
    
    //width
    const baseWidth = visibleInitiative.length > 0 ? 230 : 200;
    const gmAdditionalWidth = isGm ? 70 : 0;
    
    OBR.action.setWidth(baseWidth + gmAdditionalWidth);
    
    //height
    const baseHeight = visibleInitiative.length > 0 ? 48 : 129; 
    const visibleItemsHeight = visibleInitiative.length * 80 + 24;
    const visibleItemsPaddingHeight = visibleInitiative.length * 16;

    OBR.action.setHeight(baseHeight + visibleItemsHeight + visibleItemsPaddingHeight);
  }, [initiativeItems.filter((initiative) => isGm || initiative.visible).length]);

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
