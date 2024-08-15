import { useEffect, useState } from "react";

import OBR, { Metadata } from "@owlbear-rodeo/sdk";

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Add, Remove, TableRows, ViewColumn } from "@mui/icons-material";


import { InitiativeRound } from "../InitiativeRound";
import { isPlainObject } from "../../util/isPlainObject";

/** Check that the item metadata is in the correct format */
function isMetadata(
  metadata: unknown
): metadata is { roundNumber: number } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.roundNumber === "number"
  );
}

export function InitiativeHeader({
  subtitle,
  isGm,
  handleFlipAlignmentClick,
  isVertical,
}: {
  subtitle?: string;
  isGm: boolean;
  handleFlipAlignmentClick: () => void;
  isVertical: boolean;
}) {
  const [initiativeRound, setInitiativeRound] = useState<InitiativeRound>({ roundNumber: 1 });


  useEffect(() => {
    const handleRoundChange = async (metadata: Metadata) => {
      if (isMetadata(metadata)) {
        setInitiativeRound({ roundNumber: metadata.roundNumber });
      }
    };

    OBR.room.onMetadataChange(handleRoundChange);
  }, []);


  function addRound() {
    if (!isGm) {
      return;
    }

    handleChangeRound(initiativeRound.roundNumber + 1);
  }

  function subtractRound() {
    if (!isGm) {
      return;
    }

    if (initiativeRound.roundNumber > 1) {
      handleChangeRound(initiativeRound.roundNumber - 1);
    }
  }

  function handleChangeRound(newRound: number) {
    // Set local immediately
    setInitiativeRound({ roundNumber: newRound });

    // Sync changes over the network
    OBR.room.setMetadata({ roundNumber: newRound });
  }

  return (
    <>
      <CardHeader
        title={"Round: " + initiativeRound.roundNumber}
        action={
          <>
            {isGm && 
              (<>
                <IconButton onClick={subtractRound} >
                  <Remove />
                </IconButton>
                <IconButton onClick={addRound} >
                  <Add />
                </IconButton>
              </>)
            }
            <IconButton onClick={handleFlipAlignmentClick} >
              {isVertical ? <ViewColumn /> : <TableRows />}
            </IconButton>
          </>}
        titleTypographyProps={{
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
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: "inline-block",
            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}
