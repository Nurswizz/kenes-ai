import axios from "axios";
import { config } from "dotenv";
import { Letter, ILetter } from "../models/Letter";
import { aiService } from "./aiService";
config();

const pollUntilReady = async (id: string, maxRetries = 20, delay = 2000) => {
  const url = `https://api.placid.app/api/rest/pdfs/${id}`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.PDF_API_KEY}`,
      },
    });

    if (res.data.status === "finished" && res.data.pdf_url) {
      return res.data;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("PDF generation timed out after polling.");
};

const generateLetter = async (
  details: string,
  recipient: string,
  sender: string
) => {
  try {
    const letter = await aiService.generateLetterDetails(
      details,
      recipient,
      sender
    );
    const letterBody = {
      pages: [
        {
          template_uuid: process.env.LETTER_TEMPLATE_UUID,
          layers: {
            date: {
              text: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            subject: {
              text: letter.subject,
            },
            body: {
              text: letter.body,
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

    const pdfData = await pollUntilReady(response.data.id);

    return pdfData;
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
      }
    );

    return pdf;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const saveLetter = async (letterData: ILetter) => {
  try {
    const letter = new Letter({
      ...letterData,
    });
    await letter.save();
    return letter;
  } catch (error) {
    console.error("Error saving letter:", error);
  }
};

export const letterService = {
  generateLetter,
  getLetterById,
  saveLetter,
};
