import { Document, model, Model, models, Schema, Types } from "mongoose";

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  name: string;
  profile_path: string;
}

export interface IMovie extends Document{
  _id: Types.ObjectId
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  casts: Cast[];
  release_date: string;
  original_language: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

const GenreSchema = new Schema<Genre>({
  id: { type: Number, required: true },
  name: { type: String, required: false },
});

const CastsSchema = new Schema<Cast>({
  name: { type: String, required: true },
  profile_path: { type: String, required: false },
});

const movieSchema = new Schema<IMovie>(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    backdrop_path: {
      type: String,
      required: false,
    },
    release_date: {
      type: String,
      required: true,
    },
    original_language: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: false
    },
    genres: {
      type: [GenreSchema],
      required: true,
    },
    casts: {
      type: [CastsSchema],
      required: true,
    },
    vote_average: {
      type: Number,
      required: true,
    },
    vote_count: {
      type: Number,
      required: true,
    },
    runtime: {
      type: Number,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Movie:Model<IMovie> = models?.Movie || model<IMovie>("Movie", movieSchema);

export default Movie
