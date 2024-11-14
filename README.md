# itinerary-planner

Description: 

A web-based application that uses Google Maps and Chat GPT technologies to create personalized travel itineraries. Essentially, it is a personalized itinerary generator with tailored recommendations based on the user’s preferences, interests, and available time while ensuring information about destinations, distances, and travel durations are real time, overall enhancing a user’s travel planning experience.

Features:
Smart and Personalized: The application retrieves user inputs such as activity or interest preferences (i.e. food trip, mall hopping, adventure), travel duration, constraints on budget and time, and with the help of Chat GPT, maximize the itinerary based on the given user preferences and available data from Google Maps. 
Interactive Maps: Integrated google maps enable users to visualize destinations and planned routes alongside get information on travel duration and distances for better optimization on travel routes. 
Dynamic Planning: Although the itinerary is generated based on user preferences, the user has the freedom to make their own itinerary or update the AI generated itinerary according to their likeness. 

Tools: 
ReactJS: This will be used to make the front-end part of the program, which would be the interactive user interface (UI) of the planner application. This would mainly focus on how the users interact with the different features of the application. 
NodeJS: This will be used to make the back-end part of the program, which would handle data, API requests, and interactions with Google Maps and ChatGPT. 
Google Maps: This will be used for mapping, getting the routes, and to pinpoint specific locations. This tool is essential for finding places to add into the itinerary, getting the distance between places, and determining how to get from one place to another. 
ChatGPT: This will be used for customizing recommendations based on information gathered from user input and Google Maps.


Data Structures:
Hash Tables: This data structure is most suited for this project because the main focus is efficiency and speed in searching, inserting, and deleting information. Hash tables will be used to store different information such as the activities with its corresponding time stamps, and day. 
