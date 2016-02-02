/*// The HTML5 canvase where we will be rendering our map.
var canvas = document.getElementById("mapCanvas");
var ctx = canvas.getContext("2d");

// This function is used to initialize everything when the game starts.
$(document).ready(function() {
  canvas.width = 1280;
  canvas.height = 720;
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 10;

  // Handle canvas click events.
  canvas.addEventListener('click', function(e) {
    // Get the click position.
    var rect = canvas.getBoundingClientRect();

    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    x *= canvas.width / $("#mapCanvas").width();
    y *= canvas.height / $("#mapCanvas").height();

    var clickedNodeIndex = detectClickedNode(x, y);

    // Pass it to preformAction to process it.
    performAction(clickedNodeIndex);
  }, false);
});*/

"use strict";

//location card class
class Location {
    //constructor
    constructor(id, locationName, value, x, y) {
        this.id = id;
        this.locationName = locationName;
        this.value = value;
        this.x = x;
        this.y = y;

        // Get the right color and resource name for each location
        switch (locationName) {
            case "Hills":
                this.color = "brown";
                this.resourceName = "brick";
                break;
            case "Forest":
                this.color = "darkgreen";
                this.resourceName = "lumber";
                break;
            case "Mountains":
                this.color = "grey";
                this.resourceName = "ore";
                break;
            case "Fields":
                this.color = "yellow";
                this.resourceName = "grain";
                break;
            case "Pasture":
                this.color = "lightgreen";
                this.resourceName = "wool";
                break;
            case "Dessert":
                this.color = "tan";
                break;
            default:
                this.color = "red";
                break;
        }
    }
}


//import Location from "location.js";

var tileWidth = 124,
    tileHeight = 108,
    tileBigHeight = 140;

//FOR NOW: this will be a three-dimensional array that holds the data of the coordinates for each tile
//(ArrayOfTileVerticesCoordinates[INDEX OF TILE] [INDEX OF VERTEX] [INDEX OF COORDINATE (x=0,y=1)]]
var ArrayOfTileVerticesCoordinates = [];

// Class for whole board of tiles
class Board {
    // Constructor
    constructor() {
        // Get canvas info
        this.canvas = document.getElementById('mapCanvas');
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.addEventListener("mousemove", function(eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;
                var rect = document.getElementById('mapCanvas').getBoundingClientRect();

                x = eventInfo.clientX - rect.left;
                y = eventInfo.clientY - rect.top;

                x *= document.getElementById('mapCanvas').width / $("#mapCanvas").width();
                y *= document.getElementById('mapCanvas').height / $("#mapCanvas").height();

                var sideLength = 72;
                var hexagonAngle = 0.523598776; // 30 degrees in radians
                var hexHeight = Math.sin(hexagonAngle) * sideLength;
                var hexRadius = Math.cos(hexagonAngle) * sideLength;
                var hexRectangleHeight = sideLength + 2 * hexHeight;
                var hexRectangleWidth = 2 * hexRadius;

            hexY = Math.floor(y / (hexHeight + sideLength));
            hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

            screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
            screenY = hexY * (hexHeight + sideLength);

            document.getElementById('mapCanvas').getContext("2d").clearRect(0, 0, document.getElementById('mapCanvas').width, document.getElementById('mapCanvas').height);

            board.render();

            var index = 0;
            for (i = 0; i <= 18; i++) {
              var dist = Math.sqrt(Math.pow(screenX - board.tiles[i].x, 2) + Math.pow(screenY - board.tiles[i].y, 2));
              if (dist < hexRadius) {
                index = i;
                console.log(index);
                break;
              }
            }

            if(hexX >= 0 && hexX < 10) {
                if(hexY >= 0 && hexY < 10) {
                    board.drawHexagon(screenX, screenY, "#000000");
                }
            }
        });

        // Setup array for all tiles
        this.tiles = [];

        // Make a list with the right number of each tile
        var locations = ["Hills", "Hills", "Hills",
            "Forest", "Forest", "Forest", "Forest",
            "Mountains", "Mountains", "Mountains",
            "Fields", "Fields", "Fields", "Fields",
            "Pasture", "Pasture", "Pasture", "Pasture",
            "Dessert"];

        // Make a list with the right number of each tile value
        var values = [5, 2, 6, 3, 8, 10, 9, 12, 11, 4, 8, 10, 9, 4, 5, 6, 3, 11];

        // Randomly shuffle the location array and the values array
        locations = shuffle(locations);

        // Get the position of the robber
        this.robberPosition = locations.indexOf("Dessert");

        // Store tiles with correct positions and values
        var x = 3.52 * tileWidth,
            y = 1.00 * tileHeight,
            valIndex = 0,
            i;

        for (i = 0; i < 3; i++) {
            if (i != this.robberPosition)
                this.tiles.push(new Location(i, locations[i], values[valIndex++], x, y));
            else
                this.tiles.push(new Location(i, locations[i], 0, x, y));
            x += tileWidth;
        }
        x -= 3.5 * tileWidth;
        y += tileHeight;
        for (i = 3; i < 7; i++) {
            if (i != this.robberPosition)
                this.tiles.push(new Location(i, locations[i], values[valIndex++], x, y));
            else
                this.tiles.push(new Location(i, locations[i], 0, x, y));
            x += tileWidth;
        }
        x -= 4.5 * tileWidth;
        y += tileHeight;
        for (i = 7; i < 12; i++) {
            if (i != this.robberPosition)
                this.tiles.push(new Location(i, locations[i], values[valIndex++], x, y));
            else
                this.tiles.push(new Location(i, locations[i], 0, x, y));
            x += tileWidth;
        }
        x -= 4.5 * tileWidth;
        y += tileHeight;
        for (i = 12; i < 16; i++) {
            if (i != this.robberPosition)
                this.tiles.push(new Location(i, locations[i], values[valIndex++], x, y));
            else
                this.tiles.push(new Location(i, locations[i], 0, x, y));
            x += tileWidth;
        }
        x -= 3.5 * tileWidth;
        y += tileHeight;
        for (i = 16; i < 19; i++) {
            if (i != this.robberPosition)
                this.tiles.push(new Location(i, locations[i], values[valIndex++], x, y));
            else
                this.tiles.push(new Location(i, locations[i], 0, x, y));
            x += tileWidth;
        }

        // Setup variables for storing used build sites
        this.usedBuildSites = [];
        this.usedRoadSites = [];
    }

