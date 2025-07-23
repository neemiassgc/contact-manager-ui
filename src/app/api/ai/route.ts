import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function GET() {
  const prompt = `
    Generate a completely random and unique set of contact information for a fictional person. Avoid clichés, obvious patterns, and recycled formats. The data should feel realistic and unpredictable, not generic.
    Make sure the data is diverse and globally representative, using believable formats, but avoid obvious patterns or clichés like “John Smith” or “123 Main St.” Names, and locations should feel authentic, original, and varied.
    Use creative combinations of names and locations, and ensure the contact does not resemble placeholder data or templates.
    Phone numbers can be from anywhere in the world, but just numbers.
  `

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
          },
          birthday: {
            type: Type.STRING,
            nullable: true
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