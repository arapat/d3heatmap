/**
*   calendarWeekHour    Setup a week-hour grid:
*                           7 Rows (days), 24 Columns (hours)
*   @param id           div id tag starting with #
*   @param width        width of the grid in pixels
*   @param height       height of the grid in pixels
*/

function colorFactory (range)
{
  return d3.scale.linear()
    .domain(range)
    .range(['white', 'red']);
}

function generateHeatMap(id, label, data, width)
{
    var calcData = processData(data, width);
    var color = colorFactory([0.0, 1.0]);
    var tooltip = d3.select('body').select('div.tooltip');
    var pixelMouseover = function(d){
      tooltip.style("opacity", 0.8)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY + 8) + "px")
        .html((d.i+1) + ": " + label[d.i] + "<br>" + (d.j+1) + ": " + label[d.j] + "<br>" + "Value: " + d.value.toFixed(3));
    };

    var grid = d3.select(id).append("svg")
                    .attr("width", width)
                    .attr("height", width)
                    .attr("class", "chart");

    var row = grid.selectAll(".row")
                  .data(calcData)
                  .enter().append("svg:g")
                  .attr("class", "row");

    var col = row.selectAll(".cell")
                 .data(function (d) { return d; })
                 .enter().append("svg:rect")
                 .attr("class", "cell")
                 .attr("x", function(d) { return d.x; })
                 .attr("y", function(d) { return d.y; })
                 .attr("width", function(d) { return d.width; })
                 .attr("height", function(d) { return d.height; })
                 .on('mouseover', function(d) {pixelMouseover(d);})
                 .on('mouseout', function() {
                    d3.select(this)
                        .style('fill', function(d){return color(d.value);});
                    tooltip.style("opacity", 1e-6);
                 })
                 .on('click', function() {
                    console.log(d3.select(this));
                 })
                 .style('fill',function(d){return color(d.value);})
                 .style("stroke", '#555');
}

////////////////////////////////////////////////////////////////////////

/**
*   randomData()        returns an array: [
                                            [{id:value, ...}],
                                            [{id:value, ...}],
                                            [...],...,
                                            ];
                        ~ [
                            [hour1, hour2, hour3, ...],
                            [hour1, hour2, hour3, ...]
                          ]

*/
function processData(matrix, gridWidth)
{
    var dataCount = matrix.length;
    var data = new Array();
    var gridItemWidth = gridWidth / dataCount;
    var gridItemHeight = gridItemWidth;
    var startX = 0;
    var startY = 0;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var count = 0;

    for (var index_a = 0; index_a < dataCount; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < dataCount; index_b++)
        {
            data[index_a].push({
                                i: index_a,
                                j: index_b,
                                value: matrix[index_a][index_b],
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                count: count
                            });
            xpos += stepX;
            count += 1;
        }
        xpos = startX;
        ypos += stepY;
    }
    return data;
}
