import { MongoClient } from "mongodb"; 
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI; 
const jwtSecret = process.env.JWT_SECRET; 

