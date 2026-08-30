import * as z from "zod"
import { tool } from "langchain"
import beautyWellness from "../../db/beauty_wellness.json" with { type: "json" };
import construction from "../../db/construction.json" with { type: "json" };
import drivingLogistics from "../../db/driving_logistics.json" with { type: "json" };
import electricalWork from "../../db/electrical_work.json" with { type: "json" };
import foodProcessingHandicrafts from "../../db/food_processing_handicrafts.json" with { type: "json" };
import tailoringApparel from "../../db/tailoring_apparel.json" with { type: "json" }; 


const sectors = {
  beauty_wellness: beautyWellness,
  construction: construction,
  driving_logistics: drivingLogistics,
  electrical_work: electricalWork,
  food_processing_handicrafts: foodProcessingHandicrafts,
  tailoring_apparel: tailoringApparel,
};

const engine = (key) => {

};

const details = tool(
  async ({ id }) => {
    try {
       if(!key){
        return "Cant find any jobs sorry , we will update u ";
       };
       
    } catch (err) {
       return "err" ;
    }
     
    },
    {
        name: "filter",
        description:
            "Filter jobs by sector. Only use this when the user's request matches one of the supported sectors. Pass the exact sector key.",
        schema: z.object({
            key: z.enum([
            "beauty_wellness",
            "construction",
            "driving_logistics",
            "electrical_work",
            "food_processing_handicrafts",
            "tailoring_apparel",
            ]),
        }),
    }
);

export { details } ;
