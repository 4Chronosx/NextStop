import { useState, useEffect } from "react";
import { openDB } from "idb";
import "./Chatbox.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

import { postUserData } from "../../api/hostOneApi";
import { useNavigate } from "react-router";

interface ActivityDetail {
  "Activity Title": string;
  "Activity Type": string;
  Duration: string;
  "Time slot": string;
  "Budget for the Activity": string;
  Location: string;
}

interface DayItinerary {
  date: string;
  details: ActivityDetail[];
}

interface Itinerary {
  title: string;
  days: DayItinerary[];
}

// Define a type for the messages
type MessageType = {
  message: string;
  sender: string;
  sentTime: string;
  direction: "incoming" | "outgoing";
  position: "single" | "first" | "normal" | "last" | 0 | 1 | 2 | 3;
};

const Chatbox = () => {
  const defaultItinerary = {
    title: "myItinerary",
    days: [
      {
        date: " ",
        details: [
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
        ],
      },
      {
        date: " ",
        details: [
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
          {
            "Activity Title": " ",
            "Activity Type": " ",
            Duration: " ",
            "Time slot": " ",
            "Budget for the Activity": " ",
            Location: " ",
          },
        ],
      },
    ],
  } as Itinerary;

  const navigate = useNavigate();
  const [typing, setTyping] = useState(false);
  const [isCreateDisabled, setisCreateDisabled] = useState(true);
  const [isViewDisabled, setisViewDisabled] = useState(true);
  const [data, setData] = useState<Itinerary>(defaultItinerary);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      direction: "incoming",
      message:
        "Hello, I am WanderMap AI. Just type 'go' to get us started with your itinerary!",
      position: "single",
      sender: "ChatGPT",
      sentTime: "15 mins ago",
    },
  ]);

  useEffect(() => {
    // Initialize IndexedDB on component mount
    const initDB = async () => {
      const db = await openDB("MyDatabase", 6, {
        upgrade(db) {
          // Create an object store for "data" with auto-incrementing keys
          db.createObjectStore("data", { autoIncrement: true });
        },
      });
      console.log("Database initialized:", db.objectStoreNames);
    };

    initDB();
  }, []);

  const handleSave = async () => {
    setisCreateDisabled(false);
    const db = await openDB("MyDatabase", 6);
    await db.add("data", data);
    getDB();
    setisCreateDisabled(true);
    setisViewDisabled(false);
  };

  const handleView = () => {
    navigate("/view-itinerary", {
      state: { itinerary: data }, // Pass the itinerary data as state
    });
  };

  const getDB = async () => {
    const db = await openDB("MyDatabase", 6);

    // Fetch all data from the object store
    const allData = await db.getAll("data");

    // Log or display the data
    console.log(allData);
  };

  const handleSend = async (message: string) => {
    const newMessage: MessageType = {
      direction: "outgoing",
      message: message,
      position: "single",
      sender: "user",
      sentTime: "just now",
    };

    const newMessages = [...messages, newMessage];
    // Update the state with the new message
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageType[]) {
    let apiMessages = chatMessages.map((messageObject: MessageType) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: `
      You are a highly detailed itinerary planning assistant. 
      Your task is to gather specific information from the user by asking **one question at a time**, 
      and then use their responses to create a complete multi-day itinerary in **JSON format**. 
      Each day must be fully planned with activities and details.
    
      ### Interaction Guidelines:
      - **Ask the following questions in order, one at a time**:
        1. "Where do you plan to have your trip?"
        2. "What is your budget for this trip?"
        3. "What's the duration of your trip? [Type your starting and ending date]"
        4. "What time do you start and end your day?"
        5. "What type of activities are you interested in? (e.g., sightseeing, shopping, outdoor adventures)"
        6. "Are there any specific places you want to visit?"
        7. "What is your preferred mode of transportation during the trip?"
        8. "Do you have any dietary restrictions or food preferences?"
    
      - **Wait for the user's response** before moving to the next question.
      - If a user asks a question or makes a request outside the provided scope, respond with: 
        *"I'm sorry, I can only assist with the trip planning questions provided. Let’s continue with your itinerary."*
    
      ### Itinerary Generation Instructions:
      - Once all questions are answered, wait for the user to type **'generate'**.
      - Generate a **comprehensive, multi-day itinerary** in the following **JSON format**:
    
      '\`\`\`json
      {
        "title": " ",
        "days": [
          {
            "date": "mm-dd-yyyy",
            "details": [
              {
                "Activity Title": " ",
                "Activity Type": " ",
                "Duration": " ",
                "Time slot": " ",
                "Budget for the Activity": " ",
                "Location": " "
              },
              
            ]
          },
          
        ]
      }
      \`\`\`'
    
      ### Requirements for Itinerary Completion:
      1. **Full Coverage for All Days**: 
         - Ensure each day has enough activities to span the entire time specified by the user (from start to end time).
         - Ensure that the user gives the starting and end date of the itinerary. With that, double check if the user has complete details 
           such as month, date, and year. Afterwards, convert data to mm-dd-yyy format 
      
      2. **Specific and Relevant Activities**:
         - Name the itinerary creatively 
         - Include activities tailored to the user’s preferences (e.g., sightseeing, dining, outdoor adventures).
         - Ensure the **Activity Titles** and **Locations** are specific and recognizable.
         - Activity types: Dining, Sightseeing, Leisure, Outdoor Adventure, Travel, Shopping

      3. **Grouping by Proximity**:
         - Organize activities within a day to minimize travel time.
         - Consider logical transitions between activities.
    
      4. **Detailed Time Slots and Durations**:
         - Assign accurate time slots for each activity.
         - Ensure the entire day is accounted for, factoring in **travel time** between locations.
    
      5. **Budget Considerations**:
         - Include estimated costs for each activity based on the user’s budget.
         - Ensure the total cost aligns with the user’s trip budget.
         - Have the budget of each activity be in the currency of the place of the activity
         - Ask user the currency of the budget they enter and convert to the itinerary destinartion place's currency accordingly
    
    
      6. **Transportation Details**:
         - MAKE SURE TO INCLUDE TRANSPORTATION FROM ONE ACTIVITY TO ANOTHER (specifiy travel duration and costs, and transportation mode)

      7. **Completion**:
         - always complete the days of the itinerary and ensure that you generate the same number of days as requested by the user
         - do not suggest user to complete the strucuture or itinerary
         - avoid unnecessary comments inside the json
         - never output the json structure

      8. Specificity
         - Ensure that ALL the activites in the itinerary have SPECIFIC addresses. DO NOT PUT VAGUE OR GENERAL ADDRESS
         - Ensure that when recommending cafe or restaurant for dining, INCLUDE OR RECOMMEND A SPECIFIC RESTAURANT not just "You local Cafe, ---}
    
      ### Output Validation:
      - **Cross-check** the itinerary to ensure all days are populated.
      - Provide a final JSON output that is **clean, formatted, and fully extractable**.
    
      ### Error Handling:
      - If the user tries to generate the itinerary without answering all questions, respond with:
        *"Please complete all the required questions to generate a full itinerary."*
      
      - If there are gaps in activities or missing details, automatically fill them with relevant suggestions based on the user's preferences and context.
      `,
    };

    const apiRequestBody = {
      model: "gpt-4o-mini",
      messages: [systemMessage, ...apiMessages],
    };

    postUserData(apiRequestBody).then((data) => {
      console.log(data.choices[0].message.content);
      // Regular expression to find JSON between the code block markers
      const jsonMatch = data.choices[0].message.content.match(
        /```json\n([\s\S]*?)\n```/
      );

      // Check if JSON content was found
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1].trim(); // Extract the JSON string and trim extra whitespace
        console.log(jsonString);
        setMessages([
          ...chatMessages,
          {
            direction: "incoming",
            message:
              "Thank you for your patience. The itinerary will be generated in a while. Enjoy your trip!",
            position: "single",
            sender: "chatGPT",
            sentTime: "just now",
          },
        ]);

        try {
          const itinerary = JSON.parse(jsonString); // Parse the JSON string if needed
          console.log(itinerary);
          setData(itinerary);
          setisCreateDisabled(false);
        } catch (error) {
          console.error("Invalid JSON format:", error);
        }
      } else {
        console.log("JSON content not found");
        setMessages([
          ...chatMessages,
          {
            direction: "incoming",
            message: data.choices[0].message.content,
            position: "single",
            sender: "chatGPT",
            sentTime: "just now",
          },
        ]);
      }

      setTyping(false);
    });
  }

  return (
    <>
      <div className="chat-container">
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <Avatar
                name="Emily"
                src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
              />
              <ConversationHeader.Content
                info="Active now"
                userName="WanderMap AI"
              />
            </ConversationHeader>
            <MessageList
              typingIndicator={
                typing ? (
                  <TypingIndicator content="WanderMapAI is typing" />
                ) : null
              }
            >
              {messages.map((message, index) => {
                const avatarSrc =
                  message.sender === "user"
                    ? "https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"
                    : "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg";
                return (
                  <Message
                    key={index}
                    model={{
                      direction: message.direction,
                      message: message.message,
                      position: message.position,
                      sender: message.sender,
                      sentTime: message.sentTime,
                    }}
                  >
                    <Avatar name={message.sender} src={avatarSrc}></Avatar>
                  </Message>
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>

        <div className="chatbox-button-container">
          <button
            className="create-button"
            disabled={isCreateDisabled}
            onClick={handleSave}
          >
            Create
          </button>
          <button
            className="view-itinerary-button"
            disabled={isViewDisabled}
            onClick={handleView}
          >
            View Itinerary
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
