const mongoose = require("mongoose");

const {Pet} = require("./mongo.models"); 

class DBClient{
    constructor(connection_string=null){
        this.connection_string = connection_string;
        this.opened = false;
    }

    stayConnected(){
        if(this.connection_string && this.opened) return this;
        mongoose.connect(this.connection_string);
        this.opened = true;
        return this;
    }

    use(connection_string){
        this.connection_string = connection_string;
        return this;
    }

    async getPets(filter={}){
        var pets = new Map();
        await Pet.find(filter, function(err, db_pets){
            if(err) throw err;
            db_pets.forEach(pet => {
                pets[pet._id] = pet
            });
        }).clone();
        return pets;
    }

    async getPet(petId){
        return await Pet.findOne({_id:petId});
    }

    async savePet(pet){
        var pet_instance = new Pet({...pet});
        var pet_json = await pet_instance.save();
        return pet_json;
    }

    async savePets(pets){
        return await Pet.insertMany(pets);
    }

    async updatePet(petId, pet){
        return await Pet.findOneAndUpdate({_id:petId}, pet, {
            returnOriginal: false
        });
    }

    async deletePet(petId){
        return await Pet.findOneAndDelete({_id:petId})
    }
}

const client = new DBClient();

module.exports = {
    models: {Pet},
    client
}