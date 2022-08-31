const express = require("express");
const {client} = require("./db/mongo.client");
const { MemoryUploader, getDataFromExcel } = require("./main.helper");

const petApp = express();


petApp.get("/pet/",async (req,res)=>{
    const pets = await client.getPets();
    res.status(200).json(pets)
})

petApp.get("/pet/:petId", async (req, res)=>{
    const id = req.params.petId;
    const pets = await client.getPet(id);
    res.status(200).json(pets);
})


petApp.post("/pet/",  MemoryUploader.single("file"), async (req, res)=>{
    const file = req.file.buffer;
    const sheet = req.body.sheetName;
    const data = getDataFromExcel(file, sheet);
    const savedData = await client.savePets(data);
    res.status(200).json(savedData);
});

petApp.patch("/pet/:petId", async (req, res)=>{
    const petId = req.params.petId;
    const pet = req.body;
    const updatedPet = await client.updatePet(petId, pet);
    res.status(200).json(updatedPet);
})

petApp.delete("/pet/:petId", async (req, res)=>{
    const petId = req.params.petId;
    const pet = await client.deletePet(petId);
    res.status(200).json(pet);
})

module.exports = {petApp};