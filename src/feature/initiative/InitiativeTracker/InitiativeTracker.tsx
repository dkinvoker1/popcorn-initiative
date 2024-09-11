import { useEffect, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import OBR, { isImage, Item, Player } from "@owlbear-rodeo/sdk";

import { InitiativeItem } from "../InitiativeItem";

import addIcon from "../../../assets/add.svg";
import removeIcon from "../../../assets/remove.svg";

import { InitiativeSettings }from "../InitiativeSettings"
import { getPluginId } from "../../plugin/getPluginId";
import { InitiativeHeader } from "./InitiativeHeader";
import { InitiativeTrackerVertical } from "./InitiativeTrackerVertical";
import { InitiativeTrackerHorizontal } from "./InitiativeTrackerHorizontal";
import { isPlainObject } from "../../util/isPlainObject";

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

export function InitiativeTracker() {
  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([]);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");
  const [initiativeSettings, setInitiativeSettings] = useState<InitiativeSettings>({ isVertical: true });

  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
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

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Add to Initiative",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: removeIcon,
          label: "Remove from Initiative",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
            ],
            permissions: ["UPDATE"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          // Check whether to add the items to initiative or remove them
          const addToInitiative = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined
          );
          for (let item of items) {
            if (addToInitiative) {
              item.metadata[getPluginId("metadata")] = {
                hasActionArray: [true],
                active: false,
              };
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []);

  function handleFlipAlignmentClick() {
    const newInitiativeSettings = { isVertical: !initiativeSettings.isVertical};
    setInitiativeSettings(newInitiativeSettings);
  }

  function handleHasActionChange(id: string, newHasAction: boolean, changedIndex: number) {
    if (role !== "GM") {
      return;
    }

    // Set local items immediately
    setInitiativeItems((prev) =>
      prev.map((initiative) => {
        if (initiative.id === id) {
          return {
            ...initiative,
            hasActionArray: initiative.hasActionArray.map((value, index) => (
              changedIndex === index?
              newHasAction:value
            )),
            active: true
          };
        } else {
          return {
            ...initiative,
            active: false
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
          if (isMetadata(metadata)) {
            if (item.id === id){
              metadata.hasActionArray = metadata.hasActionArray.map((value, index) => (
                changedIndex === index?
                newHasAction:value
              ));
              metadata.active = true;
            } else {
              metadata.active = false;
            }
          }
        }
      }
    );
  }

  return (
    <Stack height="100vh">
      <InitiativeHeader
        isGm = {role === "GM"}
        subtitle = {
          initiativeItems.length === 0
            ? "Select a character to start initiative"
            : undefined
        }
        handleFlipAlignmentClick = {handleFlipAlignmentClick}
        isVertical = {initiativeSettings.isVertical}
      />
      {initiativeSettings.isVertical ?
        <InitiativeTrackerVertical
          initiativeItems={initiativeItems}
          onHasActionChange={handleHasActionChange}
          isGm={role === "GM"}
        ></InitiativeTrackerVertical>
      : <InitiativeTrackerHorizontal
          initiativeItems={initiativeItems}
          onHasActionChange={handleHasActionChange}
          isGm={role === "GM"}
        ></InitiativeTrackerHorizontal>}
    </Stack>
  );
}
