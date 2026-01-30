import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type googleformTriggerData = Record<string, unknown>;

export const googleformTriggerExecutor: NodeExecutor<
  googleformTriggerData
> = async ({ nodeId, context, step, publish }) => {
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "loading",
    }),
  );
  const result = await step.run("google-form-trigger", async () => context);
  await publish(
    googleFormTriggerChannel().status({
      nodeId,
      status: "success",
    }),
  );
  return result;
};
