import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config(); // Load environment variables

// Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Function to send WhatsApp message
const sendWhatsAppMessage = async (to, message) => {
    try {
        const response = await client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio Sandbox Number
            to: `whatsapp:${to}`, // User's WhatsApp Number
            body: message,
        });

        console.log('Message Sent:', response.sid);
        return response;
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw error; // Ensure the error is properly handled
    }
};




export const sendSMS = async (to, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
            to: to, // Recipient's phone number
        });
        return response;
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
};

// Export the function
export default sendWhatsAppMessage;
