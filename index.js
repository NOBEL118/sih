import express from "express";
import cors from 'cors';
import {saveData} from "./src/tools/tools";
import {initDB} from "./src/db/database";
import {tool} from "./agent/tool";

const app = express();

app.use(cors());

app.use(express.json());

// db 

try {
    console.log("trying making db ✔️");
    initDB();
    console.log("db done 👍");
} catch (err){
    console.log(err);
};


app.get("/", (req, res) => {
  res.send("SIH backend is running 🚀");
});

app.post("/form", (req, res) => {
    const data = req.body;
    if (!data){
        return "pls send somehting";
    };
    try {
        saveData(
            data.name,
            data.education,
            data.occupation,
            data.skills,
            data.interests,
            data.mobility,
            data.employment_preference,
            data.phone
        );
        console.log(data);
        return res.status(201).json({
            success: true,
            message: "Beneficiary data saved."
        });
    } catch (err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Database error."
        });
    };

});

app.get("/job", (req,res) => {

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

