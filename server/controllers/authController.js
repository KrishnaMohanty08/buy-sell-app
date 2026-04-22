import bcrypt from "bcrypt"
import prism from "../prisma/client"
import generateToken from "..utils/jwt"

export const register =async  (req, res) => {
    try{
        const {email,password}=req.body
        const hashPassword=await bcrypt.hash(password,10);

        const user=await prisma.user.create({
            data:{
                email,
                password:hashPassword,
            }
        });
        res.json({message:"user registered",user});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

export const login =async (req,res)=>{
    try{
        const {email,password}=req.body
        const user =await prisma.user.findUnique(
            {where:email},
        )
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }
        res.json({message:"Login successful",token:generateToken(user.id)});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}
