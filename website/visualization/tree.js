document.getElementById("phylocanvas").style.overflow = "hidden";

let treeType = "circular"; // Initial shape of the phylogenetic tree.

// Setting initial tree properties.
let tree = Phylocanvas.createTree('phylocanvas', {
    /*
            metadata: {

                padding: 300

            },*/

    history: {
        parent: document.getElementById("mapid"),
        zIndex: -1000
    },

   // baseNodeSize: 20,
    padding: 5,
   // textSize: "25",
    font: "helvetica",
   // root: "A_H3N2_reference_demo",
    zoomFactor: 2,
    labelPadding: 5,
    showLabels: true,
    //lineWidth: 1,
    alignLabels: true,
    //  highlightColour: "red",
    highlightSize: 1,
    highlightWidth: -1
    //   showBranchLengthLabels: true
});

function phylTree(metaData, data_input) {

    // Generating metadata options for coloring nodes in the tree.
    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

        if (j === 0) {

            let optionMetadataa = document.createElement("OPTION");

            optionMetadataa.id = "optionMetadataa";
            optionMetadataa.innerHTML= "None";

            document.getElementById("selectNodeColor").appendChild(optionMetadataa);

        }

        let optionMetadata = document.createElement("OPTION");

        optionMetadata.id = "optionMetadata"+j;
        optionMetadata.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[j];
        optionMetadata.value = Object.keys(metaData[Object.keys(metaData)[0]])[j];

        document.getElementById("selectNodeColor").appendChild(optionMetadata);
    }

    // Listening to changes in the select element of node colors which will trigger tree update.
    document.getElementById("selectNodeColor").addEventListener("change", function () {

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

            if (document.getElementById("optionMetadata"+j).selected) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    tree.leaves[i].setDisplay({
                        //colour: 'red',
                        //shape: 'circle', // or square, triangle, star
                        //size: 3, // ratio of the base node size
                        leafStyle: {
                            //strokeStyle: '#0000ff',
                            fillStyle: "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j])),
                            //lineWidth: 2,
                        }
                    });
                }
            }
        }
    });

    document.getElementById("treeButton").src = "../img/" + treeType + ".png"; // Initializing the right tree button accordingly to the shape of the tree.

    tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
    tree.setNodeSize(document.getElementById("nodeSize").value); // Setting the node size accordingly to the value of the respective range element.
    //tree.setTextSize(document.getElementById("textSize").value);

    tree.on('beforeFirstDraw', function () {

        // Generating metadata options for inserting bars in front of tree leafs.
            for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

                    let metadataSwitchLabel = document.createElement("LABEL"); // Metadata label.
                    let metadataSwitch = document.createElement("INPUT"); // Checkbox input.

                    metadataSwitchLabel.id = "metadataSwitchLabel"+j;
                    metadataSwitchLabel.className = "metadataSwitchLabel";
                    metadataSwitchLabel.innerHTML = Object.keys(metaData[Object.keys(metaData)[0]])[j];
                    metadataSwitchLabel.style.display = "block";
                    metadataSwitchLabel.style.paddingLeft = "10px";
                    metadataSwitchLabel.style.paddingRight = "10px";
                    metadataSwitchLabel.style.opacity = "1";

                    metadataSwitch.id = "metadataSwitch"+j;
                    metadataSwitch.className = "metadataSwitch";
                    metadataSwitch.type = "checkbox";
                    metadataSwitch.style.zIndex = "2000";
                    metadataSwitch.style.cursor = "pointer";
                    metadataSwitch.style.marginLeft = "10px";

                    document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabel);
                    document.getElementById("metadataSwitchLabel"+j).appendChild(metadataSwitch);
            }

            radioDetect(metaData, Object.keys(Object.values(metaData)[0]).length);
    });

    tree.load(data_input);

    selectAlll(metaData, Object.keys(Object.values(metaData)[0]).length);
    displayLabel(metaData, Object.keys(Object.values(metaData)[0]).length);
}

function radioDetect (metaData, max) {

    for (let j = 0; j < max; j++) {

        document.getElementById("metadataSwitch"+j).addEventListener("change", function () {

            if (document.getElementById("metadataSwitch"+j).checked === true) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                    (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j]));

                    if (document.getElementById("metadataSwitchDisplay").checked === true) {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                    } else {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                    }
                }

            } else {

                for (let i = 0; i < tree.leaves.length; i++) {

                    delete (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]];

                }
            }

            tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.

        });
    }
}

// -------------------------------------- Toggle Gear --------------------------------------

