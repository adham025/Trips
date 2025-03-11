import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
dotenv.config({ path: path.resolve(__dirname, "../config/.env") }); 
import {Router} from "express";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const paymentRoutes = Router();

const BaseUrl = `http://localhost:5173`

paymentRoutes.get("/" , (req,res)=>{
    res.render('index.ejs')
})
paymentRoutes.get("/cancel" , (req,res)=>{ 
  res.render("cancel.ejs")
})
paymentRoutes.get("/success" , (req,res)=>{
  res.render("success.ejs")
})
paymentRoutes.post("/checkout" , async (req,res)=>{
    const {title , price} = req.body;
    console.log(title);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data:{
                currency: 'usd',
                product_data: {
                    name: title
                },
                unit_amount: price * 100,
            },
            quantity: 1
            },
        ],
        mode: "payment",
        success_url: `${BaseUrl}/booking`,
        cancel_url: `${BaseUrl}/cancel`
    })

    // res.redirect(session.url)
    
    res.json({status: "done" , session: session , url: session.url});

})

export default paymentRoutes; 