// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/calendar-view
  
function Calendar(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    width = 1200, // width of the chart, in pixels
    cellSize = 17, // width and height of an individual day, in pixels
    weekday = "monday", // either: weekday, sunday, or monday
    formatDay = i => "SMTWTFS"[i], // given a day number in [0, 6], the day-of-week label
    formatMonth = "%b", // format specifier string for months (above the chart)
    yFormat, // format specifier string for values (in the title)
    colors = d3.interpolatePiYG
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
  
    const countDay = weekday === "sunday" ? i => i : i => (i + 6) % 7;
    const timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday;
    const weekDays = weekday === "weekday" ? 5 : 7;
    const height = cellSize * (weekDays + 2);
  
    // Compute a color scale. This assumes a diverging color scheme where the pivot
    // is zero, and we want symmetric difference around zero.
    const max = d3.quantile(Y, 0.9975, Math.abs);
    const color = d3.scaleSequential([-max, +max], colors).unknown("none");
  
    // Construct formats.
    formatMonth = d3.utcFormat(formatMonth);
  
    // Compute titles.
    if (title === undefined) {
      const formatDate = d3.utcFormat("%B %-d, %Y");
      const formatValue = color.tickFormat(100, yFormat);
      title = i => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
    } else if (title !== null) {
      const T = d3.map(data, title);
      title = i => T[i];
    }
  
    // Group the index by year, in reverse input order. (Assuming that the input is
    // chronological, this will show years in reverse chronological order.)
    const years = d3.groups(I, i => X[i].getUTCFullYear()).reverse();
  
    function pathMonth(t) {
      const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
      const w = timeWeek.count(d3.utcYear(t), t);
      return `${d === 0 ? `M${w * cellSize},0`
          : d === weekDays ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${weekDays * cellSize}`;
    }

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height * years.length  + 50)
    .attr("viewBox", [0, 0, width, height * years.length  + 50 ])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("border-radius", "5px");
  
  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);
  
  const cell = year.append("g")
    .selectAll("rect")
    .data(weekday === "weekday"
        ? ([, I]) => I.filter(i => ![0, 6].includes(X[i].getUTCDay()))
        : ([, I]) => I)
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", i => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
      .attr("y", i => countDay(X[i].getUTCDay()) * cellSize + 0.5)
      .attr("fill", i => color(Y[i]))
      .on("mouseover", function (event, i) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
        tooltip.html(title(i))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  
    year.append("text")
        .attr("x", -5)
        .attr("y", -5)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(([key]) => key);
  
    year.append("g")
        .attr("text-anchor", "end")
      .selectAll("text")
      .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
      .join("text")
        .attr("x", -5)
        .attr("y", i => (countDay(i) + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .text(formatDay);
    
    if (title) cell.append("title")
        .text(title);
  
    const month = year.append("g")
      .selectAll("g")
      .data(([, I]) => d3.utcMonths(d3.utcMonth(X[I[0]]), X[I[I.length - 1]]))
      .join("g");
  
    month.filter((d, i) => i).append("path")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 3)
        .attr("d", pathMonth);
  
    month.append("text")
        .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
        .attr("y", -5)
        .text(formatMonth);
    
    // Compute the new height including the legend
    const legendHeight = 50;
    const newHeight = height * years.length + legendHeight;
  
    // Update the SVG height and viewBox
    svg.attr("height", newHeight)
       .attr("viewBox", [0, 0, width, newHeight]);
    
    const uniqueValues = new Set(Y);
    const sortedValues = Array.from(uniqueValues).sort((a, b) => a - b);
    const categoriesCount = 10;
    const maxValue = d3.max(Y); // Get the max value from the data
    const minValue = d3.min(Y); // Get the min value from the data
    const range = maxValue - minValue;
    
    const categories = [...Array(categoriesCount)].map((_, i) => {
      const upperBound = minValue + range / categoriesCount * (i + 1);
      const lowerBound = minValue + range / categoriesCount * i;
    
      return {
        upperBound,
        lowerBound,
        color: color((upperBound + lowerBound) / 2)
      };
    });
    
  
    const legend = svg.append("g")
  .attr("transform", `translate(40.5,${height * years.length + 15})`);

const legendWidth = width / categoriesCount;

legend
  .selectAll("rect")
  .data(categories)
  .enter()
  .append("rect")
  .attr("fill", d => d.color)
  .attr("x", (d, i) => legendWidth * i)
  .attr("width", legendWidth)
  .attr("height", 15);

legend
  .selectAll("text")
  .data(categories)
  .enter()
  .append("text")
  .attr("x", (d, i) => legendWidth * i + legendWidth / 2)
  .attr("y", 30)
  .attr("text-anchor", "middle")
  .attr("font-size", 11)
  .text(d => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

  
  
    return Object.assign(svg.node(), {scales: {color}});
  }


document.addEventListener("DOMContentLoaded", async () => {

  const response = await fetch("calendar.json");
  const data = await response.json();

  
  const xAccessor = (d) => new Date(Date.parse(d.date));
  const yAccessor = (d) => d.value;

  // Configure the calendar chart options
  const options = {
    x: xAccessor,
    y: yAccessor,
    title: (d) => {
      return `${d.date}\n` +
             `Number of Posts: ${d.value}\n` +
             `Relevant Film Event: ${d.relevant_film_event}\n` +
             `Relevant Sport Event: ${d.relevant_sport_event}\n`;
    },
    cellSize: 20,
    colors: d3.interpolateRdBu,
  };

  // Create the calendar chart
  const calendarChart = Calendar(data, options);

  // Append the calendar chart to the DOM
  document.getElementById("calendar-chart").appendChild(calendarChart);
  });
  


