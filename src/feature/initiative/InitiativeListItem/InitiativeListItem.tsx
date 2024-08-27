import OBR, { Math2, Vector2 } from "@owlbear-rodeo/sdk";

import { InitiativeItem } from "../InitiativeItem";
import { InitiativeListItemVertical } from "./InitiativeListItemVertical";
import { InitiativeListItemHorizontal } from "./InitiativeListItemHorizontal";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onHasActionChange: (initiativeId: string, hasAction: boolean) => void;
  isGm: boolean;
  isVertical: boolean;
};

export function InitiativeListItem({
  initiative,
  onHasActionChange: onHasActionChange,
  isGm: isGm,
  isVertical,
}: InitiativeListItemProps) {
  if (!initiative.visible && !isGm) {
    return null;
  }

  async function handleDoubleClick() {
    // Deselect the list item text
    window.getSelection()?.removeAllRanges();

    // Select this item
    await OBR.player.select([initiative.id]);

    // Focus on this item

    // Convert the center of the selected item to screen-space
    const bounds = await OBR.scene.items.getItemBounds([initiative.id]);
    const boundsAbsoluteCenter = await OBR.viewport.transformPoint(
      bounds.center
    );

    // Get the center of the viewport in screen-space
    const viewportWidth = await OBR.viewport.getWidth();
    const viewportHeight = await OBR.viewport.getHeight();
    const viewportCenter: Vector2 = {
      x: viewportWidth / 2,
      y: viewportHeight / 2,
    };

    // Offset the item center by the viewport center
    const absoluteCenter = Math2.subtract(boundsAbsoluteCenter, viewportCenter);

    // Convert the center to world-space
    const relativeCenter = await OBR.viewport.inverseTransformPoint(
      absoluteCenter
    );

    // Invert and scale the world-space position to match a viewport position offset
    const viewportScale = await OBR.viewport.getScale();
    const viewportPosition = Math2.multiply(relativeCenter, -viewportScale);

    await OBR.viewport.animateTo({
      scale: viewportScale,
      position: viewportPosition,
    });
  }

  return (
    isVertical ?
      <InitiativeListItemVertical
        initiative={initiative}
        onHasActionChange={onHasActionChange}
        isGm={isGm}
        onDoubleClick={handleDoubleClick}
      />
    : <InitiativeListItemHorizontal
        initiative={initiative}
        onHasActionChange={onHasActionChange}
        isGm={isGm}
        onDoubleClick={handleDoubleClick}
      />  
  );
}
