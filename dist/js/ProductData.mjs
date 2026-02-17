
export function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;//here I'm actually using  NAME in the json to locate the json files hence a mis match between the info in the category json and actual json name will be chaotic
    this.path = `../json/${this.category}.json`;// this chooses where toad the data from as such the category info
  }
  async getData() {

      try {
          const response = await fetch(this.path);
          if (response){
              const data = await convertToJson(response);
              return this.category === "tents" ? data : data.Result;
          }
          else {
            return "data not available";
          }
      } 
      catch (error){
          return "data not available";
      }
  
}



  async findProductById(id) {
  const data = await this.getData();
  return data.find(
    item => item.Id.toString().toLowerCase() === id.toString().toLowerCase()
  );
}

}
