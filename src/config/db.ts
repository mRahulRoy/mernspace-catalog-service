import mongoose from "mongoose";
import config from "config";

export const init = async () => {
    await mongoose.connect(config.get("database.url"));
};
