import bcrypt from "bcryptjs"
import prisma from "../prisma/client.js"
import generateToken from "../utils/jwt.js"

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;  
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,   
                lastName,    
                email,
                password: hashPassword,
            }
        });

        const token = generateToken(user);  
        res.json({ 
            message: "user registered", 
            token, 
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login =async (req,res)=>{
    try{
        const {email,password}=req.body
        const user =await prisma.user.findUnique(
            {where:{email:email}},
        )
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }
        res.json({message:"Login successful",token:generateToken(user), user: {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, profileImage: user.profileImage}});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true,
                listings: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        image: true,
                        createdAt: true,
                    }
                },
                savedListings: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        image: true,
                        createdAt: true,
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
