import OpenAI from "openai";
import { Place, ChatMessage } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function chatWithAI(
  userMessage: string,
  place: Place,
  cityName: string,
  history: ChatMessage[] = []
): Promise<string> {
  try {
    // Prepare context about the place
    const placeContext = `
      Nome: ${place.name}
      Categoria: ${place.category}
      Indirizzo: ${place.address}
      Città: ${cityName}
      Descrizione: ${place.description}
      Orari: ${place.openingHours || "Non specificati"}
      Contatti: ${place.contactPhone || ""} ${place.contactEmail || ""}
      Prezzo: ${place.priceLevel}
      Valutazione: ${(place.rating / 10).toFixed(1)}/5.0 (${place.reviewCount} recensioni)
      Tag: ${place.tags?.join(", ") || ""}
    `;

    // Prepare conversation history for context
    const messages = [
      {
        role: "system",
        content: `Sei un assistente virtuale specializzato in informazioni turistiche per ${place.name} a ${cityName}. 
        Fornisci informazioni accurate e utili basate sui seguenti dettagli sul luogo. 
        Rispondi in italiano in modo amichevole e professionale. 
        Se non conosci la risposta, suggerisci di contattare direttamente il luogo.
        
        INFORMAZIONI SUL LUOGO:
        ${placeContext}`
      },
      // Include conversation history
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add the current user message
      {
        role: "user",
        content: userMessage
      }
    ];

    // Call the OpenAI API
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "Mi dispiace, non ho potuto elaborare la tua richiesta. Prova a riformulare la domanda.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Mi dispiace, si è verificato un errore nel sistema. Riprova più tardi o contatta direttamente il luogo per informazioni.";
  }
}
