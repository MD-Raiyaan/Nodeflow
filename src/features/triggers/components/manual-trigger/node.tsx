import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [diaglogOpen,setDialogOpen]=useState(false);
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "manual-trigger-execution",
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });
  const handleOpenSettings=()=>setDialogOpen(true);
  return (
    <>
      <ManualTriggerDialog open={diaglogOpen} onOpenChange={setDialogOpen}  />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="when clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
