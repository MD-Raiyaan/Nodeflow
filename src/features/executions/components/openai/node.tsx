"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenaiFormValues,OpenAiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenaiRealtimeToken } from "./actions";

type OpenAiNodeData = {
  credentialId?:string;
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `gpt-4:${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";
  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "openai-execution",
    topic: "status",
    refreshToken: fetchOpenaiRealtimeToken,
  });
  const [diaglogOpen, setDialogOpen] = useState(false);
  const handleOpenSettings = () => setDialogOpen(true);
  const { setNodes } = useReactFlow();

  const handleSubmit = (values: OpenaiFormValues) => {
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
      <OpenAiDialog
        open={diaglogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/openai.svg"}
        name="OpenAi"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

OpenAiNode.displayName = "OpenAiNode";