    // Function to draw a single tile and returns the array of vertex coordinates
    drawTile(location) {
        // Draw the hexagon and save it's array of vertices
        var vertexArray = this.drawHexagon(location.x, location.y, location.color);

        // Draw the number
        if (location.value !== 0) {
            if (location.value == 6 || location.value == 8)
                this.ctx.fillStyle = "red";
            else
                this.ctx.fillStyle = "black";
            this.ctx.strokeStyle = "black";
            this.ctx.font = "50px Arial";

            if (location.value < 10) {
                this.ctx.fillText(location.value, location.x + 47, location.y + 90);
                this.ctx.strokeText(location.value, location.x + 47, location.y + 90);
            } else {
                this.ctx.fillText(location.value, location.x + 33, location.y + 90);
                this.ctx.strokeText(location.value, location.x + 33, location.y + 90);
            }
        }

        return vertexArray; //return the array of vertex coordinates
    }

    // Function to draw a hexagon and returns an array with an array of vertex coordinates
    drawHexagon(x, y, fillColor) {
        var sideLength = 72;
        var hexagonAngle = 0.523598776; // 30 degrees in radians
        var hexHeight = Math.sin(hexagonAngle) * sideLength;
        var hexRadius = Math.cos(hexagonAngle) * sideLength;
        var hexRectangleHeight = sideLength + 2 * hexHeight;
        var hexRectangleWidth = 2 * hexRadius;
        var listOfVertexCoordinates = []; //array that will hold the vertices of the hexagon

        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();
        var v0 = [x + hexRadius, y]; //creates an array with the coordinates as entries
        this.ctx.moveTo(v0[0], v0[1]); //move to vertex 0
        listOfVertexCoordinates.push(v0); //pushes the coordinates array to the vertex array
        var v1 = [x + hexRectangleWidth, y + hexHeight];
        this.ctx.lineTo(v1[0], v1[1]); // move to vertex 1
        listOfVertexCoordinates.push(v1);
        var v2 = [x + hexRectangleWidth, y + hexHeight + sideLength];
        this.ctx.lineTo(v2[0], v2[1]); //move to vertex 2
        listOfVertexCoordinates.push(v2);
        var v3 = [x + hexRadius, y + hexRectangleHeight];
        this.ctx.lineTo(v3[0], v3[1]); //move to vertex 3
        listOfVertexCoordinates.push(v3);
        var v4 = [x, y + sideLength + hexHeight];
        this.ctx.lineTo(v4[0], v4[1]); //move to vertex 4
        listOfVertexCoordinates.push(v4);
        var v5 = [x, y + hexHeight];
        this.ctx.lineTo(v5[0], v5[1]); //move to vertex 5
        listOfVertexCoordinates.push(v5);
        this.ctx.closePath(); //close off the hexagon by going back to vertex 0

        this.ctx.fill();
        this.ctx.fillStyle = "black";
        this.ctx.stroke();

        return listOfVertexCoordinates; //returns the list of of vertices for the hexagon
        //(two-dimensional array that holds arrays of x and y pairs for each vertex)
    }

