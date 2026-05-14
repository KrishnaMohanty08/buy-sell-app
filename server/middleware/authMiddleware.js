import jwt from "jsonwebtoken"

const authMiddleware =(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader){
        console.warn('[AUTH] No authorization header');
        return res.status(401).json({message:"No token"});
    }
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    try{
        const secret = process.env.JWT_SECRET?.trim() || '';
        if (!secret) {
            console.error('[AUTH] JWT_SECRET is not configured');
            return res.status(500).json({message:"Server configuration error"});
        }
        
        const decoded=jwt.verify(token, secret);
        req.user=decoded;
        next();
    }catch(err){
        console.error('[AUTH] Token verification failed:', err.message);
        return res.status(401).json({message:"Invalid or expired token"});
    }
}
export default authMiddleware;