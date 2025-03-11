import tripModel from "../../DB/model/trip.model.js"

export const searchController = async (req,res)=>{
    try{
        const {search} = req.query;
        
        const data = await tripModel.find({
            $or: [
                { title: { $regex: search, $options: "i" } }, 
                { description: { $regex: search, $options: "i" } },
                { destination: { $regex: search, $options: "i" } }
              ],
        })
        if(data.length == 0){
            return res.status(400).json({status: "Failed" , data: "Not found"})
        }
        res.status(200).json({status: "success" , data});
    }
    catch(error){
        res.status(400).json({status: "error" , error})
    }
} 
