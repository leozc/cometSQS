var winston = require('winston');
var fmt = require('fmt');
var fs = require('fs');
var http = require('http');
var _ = require('underscore');
var sqs=require("./sqs.js");
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
     // new (winston.transports.File)({ filename: '/var/log/sqscomet.log' })
    ]
});
  
http.createServer(function (request, response) {
    var queuename = "00000test";
    
    logger.log('info','request starting...' );
    
    sqs.receive(queuename, function(err, data) {
        logger.log('info',"Receiving message from my-queue - expecting success (and a message)");
        
        if(! err){
            if ( _.isUndefined(data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message) ) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify([]), 'utf-8');
                        
                        
                        return;
            }
            if ( ! _.isArray(data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message) ) {
                 // turn this into an array
                 data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message = [
                     data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message
                 ];
             }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({"receiveMsg":data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message}), 'utf-8');
            // delete the message
            sqs.delete(queuename,data.Body.ReceiveMessageResponse.ReceiveMessageResult.Message,
                function(err, data) {
                            logger.log('debug',"Deleting Messages - expecting success");
                        }
            );
            
        }
        else{
           response.writeHead(503, { 'Content-Type': 'application/json'});
           logger.log('error', JSON.stringify(err));
       }
    }
    )
}).listen(9999);