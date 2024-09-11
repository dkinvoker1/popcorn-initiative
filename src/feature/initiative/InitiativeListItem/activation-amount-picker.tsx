import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./../../../index.css";
import { PluginThemeProvider } from "../../plugin/PluginThemeProvider";
import { PluginGate } from "../../plugin/PluginGate";
import { InitiativeItem } from "../InitiativeItem";
import OBR, { isImage, Item } from "@owlbear-rodeo/sdk";
import { isPlainObject } from "../../util/isPlainObject";
import { getPluginId } from "../../plugin/getPluginId";
import { Add, Remove } from "@mui/icons-material";
import { CardHeader, Divider, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/joy";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { hasActionArray: boolean[]; active: boolean } {
  return (
    isPlainObject(metadata) &&
    Array.isArray(metadata.hasActionArray) &&
    typeof metadata.active === "boolean"
  );
}

function ActivationAmountPicker() {
  const [initiativeId, setInitiativeId] = useState<string | null>(null);
  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get("initiativeId");

    if (amountParam) {
      setInitiativeId(String(amountParam));
    }
  }, []);

  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const initiativeItems: InitiativeItem[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            initiativeItems.push({
              id: item.id,
              imgSrc: item.image.url,
              active: metadata.active,
              visible: item.visible,
              hasActionArray: metadata.hasActionArray,
            });
          }
        }
      }
      setInitiativeItems(initiativeItems);
    };

    OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);


  function addAction() {
    handleHasActionChange(true);
  }

  function subtractAction() {
    handleHasActionChange(false);
  }

  function handleHasActionChange(add: boolean) {
    // Set local items immediately
    setInitiativeItems((prev) =>
      prev.map((initiative) => {
        if (initiative.id === initiativeId) {
          return {
            ...initiative,
            hasActionArray: getNewHasActionArray(add, initiative.hasActionArray),
          };
        } else {
          return {
            ...initiative,
          }
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems(
      initiativeItems.map((init) => init.id),
      (items) => {
        for (let item of items) {
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata) && item.id === initiativeId) {
            metadata.hasActionArray = getNewHasActionArray(add, metadata.hasActionArray);
          }
        }
      }
    );
  }

  function getNewHasActionArray(add: boolean, oldArray: boolean[]){
    var newHasActionArray = oldArray;

    if (add && newHasActionArray.length < 3) {
      newHasActionArray = newHasActionArray.concat([true]);
    }
    else if(!add && newHasActionArray.length > 1){
      newHasActionArray.pop();
    }

    return newHasActionArray;
  }

  return (
    <>
      <CardHeader
        title={"Available actions"}
        titleTypographyProps={{
          textAlign: "center",
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
        sx = {{
         paddingBottom: "0px",
        }}
      />
      <Divider variant="middle" />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton onClick={subtractAction} >
          <Remove />
        </IconButton>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            fontSize: "1.125rem",
            fontWeight: "bold",
            display: "inline-block",
            color: "text.primary",
          }}
        >
          {initiativeItems.find((initiative) => initiative.id === initiativeId )?.hasActionArray.length}
        </Typography>
        <IconButton onClick={addAction} >
          <Add />
        </IconButton>
      </Box>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("activation-amount-picker") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <ActivationAmountPicker />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>
);
