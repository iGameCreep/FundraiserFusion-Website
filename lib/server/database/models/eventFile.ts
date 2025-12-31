import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id: String,
    b64: String,
    createdAt: {
        type: Date,
        expires: 60 * 60 * 24,
    },
});

const EventFile =
    mongoose.models.EventFile ?? mongoose.model("EventFile", schema);

export default EventFile;
