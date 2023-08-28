/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Users from "../models/User";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";

type UserObject = {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    token: string
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email: email });
        if (!user) {
            const newUser = new Users({
                username: req.body.username,
                email: req.body.email,
            });
            await newUser.save().then((savedUser => {
                const userToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET as string);
                const userObj: UserObject = {
                    _id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    token: userToken
                };
                return res.status(201).json(userObj);
            }));
        }
        if(user !== null){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
            const userObj: UserObject = {
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            };            
            return res.status(200).json(userObj);
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}