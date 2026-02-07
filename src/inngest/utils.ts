import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort=(nodes:Node[],
    connections:Connection[]
):Node[]=>{
    // if no connections, return nodes as is 
    if(connections.length==0){
       return nodes;
    }

    const edges:[string,string][]=connections.map((conn)=>[
        conn.fromNodeId,
        conn.toNodeId,
    ]);

    // add nodes with no connections as self edges to ensure they are included
    const connectedNodesIds=new Set<string>();
    for(const conn of connections){
        connectedNodesIds.add(conn.fromNodeId);
        connectedNodesIds.add(conn.toNodeId);
    }
     
    for (const node of nodes){
        if(!connectedNodesIds.has(node.id)){
            edges.push([node.id,node.id]);
        }
    }

    // perform sort
    let sortedNodeIds:string[];
    try{
        sortedNodeIds=toposort(edges);
        sortedNodeIds=[...new Set(sortedNodeIds)];
    }catch(error){
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("workflow contains a cycle");
        }
        throw error;
    }

    const nodeMap=new Map(nodes.map((n)=>[n.id,n]));
    return sortedNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean);
}


export const sendWorkflowExecution=async(data:{
    workflowId:string;
    [key:string]:any;
})=>{
    return inngest.send({
      name: "workflows/execute.workflow",
      data,
      id:createId(),
    });
}