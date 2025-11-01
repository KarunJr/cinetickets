import { Document, model, Model, models, Schema } from "mongoose";

export interface IFavourtie extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  movies: Schema.Types.ObjectId[];
}

const favouriteSchema = new Schema<IFavourtie>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movies: {
      type: [Schema.Types.ObjectId],
      ref: "Movie",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Favourite: Model<IFavourtie> =
  models?.Favourite || model<IFavourtie>("Favourite", favouriteSchema);

export default Favourite;
