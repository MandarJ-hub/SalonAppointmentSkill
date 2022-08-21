/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

// are you tracking past celebrities between sessions
const celeb_tracking = true;

// const services = {
//     hairservices: [
//         {
//             name: 'Hair Cut'
//         },
//         {
//             name: 'Hair Wash'
//         },
//         {
//             name: 'Hair Color'
//         },
//         {
//             name: 'Hair Styling'
//         }
//     ],
//     beautyservices: [
//         {
//             name: 'Facial'
//         },
//         {
//             name: 'Manicure'
//         },
//         {
//             name: 'Pedicure'
//         },
//         {
//             name: 'Waxing'
//         },
//         {
//             name: 'Bleach'
//         }
//     ],
//     relaxingtherapies: [
//         {
//             name: 'Deep Tissue Massage'
//         },
//         {
//             name: 'Aroma Massage'
//         },
//         {
//             name: 'Candle Massage'
//         },
//         {
//             name: 'Moroccon Oil Head Massage'
//         },
//         {
//             name: 'Body Scrub'
//         }
            
//     ],
   
    
// };


var registeredUsers = [];
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Neomis Salon and Spa. Let\'s begin by knowing your name. ';


  
            //.reprompt(speakOutput)
            //.getResponse();
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            
            .addDelegateDirective({
                name: 'GetNameIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SalonBookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SalonbookIntent';
    },
    handle(handlerInput) {
      
        
        const speakOutput = 'That\'s great. Please tell us your name';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            
            .reprompt(speakOutput)
            .getResponse();
    }
};

let registeredFName='';
let registeredLName='';

const NameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNameIntent';
    },
    handle(handlerInput) {
      
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        registeredFName = Alexa.getSlotValue(requestEnvelope,'firstName');
        registeredLName = Alexa.getSlotValue(requestEnvelope,'lastName');
        
        var user = {
            firstname: registeredFName,
            lastname: registeredLName
        }
        registeredUsers.push(user);
        
        
    
    const speakOutput = 'May I know your phone number?';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PhoneIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPhoneNumber';
    },
    handle(handlerInput) {
        //const speakOutput = 'Awesome. We offer different services : Hair Services, Beauty Services, Bridal Services, Stress Relieving Therapies and Relaxing Therapies. Which one would you like to avail?';
        
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        const registeredPhone = Alexa.getSlotValue(requestEnvelope,'phone');
        
        var user = {
           phone:registeredPhone
        }
        registeredUsers.push(user);
        
        
        const speakOutput='When would you like to schedule an appointment?'
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'DateandTimeIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt(speakOutput)
            .getResponse();
    }
};


// const ServicesIntentHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ServiceIntent';
//     },
//     handle(handlerInput) {
//         const speakOutput = 'When would you like to schedule an appointment?';
        
//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(speakOutput)
//             .getResponse();
//     }
// };

let chosenDate = '';
let chosenTime = '';

const DateandTimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DateandTimeIntent';
    },
    handle(handlerInput) {
    
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        chosenTime = Alexa.getSlotValue(requestEnvelope,'appointmentTime');
        chosenDate = Alexa.getSlotValue(requestEnvelope,'appointmentDate');
    
        const speakOutput = `Thank you! We at Neomis Salon and Spa offer different services. We offer Hair services, Beauty Services and Relaxing Therapies. Which one would you like to avail?`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
              .addDelegateDirective({
                name: 'LoggedInIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt(speakOutput)
            .getResponse();
    }
};

let chosenHairServices = '';
let chosenBeautyServices = '';
let chosenRelaxingTherapies ='';

const LoggedInIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LoggedInIntent';
    },
   handle(handlerInput) {
   
    const {requestEnvelope} = handlerInput;
    const {intent} = requestEnvelope.request;
    
        let speakOutput = '';
        let chosenService = Alexa.getSlotValue(requestEnvelope,'service'); // make one slot service and add hair,beauty, relaxig theirapies
        //while(chosenService !== undefined){
            if(chosenService.toUpperCase() === 'HAIR SERVICES'){
                speakOutput = `Great! We offer Hair Cut, Hair Wash, Hair Color and Hair Styling. What would you like to have? `;
                return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt('Do you want anything else done?')
            .addDelegateDirective({
                name: 'HairServicesIntent',   // make Hair Services Intent
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
            }
            else if(chosenService.toUpperCase() === 'BEAUTY SERVICES'){
                speakOutput = `Great! We offer Facials, Pedicure, Manicure, Bleach and Waxing. Which one shall I book for you? `;
                return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt('Do you want anything else done?')
            .addDelegateDirective({
                name: 'BeautyServicesIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
            }
            else if(chosenService.toUpperCase() === 'RELAXING THERAPIES'){
                speakOutput = `Great! We offer Deep Tissue Massage, Aroma Massage, Candle Massage, Moroccon Oil Head Massage and Body Scrub. Which one shall I book for you? `;
                return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt('Do you want anything else done?')
            .addDelegateDirective({
                name: 'RelaxingTherapiesIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
            }
        else {
            return handlerInput.responseBuilder
            .speak("Thank you for choosing Neomis Spa and Salon. Please wait while we process your appointment.")
            // .reprompt('Do you want anything else done?')
            .addDelegateDirective({
                name: 'ConfirmBookingIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
        }
    }
 };
 
 const ConfirmBookingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmBookingIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Thank you,${registeredFName}. Your appointment for ${chosenHairServices} and ${chosenBeautyServices}${chosenRelaxingTherapies} on ${chosenDate} at ${chosenTime} has been booked successfully. Thank you and have a nice day!`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond' )
            .getResponse();
    }
};
 
const HairServicesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HairServicesIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        
         chosenHairServices = Alexa.getSlotValue(requestEnvelope,'hairTypes'); // make one slot
         const speakOutput = `A ${chosenHairServices} has been booked. Do you want anything else? Please select a service`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'LoggedInIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond' )
            .getResponse();
    }
       
    
};

 const BeautyServicesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BeautyServicesIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        chosenBeautyServices = Alexa.getSlotValue(requestEnvelope,'beautyTypes');
        const speakOutput = `A ${chosenBeautyServices} has been booked. Would you like to book anything else?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'LoggedInIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond' )
            .getResponse();
    }
};

 const RelaxingTherapiesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RelaxingTherapiesIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
       chosenRelaxingTherapies = Alexa.getSlotValue(requestEnvelope,'relaxingType');
        const speakOutput = `A ${chosenRelaxingTherapies} has been booked. Would you like to book anything else?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDelegateDirective({
                name: 'LoggedInIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond' )
            .getResponse();
    }
};

 

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'May I know your name?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const LoadDataInterceptor = {
    async process(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // get persistent attributes, using await to ensure the data has been returned before
        // continuing execution
        var persistent = await handlerInput.attributesManager.getPersistentAttributes();
        if(!persistent) persistent = {};

        // ensure important variables are initialized so they're used more easily in handlers.
        // This makes sure they're ready to go and makes the handler code a little more readable
        if(!sessionAttributes.hasOwnProperty('current_celeb')) sessionAttributes.current_celeb = null;  
        if(!sessionAttributes.hasOwnProperty('score')) sessionAttributes.score = 0;
        if(!persistent.hasOwnProperty('past_celebs')) persistent.past_celebs = [];  
        if(!sessionAttributes.hasOwnProperty('past_celebs')) sessionAttributes.past_celebs = [];  

        // if you're tracking past_celebs between sessions, use the persistent value
        // set the visits value (either 0 for new, or the persistent value)
        sessionAttributes.past_celebs = (celeb_tracking) ? persistent.past_celebs : sessionAttributes.past_celebs;
        sessionAttributes.visits = (persistent.hasOwnProperty('visits')) ? persistent.visits : 0;

        //set the session attributes so they're available to your handlers
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
};
// This request interceptor will log all incoming requests of this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log('----- REQUEST -----');
        console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
};

// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
const SaveDataInterceptor = {
    async process(handlerInput) {
        const persistent = {};
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        // save (or not) the past_celebs & visits
        persistent.past_celebs = (celeb_tracking) ? sessionAttributes.past_celebs : [];
        persistent.visits = sessionAttributes.visits;
        // set and then save the persistent attributes
        handlerInput.attributesManager.setPersistentAttributes(persistent);
        let waiter = await handlerInput.attributesManager.savePersistentAttributes();
    }
};
// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log('----- RESPONSE -----');
        console.log(JSON.stringify(response, null, 2));
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        SalonBookIntentHandler,
        NameIntentHandler,
        PhoneIntentHandler,
        CancelAndStopIntentHandler,
        DateandTimeIntentHandler,
        LoggedInIntentHandler,
        RelaxingTherapiesIntentHandler,
        BeautyServicesIntentHandler,
        ConfirmBookingIntentHandler,
        HairServicesIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
        .addRequestInterceptors(
    LoadDataInterceptor,
    LoggingRequestInterceptor
)
.addResponseInterceptors(
    SaveDataInterceptor,
    LoggingResponseInterceptor
)
    .addErrorHandlers(
        ErrorHandler)
        .withPersistenceAdapter(
    new ddbAdapter.DynamoDbPersistenceAdapter({
        tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
        createTable: false,
        dynamoDBClient: new AWS.DynamoDB({apiVersion: 'latest', region: process.env.DYNAMODB_PERSISTENCE_REGION})
    })
)
      
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();