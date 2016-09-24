console.log('js works');

var dataArray = [
  {weight: 10, date: '2015/01/01'},
  {weight: 13, date: '2015/01/09'},
  {weight: 21, date: '2015/01/19'},
  {weight: 25, date: '2015/01/30'},
  {weight: 29, date: '2015/02/10'},
  {weight: 32, date: '2015/02/23'},
  {weight: 38, date: '2015/02/28'},
  {weight: 43, date: '2015/03/17'},
  {weight: 49, date: '2015/03/19'},
  {weight: 51, date: '2015/04/01'},
  {weight: 52, date: '2015/04/21'},
  {weight: 57, date: '2015/05/03'},
  {weight: 61, date: '2015/05/22'},
  {weight: 65, date: '2015/06/10'},
  {weight: 70, date: '2015/06/27'}
];

var parsedDate = d3.timeParse('%Y/%m/%d');
// console.log('2014/01/31');
// console.log(parsedDate('2014/01/31'));

var height = 500;
var width = 1200;
var margin = 20;

// x scale that starts at the earliest date and ends at the latest date
var x = d3.scaleTime()
        .domain(d3.extent(dataArray, function (d) {
          var date = parsedDate(d.date);
          return date;
        }))
        .range([0, (width - (4 * margin))]);
// y scale that starts at zero, and ends at the greatest value
  // the range of [height, 0] makes it scale bottom to top
var y = d3.scaleLinear()
        .domain([0, d3.max(dataArray, function (d) {
          return d.weight;
        })])
        .range([(height - (2.5 * margin)), margin]);

// Creates axes on using the x and y scales above
  // Also creates grid lines that span the width and height of the graph
var xAxis = d3.axisBottom()
            .scale(x)
            .tickSizeInner(-(height - (3.5 * margin)))
            .tickSizeOuter(0);
var yAxis = d3.axisLeft()
            .scale(y)
            .tickSizeInner(-(width - (4 * margin)));

// Creates div for tooltip
var div = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('opacity', 0);

var canvas = d3.select('body')
              .append('svg')
              .attr('height', height)
              .attr('width', width)
              .style('background', '#bed')
              .style('display', 'block')
              .style('margin', '0 auto')
              .append('g')
                .attr('transform', 'translate (60, 0)');

// Generates the fill area beneath the data line
  // Uses same x function as var line, with y1 val set to var line's y val, with y0 making the other edge along the bottom axis
var area = d3.area()
             .x(function (d) {
              var date = parsedDate(d.date);
              return x(date);
             })
             .y0((height - (2.5 * margin)))
             .y1(function (d) {return y(d.weight);})
             .curve(d3.curveMonotoneX);

// Generates the lines
  // Each parsed date item is filtered through the x scale
  // Each weight item is filtered through the y scale
  // A curve is set to each line to make it smoother
var line = d3.line()
            .x(function (d) {
              var date = parsedDate(d.date);
              return x(date);
            })
            .y(function (d) {return y(d.weight);})
            .curve(d3.curveMonotoneX);

// Creates the fill area beneath the line
  // This is set before both the line and points so it's underneath everything else
canvas.append('path')
      .data([dataArray])
      .attr('class', 'area')
      .attr('d', area);

// Creates lines, and uses '.path' as selector to differentiate 'path' from the area creator above
canvas.selectAll('.path')
        .data([dataArray])
        .enter()
        .append('path')
          .attr('class', '.path')
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', 'blue')
          .attr('stroke-width', 3);

// Appends x axis and moves it to bottom
canvas.append('g')
        .attr('transform', 'translate (0, ' + (height - (2.5 * margin)) + ')')
        .call(xAxis);

// Appends y axis
canvas.append('g')
        .call(yAxis);

// Creates points representing data
canvas.selectAll('circle')
        .data(dataArray)
        .enter()
        .append('circle')
          .attr('r', 3)
          .attr('cx', function (d) {
            var date = parsedDate(d.date);
            return x(date);
          })
          .attr('cy', function (d) {return y(d.weight);})
          // Displays tooltip
          .on('mouseover', function (d) {
            div.transition()
              .duration(500)
              .style('opacity', 0);
            div.transition()
              .duration(200)
              .style('opacity', 0.9);
            div.html(
              '<a href="http://www.google.com" target="_blank">Click Here</a><br />' + 
              d.weight)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
          });

// Sets label on y axis
canvas.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-35,' + (height / 2) + ')rotate(-90)')
      .text('Weight');

// Sets label on x axis
canvas.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(' + ((width - (4 * margin)) / 2) + ',' + (height - 10) + ')')
      .text('Date');