let treeToggleGear = document.createElement("IMG");

treeToggleGear.id = "toggle";
treeToggleGear.style.position = "absolute";
treeToggleGear.style.right = "10px";
treeToggleGear.style.top = "10px";
treeToggleGear.onclick = toggle;
treeToggleGear.style.zIndex = "1";
treeToggleGear.src = "../img/pixelmator/gear_black.png";
treeToggleGear.style.width = "25px";
treeToggleGear.style.cursor = "pointer";

document.getElementById("phylocanvas").appendChild(treeToggleGear);

// -------------------------------------- Tree --------------------------------------

let treeDiv = document.createElement("DIV");
let treeButton = document.createElement("IMG");
let treeDivInside = document.createElement("DIV");

let treeType1 = document.createElement("IMG");
let treeType2 = document.createElement("IMG");
let treeType3 = document.createElement("IMG");
let treeType4 = document.createElement("IMG");
let treeType5 = document.createElement("IMG");

treeDiv.id = "treeDiv";
treeDiv.classList.add("dropdown");
treeDiv.classList.add("toggle");
treeDiv.style.position = "absolute";
treeDiv.style.zIndex = "2000";
treeDiv.style.right = "10px";
treeDiv.style.bottom = "10px";
treeDiv.style.display = "none";

treeButton.id = "treeButton";
treeButton.style.textAlign = "center";
treeButton.src = "../img/circular.png";
treeButton.style.width = "30px";
treeButton.style.cursor = "pointer";

treeDivInside.id = "treeDivInside";
treeDivInside.class = "dropdown-content";
treeDivInside.style.display = "none";
treeDivInside.style.position = "absolute";
treeDivInside.style.bottom = "30px";
treeDivInside.style.right = "0px";
treeDivInside.style.zIndex = "700";
treeDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeDivInside.style.backgroundColor = "black";
treeDivInside.style.borderTopLeftRadius = "10px";
treeDivInside.style.borderTopRightRadius = "10px";
treeDivInside.style.borderBottomRightRadius = "10px";
treeDivInside.style.borderBottomLeftRadius = "10px";

treeType1.id = "radial";
treeType1.style.cursor = "pointer";
treeType1.style.display = "block";
treeType1.style.padding = "5px 10px";
treeType1.style.zIndex = "2";
treeType1.src = "../img/radial.png";
treeType1.style.width = "30px";

treeType2.id = "rectangular";
treeType2.style.cursor = "pointer";
treeType2.style.display = "block";
treeType2.style.padding = "5px 10px";
treeType2.style.zIndex = "2";
treeType2.src = "../img/rectangular.png";
treeType2.style.width = "30px";

treeType3.id = "circular";
treeType3.style.cursor = "pointer";
treeType3.style.display = "block";
treeType3.style.padding = "5px 10px";
treeType3.style.zIndex = "2";
treeType3.src = "../img/circular.png";
treeType3.style.width = "30px";

treeType4.id = "diagonal";
treeType4.style.cursor = "pointer";
treeType4.style.display = "block";
treeType4.style.padding = "5px 10px";
treeType4.style.zIndex = "2";
treeType4.src = "../img/diagonal.png";
treeType4.style.width = "30px";

treeType5.id = "hierarchical";
treeType5.style.cursor = "pointer";
treeType5.style.display = "block";
treeType5.style.padding = "5px 10px";
treeType5.style.paddingBottom = "10px";
treeType5.style.zIndex = "2";
treeType5.src = "../img/hierarchical.png";
treeType5.style.width = "30px";

document.getElementById("phylocanvas").appendChild(treeDiv);

document.getElementById("treeDiv").appendChild(treeButton);
document.getElementById("treeDiv").appendChild(treeDivInside);

document.getElementById("treeDivInside").appendChild(treeType1);
document.getElementById("treeDivInside").appendChild(treeType2);
document.getElementById("treeDivInside").appendChild(treeType3);
document.getElementById("treeDivInside").appendChild(treeType4);
document.getElementById("treeDivInside").appendChild(treeType5);

// -------------------------------------- Style --------------------------------------

let treeStyleDiv = document.createElement("DIV");
let treeStyleButton = document.createElement("BUTTON");
let treeStyleDivInside = document.createElement("DIV");

let nodeSizeLabel = document.createElement("P");
let nodeSize = document.createElement("INPUT");

let textSizeLabel = document.createElement("P");
let textSize = document.createElement("INPUT");

let lineWidthLabel = document.createElement("P");
let lineWidth = document.createElement("INPUT");

