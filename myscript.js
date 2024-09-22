// set the dimensions and margins of the graph
const margin = {top: 80, right: 25, bottom: 25, left: 100},
  width = 1825 - margin.left - margin.right,
  height = 710 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("body")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom+100)
.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(function(data) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const years = [];
  for(let i=0; i<data.monthlyVariance.length ;i++)
    {
      if(years.includes(data.monthlyVariance[i].year) == false)
      {
        years.push(data.monthlyVariance[i].year);
      }
    }
  const months = [];
    for(let i=0; i<data.monthlyVariance.length ;i++)
    {
      months.push(data.monthlyVariance[i].month);
    }
  const variance = [];
    for(let i=0; i<data.monthlyVariance.length ;i++)
    {
      variance.push(data.monthlyVariance[i].variance);
    }
  
 
  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain([1750,1760,1770,1780,1790,1800,1810,1820,1830,1840,1850,1860,1870,1880,1890,1900,1910,1920,1930,1940,1950,1960,1970,1980,1990,2000,2010,2020])
    .paddingInner(0);
  
  svg.append("g")
    .attr("id","x-axis")
    .style("font-size", 15)
    .attr("transform", `translate(-22, ${height})`)
    .call(d3.axisBottom(x).tickSize(10))
    .select(".domain").remove();
  
  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(['December','November','October','September','August','July','June','May','April','March','February','January'])
    .padding(0);
    
  svg.append("g")
    .attr("id","y-axis")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(10))
    .select(".domain").remove();

  // create a tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .style("position","absolute")
    .style("z-index", "10")
    .attr("class", "tooltip")
    .style("background", "rgba(0, 0, 0, 0.75)")
    .style("color","white")
    .style("text-align","center")
    .style("font-family","sans-serif")
    .style("border-radius", "5px")
    .style("padding", "5px");
  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event,d) {
    tooltip
      .style("opacity", 1)
        d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  
  // on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
  const mousemove = function(event,d) {
    let basetemp = 8.66;
    basetemp += d.variance;
    tooltip
      .html("Year: " + d.year + "<br>Temperature: "+ basetemp.toFixed(2) + "°C<br>Variance: " + d.variance + "°C" )
      .style("top", ((event.pageY)-100)+"px")
      .style("left",((event.pageX)-50)+"px");
  }
  const mouseleave = function(event,d) {
    tooltip
      .style("opacity", 0)
      .style("stroke", "none")
     // .style("opacity", 0.8)
  }

  var colorScale = d3.scaleLinear()
      .range([
              "rgb(69,117,180)",
              "rgb(116,173,209)",
              "rgb(171,217,233)",
              "rgb(224,243,248)",
              "rgb(254,224,191)",
              "rgb(254,224,144)",
              "rgb(253,174,97)",
              "rgb(244,109,67)",
              "rgb(215,48,39)"
             ])
      .domain([2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8]);
  
  // add the squares
  svg.selectAll()
    .data(data.monthlyVariance)
    .join("rect")
      .attr("class","cell")
      .attr("padding","0px")
      .attr("x", (d,i) =>(i/1.945) +15)
      .attr("y", (d)=>(d.month*51 -65))
      .attr("width", 7)
      .attr("height", 51 )
      .style("fill", function(d,i) 
{
          let basetemp = 8.66;
          basetemp += d.variance;
          return colorScale(basetemp);
  })
      .style("stroke-width", 0)
      .style("stroke", "none")
      .style("opacity", 1)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})
 
// Add title to graph
svg.append("text")
        .attr("x", 550)
        .attr("y", -50)
        .attr("position","relative")
        .attr("text-anchor", "center")
        .style("font-size", "30px")
        .text("Monthly Global Land-Surface Temperature")
        .attr("id","title")

// Add subtitle to graph
svg.append("text")
        .attr("x", 625)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .attr("id","description")
        .style("font-size", "22px")
        .style("fill", "black")
        .style("max-width", 400)
        .text("1753 - 2015: base temperature 8.66℃");

svg.append("text")
  .attr("x",-375)
  .attr("y",-70)
  .attr("transform","rotate(-90)")
  .text("Month")
  .style("font-size","25px");
 
 svg.append("text")
    .attr("x",750)
    .attr("y",660)
    .text("Year")
    .attr("font-size","25px");
  
  const key = d3.scaleBand()
  .domain([2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8])
  .range([10, 600])
  .paddingOuter(.5);
  
  const gx = svg.append("g")
  .attr("id","key")
  .attr("transform", `translate(0,${height+100})`)
  .call(d3.axisBottom(key));
   
  svg.append("rect")
    .attr("x",63)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(69,117,180)");
  
 
  svg.append("rect")
    .attr("x",117)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(116, 173, 209)");
    
  svg.append("rect")
    .attr("x",171)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(171, 217, 233)");
  
  svg.append("rect")
    .attr("x",224)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(224, 243, 248)");
  
  svg.append("rect")
    .attr("x",278)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(254, 224, 191)");
  
  svg.append("rect")
    .attr("x",332)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(254, 224, 144)");
  
  svg.append("rect")
    .attr("x",385)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(253, 174, 97)");
  
  svg.append("rect")
    .attr("x",439)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(244,109,67)");
  
  svg.append("rect")
    .attr("x",492)
    .attr("y",665)
    .attr("width",54)
    .attr("height",40)
    .attr('stroke', 'black')
    .attr("fill","rgb(215,48,39)");
    
