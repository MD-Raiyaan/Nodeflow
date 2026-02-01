import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import {generateText} from "ai"
import Handlebars from "handlebars";
import { openaiChannel } from "@/inngest/channels/openai";

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

export const OpenaiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    openaiChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if(!data.variableName){
    await publish(
      openaiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Variable name is required");
  }

  if(!data.userPrompt){
    await publish(
      openaiChannel().status({
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

  const openai = createOpenAI({
    apiKey: credentialValue,
  });  

  try{
    const {steps}=await step.ai.wrap("openai-generate-text",
      generateText,
      {
        model:openai("gpt-4"),
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
      openaiChannel().status({
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
       openaiChannel().status({
         nodeId,
         status: "error",
       }),
     );
     throw error;
  }

};
