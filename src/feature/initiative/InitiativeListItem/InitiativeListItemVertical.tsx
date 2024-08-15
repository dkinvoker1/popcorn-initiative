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

export function InitiativeListItemVertical({
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
      key={initiative.id}
      sx = {{
        padding: "0px",
        paddingLeft: "8px"
      }}
      secondaryAction={
        <Checkbox
          checked={initiative.hasAction}
          onChange={(e) => {
            onHasActionChange(initiative.id, e.target.checked);
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          disabled={!showHidden}
        />
      }
      selected={initiative.active}
      onDoubleClick={onDoubleClick}
    >
      {!initiative.visible && showHidden && (
        <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
          <VisibilityOffRounded fontSize="small" />
        </ListItemIcon>
      )}
      <img src={initiative.imgSrc} width={80}/>
    </ListItem>
  );
}
