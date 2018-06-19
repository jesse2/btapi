var express=require('express');
var app=express();
var braintree=require("braintree");
var cors=require('cors');
var bodyParser=require('body-parser');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var gateway=braintree.connect({
    environment : braintree.Environment.Sandbox,
    merchantId: "",
    publicKey: "",
    privateKey: ""
});
app.get('/', function(req,res){
    res.send('Hello World');
});

app.get('/client_token', function(req,res){
    console.log('received request for token');
    gateway.clientToken.generate({}, function(err,response){
        res.send(response.clientToken);
    });
});

app.post("/checkout/", function (req, res) {

    var nonceFromTheClient=req.body.nonce;
    var first=req.body.firstname;
    var last=req.body.lastname;
    var amount=req.body.amount;
    var email=req.body.email;
    var address=req.body.address;
    var city=req.body.city;
    var zip=req.body.zip;

    // gateway.customer.create({
    //    firstName:first,
    //    lastName:last,
    //    email:email 
    // },function(err,result){
    //     if(result){
    //     console.log("if it worked, this should return id: " +result.customer.id);
    //     }else{
    //         console.log("Error!: "+err);
    //     }
    // });

   // Use payment method nonce here
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        customer:{
            //id:"customer_"+first,
            firstName:first,
            lastName:last,
            email:email
        },
        billing:{
            firstName:first,
            lastName:last,
            streetAddress:address,
            locality:city,
            postalCode:zip
        },
        shipping:{
            firstName:first,
            lastName:last,
            streetAddress:address,
            locality:city,
            postalCode:zip
        },
        options: {
          submitForSettlement: true,
          storeInVaultOnSuccess:true
        }
      }, function (err, result) {
          if(result)
          {
              //console.log(result.transaction);
              res.send(result.transaction.id);
          }
      });
  });

  app.post("/paymentinfo/", function(req,res){
      
      var transid=req.body.transid;
      console.log("transaction id: "+transid);

    gateway.transaction.find(transid, function(err,transaction){
        console.log(transaction);
        res.json(transaction);
        //res.send(transaction);
    });
  });


app.listen(3000,function(){
    console.log('listening on port 3000');
});