let selectNodeColorLabel = document.createElement("P");
let selectNodeColor = document.createElement("SELECT");

treeStyleDiv.id = "treeStyleDiv";
treeStyleDiv.classList.add("dropdown");
treeStyleDiv.classList.add("toggle");
treeStyleDiv.style.position = "absolute";
treeStyleDiv.style.top = "10px";
treeStyleDiv.style.left = "90px";
treeStyleDiv.style.zIndex = "2000";
treeStyleDiv.style.display = "none";

treeStyleButton.id = "treeStyleButton";
treeStyleButton.innerHTML = "Style";
treeStyleButton.style.textAlign = "center";
treeStyleButton.style.width = "50px";
treeStyleButton.style.height = "25px";
treeStyleButton.style.cursor = "pointer";
treeStyleButton.style.backgroundColor = "black";
treeStyleButton.style.borderColor = "white";
treeStyleButton.style.color = "white";
treeStyleButton.style.borderRadius = "10px";

treeStyleDivInside.id = "treeStyleDivInside";
treeStyleDivInside.class = "dropdown-content";
treeStyleDivInside.style.display = "none";
treeStyleDivInside.style.position = "absolute";
treeStyleDivInside.style.zIndex = "20";
treeStyleDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeStyleDivInside.style.lineHeight = "5px";
treeStyleDivInside.style.paddingBottom = "15px";
treeStyleDivInside.style.paddingLeft = "10px";
treeStyleDivInside.style.paddingRight = "10px";
treeStyleDivInside.style.fontSize = "12px";
treeStyleDivInside.style.backgroundColor = "black";
treeStyleDivInside.style.borderTopLeftRadius = "10px";
treeStyleDivInside.style.borderTopRightRadius = "10px";
treeStyleDivInside.style.borderBottomRightRadius = "10px";
treeStyleDivInside.style.borderBottomLeftRadius = "10px";

nodeSizeLabel.id = "nodeSizeLabel";
nodeSizeLabel.innerHTML = "Node Size";
nodeSizeLabel.style.zIndex = "2";
nodeSizeLabel.style.textAlign = "center";
nodeSizeLabel.style.color = "white";

nodeSize.id = "nodeSize";
nodeSize.type = "range";
nodeSize.value = "10";
nodeSize.style.zIndex = "2";
nodeSize.style.cursor = "pointer";
nodeSize.style.width = "100px";
nodeSize.style.display = "block";
nodeSize.style.margin = "auto";

textSizeLabel.id = "textSizeLabel";
textSizeLabel.innerHTML = "Label Size";
textSizeLabel.style.zIndex = "2";
textSizeLabel.style.textAlign = "center";
textSizeLabel.style.color = "white";

textSize.id = "textSize";
textSize.type = "range";
textSize.value = "12";
textSize.style.zIndex = "2";
textSize.style.cursor = "pointer";
textSize.style.width = "100px";
textSize.style.display = "block";
textSize.style.margin = "auto";

lineWidthLabel.id = "lineWidthLabel";
lineWidthLabel.innerHTML = "Line Width";
lineWidthLabel.style.zIndex = "2";
lineWidthLabel.style.textAlign = "center";
lineWidthLabel.style.color = "white";

lineWidth.id = "lineWidth";
lineWidth.type = "range";
lineWidth.value = "20";
lineWidth.style.zIndex = "2";
lineWidth.style.cursor = "pointer";
lineWidth.style.width = "100px";
lineWidth.style.display = "block";
lineWidth.style.margin = "auto";

selectNodeColorLabel.id = "selectNodeColorLabel";
selectNodeColorLabel.innerHTML = "Color";
selectNodeColorLabel.style.zIndex = "1000";
selectNodeColorLabel.style.textAlign = "center";
selectNodeColorLabel.style.color = "white";

selectNodeColor.id = "selectNodeColor";
selectNodeColor.style.zIndex = "1000";
selectNodeColor.style.display = "block";
selectNodeColor.style.width = "100px";

document.getElementById("phylocanvas").appendChild(treeStyleDiv);

document.getElementById("treeStyleDiv").appendChild(treeStyleButton);
document.getElementById("treeStyleDiv").appendChild(treeStyleDivInside);

document.getElementById("treeStyleDivInside").appendChild(nodeSizeLabel);
document.getElementById("treeStyleDivInside").appendChild(nodeSize);

document.getElementById("treeStyleDivInside").appendChild(textSizeLabel);
document.getElementById("treeStyleDivInside").appendChild(textSize);

