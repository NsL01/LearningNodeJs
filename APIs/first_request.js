const request = require("request");
/*const rp = require("request-promise");

rp("https://jsonplaceholder.typicode.com/users/1")
    .then((htmlstring) => {
        console.log(JSON.parse(htmlstring).company.name);   
    })
    .catch((err) => {
        console.log("Error", err);
    });*/


request('https://jsonplaceholder.typicode.com/users/1', (error, response, body) => {
    if(!error & response.statusCode == 200){
        const parsedData = JSON.parse(body);
        console.log(`lives in ${parsedData.address.street}`);
    }else{
        console.log("Something went wront!");
    }
});
