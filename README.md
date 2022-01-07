# nana_notification_task

## Description

A notification system prototype to handle high load notification messages with mock integration to 3rd parties providers, the system designed to be scalable in production as the admin has the flexibility to deploy as many service as he wants to handle the notifications load, also the system separates the notification service which is interfacing with the client and the integration service which takes more time to handle integration with 3rd parties. Both services are communicating through  rabbitmq (queue service), so we can have as many instances as we want without facing complexity in communication

### Technology:
 - Nodejs
 - MongoDB
 - Rabbitmq
 - Docker 
 
### Libraries:
 - Hapijs (an enterprise-grade nodejs framework, Originally developed to handle Walmart’s Black Friday scale )
 - Inert for serving static files for swagger docs
 - Pino for logging 
 - amqlib for rabbitmq integration
 - vision for template rendering for swagger 
 - hapi-swagger for swagger documentation
 - mongoose for handling database
 - Moment for dates
 
## Architecture
  The system consists of main 4 parts 
 - Inatgration_service 
 - Notification_service
 - Queue Service
 - Mongo db
 
 
 ![alt text](https://i.ibb.co/fqzQFj9/Screen-Shot-2022-01-07-at-1-54-16-AM.png)
 
 

Everytime the notification service receives a request, it will send a message to the queueing service to be handled by the integration service

The integration service responsible about sending the notification to service provider to be sent to user and update the notification system if the message failed or succeeded

The queue service responsible about the communication between the services and responsible about (scheduling/delay) a message to be sent on specific date 

## Services Functionality 
### Notification_service
 - Create 3 queues for each notification type (email, sms, and push)
 - Validates send notification request 
 - Check on notification type and template name
 - Check on user info
 - Send message to queue based on notification type
 - Calculate the delay by converting schedule_date to milliseconds and subtract it from the current millisecond 

### Intgeration_service 
 - Load templates by names
 - Send notification to providers 
 - Create status queue with two routs success and failed 
 - Update the notification service with message status
 
 ## Installation
 
make sure you have docker setup and docker-compose

 ``` 
docker-compose up 
 ```
 
 if you want to run it on you local machine without docker 
  - first make sure you have mongodb installed first 
  - launch docker image for rabbitmq with message delay plugin
  ```
  docker run --name rabbitmq -p 5672:5672 heidiks/rabbitmq-delayed-message-exchange:latest
  ```
  - go to intgeration service directory and run
  ```
  npm i
  ```
  - then run 
  ```
  npm run dev
  ```
  then goto notification service directory and run 
  ```
  npm i 
  ```
  then 
  ```
  npm run dev
  ```
  
  ## testing 
  
  to test the service form your machine 
   - make sure rasbbitmq is working 
   ```
  docker run --name rabbitmq -p 5672:5672 heidiks/rabbitmq-delayed-message-exchange:latest
  ```
 -  to test notification service you have to run integration service first
 - go to integration service and run 
 ```
 npm start
 ```
 - then go to notification service and run
 ```
 npm run test
 ```
 - to run test in integration service you don't need to run notification service, just go to integration service
 ```
 npm run test
 ```
 
 ## notes
 - in databse migration I've added static ids for users and templates, because those should be a sperate microservices but for simplicity I've added them as mock service, but it's not a good practice add static ids to database

 - to get swagger documentation for integration_service go to
 ```
 http://localhost:3001/documentation#/
 ```

 - to get swagger documentation for notification_service go to
 ```
 http://localhost:3000/documentation#/
 ```

 - I've added the messages as template files, because we can localize it based on user language 

 - I've used handlebars to process user info inside html templates

 - to schedule notification I do calculation as schedule.milliseconds - now.milliseconds and add it as delay on message header
  
 
 



