let savedConnections = [];

let nodeCount = 0;

let selectedNode = null;

// JSPLUMB SETUP

jsPlumb.ready(function () {

    jsPlumb.setContainer("canvas");
});

/* ADD NODE */

function addNode() {

    nodeCount++;

    const canvas =
        document.getElementById("canvas");

    // CREATE NODE

    const node =
        document.createElement("div");

    node.classList.add("roadmap-node");

    node.id = "node-" + nodeCount;

    // DEFAULT CONTENT

   node.innerHTML = `

    <button
        class="delete-btn"
        onclick="deleteNode(event, '${node.id}')"
    >
        ×
    </button>

    <h3>New Topic</h3>

    <p>To Learn</p>
`;

    // POSITION

    node.style.left =
        (50 + nodeCount * 40) + "px";

    node.style.top =
        (50 + nodeCount * 40) + "px";

    // HIDE EMPTY TEXT

    const canvasText =
        document.querySelector(".canvas-text");

    if(canvasText){
        canvasText.style.display = "none";
    }

    // ADD TO CANVAS

    canvas.appendChild(node);

    // ENTRY ANIMATION

node.animate(

    [
        {
            opacity:0,
            transform:"scale(0.7)"
        },

        {
            opacity:1,
            transform:"scale(1)"
        }
    ],

    {
        duration:300
    }
);


    // ENABLE FEATURES

    makeDraggable(node);

    enableEditing(node);

    enableConnections(node);
}

/* DRAGGING */

function makeDraggable(node){

    jsPlumb.draggable(node, {

        containment:true
    });
}

/* EDITING */

function enableEditing(node) {

    // RIGHT CLICK → EDIT NODE

    node.addEventListener(
        "contextmenu",
        (e) => {

            e.preventDefault();

            // EDIT TOPIC

            const topic =
                prompt("Enter Topic Name:");

            if(topic){

                node.querySelector("h3")
                    .innerText = topic;
            }

            // EDIT STATUS

            const status =
                prompt(
                    "Enter Status:\n(To Learn / In Progress / Completed)"
                );

            if(status){

                node.querySelector("p")
                    .innerText = status;

                updateNodeColor(node, status);
            }
        }
    );
}

/* NODE COLORS */

function updateNodeColor(node, status){

    status =
        status.toLowerCase();

    // COMPLETED

    if(status === "completed"){

        node.style.border =
            "2px solid #22c55e";

        node.style.boxShadow =
            "0 0 15px rgba(34,197,94,0.6)";
    }

    // IN PROGRESS

    else if(status === "in progress"){

        node.style.border =
            "2px solid #eab308";

        node.style.boxShadow =
            "0 0 15px rgba(234,179,8,0.6)";
    }

    // TO LEARN

    else{

        node.style.border =
            "2px solid #3b82f6";

        node.style.boxShadow =
            "0 0 15px rgba(59,130,246,0.6)";
    }
}

/* CONNECTIONS */

/* OLD  CONNECTIONS CODE */

// function enableConnections(node){

//     node.addEventListener(
//         "click",
//         () => {

//             // SELECT FIRST NODE

//             if(selectedNode == null){

//                 selectedNode = node;

//                 node.style.border =
//                     "2px solid #ec4899";
//             }

//             // CONNECT SECOND NODE

//             else{

//                 jsPlumb.connect({

//                     source:selectedNode,

//                     target:node,

//                     anchors:["Bottom", "Top"],

//                     endpoint:"Dot",

//                     connector:[
//                         "Bezier",
//                         {
//                             curviness:40
//                         }
//                     ],

//                     paintStyle:{
//                         stroke:"#a855f7",
//                         strokeWidth:4
//                     },

//                     overlays:[
//                         [
//                             "Arrow",
//                             {
//                                 width:12,
//                                 length:12,
//                                 location:1
//                             }
//                         ]
//                     ]
//                 });

//                 // STORE CONNECTION

//                 savedConnections.push({

//                     sourceNode:
//                         selectedNode.id,

//                     targetNode:
//                         node.id
//                 });

//                 // RESET BORDER

//                 updateNodeColor(
//                     selectedNode,
//                     selectedNode
//                         .querySelector("p")
//                         .innerText
//                 );

//                 selectedNode = null;
//             }
//         }
//     );
// }


// NEW CONNECTIONS CODE


/* CONNECTIONS */

