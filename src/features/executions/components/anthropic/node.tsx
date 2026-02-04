"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog,AnthropicFormValues} from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./actions";

type AnthropicNodeData = {
  credentialId?: string;
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `claude-sonnet-4-0:${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "anthropic-execution",
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });
  const [diaglogOpen, setDialogOpen] = useState(false);
  const handleOpenSettings = () => setDialogOpen(true);
  const { setNodes } = useReactFlow();

  const handleSubmit = (values: AnthropicFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <AnthropicDialog
        open={diaglogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/anthropic.svg"}
        name="Anthropic"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

AnthropicNode.displayName = "AnthropicNode";
