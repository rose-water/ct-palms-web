let width = 1200;
let height = 900;

let projection = d3.geo.mercator()
  .center([0 , 0])
  .scale(100)
  .rotate([-180, 0]);

let svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

let path = d3.geo.path().projection(projection);
let g = svg.append("g");

// load and display the World
d3.json("js/world-110m2.json", (err, topology) => {
  
  // load and display the cities
  // d3.csv("cities.csv", (error, data) => {
  //   g.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("a")
  //   .attr("xlink:href", (d) => {
  //     return "https://www.google.com/search?q="+d.city;
  //   })
  //   .append("circle")
  //   .attr("cx", (d) => {
  //     return projection([d.lon, d.lat])[0];
  //   })
  //   .attr("cy", (d) => {
  //     return projection([d.lon, d.lat])[1];
  //   })
  //   .attr("r", 5)
  //   .style("fill", "red");
  // });
    
  g.selectAll("path")
    .data(topojson.object(topology, topology.objects.countries).geometries)
    .enter()
    .append("path")
    .attr("d", path);

});
  
// zoom and pan
var zoom = d3.behavior.zoom()
  .on("zoom", () => {
    g.attr("transform","translate(" + d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    g.selectAll("circle").attr("d", path.projection(projection));
    g.selectAll("path").attr("d", path.projection(projection)); 
  });

svg.call(zoom)