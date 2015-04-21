var bidChart = d3.select("#bidChart")
    .attr("height", 170)
    .attr("width", 75)
    .append("g")
    .attr("transform", "translate(0,0)");

var askChart = d3.select("#askChart")
    .attr("height", 170)
    .attr("width", 75)
    .append("g")
    .attr("transform", "translate(0,0)");

function updateHeight(bid, bidY, bidPrice, ask, askY, askPrice){
    console.log(bid);
    console.log(ask);
    
    bidChart.append("rect")
        .attr("y", 170)
        .attr("x", 0)
        .attr("height", bid)
        .attr("width", 75)
        .transition()
        .duration(1000)
        .attr("y", bidY);

    bidChart.append("text")
        .text(bidPrice)
        .attr("y", bidY - 3)
        .style("font-size", "14px")
        .attr("x", 18);

    bidChart.append("text")
        .text("bid")
        .attr("fill", "#ECF0F1")
        .attr("y", 165)
        .attr("x", 18);
      
    askChart.append("rect")
    .attr("y", 170)
    .attr("x", 0)
    .attr("height", ask)
    .attr("width", 75)
    .transition()
    .duration(1000)
    .attr("y", askY);

    askChart.append("text")
        .text("" + askPrice)
        .style("font-size", "14px")
        .attr("y", askY - 3)
        .attr("x", 18);

    askChart.append("text")
        .text("ask")
        .attr("fill", "#ECF0F1")
        .attr("y", 165)
        .attr("x", 18);
}