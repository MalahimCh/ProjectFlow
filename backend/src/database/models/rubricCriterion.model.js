import mongoose from "mongoose";

const rubricCriterionSchema = new mongoose.Schema(
  {
    rubric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rubric",
      required: true,
    },

    criterionName: {
      type: String,
      required: true,
      trim: true,
    },

    marksAllocated: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

rubricCriterionSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

const RubricCriterion = mongoose.model(
  "RubricCriterion",
  rubricCriterionSchema,
);

export default RubricCriterion;
