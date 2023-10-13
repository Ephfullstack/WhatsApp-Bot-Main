import { WhatsappService } from "../../services/whatsapp.service";
import whatsappSchema from "../data/whatsapp.schema";

export class WhatsappRepository {
     static async create(whatsAppId: string, name: string){
        return await whatsappSchema.create({
            name,
            whatsAppId
        })}
        
     static async createEmail(email: string){
        return await whatsappSchema.create({
            email
        })
    
    }
    static async findUserByName(name?: string){
        return await whatsappSchema.find({
            name
        })
    }
    
}
