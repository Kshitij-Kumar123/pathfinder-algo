var cols = 30;
var rows = 30;
var grid = new Array(cols);
var openList = [];
var closedList = [];
// console.log(random(1));
var gridWidth;

function heuristic(neighbor, end) {
  // uses good old pythagoream theorem to find 
  // the direct distance between chosen neighbor node and 
  // the end node
  // return dist(neighbor.i, neighbor.j, end.i, end.j);
  
  return (abs(neighbor.i - end.i) + abs(neighbor.j - end.j));
}

function GridObject(i, j) {
  this.i = i;
  this.j = j;
  this.g = 0;
  this.f = 0;
  this.previous = undefined;
  this.h = 0;
  this.cameFrom = undefined;
  this.wall = false;
  this.neighbors = [];
  
  if (Math.random(1) < 0.2) {
    this.wall = true;
  }
  

  this.addNeighbors = function(grid) {
    i = this.i;
    j = this.j;

    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }

  }

  this.display = function(color) {
    w = gridWidth;
    fill(color);
    if (this.wall) {
      fill(0);
    }
    
    rect(this.i * w, this.j * w, w, w);
  }
}

for (let i = 0; i < grid.length; i++) {
  grid[i] = new Array(rows);
}

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i][j] = new GridObject(i, j);
  }
}

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    grid[i][j].addNeighbors(grid);
    // console.log(grid[i][j]);
  }
}

var startNode = grid[0][0];
var endNode = grid[cols - 1][rows - 1];

openList.push(startNode);

function setup() {
  createCanvas(400, 400);
}

var currentPos;
var path;

function draw() {

  background(0);

  if (openList.length > 0) {
    var lowest = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f > openList[lowest]) {
        lowest = i;
      }
    }

    currentPos = openList[lowest];

    if (currentPos == endNode) {
      console.log("Objective met");
    }

    var tempOpenList = openList.filter(el => {
      return el !== currentPos;
    });

    openList = tempOpenList;

    closedList.push(currentPos);

    var neighbors = currentPos.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      if (!closedList.includes(neighbors[i]) && !neighbors[i].wall) {
        let tempGscore = currentPos.g + 1;

        if (openList.includes(neighbors[i])) {
          if (tempGscore < neighbors[i].g) {
            neighbors[i].g = tempGscore;
          }
        } else {
          neighbors[i].g = tempGscore;
          openList.push(neighbors[i]);
        }

        neighbors[i].h = heuristic(neighbors[i], endNode);
        neighbors[i].f = neighbors[i].g + neighbors[i].h;
      }
    }

  } else {
    console.log('no solution');
    noLoop();
  }


  gridWidth = width / cols;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].display(color(255, 255, 255));
    }
  }

  for (let j = 0; j < openList.length; j++) {
    openList[j].display(color(0, 255, 0));
  }

  for (let j = 0; j < closedList.length; j++) {
    closedList[j].display(color(255, 0, 0));
  }

  path = [];
  var temp = currentPos;
  path.push(temp);

  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let j = 0; j < path.length; j++) {
    path[j].display(color(0, 0, 255));
  }

}