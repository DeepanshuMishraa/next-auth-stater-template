"use server"

import prisma from "@/utils/db";
import { SignUpSchema } from "@/validators/auth.validators"
import bcrypt from "bcryptjs"


export const signUp = async(_data:unknown)=>{
    const parsedData = SignUpSchema.safeParse(_data);

    if(!parsedData.success){
        throw new Error("Validation Failed")
    }

    const {name,email,password} = parsedData.data;

    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(user){
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hashSync(password,10);

    const newUser=  await prisma.user.create({
        data:{
            name:name,
            email:email,
            password:hashedPassword,
            provider:"email"
        }
    })

    return{
        status:200,
        message:"User created successfully",
        data:newUser
    }
}
