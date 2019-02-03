// Importing General Libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');

// Importing Community Finding Libraries.
const infomap = require('./website/algorithms/mod_algorithms/mod_infomap');
const louvain = require('./website/algorithms/mod_algorithms/mod_louvain');
const layeredLabelPropagation = require('./website/algorithms/mod_algorithms/mod_layeredLabelPropagation');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

let result = {}, result_reset = {}, result_cyto = {}, result_cyto_reset = {};
let community, node_data, obj, obj_cyto, gamma_var;

function edge (source, target) { // Used in fs.readFile in order to push each edge in Input.txt to an empty array.
    return {source: source, target: target, value: 1}; // Previously, I used parseInt to convert source and target strings to an integer.
}

function nodify (final_node_data, state) { // Used in fs.readFile in order to push each node in Input.txt to an empty array.

    let result_aux = [];
    let keys = Object.keys(final_node_data);

    switch(state) {

        case 0:
        keys.forEach(function (key) {
            result_aux.push({"id": key, "group": final_node_data[key]})
        });
        break;

        case 1:
        keys.forEach(function (key) {
            result_aux.push({"id": key, "group": 1})
        });
        break;

        case 2:
        keys.forEach(function (key) {
            result_aux.push({data: {id: key, weight: 0, label: "aaa"}, classes: "top-left"})
        });
        break;

        case 3:
        keys.forEach(function (key) {
            result_aux.push({data: {id: key, weight: final_node_data[key], label: "2"}, classes: "top-left"});
        });

    }
    return result_aux; // Previously, I used parseInt to convert the key string to an integer.
}

function readFile(type) {

    fs.readFile('./uploads/Input.txt', 'utf8', function (err, data) {

        if (err) throw err;

        obj = [];
        obj_cyto = [];
        node_data = {};

        let splitted = data.toString().split("\n");

        for (let i = 0; i < 100; i++) {
            let splitLine = splitted[i].split("\t");
            node_data[splitLine[0]] = true;
            node_data[splitLine[1]] = true;
            obj.push(edge(splitLine[0], splitLine[1]));
            obj_cyto.push({data: edge(splitLine[0], splitLine[1])});

        }

        let final_node_data = Object.keys(node_data);

        switch (type) {

            case 'init':
                result_reset["nodes"] = nodify(node_data, 1);
                result_reset["links"] = obj;

                result_cyto_reset["nodes"] = nodify(node_data, 2);
                result_cyto_reset["links"] = obj_cyto;

                break;

            case 'louvain':
                community = louvain.louvainVar(final_node_data, obj);

                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 3);
                result_cyto["links"] = obj_cyto;

                break;

            case 'infomap':
                community = infomap.infomapVar(final_node_data, obj);

                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 3);
                result_cyto["links"] = obj_cyto;

                break;

            case 'llp':
                community = layeredLabelPropagation.layeredLabelPropagationVar(final_node_data, obj, gamma_var);

                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 3);
                result_cyto["links"] = obj_cyto;

        }

    });

}

 readFile('init');

 // Standard algorithm when any is chosen.

app.get('/run/:id', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    if(req.params.id === "Cytoscape") {

        res.send(result_cyto);

    } else {
        res.send(result); // Responding.
    }

});

app.get('/reset/:alg', function (req, res) { // This will run every time you send a request to localhost:3000/search.

        if(req.params.alg === "Cytoscape") {
             res.send(result_cyto_reset);
        } else {
             res.send(result_reset); // Responding.
        }

});

app.get('/algorithm/:type', function (req, res) { // This will run every time you send a request to localhost:3000/search.

        readFile(req.params.type);

    res.send();
});


app.post('/upload', function (req, res){

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + "Input.txt"; // file.name substituted by Input.txt
    });

});

app.post('/gamma', function (req, res){

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + "Input.txt"; // file.name substituted by Input.txt
    });

});