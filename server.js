const express = require('express');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname +'/client'))


app.post('/upload_json', (req, res) =>{ 
    var data = JSON.parse(req.body.formData);
    console.log(data);
    res.end();
});

app.listen(3000, () =>{ 
    console.log("listen to port:http://localhost:3000");
});


function extractHeaders (jsonObj, headObj= {}){ 
    if (Array.isArray(jsonObj)){ 
        for (let item of jsonObj){ 
            extractHeaders(item, headObj);
        }
    } else { 
        Object.keys(jsonObj).forEach(key =>{ 
            if (key !== "children"){ 
                headObj[key] = "";
            }else if (jsonObj[key].length){ 
                extractHeaders(jsonObj[key], headObj)
            }
        })
    } return headObj; 
}
function extractValues(jsonObj, headObj, objvalArr=[]){
    if(Array.isArray(jsonObj)){
        for(let item of jsonObj){
            
            extractValues(item, headObj, objvalArr)
        }   
    }else{
        let valObj = Object.create(headObj)
        Object.keys(jsonObj).forEach(key=>{
            if(key!=="children"){
                valObj[key]=jsonObj[key]
            }
            else {
                extractValues(jsonObj[key], headObj, objvalArr)
            }
        });
        objvalArr.push(valObj)
    }
    return objvalArr;
}
function convertToCSV (jsonObj){ 
    let headObj = extractHeaders(jsonObj);
    let valArr = extractValues(jsonObj, headObj);
    let dataArr = []; 
dataArr.push(Object.keys(jsonObj).join(','))
for (let valObj of valArr){ 
    let row = Object.keys(valObj).map(key =>{
        return valObj[key];
    });
    dataArr.push(row.join(','));
}
let csvdata = dataArr.join('\n');
return csvdata;
}