document.getElementById("treeStyleDivInside").appendChild(lineWidthLabel);
document.getElementById("treeStyleDivInside").appendChild(lineWidth);

document.getElementById("treeStyleDivInside").appendChild(selectNodeColorLabel);
document.getElementById("treeStyleDivInside").appendChild(selectNodeColor);

// -------------------------------------- Metadata --------------------------------------

let treeMetadataDiv = document.createElement("DIV");
let treeMetadataButton = document.createElement("BUTTON");
let treeMetadataDivInside = document.createElement("DIV");

let metadataSwitchLabel = document.createElement("LABEL");
let metadataSwitch = document.createElement("INPUT");

let metadataSwitchLabelDisplay = document.createElement("LABEL");
let metadataSwitchDisplay = document.createElement("INPUT");

treeMetadataDiv.id = "treeMetadataDiv";
treeMetadataDiv.classList.add("dropdown");
treeMetadataDiv.classList.add("toggle");
treeMetadataDiv.style.position = "absolute";
treeMetadataDiv.style.left = "10px";
treeMetadataDiv.style.top = "10px";
treeMetadataDiv.style.bottom = "4px";
treeMetadataDiv.style.zIndex = "2000";
treeMetadataDiv.style.display = "none";

treeMetadataButton.id = "treeMetadataButton";
treeMetadataButton.innerHTML = "Metadata";
treeMetadataButton.style.textAlign = "center";
treeMetadataButton.style.width = "75px";
treeMetadataButton.style.height = "25px";
treeMetadataButton.style.cursor = "pointer";
treeMetadataButton.style.backgroundColor = "black";
treeMetadataButton.style.borderColor = "white";
treeMetadataButton.style.color = "white";
treeMetadataButton.style.borderRadius = "10px";

treeMetadataDivInside.id = "treeMetadataDivInside";
treeMetadataDivInside.class = "dropdown-content";
treeMetadataDivInside.style.display = "none";
treeMetadataDivInside.style.position = "absolute";
treeMetadataDivInside.style.zIndex = "20";
treeMetadataDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeMetadataDivInside.style.fontSize = "12px";
treeMetadataDivInside.style.height = "200px";
treeMetadataDivInside.style.overflow = "scroll";
treeMetadataDivInside.style.borderTopLeftRadius = "10px";
treeMetadataDivInside.style.borderTopRightRadius = "10px";
treeMetadataDivInside.style.borderBottomRightRadius = "10px";
treeMetadataDivInside.style.borderBottomLeftRadius = "10px";
treeMetadataDivInside.style.backgroundColor = "black";
treeMetadataDivInside.style.color = "white";
treeMetadataDivInside.style.minWidth = "150px";

metadataSwitchLabel.id = "metadataSwitchLabel";
metadataSwitchLabel.innerHTML = "Select All";
metadataSwitchLabel.style.display = "block";
metadataSwitchLabel.style.paddingLeft = "10px";
metadataSwitchLabel.style.paddingRight = "10px";
metadataSwitchLabel.style.backgroundColor = "white";
metadataSwitchLabel.style.color = "black";

metadataSwitch.id = "metadataSwitch";
metadataSwitch.type = "checkbox";
metadataSwitch.style.zIndex = "2000";
metadataSwitch.style.cursor = "pointer";
metadataSwitch.style.marginLeft = "10px";

metadataSwitchLabelDisplay.id = "metadataSwitchLabelDisplay";
metadataSwitchLabelDisplay.innerHTML = "Metadata Labels";
metadataSwitchLabelDisplay.style.display = "block";
metadataSwitchLabelDisplay.style.paddingLeft = "10px";
metadataSwitchLabelDisplay.style.paddingRight = "10px";
metadataSwitchLabelDisplay.style.backgroundColor = "white";
metadataSwitchLabelDisplay.style.color = "black";

metadataSwitchDisplay.id = "metadataSwitchDisplay";
metadataSwitchDisplay.type = "checkbox";
metadataSwitchDisplay.style.zIndex = "2000";
metadataSwitchDisplay.style.cursor = "pointer";
metadataSwitchDisplay.style.marginLeft = "10px";

document.getElementById("phylocanvas").appendChild(treeMetadataDiv);

document.getElementById("treeMetadataDiv").appendChild(treeMetadataButton);
document.getElementById("treeMetadataDiv").appendChild(treeMetadataDivInside);

document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabelDisplay);
document.getElementById("metadataSwitchLabelDisplay").appendChild(metadataSwitchDisplay);

