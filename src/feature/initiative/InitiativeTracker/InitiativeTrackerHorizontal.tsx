import { useEffect, useRef } from "react";

import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OBR from "@owlbear-rodeo/sdk";

import { InitiativeListItem } from "../InitiativeListItem/InitiativeListItem";
import { InitiativeItem } from "../InitiativeItem";

type InitiativeTrackerHorizontalProps = {
  initiativeItems: InitiativeItem[];
  onHasActionChange: (initiativeId: string, hasAction: boolean, index: number) => void;
  isGm: boolean;
};
export function InitiativeTrackerHorizontal({
  initiativeItems,
  onHasActionChange: onHasActionChange,
  isGm: isGm,
}: InitiativeTrackerHorizontalProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const visibleInitiative = initiativeItems.filter((initiative) => isGm || initiative.visible);

    if (visibleInitiative.length < 1) {
      OBR.action.setHeight(129);
      OBR.action.setWidth(200);
    }
    else{
      // height
      const baseHeight = 212;
      const gmAdditionalHeight = isGm ? 40 : 0;

      OBR.action.setHeight(baseHeight + gmAdditionalHeight);
      // width
      const minWidth = isGm ? 230 : 150;
      var calculatedWidth = visibleInitiative.length * 158
      OBR.action.setWidth(Math.max(minWidth, calculatedWidth));
    }
  }, [initiativeItems.filter((initiative) => isGm || initiative.visible).length]);

  return (
      <Box sx={{ overflowX: "auto", overflowY: "auto" }}>
        <List 
          ref={listRef}
          component={Stack}
          direction="row"
          dense={true}
        >
          {initiativeItems
            .map((initiative) => (
              <InitiativeListItem
                key={initiative.id}
                initiative={initiative}
                onHasActionChange={onHasActionChange}
                isGm={isGm}
                isVertical={false}
              />
            ))}
        </List>
      </Box>
  );
}
