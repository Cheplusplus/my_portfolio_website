let marker_mode = false;
let markers = [];
let path = [];
let button = document.getElementById("set_markers");
let request_path = document.getElementById("get_path");


const reset_markers = function(){
    ctx.fillStyle = "#011";   
    markers.forEach(function(marker){  
        ctx.fillRect((marker.x) * square_size , (marker.y) * square_size , square_size , square_size );
    });
}

const reset_path = function(){
    ctx.fillStyle = "#011";
    if (path === null){
        return;
    }
    path.forEach(function(point, index){  
        if (index === 0){
            return;
        }
        ctx.fillRect((point.x) * square_size , (point.y) * square_size , square_size , square_size );
    });
    path = [];
}

button.addEventListener('click', function(){
    reset_markers();
    reset_path();
    marker_mode = true;
    markers = [];
    return
});

canvas.addEventListener('mousedown', function(event) {
    if (!marker_mode){    
        return
    }

    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    let gridX = Math.floor(x / square_size);
    let gridY = Math.floor(y / square_size);
    // If this square is an obstacle then dont make it a marker
    if (obstacles.findIndex(i => i.x === gridX && i.y === gridY) !== -1){
        return
    }
    if (markers.length === 0){
        markers.push({"x":gridX,"y":gridY,"start": true});
        changeColor(gridX,gridY,"#080");
    }
    else if (markers.length === 1 ){
        markers.push({"x":gridX,"y":gridY,"start": false});
        changeColor(gridX,gridY,"#800000");
        // marker_mode = false;
    }
    else {
        marker_mode = false;
    }
});

const sendMarkers = async function(){
    if (markers.length !== 2){
        console.log("Markers length is not 2!")
        return
    };
    const url = "/astar/";

    try{
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
              },
            method:'POST',
            body: JSON.stringify(markers),

        }).then((response) => response.json()).then((data)=> {
            try{
                path = data;
                drawPath();
            }
            catch(error){
                console.log(error);
            }
        });
        
    }
    catch(error){
        console.log(error);
    };
};

request_path.addEventListener('click', function(){
    reset_path();
    marker_mode = false;
    Promise.all([promises]).then(() => {sendMarkers();});
});

const drawPath = function(){
    if (path === null){
        return;
    }
    path.forEach(function(point, index){
        if (index === 0){
            return;
        }
        setTimeout(() => {
            changeColor(point.x,point.y,'#c54');
        }, index * 50);
    });
};