    // Function to draw a circle
    drawCircle(context, centerX, centerY, radius) {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = "lightgrey";
        context.fill();
        context.strokeStyle = "black";
        context.stroke();
    }

    // Function to draw robber
    drawRobber() {
        var robberX = 4.025 * tileWidth,
            robberY = 1.66 * tileHeight;

        if (0 <= this.robberPosition && this.robberPosition < 3) {
            robberX += tileWidth * this.robberPosition;
        } else if (3 <= this.robberPosition && this.robberPosition < 7) {
            robberX += tileWidth * (this.robberPosition - 3) - 0.5 * tileWidth;
            robberY += tileHeight;
        } else if (7 <= this.robberPosition && this.robberPosition < 12) {
            robberX += tileWidth * (this.robberPosition - 7) - 1 * tileWidth;
            robberY += 2 * tileHeight;
        } else if (12 <= this.robberPosition && this.robberPosition < 16) {
            robberX += tileWidth * (this.robberPosition - 12) - 0.5 * tileWidth;
            robberY += 3 * tileHeight;
        } else {
            robberX += tileWidth * (this.robberPosition - 16);
              robberY += 4 * tileHeight;
        }

        this.drawCircle(this.ctx, robberX, robberY, 30);
    }

    // Function to draw a settlement
    drawSettlement(index, color) {
        // Set color
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = "black";

        // Get the coordinates of where to draw the settlement
        var x = 2 * tileWidth, y = 0.416666667 * tileHeight;

        if (0 <= index && index < 3) {
            x += tileWidth * index;
        } else if (3 <= index && index < 7) {
            x += tileWidth * (index - 3) - 0.5 * tileWidth;
            y += (1 / 4) * tileBigHeight;
        } else if (7 <= index && index < 11) {
            x += tileWidth * (index - 7) - 0.5 * tileWidth;
            y += (3 / 4) * tileBigHeight;
        } else if (11 <= index && index < 16) {
            x += tileWidth * (index - 11) - 1 * tileWidth;
            y += (4 / 4) * tileBigHeight;
        } else if (16 <= index && index < 21) {
            x += tileWidth * (index - 16) - 1 * tileWidth;
            y += (6 / 4) * tileBigHeight;
        } else if (21 <= index && index < 27) {
            x += tileWidth * (index - 21) - 1.5 * tileWidth;
            y += (7 / 4) * tileBigHeight;
        } else if (27 <= index && index < 33) {
            x += tileWidth * (index - 27) - 1.5 * tileWidth;
            y += (9 / 4) * tileBigHeight;
        } else if (33 <= index && index < 38) {
            x += tileWidth * (index - 33) - 1 * tileWidth;
            y += (10 / 4) * tileBigHeight;
        } else if (38 <= index && index < 43) {
            x += tileWidth * (index - 38) - 1 * tileWidth;
            y += (12 / 4) * tileBigHeight;
        } else if (43 <= index && index < 47) {
            x += tileWidth * (index - 43) - 0.5 * tileWidth;
            y += (13 / 4) * tileBigHeight;
        } else if (47 <= index && index < 51) {
            x += tileWidth * (index - 47) - 0.5 * tileWidth;
            y += (15 / 4) * tileBigHeight;
        } else if (51 <= index && index < 54) {
            x += tileWidth * (index - 51);
            y += (16 / 4) * tileBigHeight;
        } else {
            x = NaN;
            y = NaN;
        }

        // Draw the square
        this.ctx.fillRect(x, y, 25, 25);
        this.ctx.strokeRect(x, y, 25, 25);
    }

    /*****************************************************************
     *      Draw Road function method that Isaac is working on
     *****************************************************************/
    //Function to draw roads
    drawRoad(edge, color) {

    }

    // Function to draw a city
    drawCity(index, color) {
        // Set color
        this.ctx.fillStyle = color;
    }

    // Render function
    render() {
        // Fill the background
        this.ctx.fillStyle = "LightSkyBlue";
        this.ctx.fillRect(0, 0, 1280, 720);

        // Draw each tile and add it's array of vertices to the big array
        for (var i = 0; i < this.tiles.length; i++) {
            ArrayOfTileVerticesCoordinates.push(this.drawTile(this.tiles[i]));
        }

        // Draw the robber
        this.drawRobber();

        /*// Draw all of the players settlements and cities
        for (i = 0; i < players.length; i++) {
            for (var j = 0; j < players[i].settlements.length; j++) {
                this.drawSettlement(players[i].settlements[j], players[i].color);
            }
            for (j = 0; j < players[i].cities.length; j++) {
                this.drawCity(players[i].cities[j], this.players[i].color);
            }
        }*/

        // TODO: Draw all of the players roads
    }
}

// Function to randomly shuffle an array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var board;

$(document).ready(function() {
  board = new Board();
  board.render();
});
