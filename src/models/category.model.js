import { Schema, model } from "mongoose";

const CategoryShema = Schema({
  label: {
    type: String,
  },
  value: {
    type: String,
  },
});

const CategoriesModel = model("Category", CategoryShema);

export default CategoriesModel;
