import { Session } from "next-auth";
import { connectToDatabase } from "../db";
import { DefaultReturn } from "./admin.controller";
import Favourite, { IFavourtie } from "@/models/favourite.model";
import User from "@/models/user.model";
import "@/models/movie.model";

interface AddFavouritesParams {
  session: Session | null;
  movieId: string;
}

export const addFavourites = async ({
  session,
  movieId,
}: AddFavouritesParams): Promise<DefaultReturn> => {
  try {
    await connectToDatabase();
    if (!session) return { success: false, message: "Session not found!" };

    const user = await User.findById(session.user.id);
    if (!user) return { success: false, message: "User not found!" };

    const fav = await Favourite.findOne({ user: user._id });

    await Favourite.findOneAndUpdate(
      { user: session?.user.id },
      { $addToSet: { movies: movieId } },
      { upsert: true, new: true }
    );
    return { success: true, message: "Movie added successfully" };
  } catch (error: any) {
    console.error("Error in addFavourites():", error);
    return { success: false, message: "Session not found!" };
  }
};

interface GetAllFavouritesReturn extends DefaultReturn {
  favourites?: IFavourtie;
}
export const getAllFavourites = async (
  session: Session | null
): Promise<GetAllFavouritesReturn> => {
  try {
    await connectToDatabase();

    const favourites = await Favourite.findOne({
      user: session?.user.id,
    }).populate("movies");

    if (!favourites) return { success: false, message: "No favourties!" };

    return { success: true, message: "Favourites fetched!", favourites };
  } catch (error: any) {
    console.error("Error in getAllFavourites():", error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};

interface DeleteFavouritesParams {
  session: Session | null;
  movieId: string;
}
export const deleteFavourites = async ({
  session,
  movieId,
}: DeleteFavouritesParams): Promise<DefaultReturn> => {
  try {
    await connectToDatabase();

    const favourite = await Favourite.findOneAndUpdate(
      { user: session?.user.id },
      { $pull: { movies: movieId } },
      { new: true }
    );

    if (favourite && favourite.movies.length === 0) {
      await favourite.deleteOne();
    }
    return {
      success: true,
      message: "Removed from favourites",
    };
  } catch (error: any) {
    console.error("Error in deleteFavourites():", error);
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
};
