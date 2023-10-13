import mongoose from 'mongoose';
import { WhatsappDoc } from '../types/mongoose.types';

const WhatsappSchema = new mongoose.Schema<WhatsappDoc>(
	{
		name:{
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: false,
		},
		whatsAppId: {
			type: String,
			requried: true,
		}
	},
	{
		timestamps: true,
	}
);

WhatsappSchema.index({ createdAt: 1 });

export default mongoose.model<WhatsappDoc>('WhatsappSchema', WhatsappSchema);
