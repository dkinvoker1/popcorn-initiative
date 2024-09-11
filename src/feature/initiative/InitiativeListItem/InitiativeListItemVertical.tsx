import { IconButton, ListItemIcon, Checkbox, ListItem, Box } from "@mui/material";
import { Settings, VisibilityOffRounded } from '@mui/icons-material';

import { InitiativeItem } from "../InitiativeItem";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../plugin/getPluginId";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onHasActionChange: (initiativeId: string, hasAction: boolean, index: number) => void;
  isGm: boolean;
  onDoubleClick: () => Promise<void>;
};

export function InitiativeListItemVertical({
  initiative,
  onHasActionChange: onHasActionChange,
  isGm: isGm,
  onDoubleClick: onDoubleClick,
}: InitiativeListItemProps) {
  if (!initiative.visible && !isGm) {
    return null;
  }

  const checkboxList = initiative.hasActionArray.map((value, index) => (
    <Checkbox
      checked={initiative.hasActionArray[index]}
      onChange={(e) => {
        onHasActionChange(initiative.id, e.target.checked, index);
      }}
      onDoubleClick={(e) => e.stopPropagation()}
      disabled={!isGm}
    /> 
  ));

  return (
    <ListItem 
      key={initiative.id}
      sx = {{
        padding: "0px",
        paddingLeft: "8px",
        paddingTop: "8px",
        paddingBottom: "8px"
      }}
      secondaryAction={
        checkboxList
      }
      selected={initiative.active}
      onDoubleClick={onDoubleClick}
    >
      {!initiative.visible && isGm && (
        <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
          <VisibilityOffRounded fontSize="small" />
        </ListItemIcon>
      )}
      <img src={initiative.imgSrc} width={80}/>
      {isGm && (
        <IconButton 
          onClick={() => {
            OBR.popover.open({
              id:  getPluginId("popover"),
              url: `/activation-amount-picker.html?initiativeId=${initiative.id}`,
              height: 100,
              width: 200,
            });
          }}
        >
          <Settings />
        </IconButton>
      )}
    </ListItem>
  );
}
