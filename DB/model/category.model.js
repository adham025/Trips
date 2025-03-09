import { Schema, model, Types } from "mongoose";


const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Category name is required'],
        min: [2, 'Category name minimum length 2 char'],
        max: [20, 'Category name max length 2 char']

    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, 'Created by is required'],

    },
    publicImageId: String,
}, {
    timestamps: true
})


const categoryModel = model('categories', categorySchema)
export default categoryModel