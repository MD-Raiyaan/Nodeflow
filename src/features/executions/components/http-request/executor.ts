import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as kyOptions} from "ky";

type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // Todo : Publish "loading" state for manual trigger
  if(!data.endpoint){
    //  publish error 
    throw new NonRetriableError("HTTP Request node:No endpoint configured");
  }
  const result = await step.run("http-request", async () =>{
     const method=data.method || "GET";
     const endpoint = data.endpoint!;
     const options:kyOptions={method};
     if(["POST","PUT","PATCH"].includes(method)){
       if(data.body){
        options.body=data.body;
       }
     }
     const response =await ky(endpoint,options);
     const contentType=response.headers.get("content-type")
     const responseData=contentType?.includes("application/json")? await response.json() : await response.text();
     return {
      ...context,
      httpResonse:{
         status:response.status,
         statusText:response.statusText,
         data:responseData
      }
     }
  } );
  // Todo : Publish "Success" state for manual trigger
  return result;
};
