# playO

### Deployed link : https://sore-gold-fish-tie.cyclic.app/


## Dependencies 

* "bcrypt": "^5.1.0",
* "dotenv": "^16.0.3",
 * "express": "^4.18.2",
 * "jsonwebtoken": "^9.0.0",
 * "mongoose": "^7.0.1",
 * "nodemon": "^2.0.21"
 
 ## Endpoints
 
 * Post  /user/signup
 
 * Post /user/login
 
 * Get /events/
 
 * Get /events/:eventId
 
 * Post /events/create
 
 * Patch /events/:eventId/update
 
 * Patch /events/:eventId/status
 
 * Delete /events/delete/:eventId
 
 * Post /request/:eventId/join
 
 * Post /request/:id/accept
 
 * Post /request/:id/reject
 
 * Patch /request/:eventId/pendingrequests
 
 * Delete /request/:id/cancel
 
 
 ##  Post  /user/signup
 
 * User with existing email cannot signup
  
 > headers.body : {name , email , password , age}
 
 > returns :- { message: "Signup Sucessfull" }  On sucessfull registration
 
 ## Post /user/login
 
 * New User has to signup up first
 
 > headers.body : { email , password}
 
 > returns :- {message: "Login Sucessful", token: token, refresh_token: refresh_token, user_detail: { name: user.name, email: user.email }} On correct credentials 
 
 * Get /events/ 
 
 > returns :- all events sorted by event time
 
 
 ## Get /events/:eventId   
 
 > headers.authorization : Bearer token
 
 > params - :eventId - Id of the event the user wants
 
 > On Sucessful token verification 
 > reutrns : { message: "Event Data", event, players } (event - Details of the event with the :eventId  and players -  all the players who have requested to join the game or joined the game with :eventId)
 
  ## Post /events/create
 
  > headers.authorization : Bearer token
  >headers.body : {event_name, event_description, event_time, event_location, event_duration, max_players}
  
  > On Sucessful token verification 
  
  > reutrns : { message: "Event Created Sucessfully" }
  
  ## Patch /events/:eventId/update
  
   > headers.authorization : Bearer token
   > headers.body : payload (fields and values which the user wants to update)
   > params :- :eventId ( Id of the event)
   
   > On Sucessful token verification
   
   > returns : { message: `Event with ${eventId} updated sucessfully` } if the event is created by the user 
   
   ## Patch /events/:eventId/status
   
   > headers.authorization : Bearer token
   > Query - status - "Start" || "End"
   > Params - :eventId
   
   > On sucessful token verification
   
   > returns : { message: `Event with ${eventId} started` }  if status is "Start"
   
   > returns : { message: `Event Status  Updated to "Ended" and all pending request of eventId - ${eventId} rejected` }  if status is "End"
   
   
  ## Delete /events/delete/:eventId
   
   > headers.authorization : Bearer token
   > Params - :eventId
   
   > On sucessful token verification
   
   > returns : { message: `Event with ${eventId} deleted sucessfully` }
   
   ## Post /request/:eventId/join
   
   > headers.authorization : Bearer token
   > Params - :eventId
   
   > On sucessful token verification
   
   > returns : {"message" :  "Join request sucessfully created"}
   
   ## Post /request/:id/accept
   
   > headers.authorization : Bearer token
   > Params - :id (join request with Id - id )
   
   > On sucessful token verification
   
   >returns : {"message" : "Request accepted"} if slots are available
   > reutrns : {"message" : "No slots available"}  if slots are unavailable
   
   ## Post /request/:id/reject
   
   > headers.authorization : Bearer token
   > Params - :id (join request with Id - id )
   
   > On sucessful token verification
   
   > returns : {"message" : `request with ${id} not for your event not found `}  if the request is not found
   > returns : {"message" : `request with ${id} rejected`} if the request is found with status pending
   
   ## Patch /request/:eventId/pendingrequests
   
   > headers.authorization : Bearer token
    > Params - :eventId ( id of the event with :eventId)
    
    > On sucessful token verification
    
    > returns : { message: "event not found" } if the event with id : eventId is not found
    > returns : { message: `all pending requests of eventId - ${eventId} rejected` } if the event with id  : eventId is found
    
    
    ## Delete /request/:id/cancel
    
    > headers.authorization : Bearer token
   > Params - :id ( request with Id - id )
   
   > On sucessful token verification
   
   > returns : {"message" : ` request with requestId - ${id} not found`} if the request with _id : id is not found 
   > returns : {"message" : "Request canceled Sucessfully"} if the request with _id : id is found
   
   
   
   
   
   
   
   
   
  
  
 