function enableConnections(node){

    node.addEventListener(
        "click",
        () => {

            // SELECT FIRST NODE

            if(selectedNode == null){

                selectedNode = node;

                node.style.border =
                    "2px solid #ec4899";
            }

            // CONNECT SECOND NODE

            else{

                jsPlumb.connect({

                    source:selectedNode,

                    target:node,

                    anchors:["Right", "Left"],

                    endpoint:"Blank",

                    connector:[
                        "Flowchart",
                        {
                            cornerRadius:12,
                            stub:30,
                            gap:5
                        }
                    ],

                    paintStyle:{
                        stroke:"#c084fc",
                        strokeWidth:3
                    },

                    hoverPaintStyle:{
                        stroke:"#e879f9",
                        strokeWidth:4
                    },

                    overlays:[
                        [
                            "Arrow",
                            {
                                width:10,
                                length:10,
                                location:1
                            }
                        ]
                    ]
                });

                // STORE CONNECTION

                savedConnections.push({

                    sourceNode:
                        selectedNode.id,

                    targetNode:
                        node.id
                });

                // RESET BORDER

                updateNodeColor(
                    selectedNode,
                    selectedNode
                        .querySelector("p")
                        .innerText
                );

                selectedNode = null;
            }
        }
    );
}




/* SAVE ROADMAP */
/* SAVE ROADMAP */

async function saveRoadmap(){

    const nodes =
        document.querySelectorAll(".roadmap-node");

    let roadmapData = [];

    // COLLECT NODE DATA

  nodes.forEach(node => {

    roadmapData.push({
          frontendId:
        node.id,


               

        title:

            node.querySelector("h3").innerText,

        status:
            node.querySelector("p").innerText,

        x:
            parseInt(node.style.left),

        y:
            parseInt(node.style.top)
    });
});

    // GET LOGGED-IN USER

    const email =
        localStorage.getItem("loggedInUser");

    // FETCH USER

    const response =
        await fetch("/auth/getUser/" + email);

    const user =
        await response.json();

    // SAVE NODES

    const saveResponse =
        await fetch(
            "/roadmap/save/" + user.id,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:
                    JSON.stringify(roadmapData)
            }
        );

    // SAVE CONNECTIONS

    await fetch(
        "/roadmap/saveConnections/" + user.id,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:
                JSON.stringify(savedConnections)
        }
    );

    // RESPONSE MESSAGE

    const message =
        await saveResponse.text();

    alert(message);
}





/* LOAD ROADMAP */

async function loadRoadmap(){

    // GET LOGGED-IN USER

    const email =
        localStorage.getItem("loggedInUser");

    if(!email){
        return;
    }

    // FETCH USER

    const response =
        await fetch("/auth/getUser/" + email);

    const user =
        await response.json();

    // FETCH NODES

    const roadmapResponse =
        await fetch(
            "/roadmap/load/" + user.id
        );

    const nodes =
        await roadmapResponse.json();

    // LOAD EACH NODE

    nodes.forEach(savedNode => {

        createLoadedNode(savedNode);
    });
}


/* LOAD CONNECTIONS */

async function loadConnections(){

    const email =
        localStorage.getItem("loggedInUser");

    if(!email){
        return;
    }

    // FETCH USER

    const response =
        await fetch("/auth/getUser/" + email);

    const user =
        await response.json();

    // FETCH CONNECTIONS

    const connectionResponse =
        await fetch(
            "/roadmap/loadConnections/" + user.id
        );

    const connections =
        await connectionResponse.json();

    // RECREATE CONNECTIONS

    connections.forEach(connection => {
        // old jspiumb code
        // jsPlumb.connect({

        //     source:connection.sourceNode,

        //     target:connection.targetNode,

        //     anchors:["Bottom", "Top"],

        //     endpoint:"Dot",

        //     connector:[
        //         "Bezier",
        //         {
        //             curviness:40
        //         }
        //     ],

        //     paintStyle:{
        //         stroke:"#a855f7",
        //         strokeWidth:4
        //     },

        //     overlays:[
        //         [
        //             "Arrow",
        //             {
        //                 width:12,
        //                 length:12,
        //                 location:1
        //             }
        //         ]
        //     ]
        // });

        // new jpumb code 


        // RESTORE CONNECTIONS ARRAY

    savedConnections.push({

        sourceNode:
            connection.sourceNode,

        targetNode:
            connection.targetNode
    });


        jsPlumb.connect({

    source:connection.sourceNode,

    target:connection.targetNode,

    anchors:["Right", "Left"],

    endpoint:"Blank",

    connector:[
        "Flowchart",
        {
            cornerRadius:12,
            stub:30,
            gap:5
        }
    ],

    paintStyle:{
        stroke:"#c084fc",
        strokeWidth:3
    },

    hoverPaintStyle:{
        stroke:"#e879f9",
        strokeWidth:4
    },

    overlays:[
        [
            "Arrow",
            {
                width:10,
                length:10,
                location:1
            }
        ]
    ]
});
    });
}


