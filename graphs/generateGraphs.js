require('dotenv').config()
const fs = require("fs");
const fetch = require("node-fetch");

const port = process.env.PORT;
const url = process.env.URL;

let inputFile = require('./alabama.json');
let outputPath = "./outputAlabama.json"

//Set up the basic graph object
graph = {}

const generateGraph = (inputObject) => {
    let candidates = inputObject.nodes.map(x => "id="+x.id)
    fetch(url+":"+port+"/api/graph/candidates/?" + candidates.join("&"))
    .then((response) => {
        return response.json()
    })
    .then((json) => {
        graph["links"] = json['data']
    })
    .then(() => {
        let nodes = 
            inputObject.nodes.map((x) => {
                return {
                    id: x.id, 
                    group: parseInt(x.cand_office_district, 10),
                }
            })
        return nodes   
    })
    .then(nodes => graph["nodes"] = nodes)
    .then(() => {
        fs.writeFile(outputPath, JSON.stringify(graph), (err) => {
            if (err) {
                console.error(err);
                return;
            };
        })
    })
    .catch(function(ex) {  
        console.log('parsing failed', ex)
    })
}

generateGraph(inputFile, null, 4)