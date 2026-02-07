import { useQueryStates } from "nuqs";
import { credentialsParams } from "../../executions/params";

export const useCredentialsParams = () => {
  return useQueryStates(credentialsParams);
};
