import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleformTriggerDialog} from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [diaglogOpen,setDialogOpen]=useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "google-form-trigger-execution",
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });
  const handleOpenSettings=()=>setDialogOpen(true);
  return (
    <>
      <GoogleformTriggerDialog open={diaglogOpen} onOpenChange={setDialogOpen}  />
      <BaseTriggerNode
        {...props}
        icon="/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
