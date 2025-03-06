import userModel from "../../DB/model/user.model.js";
import bcryptjs from "bcryptjs";
import cloudinary from '../../services/cloudinary.js'
import { uploadFromBuffer } from "../../services/uploadImage.js";
export const changePassword = async (req,res)=>{
    try{
        const {currentPassword , newPassword} = req.body;
        const {userId} = req;
        const {password} = await userModel.findById(userId);
        
        const decode = bcryptjs.compareSync(currentPassword , password);
        console.log(decode);
        
        if(!decode){
            return res.status(400).json({status: "Failed" , error: "password is wrong"});
        }
        const hashPass = bcryptjs.hashSync(newPassword , +process.env.SALTROUND);
        const updatePass = await userModel.findByIdAndUpdate(userId , {
            password: hashPass
        } , {new: true});
        res.status(200).json({status:"success" , data: "password is updated successfully"});
    }
    catch(err){
        res.status(400).json({status: "Failed" , error: err.message})
    }
}

export const accountController = async (req,res)=>{
    try {
        const {userId} = req;
        const {username , phone} = req.body;

        const updateUser = await userModel.findByIdAndUpdate(userId , {
            name: username,
            phone
        } , {new: true});

        if(!updateUser){
            return res.status(400).json({status: "Failed" , error: "Something went wrong server"});
        }
        res.status(200).json({status: "data is updated successfully" , data: updateUser});
    } catch (error) {
        res.status(400).json({status: "Failed" , error: error});
    }
}
export const getUserDataInAccount = async (req,res)=>{
    try {
        const {userId} = req;
        const user = await userModel.findById(userId).select("name phone email");

        if(!user){
            return res.status(400).json({status: "Failed" , error: "Something went wrong server"});
        }
        res.status(200).json({status: "success" , data: user});
    } catch (error) {
        res.status(400).json({status: "Failed" , error: error});
    }
}
export const deleteAccount = async(req,res)=>{
    try{
        const {userId} = req;
        const user = await userModel.findByIdAndDelete(userId);
        if(!user){
            return res.status(400).json({status: "Something went wrong during db action"})
        }
        res.status(200).json({status: "success" , data: "Account deleted successfully"});
    }
    catch(err){
        res.status(400).json({"status":"Failed" , error: err});
    }
}


export const addProfileImage =  async(req, res, next )=>{
    const file = req.file
    const user  =  req.user;
    
    if (!file) {
        return next(new Error("Please upload ur image"))
    }
 
 const folder = `users/${user._id}/${user.name}.png`

    const response = await uploadFromBuffer(req.file.buffer , folder)
    console.log(response);
    const updateUser =  await userModel.findByIdAndUpdate({_id:user._id}, {
    $set: {image : response.secure_url}
})
return res.status(200).json({messgae:"image uploaded success", success:true , user : updateUser})
}