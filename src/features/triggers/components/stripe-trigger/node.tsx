import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [diaglogOpen,setDialogOpen]=useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "stripe-trigger-execution",
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });
  const handleOpenSettings=()=>setDialogOpen(true);
  return (
    <>
      <StripeTriggerDialog open={diaglogOpen} onOpenChange={setDialogOpen}  />
      <BaseTriggerNode
        {...props}
        icon="/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
