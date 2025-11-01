import { Document, model, Model, models, Schema, Types } from "mongoose";

export enum SeatStatus {
  LOCKED = "LOCKED",
  BOOKED = "BOOKED",
}

export interface IShow extends Document {
  _id: Types.ObjectId;
  movie: Schema.Types.ObjectId;
  showDateTime: Date;
  showPrice: number;
  // occupiedSeats: {
  //   [seatNumber: string]: {
  //     user: string,
  //     status: SeatStatus;
  //     expireAt?: Date;
  //   };
  // };
  occupiedSeats: Record<string, string>
}

const showSchema = new Schema<IShow>(
  {
    movie: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Movie",
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
    occupiedSeats: {
      type: Object,
      default: {},
    },
  },
  {
    minimize: false,
  }
);

const Show: Model<IShow> = models?.Show || model<IShow>("Show", showSchema);

export default Show;
