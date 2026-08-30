import * as z from "zod";
import { tool } from "langchain";

import construction from "../../db/construction.json" with { type: "json" };
import drivingLogistics from "../../db/driving_logistics.json" with { type: "json" };
import electricalWork from "../../db/electrical_work.json" with { type: "json" };

const details = tool(
  async ({ id }) => {
    try {
      console.log("✅ ID:", id);

      if (id.startsWith("CSDCI")) {
        // Construction
        const result = construction.filter((item) => item.id === id);
        return JSON.stringify(result);
      }

      if (id.startsWith("LSC")) {
        // Driving / Logistics
        const result = drivingLogistics.filter((item) => item.id === id);
        return JSON.stringify(result);
      }

      if (id.startsWith("DGT")) {
        // Electrical
        const result = electricalWork.filter((item) => item.id === id);
        return JSON.stringify(result);
      }

      return JSON.stringify({
        error: "Invalid job ID",
      });

    } catch (err) {
      console.error(err);
      return JSON.stringify({
        error: err.message,
      });
    }
  },
  {
    name: "details",
    description:
      "Get the complete details of a specific job using its job ID. Use it when you found a relevant job.",
    schema: z.object({
      id: z.string(),
    }),
  }
);

export { details };