import { useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { InitiativeTracker } from "./feature/initiative/InitiativeTracker/InitiativeTracker";
import { EmptyHeader } from "./feature/initiative/InitiativeTracker/EmptyHeader";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return <InitiativeTracker />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
      <EmptyHeader />
    );
  }
}