document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabel);
document.getElementById("metadataSwitchLabel").appendChild(metadataSwitch);

// -------------------------------------- Button Dynamics

function toggle() {

    let x = document.getElementsByClassName("toggle");

    for (let i = 0; i < x.length; i++) {
        if (x[i].style.display === "none") {
            x[i].style.display = "block";
            document.getElementById("treeButton").style.display = "block";
            document.getElementById("toggle").style.transform = "rotate(-15deg)";
        } else {
            x[i].style.display = "none";
            document.getElementById("treeButton").style.display = "none";
            document.getElementById("toggle").style.transform = "rotate(15deg)";
        }
    }
}

let shapes = ["radial", "rectangular", "circular", "diagonal", "hierarchical"];

for (let i = 0; i < shapes.length; i++) {

    document.getElementById(shapes[i]).addEventListener("click", function () {

        document.getElementById("treeButton").src = "../img/" + shapes[i] + ".png";

        tree.setTreeType(shapes[i]); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.

        treeType = shapes[i];

    });
}

document.getElementById("nodeSize").addEventListener("input", function () {

    tree.setNodeSize(document.getElementById("nodeSize").value);

});

document.getElementById("textSize").addEventListener("input", function () {

    tree.setTextSize(document.getElementById("textSize").value);

});

document.getElementById("lineWidth").addEventListener("input", function () {

    tree.lineWidth = document.getElementById("lineWidth").value/20;

    tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.

});

document.getElementById("treeDivInside").addEventListener("mouseover", function () {

    treeDivInside.style.display = "block";

});

document.getElementById("treeDivInside").addEventListener("mouseout", function () {

    treeDivInside.style.display = "none";

});

document.getElementById("treeButton").addEventListener("mouseover", function () {

    treeDivInside.style.display = "block";

});

document.getElementById("treeButton").addEventListener("mouseout", function () {

    treeDivInside.style.display = "none";

});

document.getElementById("treeStyleDivInside").addEventListener("mouseover", function () {

    treeStyleDivInside.style.display = "block";

});

document.getElementById("treeStyleDivInside").addEventListener("mouseout", function () {

    treeStyleDivInside.style.display = "none";

});

document.getElementById("treeStyleButton").addEventListener("mouseover", function () {

    treeStyleDivInside.style.display = "block";

});

document.getElementById("treeStyleButton").addEventListener("mouseout", function () {

    treeStyleDivInside.style.display = "none";

});

document.getElementById("treeMetadataDivInside").addEventListener("mouseover", function () {

    treeMetadataDivInside.style.display = "block";

});

document.getElementById("treeMetadataDivInside").addEventListener("mouseout", function () {

    treeMetadataDivInside.style.display = "none";

});

document.getElementById("treeMetadataButton").addEventListener("mouseover", function () {

    treeMetadataDivInside.style.display = "block";

});

document.getElementById("treeMetadataButton").addEventListener("mouseout", function () {

    treeMetadataDivInside.style.display = "none";

});

function selectAlll (metaData, max) {

    document.getElementById("metadataSwitch").addEventListener("change", function () {

        if (document.getElementById("metadataSwitch").checked === true) {

            for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

                document.getElementsByClassName("metadataSwitch")[i].checked = true;

            }

            for (let j = 0; j < max; j++) {

                        for (let i = 0; i < tree.leaves.length; i++) {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j]));

                            if (document.getElementById("metadataSwitchDisplay").checked === true) {

                                (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                            } else {

                                (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                            }
                        }

                    tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
            }

        } else {

            for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

                document.getElementsByClassName("metadataSwitch")[i].checked = false;

            }

                for (let i = 0; i < tree.leaves.length; i++) {

                    tree.leaves[i].data = {
                    };

                }

                tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.

        }
    });
}

function displayLabel (metaData, max) {

    document.getElementById("metadataSwitchDisplay").addEventListener("change", function () {

    let metaLabels = [];

    for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

        if (document.getElementsByClassName("metadataSwitch")[i].checked === true) {

            metaLabels.push(document.getElementsByClassName("metadataSwitchLabel")[i].innerText);

        }
    }

    console.log(metaLabels);

    for (let j = 0; j < max; j++) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    if (metaLabels.find(function(element) {
                        return (element === Object.keys(metaData[tree.leaves[i].label])[j]);
                    }) !== undefined) {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j]));

                        if (document.getElementById("metadataSwitchDisplay").checked === true) {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                        } else {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                        }

                    }

                }

            tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
    }
    })
}