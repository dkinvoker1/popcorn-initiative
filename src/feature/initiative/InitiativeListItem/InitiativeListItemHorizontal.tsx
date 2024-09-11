import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { InitiativeItem } from "../InitiativeItem";
import { IconButton } from "@mui/material";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../plugin/getPluginId";
import { Settings } from "@mui/icons-material";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onHasActionChange: (initiativeId: string, hasAction: boolean, index: number) => void;
  isGm: boolean;
  onDoubleClick: () => Promise<void>;
};

export function InitiativeListItemHorizontal({
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
      selected={initiative.active}
      dense = {true}
    >
      <List
        onDoubleClick={onDoubleClick}
        style={{flex:'auto'}}
      >
        <ListItem disablePadding = {true} style={{justifyContent:'center'}} >
          {
            checkboxList
          }
        </ListItem>
        <ListItem disablePadding = {true} style={{justifyContent:'center'}} >
            <img src={initiative.imgSrc} width={80}/>
        </ListItem>
        <ListItem disablePadding = {true} style={{justifyContent:'center'}} >
          {!initiative.visible && isGm && (
            <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
              <VisibilityOffRounded fontSize="small" />
            </ListItemIcon>
          )}
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
      </List>
    </ListItem>
  );
}
