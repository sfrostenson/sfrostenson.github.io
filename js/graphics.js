// NODE GROUPS:  0: Frontend | 1: Backend | 2: DevStack
var data = [
  {"id": 0, "name": "HTML/CSS", "r": 50 },
  {"id": 0, "name": "JS/jQuery", "r": 50 },
  {"id": 0, "name": "D3", "r": 40 },
  {"id": 0, "name": "Responsiveness", "r": 40 },
  {"id": 0, "name": "Backbone", "r": 35 },
  {"id": 0, "name": "Lodash", "r": 50 },
  {"id": 0, "name": "Mapbox/Leaflet", "r": 50 },
  {"id": 0, "name": "Sketch", "r": 30 },
  {"id": 0, "name": "Photoshop", "r": 30 },

  {"id": 1, "name": "gulp", "r": 50 },
  {"id": 1, "name": "browserify", "r": 50 },
  {"id": 1, "name": "sass", "r": 50 },
  {"id": 1, "name": "git", "r": 50 },
  {"id": 1, "name": "npm", "r": 50 },

  {"id": 2, "name": "node", "r": 40 },
  {"id": 2, "name": "django", "r": 32 },
  {"id": 2, "name": "python", "r": 50 },
  {"id": 2, "name": "PostgreSQL", "r": 50 },
  {"id": 2, "name": "PostGIS/GDAL", "r": 50 },
  {"id": 2, "name": "Makefiles", "r": 50 },
];

// TO DO: make responsive
var fill = d3.scale.ordinal()
    .range(['#bd22bc', '#bcbd22', '#22bcbd']);

var nodes = [];
var labels = [];

var containerWidth = $('#force-bubbles').width();

// positioning of the 3 node groupings
var foci = [{x: containerWidth/7 * 2, y: 150}, {x: containerWidth/7 * 6, y: 150}, {x: containerWidth/7 * 4, y: 150}];

var svg = d3.select("#force-bubbles").append("svg");

// dynamic charge for force layout based on screen size
var charge = ($('#force-bubbles').width() < 550) ? -180 : -450;
var force = d3.layout.force()
    .nodes(nodes)
    .charge(charge)
    .chargeDistance(500)
    .gravity(0.1)
    .friction(0.8)
    .on("tick", tick);

var node = svg.selectAll("g");

function tick(e) {
  var k = 0.08 * e.alpha;
  // Push nodes toward their designated focus.
  nodes.forEach(function(o, i) {
    o.y += (foci[o.id].y - o.y) * k;
    o.x += (foci[o.id].x - o.x) * k;
  });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

}

var counter = 0;

var timer = setInterval(function(){

  if (nodes.length > data.length-1) { clearInterval(timer); return;}

  var item = data[counter];
  nodes.push({id: item.id, r: item.r, name: item.name, d: item.d});
  force.start();

  node = node.data(nodes);

  var n = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('cursor', 'pointer')
      .on('mousedown', function(d) {
         var sel = d3.select(this);
         sel.moveToFront();
      })
      .call(force.drag);

  // dynamic radius sizing for bubbles based on screen size
  var radius = ($('#force-bubbles').width() < 550) ? 0.7 : 1;

  n.append("circle")
      .attr("r",  function(d) { return (d.r) * radius; })
      .style("fill", function(d) { return fill(d.id); });

  // dynamic text sizing based on screen size
  var textSize = ($('#force-bubbles').width() < 550) ? 10 : 13;

  n.append("text")
      .text(function(d){
          return d.name;
      })
      .style("font-size", function(d) {
          return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * textSize) + "px";
       })
      .attr("dy", ".35em");

  counter++;

}, 100);


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function resize() {
    var width = $('#force-bubbles').width();
    var height = $('#force-bubbles').height();
    var charge = ($('#force-bubbles').width() < 550) ? -180 : -450;
    svg.attr("width", width)
        .attr("height", height);

    force.charge(charge);
    force.size([width, height]).resume();

  }

resize();
  d3.select(window).on('resize', resize);