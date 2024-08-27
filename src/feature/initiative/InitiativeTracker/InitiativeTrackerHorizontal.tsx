import { useEffect, useRef } from "react";

import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import OBR from "@owlbear-rodeo/sdk";

import { InitiativeListItem } from "../InitiativeListItem/InitiativeListItem";
import { InitiativeItem } from "../InitiativeItem";

type InitiativeTrackerHorizontalProps = {
  initiativeItems: InitiativeItem[];
  onHasActionChange: (initiativeId: string, hasAction: boolean) => void;
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
      OBR.action.setHeight(212);
      // width
      const minWidth = isGm ? 230 : 150;
      var calculatedWidth = visibleInitiative.length*112;

      OBR.action.setWidth(Math.max(minWidth, calculatedWidth));
    }
  }, [initiativeItems.length]);

  return (
      <Box sx={{ overflowX: "auto", overflowY: "auto" }}>
        <List ref={listRef} component={Stack} direction="row" dense={true}>
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