/* CREATE LOADED NODE */

function createLoadedNode(savedNode){

    const canvas =
        document.getElementById("canvas");

    const node =
        document.createElement("div");

    node.classList.add("roadmap-node");
node.id =
    savedNode.frontendId;

// UPDATE NODE COUNT

nodeCount = Math.max(
    nodeCount,
    parseInt(
        savedNode.frontendId.replace("node-", "")
    )
);

    // CONTENT

   node.innerHTML = `

    <button
        class="delete-btn"
        onclick="deleteNode(event, '${node.id}')"
    >
        ×
    </button>

    <h3>${savedNode.title}</h3>

    <p>${savedNode.status}</p>
`;
    // POSITION

    node.style.left =
        savedNode.x + "px";

    node.style.top =
        savedNode.y + "px";

    // APPLY COLOR

    updateNodeColor(
        node,
        savedNode.status
    );

    // HIDE EMPTY TEXT

    const canvasText =
        document.querySelector(".canvas-text");

    if(canvasText){
        canvasText.style.display = "none";
    }

    // ADD NODE

    canvas.appendChild(node);

    // ENTRY ANIMATION

node.animate(

    [
        {
            opacity:0,
            transform:"scale(0.7)"
        },

        {
            opacity:1,
            transform:"scale(1)"
        }
    ],

    {
        duration:300
    }
);

    // FEATURES

    makeDraggable(node);

    enableEditing(node);

    enableConnections(node);
}



// AUTO LOAD ROADMAP



window.onload = async function(){

    // CHECK LOGIN

    const email =
        localStorage.getItem(
            "loggedInUser"
        );

    if(!email){

        window.location.href =
            "pflogin.html";

        return;
    }

    await loadUsername();

    setupRoadmapTitle();

    await loadRoadmap();

    loadConnections();

     loadNotes();
};

/* DELETE NODE */

function deleteNode(event, nodeId){

    // PREVENT CONNECTION CLICK

    event.stopPropagation();

    const node =
        document.getElementById(nodeId);

    // REMOVE NODE + CONNECTIONS

    jsPlumb.remove(node);

    // SHOW EMPTY TEXT AGAIN

    const remainingNodes =
        document.querySelectorAll(".roadmap-node");

    if(remainingNodes.length === 0){

        const canvasText =
            document.querySelector(".canvas-text");

        if(canvasText){
            canvasText.style.display = "block";
        }
    }
}


/* CLEAR CANVAS */

function clearCanvas(){

    // REMOVE ALL CONNECTIONS

    jsPlumb.deleteEveryConnection();

    // REMOVE ALL NODES

    const nodes =
        document.querySelectorAll(".roadmap-node");

    nodes.forEach(node => {

        node.remove();
    });

    // RESET SAVED CONNECTIONS

    savedConnections = [];

    // SHOW EMPTY TEXT

    const canvasText =
        document.querySelector(".canvas-text");

    if(canvasText){

        canvasText.style.display = "block";
    }
}




/* LOGOUT */

function logout(){

    // CLEAR SESSION

    localStorage.removeItem(
        "loggedInUser"
    );

    // REDIRECT

    window.location.href =
        "pflogin.html";
}




/* OLD   ROADMAP TITLE */

// function setupRoadmapTitle(){

//     let roadmapTitle =
//         localStorage.getItem(
//             "roadmapTitle"
//         );

//     // ASK TITLE FIRST TIME

//     if(!roadmapTitle){

//         roadmapTitle =
//             prompt(
//                 "Enter Your Roadmap Name"
//             );

//         // DEFAULT VALUE

//         if(!roadmapTitle ||
//             roadmapTitle.trim() === ""){

//             roadmapTitle =
//                 "My Learning Roadmap";
//         }

//         localStorage.setItem(
//             "roadmapTitle",
//             roadmapTitle
//         );
//     }

//     // UPDATE NAVBAR TITLE

//     document.getElementById(
//         "roadmapTitle"
//     ).innerText = roadmapTitle;
// }

