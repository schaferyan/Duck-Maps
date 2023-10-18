import { config, getJson} from "serpapi";
import * as dotenv from "dotenv";

dotenv.config();
config.api_key = process.env.SERPAPI_KEY;

const params = {
  engine: "duckduckgo_maps",
  strict_bbox: "1"
}

const coffee_shops = [];

const area = [30.43874, -97.873607,30.195627,-97.624932];

function getResults(q, bbox){
  params.q = q;
  params.bbox = bbox;
  getJson( params, (results) => {
    const local_results = results.local_results;
    if(local_results){
      console.log(local_results.length - 1 + " results");
      for (const result of local_results){
        console.log(result.title);
      }

    }
  });
}


/* the top corner of our box will be the same as the top corner of the overall area. The lower corner is determined by the
size of the moving window */

/*bbox=30.275933298683846,-97.75356226769851,30.26222921173649,-97.73221544030126

30.275933298683846 - 30.26222921173649 = 0.01370408694
-97.75356226769851 - -97.73221544030126 = -0.02134682739

reverse the signs - the first should be subtracted from the second

top one is the height of the window
bottom is the width

*/
const height_offset = -0.01370408694;
const width_offset = 0.02134682739;
// const height_offset = -0.05;
// const width_offset = 0.05;



function findAll(q, area){
 const coords = [area[0], area[1], area[0] + height_offset, area[1] + width_offset];

 /loop while the top part of our window is above ant to the left of the bottom and right borsers of the area/
 while(coords[0] > area[2]){
  while(coords[1] < area[3]){
    const coords_string = coords.toString();
    console.log(coords_string);
    getResults(q, coords_string);
    coords[1] += width_offset;
    coords[3] += width_offset;
  }
  coords[1] = area[1];
  coords[3] = area[3];
  coords[0] += height_offset;
  coords[2] += height_offset;
 }

}

findAll("coffee", area);



// getResults("coffee", bbox_string);

