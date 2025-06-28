import LLM "mo:llm";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Int "mo:base/Int";


persistent actor {
  public func prompt(prompt : Text) : async Text {
    await LLM.prompt(#Llama3_1_8B, prompt);
  };

  // Helper function to detect bot type
  private func detectBotType(messages: [LLM.ChatMessage]) : Text {
    if (messages.size() == 0) {
      return "legal";
    };
    
    let lastMessage = messages[messages.size() - 1];
    switch (lastMessage) {
      case (#user(userMsg)) {
        let content = userMsg.content;
        if (Text.contains(content, #text "crop") or
            Text.contains(content, #text "farm") or
            Text.contains(content, #text "maize") or
            Text.contains(content, #text "farmer") or
            Text.contains(content, #text "plant") or
            Text.contains(content, #text "agriculture") or
            Text.contains(content, #text "livestock")) {
          "agriculture";
        } else {
          "legal";
        };
      };
      case _ { "legal" };
    };
  };

  // Option 1: Clean formatting - removes HTML tags and converts to plain text
  private func cleanFormatText(text : Text) : Text {
    var result = text;
    // Remove HTML tags
    result := Text.replace(result, #text "<strong>", "");
    result := Text.replace(result, #text "</strong>", "");
    result := Text.replace(result, #text "<br>", "\n");
    result := Text.replace(result, #text "<br/>", "\n");
    
    // Clean up multiple consecutive newlines
    result := Text.replace(result, #text "\n\n\n", "\n\n");
    result;
  };

  // Option 2: Markdown formatting - converts **text** to bold and proper line breaks
  private func markdownFormat(text : Text) : Text {
    var result = text;
    // Convert double line breaks to proper paragraphs
    result := Text.replace(result, #text "\n\n", "\n\n");
    result;
  };

  // Option 3: Numbered list formatting - makes lists more readable
  private func formatAsNumberedList(text : Text) : Text {
    let lines = Text.split(text, #text "\n");
    let buffer = Buffer.Buffer<Text>(0);
    var counter = 0;
    
    for (line in lines) {
      let trimmed = Text.trim(line, #text " ");
      if (Text.size(trimmed) > 0) {
        if (Text.startsWith(trimmed, #text "1.") or 
            Text.startsWith(trimmed, #text "2.") or 
            Text.startsWith(trimmed, #text "3.") or 
            Text.startsWith(trimmed, #text "4.") or 
            Text.startsWith(trimmed, #text "5.") or 
            Text.startsWith(trimmed, #text "6.") or 
            Text.startsWith(trimmed, #text "7.") or 
            Text.startsWith(trimmed, #text "8.") or 
            Text.startsWith(trimmed, #text "9.")) {
          counter += 1;
          buffer.add(Int.toText(counter) # ". " # Text.replace(trimmed, #text "**", ""));
        } else {
          buffer.add(trimmed);
        };
      } else {
        buffer.add("");
      };
    };
    
    Text.join("\n", buffer.vals());
  };

  public func chat(messages : [LLM.ChatMessage]) : async Text {
    let botType = detectBotType(messages);
    
    let kenyaInstructions : LLM.ChatMessage = if (botType == "agriculture") {
      #system_({
        content = "You are an agricultural expert specializing exclusively in Kenya. 
          - Focus on Kenyan crops (maize, tea, coffee, horticulture)
          - Provide region-specific advice
          - Reference Kenyan agricultural policies
          - Give market prices in Kenyan Shillings (KES)
          - Format responses in clear, readable paragraphs
          - Use numbered lists for multiple points
          - If asked about other countries, redirect to Kenyan context";
      })
    } else {
      #system_({
        content = "You are a legal expert specializing exclusively in Kenyan law. 
          - Only provide information about Kenya's legal system
          - If asked about other countries, politely decline
          - Cite relevant Kenyan laws and statutes
          - For land issues, reference Kenyan Constitution
          - Format responses in clear, readable paragraphs
          - Use numbered lists for multiple rights or points
          - Keep formatting clean and professional";
      })
    };

    let augmentedMessages = Array.append<LLM.ChatMessage>([kenyaInstructions], messages);
    
    let response = await LLM.chat(#Llama3_1_8B)
                          .withMessages(augmentedMessages)
                          .send();

    switch(response.message.content) {
      case(?text) {
        // Choose one of these formatting options:
        // Option 1: Clean text (removes HTML tags)
        cleanFormatText(text)
        
        // Option 2: Keep original formatting
        // text
        
        // Option 3: Apply markdown formatting
        // markdownFormat(text)
      };
      case null "";
    };
  };
};