/* ROADMAP TITLE */

async function setupRoadmapTitle(){

    // GET LOGGED-IN USER

    const email =
        localStorage.getItem(
            "loggedInUser"
        );

    // GET USER

    const response =
        await fetch(
            "/auth/getUser/" + email
        );

    const user =
        await response.json();

    // LOAD TITLE FROM DATABASE

    const titleResponse =
        await fetch(
            "/auth/getRoadmapTitle/" +
            user.id
        );

    let roadmapTitle =
        await titleResponse.text();

    // FIRST TIME USER

    if(!roadmapTitle ||
        roadmapTitle === ""){

        roadmapTitle =
            prompt(
                "Enter Your Roadmap Name"
            );

        if(!roadmapTitle ||
            roadmapTitle.trim() === ""){

            roadmapTitle =
                "My Learning Roadmap";
        }

        // SAVE TO DATABASE

        await fetch(

            "/auth/saveRoadmapTitle/" +
            user.id,

            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                    JSON.stringify(
                        roadmapTitle
                    )
            }
        );
    }

    // DISPLAY TITLE

    document.getElementById(
        "roadmapTitle"
    ).innerText = roadmapTitle;
}


/* ROADMAP TITLE */

// function setupRoadmapTitle(){

//     // GET LOGGED-IN USER

//     const email =
//         localStorage.getItem(
//             "loggedInUser"
//         );

//     // CREATE UNIQUE KEY

//     const roadmapKey =
//         "roadmapTitle_" + email;

//     // GET TITLE

//     let roadmapTitle =
//         localStorage.getItem(
//             roadmapKey
//         );

//     // ASK FIRST TIME

//     if(!roadmapTitle){

//         roadmapTitle =
//             prompt(
//                 "Enter Your Roadmap Name"
//             );

//         // DEFAULT TITLE

//         if(!roadmapTitle ||
//             roadmapTitle.trim() === ""){

//             roadmapTitle =
//                 "My Learning Roadmap";
//         }

//         // SAVE USER-SPECIFIC TITLE

//         localStorage.setItem(
//             roadmapKey,
//             roadmapTitle
//         );
//     }

//     // DISPLAY TITLE

//     document.getElementById(
//         "roadmapTitle"
//     ).innerText = roadmapTitle;
// }

/* =========================
   NOTES PANEL
========================= */

// TOGGLE PANEL

function toggleNotesPanel(){

    document
        .getElementById("notesPanel")
        .classList.toggle("open");
}

// SAVE NOTE

async function saveNote(){

    const content =
        document.getElementById(
            "noteInput"
        ).value;

    if(content.trim() === ""){
        return;
    }

    // GET USER

    const email =
        localStorage.getItem(
            "loggedInUser"
        );

    const response =
        await fetch(
            "/auth/getUser/" + email
        );

    const user =
        await response.json();

    // SAVE NOTE

    await fetch(
        "/notes/save/" + user.id,
        {
            method:"POST",

            headers:{
                "Content-Type":
                    "application/json"
            },

            body:JSON.stringify({
                content:content
            })
        }
    );

    // CLEAR INPUT

    document.getElementById(
        "noteInput"
    ).value = "";

    loadNotes();
}

// LOAD NOTES

async function loadNotes(){

    const email =
        localStorage.getItem(
            "loggedInUser"
        );

    const response =
        await fetch(
            "/auth/getUser/" + email
        );

    const user =
        await response.json();

    const notesResponse =
        await fetch(
            "/notes/load/" + user.id
        );

    const notes =
        await notesResponse.json();

    const notesList =
        document.getElementById(
            "notesList"
        );

    notesList.innerHTML = "";

    notes.forEach(note => {

        notesList.innerHTML += `

            <div class="note-card">

                <button
                    class="delete-note"
                    onclick="deleteNote(${note.id})"
                >
                    ×
                </button>

                <p>${note.content}</p>

            </div>
        `;
    });
}

// DELETE NOTE

async function deleteNote(id){

    await fetch(
        "/notes/delete/" + id,
        {
            method:"DELETE"
        }
    );

    loadNotes();
}


async function loadUsername(){

    const email =
        localStorage.getItem(
            "loggedInUser"
        );

    const response =
        await fetch(
            "/auth/getUser/" + email
        );

    const user =
        await response.json();

    document.getElementById(
        "usernameDisplay"
    ).innerText =
        "👤 " + user.username;
}