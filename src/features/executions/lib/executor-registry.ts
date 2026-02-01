import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { HttpRequestExecutor } from "../components/http-request/executor";
import { googleformTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { StripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";

export const executorRegistry:Record<NodeType,NodeExecutor>={
  [NodeType.MANUAL_TRIGGER]:manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]:HttpRequestExecutor,
  [NodeType.INITIAL]:manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]:googleformTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]:StripeTriggerExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type : ${type}`);
  }
  return executor;
};