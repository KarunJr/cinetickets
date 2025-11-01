import { Document, model, Model, models, Schema, Types } from "mongoose";

export enum Status {
  PENDING = "PENDING",
  FAILED = "FAILED",
  COMPLETE = "COMPLETE",
  LATE_PAYMENT = "LATE_PAYMENT"
}
export interface IBookingSchema extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  show: Types.ObjectId;
  amount: number;
  bookedSeats: [string];
  status: Status;
  transactionUuid: string;
  paymentLink: string;
}

const bookingSchema = new Schema<IBookingSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    show: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Show",
    },
    amount: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: [Array],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    transactionUuid: {
      type: String,
    },
    paymentLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBookingSchema> =
  models?.Booking || model<IBookingSchema>("Booking", bookingSchema);

export default Booking;
