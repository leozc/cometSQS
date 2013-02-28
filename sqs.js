var awssum = require('awssum');
var amazon = awssum.load('amazon/amazon');
var Sqs = awssum.load('amazon/sqs').Sqs;
var awscred=require('./config.js');
var _ = require('underscore');
var fmt = require('fmt');
//receive("00000test")

exports.receive= function (quenename, callback){
    var sqs = new Sqs({
      'accessKeyId'     : awscred.accessKeyId,
      'secretAccessKey' : awscred.secretAccessKey,  
      'region'          : amazon.US_EAST_1,
	  'awsAccountId'    : awscred.awsAccountId
    });

    var options = {
        QueueName : quenename,
        AttributeName: 'All',
        MaxNumberOfMessages:10,
        VisibilityTimeout:60,
        WaitTimeSeconds:20
    };
    sqs.ReceiveMessage(options, callback);
    
}

exports.delete=function(queuename,messages,callback){
    var sqs = new Sqs({
      'accessKeyId'     : awscred.accessKeyId,
      'secretAccessKey' : awscred.secretAccessKey,  
      'region'          : amazon.US_EAST_1,
	  'awsAccountId'    : awscred.awsAccountId
    });
    var options = {
                QueueName     : queuename,
                ReceiptHandle : [],
                Id            : [],
            };

    _.each(messages, function(m) {
        fmt.dump(m,"OBJECT");
        options.ReceiptHandle.push( m.ReceiptHandle );
        options.Id.push( Math.floor(Math.random() * 1000) );
    });

    sqs.DeleteMessageBatch(options, callback);
    
}