import { aiService } from "./aiService";
import axios from "axios";
import { config } from "dotenv";
config();

const generateLetter = async (details: string, recipient: string) => {
  try {
    // const letter = await aiService.generateLetterDetails(details, recipient);
    const letterBody = {
      pages: [
        {
          template_uuid: process.env.LETTER_TEMPLATE_UUID,
          layers: {
            date: {
              text: Date.now().toString(),
            },
            subject: {
              text: "Subject of the letter",
            },
            body: {
              text: "Body of the letter",
            },
            recipient: {
              text: recipient,
            },
          },
        },
      ],
    };

    const response = await axios.post(
      "https://api.placid.app/api/rest/pdfs",
      letterBody,
      {
        headers: { Authorization: `Bearer ${process.env.PDF_API_KEY}` },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to generate PDF");
    }
    
    return response.data
  } catch (error) {
    console.error("Error generating letter:", error);
    throw new Error("Failed to generate letter");
  }
};

const getLetterById = async (letterId: string) => {
  try {
    const pdf = await axios.get(
      `https://api.placid.app/api/rest/pdfs/${letterId}`,
      {
        headers: { Authorization: `Bearer ${process.env.PDF_API_KEY}` },
      });
    
      return pdf; 
  } catch (error) {
    console.error(error);
    return null;
  } 
}

export const letterService = {
  generateLetter,
  getLetterById
};
