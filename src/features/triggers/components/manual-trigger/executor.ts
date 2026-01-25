import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData=Record<string,unknown>;

export const manualTriggerExecutor:NodeExecutor<ManualTriggerData>=async({
    nodeId,
    context,
    step
})=>{
    // Todo : Publish "loading" state for manual trigger
    const result=await step.run("manual-trigger",async()=>context);
    // Todo : Publish "Success" state for manual trigger
    return result;  
}