import bcrypt from "bcryptjs"
import prisma from "../prisma/client.js"
import generateToken from "../utils/jwt.js"
import { generateOtp, getOtpExpiry } from '../utils/otp.js';
import {  sendOtpEmail }  from '../utils/mailer.js';

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

// Step 1: Request OTP
export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    // ✅ Invalidate ALL old unused OTPs for this email
    await prisma.otpToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const otp = generateOtp();

    // ✅ Hash OTP before storing (timing attack protection)
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.otpToken.create({
      data: {
        email,
        token: hashedOtp,
        expiresAt: getOtpExpiry(),
      },
    });

    await sendOtpEmail(email, otp); // send raw OTP to user

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('requestOtp error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 2: Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    // Get the latest unused OTP record for this email
    const record = await prisma.otpToken.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: 'desc' },
    });

    // ✅ Generic message — don't reveal whether email or OTP is wrong
    if (!record) return res.status(401).json({ message: 'Invalid or expired OTP' });

    // ✅ Check expiry
    if (record.expiresAt < new Date()) {
      await prisma.otpToken.update({
        where: { id: record.id },
        data: { used: true },
      });
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // ✅ Constant-time bcrypt compare (timing attack safe)
    const isMatch = await bcrypt.compare(otp, record.token);
    if (!isMatch) return res.status(401).json({ message: 'Invalid or expired OTP' });

    // ✅ Mark as used immediately (prevent reuse)
    await prisma.otpToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    const user = await prisma.user.findUnique({ where: { email } });

    const token = generateToken(user);

    return res.status(200).json({ 
      message: 'OTP verified successfully',
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
    console.error('verifyOtp error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

