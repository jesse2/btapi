var express=require('express');
var app=express();
var braintree=require("braintree");
var cors=require('cors');

app.use(cors());

var gateway=braintree.connect({
    environment : braintree.Environment.Sandbox,
    merchantId: "3znffydh7wvgphyw",
    publicKey: "k49wftrkkvqsy72t",
    privateKey: "73bbdeebd7d8cededa229f978ff538e4"
});
app.get('/', function(req,res){
    res.send('Hello World');
});

app.get('/client_token', function(req,res){
    gateway.clientToken.generate({}, function(err,response){
        res.send(response.clientToken);
    });
});

app.post("/checkout/:nonce", function (req, res) {

    var nonceFromTheClient=req.params.nonce;

    // Use payment method nonce here
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(result)
          {
              //console.log(result.transaction);
              res.send(result.transaction.id);
          }
      });
  });

  app.get("/checkout/:id", function(req,res){
      //var result;
      var transid=req.paarams.id;
    gateway.transaction.find(transid, function(err,transaction){
        //console.log(transaction);
        res.send(transaction);
    });
  });
app.listen(3000,function(){
    console.log('listening on port 3000');
});