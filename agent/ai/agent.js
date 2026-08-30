// for sending msg to user and making a record for recporting agent

import { ChatGroq } from "@langchain/groq"
import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

// tools 

import {details} from "../tools/details";


const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: 1024,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY,
}) ;


// giving tools to llm 

const modelWithTools = model.bindTools([
    details
]);

// condt tools calling 

const toolNode = new ToolNode([
    details
]);

// brain node , calling llm

async function llmNode(state) {
  const response = await modelWithTools.invoke(state.messages);
  return {
    messages: [response],
  };
}

// now condition to decide tool call 

function shouldContinue(state) {
  const lastMessage = state.messages.at(-1);

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return END;
}

// now definig graph 

const graph = new StateGraph(MessagesAnnotation);

// adding nodes and edges to graph 

graph.addEdge(START , "llm") ;
graph.addNode("llm" , llmNode) ;
graph.addConditionalEdges(
  "llm",
  shouldContinue,
  {
    tools: "tools",
    [END]: END,
  }
) ;
graph.addNode("tools",toolNode) ;
graph.addEdge("tools","llm") ;
// compiling  graph 

const ai = graph.compile();

// now invoke
async  function agent (data) {
  while (true){
    const result = await ai.invoke(
      {
        messages: [
            new SystemMessage(
               `
                  You are a job matching assistant.

                  STEP 1 — FIND THE BEST JOB:
                  When matching a job, prioritize the job's keywords.
                  The user's wording does not need to exactly match the job_role.
                  Match synonyms, Hindi words, Hinglish, and natural descriptions of the work
                  against the job_role and keywords.
                  Use the following job table to match the user's qualification, skills, experience,
                  or stated work with the most suitable job.

                  | id | sector | job_role | qualification |
                  |---|---|---|---|
                  | CSDCI_CON_Q0101 | Construction | Helper Mason | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0102 | Construction | Assistant Mason | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0113 | Construction | Brick Mason | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0203 | Construction | Bar Bender and Steel Fixer | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q3001 | Construction | Shuttering Carpenter | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0602 | Construction | Assistant Electrician | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0503 | Construction | Construction Painter and Decorator | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | CSDCI_CON_Q0314 | Construction | Assistant Scaffolder-System | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | DGT_ELECTRICIAN | Electrical Work | Electrician | Passed 10th class examination with Science and Mathematics or with vocational subject in same sector or its equivalent. |
                  | DGT_WIREMAN | Electrical Work | Wireman | Passed 8th class examination. |
                  | DGT_SOLAR_TECH_ELEC | Electrical Work | Solar Technician (Electrical) | Passed 10th class examination. |
                  | DGT_LIFT_ESCALATOR | Electrical Work | Lift and Escalator Mechanic | Passed 10th class examination. |
                  | DGT_ELECTRONICS_MECHANIC | Electrical Work | Electronics Mechanic | Passed 10th Class examination with Science and Mathematics or with vocational subject in same sector or its equivalent. |
                  | DGT_TECH_ELECTRONICS_REPAIR | Electrical Work | Technician Electronics System Design and Repair | 10th Class Passed; lateral entry is available for relevant NTC holders as stated by DGT. |
                  | LSC_LSC_Q1301 | Driving/Logistics | Cargo Vehicle Driver (Non-hazardous Goods) | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q1302 | Driving/Logistics | Reefer Vehicle Operator cum Driver | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q1001 | Driving/Logistics | Land Transportation Associate | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q1002 | Driving/Logistics | Land Transportation Executive | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q1003 | Driving/Logistics | Land Transportation Supervisor | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q2603 | Driving/Logistics | E-commerce Delivery Associate | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q0101 | Driving/Logistics | Warehouse Associate | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |
                  | LSC_LSC_Q3201 | Driving/Logistics | Supply Chain Associate | QP-specific minimum qualification not independently verified from the indexed QP page; verify QP PDF. |

                  Match the user prefrence to the one and only closest suitable job from this table.

                 STEP 2 — GET DETAILS:

                    If a suitable job is found by search_job, take the exact "id" of that job.
                    NOTE : Only call tool once .
                    Then call the "details" tool with ONLY that job ID .
                    Example:
                    If the matched job is:
                    id: DGT_ELECTRICIAN
                    Call:
                    details({ id: "DGT_ELECTRICIAN" })
                    Do not invent, modify, or guess the ID.
                    If no suitable job is found, do not call details.

                   STEP 3 — RESPOND:

                    FINAL RESPONSE:

                    After the details tool returns the job information, respond with ONLY a clear,
                    technical, voice-friendly message containing all available job details.

                    Include every field returned by the details tool:

                    Job ID
                    Job Role
                    Hindi Name
                    Sector
                    QP Code
                    Source
                    NSQF Level
                    Minimum Qualification
                    Keywords

                    Do not return JSON.
                    Do not use markdown.
                    Do not add introductions such as "Here are the full details".
                    Do not omit any field.

                    Example format:

                    Job ID: DGT_WIREMAN.
                    Job Role: Wireman.
                    Hindi Name: वायरमैन.
                    Sector: Electrical Work.
                    QP Code: DGT_WIREMAN.
                    Source: DGT CTS/ITI.
                    NSQF Level: 3.
                    Minimum Qualification: Passed 8th class examination.
                    Keywords: wireman, वायरमैन, तार वाला.

                    Return only this final message.

                    If the details tool returns no job information, simply say:
                    "No suitable job found."
                  `
            ),
            new HumanMessage(data)
        ]
      } ,
      {
        recursionLimit: 100,
      }
    ) ;
    const lastMessage = result.messages[result.messages.length - 1];
    return lastMessage.content;
   // console.log(" 🤖 : " , lastMessage.content);
  } ;
} ; 

export default agent;