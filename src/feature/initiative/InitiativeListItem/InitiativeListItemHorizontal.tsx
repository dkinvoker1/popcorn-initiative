import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { InitiativeItem } from "../InitiativeItem";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onHasActionChange: (initiativeId: string, hasAction: boolean) => void;
  showHidden: boolean;
  onDoubleClick: () => Promise<void>;
};

export function InitiativeListItemHorizontal({
  initiative,
  onHasActionChange: onHasActionChange,
  showHidden,
  onDoubleClick: onDoubleClick,
}: InitiativeListItemProps) {
  if (!initiative.visible && !showHidden) {
    return null;
  }

  return ( 
    <ListItem
      selected={initiative.active}
      dense = {true}
    >
      <List
        onDoubleClick={onDoubleClick}>
        <ListItem disablePadding = {true}>
          {!initiative.visible && showHidden && (
            <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
              <VisibilityOffRounded fontSize="small" />
            </ListItemIcon>
          )}
          <Checkbox
              checked={initiative.hasAction}
              onChange={(e) => {
                  onHasActionChange(initiative.id, e.target.checked);
              }}
              onDoubleClick={(e) => e.stopPropagation()}
              disabled={!showHidden}
          />
        </ListItem>
        <ListItem disablePadding = {true}>
            <img src={initiative.imgSrc} width={80}/>
        </ListItem>
      </List>
    </ListItem>
  );
}
