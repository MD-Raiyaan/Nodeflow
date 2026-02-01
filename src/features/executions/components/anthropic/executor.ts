import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import {generateText} from "ai"
import Handlebars from "handlebars";
import { anthropicChannel } from "@/inngest/channels/anthropic";


Handlebars.registerHelper("json", (context) => {
  const stringified = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(stringified);
  return safeString;
});

type GeminiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const AnthropicExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    anthropicChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if(!data.variableName){
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Variable name is required");
  }

  if(!data.userPrompt){
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("User prompt is required");
  }

  // todo : check for credential
  
  const systemPrompt=data.systemPrompt
  ? Handlebars.compile(data.systemPrompt)(context)
  : "You are a helpful assistant.";

  const userPrompt=Handlebars.compile(data.userPrompt)(context);
  const credentialValue=process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // todo : fetch crdential 

  const anthropic = createAnthropic({
    apiKey: credentialValue,
  });  

  try{
    const {steps}=await step.ai.wrap("openai-generate-text",
      generateText,
      {
        model:anthropic("claude-sonnet-4-0"),
        system:systemPrompt,
        prompt:userPrompt,
        experimental_telemetry:{
          isEnabled:true,
          recordInputs:true,
          recordOutputs:true,
        }
      },
    );
     
    const text=steps[0].content[0].type==="text"?
      steps[0].content[0].text:"";
    
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]:{
        text,
      },
    }

  }catch(error){
     await publish(
       anthropicChannel().status({
         nodeId,
         status: "error",
       }),
     );
     throw error;
  }

};
