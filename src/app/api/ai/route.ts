import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function GET() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Generate a new random contact with a variable number of phone numbers, emails, and addresses.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
          },
          phoneNumbers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                marker: {
                  type: Type.STRING
                },
                value: {
                  type: Type.STRING
                }
              }
            },
          },
          emails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                marker: {
                  type: Type.STRING
                },
                value: {
                  type: Type.STRING
                }
              }
            },
          },
          addresses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                marker: {
                  type: Type.STRING
                },
                country: {
                  type: Type.STRING
                },
                city: {
                  type: Type.STRING
                },
                street: {
                  type: Type.STRING
                },
                zipcode: {
                  type: Type.STRING
                },
                state: {
                  type: Type.STRING
                }
              }
            },
          },
        },
      },
    }
  });
  return new NextResponse(response.text);
}