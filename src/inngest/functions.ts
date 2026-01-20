import { inngest } from "./client";
import prisma from "@/lib/db";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import {generateText} from "ai";

export const helloWorld = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    
    const {steps:geminiSteps}=await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model:google("gemini-2.5-flash"),
        system:"you are a helpful assistant.",
        prompt:"what is 2+2 ?",
        experimental_telemetry:{
          isEnabled:true,
          recordInputs:true,
          recordOutputs:true
        }
      }
    )

    return { geminiSteps };
  },
);
