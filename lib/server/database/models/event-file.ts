import mongoose from "mongoose";

const schema = new mongoose.Schema({ id: String, b64: String });
const EventFile =
    mongoose.models.EventFile ?? mongoose.model("EventFile", schema);

export default EventFile;
