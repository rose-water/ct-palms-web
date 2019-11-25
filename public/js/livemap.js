/*
* I did not write this code. I only changed some of the styling/colors.
* Original map code by Atanu Mallick:
* https://bl.ocks.org/atanumallick/8d18989cd538c72ae1ead1c3b18d7b54
*/

// -------------------------------------------------------------
const width = 960;
const height = 500;

const config = {
  speed: 0.005,
  verticalTilt: -10,
  horizontalTilt: 0
}

let locations      = [];
const svg          = d3.select('svg').attr('width', width).attr('height', height);
const markerGroup  = svg.append('g');
const projection   = d3.geoOrthographic();
const initialScale = projection.scale();
const path         = d3.geoPath().projection(projection);
const center       = [ width/2, height/2 ];

drawGlobe();    
drawGraticule();
enableRotation();

// -------------------------------------------------------------
function drawGlobe() { 
  d3.queue()
    .defer(d3.json, 'js/world-110m.json')          
    .defer(d3.json, '/getMarkerData')
    .await((error, worldData, locationData) => {
      svg.selectAll(".segment")
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter().append("path")
        .attr("class", "segment")
        .attr("d", path)
        .style("stroke", "#151515")
        .style("stroke-width", "0.5px")
        .style("fill", (d, i) => '#7FFFD4')
        .style("opacity", "1");
        locations = locationData;
        drawMarkers();                   
      });
}


// -------------------------------------------------------------
function drawGraticule() {
  const graticule = d3.geoGraticule().step([5, 5]);

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path)
    .style("stroke-width", "0.5px")
    .style("fill", "#151515")
    .style("stroke", "#3b3a3a");
}


// -------------------------------------------------------------
function enableRotation() {
  d3.timer(function (elapsed) {
    projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
    svg.selectAll("path").attr("d", path);
    drawMarkers();
  });
}


// -------------------------------------------------------------
function drawMarkers() {
  const markers = markerGroup.selectAll('circle').data(locations);

  markers.enter()
    .append('circle')
    .merge(markers)
    .attr('cx', d => projection([d.lon, d.lat])[0])
    .attr('cy', d => projection([d.lon, d.lat])[1])
    .attr('fill', d => {
      const coordinate = [d.lon, d.lat];
      gdistance = d3.geoDistance(coordinate, projection.invert(center));
      return gdistance > 1.57 ? 'none' : 'steelblue';
    })
    .attr('r', 20);

  markerGroup.each(function () {
    this.parentNode.appendChild(this);
  });
}