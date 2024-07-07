document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Show the initial slide
    slides[currentSlide].classList.add('active');

    // Function to show next slide
    function showNextSlide() {
        if (currentSlide < slides.length - 1) {
            slides[currentSlide].classList.remove('active');
            currentSlide++;
            slides[currentSlide].classList.add('active');
        }
    }

    // Function to show previous slide
    function showPrevSlide() {
        if (currentSlide > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide--;
            slides[currentSlide].classList.add('active');
        }
    }

    // Event listeners for next and previous buttons
    const nextBtns = document.querySelectorAll('.nextBtn');
    const prevBtns = document.querySelectorAll('.prevBtn');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', showNextSlide);
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', showPrevSlide);
    });

    // DATA
    d3.csv("data/breast-cancer.csv").then(function(data) {
        console.log(data)



        // STAGE BY AGE
        // defined color variables for T1, T2, T3, T4
        var colorT1 = "#6E82B2";
        var colorT2 = "#DBB5D8";
        var colorT3 = "#CBE1A6";
        var colorT4 = "#EA908D";

        // Select the legend-text div and append the legend text
        var legendText = d3.select("#legend-text")
            .style("text-align", "center")
            .style("font-size", "18px")
            .style("margin-top", "10px");

        // Create the legend text with colored spans for each segment
        legendText.html(`<span style="color:#666;">Stages:</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="color:${colorT1};">T1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                 <span style="color:${colorT2};">T2</span>&nbsp;&nbsp;&nbsp;&nbsp;
                 <span style="color:${colorT3};">T3</span>&nbsp;&nbsp;&nbsp;&nbsp;
                 <span style="color:${colorT4};">T4</span>`);

        // Set up dimensions and margins for the chart
        var margin = { top: 20, right: 20, bottom: 50, left: 50 };
        var width = 800 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        // Create SVG element
        var svg = d3.select("#age-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create a scale band for x-axis (stages)
        var x = d3.scaleLinear()
            .domain([20, 70])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 38)
            .text("Age group");

        // Create a scale linear for y-axis (age)
        var y = d3.scaleLinear()
            .domain([0, 650])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -margin.left + 12)
            .attr("transform", "rotate(-90)")
            .text("Number of cases");

        // Set parameters for histogram
        var histogram = d3.histogram()
            .value(function(d) { return d.Age; })
            .domain(x.domain())  // domain of the graphic
            .thresholds(4); // numbers of bins

        // Filter data to get bins
        var bins1 = histogram(data.filter( function(d){return d["T Stage "] === "T1"} ));
        var bins2 = histogram(data.filter( function(d){return d["T Stage "] === "T2"} ));
        var bins3 = histogram(data.filter( function(d){return d["T Stage "] === "T3"} ));
        var bins4 = histogram(data.filter( function(d){return d["T Stage "] === "T4"} ));
        
        // Initialize tooltip
        var tooltip = d3.select("#age-chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        // append the bars for series 2
        svg.selectAll("rect")
            .data(bins2)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; 
            })
            .attr("width", function(d) { 
                return x(d.x1) - x(d.x0) -1 ; 
            })
            .attr("height", function(d) { 
                return height - y(d.length); 
            })
            .style("fill", "#DBB5D8")
            .style("opacity", 0.6)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1); // Brighten the bar
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9); // Make tooltip visible
                tooltip.html("<strong>Age Range:</strong> " + d.x0 + " - " + d.x1 +
                                "<br><strong>Cancer Stage:</strong> " + d[0]['T Stage '] + 
                            "<br><strong>Number of Cases:</strong> " + d.length)
                        .style("left", (event.clientX + 10) + "px")  // Adjust left position
                        .style("top", (event.clientY + 10) + "px"); // Adjust top position
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0.6); // Restore original opacity
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0); // Hide tooltip
            });

        // append the bars for series 1
        svg.selectAll("rect2")
            .data(bins1)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; 
            })
            .attr("width", function(d) { 
                return x(d.x1) - x(d.x0) -1 ; 
            })
            .attr("height", function(d) { 
                return height - y(d.length); 
            })
            .style("fill", "#6E82B2")
            .style("opacity", 0.6)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1); // Brighten the bar
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9); // Make tooltip visible
                tooltip.html("<strong>Age Range:</strong> " + d.x0 + " - " + d.x1 +
                                "<br><strong>Cancer Stage:</strong> " + d[0]['T Stage '] + 
                            "<br><strong>Number of Cases:</strong> " + d.length)
                        .style("left", (event.clientX + 10) + "px")  // Adjust left position
                        .style("top", (event.clientY + 10) + "px"); // Adjust top position
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0.6); // Restore original opacity
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0); // Hide tooltip
            });

        // append the bars for series 3
        svg.selectAll("rect3")
            .data(bins3)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; 
            })
            .attr("width", function(d) { 
                return x(d.x1) - x(d.x0) -1 ; 
            })
            .attr("height", function(d) { 
                return height - y(d.length); 
            })
            .style("fill", "#CBE1A6")
            .style("opacity", 0.6)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1); // Brighten the bar
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9); // Make tooltip visible
                tooltip.html("<strong>Age Range:</strong> " + d.x0 + " - " + d.x1 +
                                "<br><strong>Cancer Stage:</strong> " + d[0]['T Stage '] + 
                            "<br><strong>Number of Cases:</strong> " + d.length)
                        .style("left", (event.clientX + 10) + "px")  // Adjust left position
                        .style("top", (event.clientY + 10) + "px"); // Adjust top position
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0.6); // Restore original opacity
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0); // Hide tooltip
            });

        // append the bars for series 4
        svg.selectAll("rect4")
            .data(bins4)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { 
                return "translate(" + x(d.x0) + "," + y(d.length) + ")"; 
            })
            .attr("width", function(d) { 
                return x(d.x1) - x(d.x0) -1 ; 
            })
            .attr("height", function(d) { 
                return height - y(d.length); 
            })
            .style("fill", "#EA908D")
            .style("opacity", 0.6)
            .on("mouseover", function(event, d) {
                d3.select(this).style("opacity", 1); // Brighten the bar
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0.9); // Make tooltip visible
                tooltip.html("<strong>Age Range:</strong> " + d.x0 + " - " + d.x1 +
                                "<br><strong>Cancer Stage:</strong> " + d[0]['T Stage '] + 
                            "<br><strong>Number of Cases:</strong> " + d.length)
                        .style("left", (event.clientX + 10) + "px")  // Adjust left position
                        .style("top", (event.clientY + 10) + "px"); // Adjust top position
            })
            .on("mouseout", function(d) {
                d3.select(this).style("opacity", 0.6); // Restore original opacity
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0); // Hide tooltip
            });

        svg.append("line")
            .attr("x1", 350)
            .attr("y1", 130)
            .attr("x2", 150)
            .attr("y2", 40)
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))  // Optional: Add a dashed style
        svg.append("text")
            .attr("x", 100 - 50)
            .attr("y", 50 / 2)
            .text("Age range: 40-50, Cancer stage: T1, Number of cases: 410")
            .attr("font-size", "12px")
            .attr("fill", "gray");





        // TUMOR SIZE BY SURVIVAL MONTHS
        // defined color variables for T1, T2, T3, T4
        var colorT1 = "#6E82B2";
        var colorT2 = "#DBB5D8";
        var colorT3 = "#CBE1A6";
        var colorT4 = "#EA908D";

        // Select the legend-text div and append the legend text
        var legendText = d3.select("#legend-text-2")
            .style("text-align", "center")
            .style("font-size", "18px")
            .style("margin-top", "10px");

        // Create the legend text with colored spans for each segment
        legendText.html(`<span style="color:#666;">Stages:</span>&nbsp;&nbsp;&nbsp;&nbsp
                    <span style="color:${colorT1};">T1</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:${colorT2};">T2</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:${colorT3};">T3</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:${colorT4};">T4</span>`);


        var margin = { top: 20, right: 20, bottom: 50, left: 50 };
        var width = 800 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        // Initialize tooltip
        var tooltipHormone = d3.select("#hormone-chart").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        var svgHormone = d3.select("#hormone-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 150])
            .range([ 0, width ]);
        svgHormone.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        svgHormone.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 38)
            .text("Tumor size (mm)");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 120])
            .range([ height, 0]);
        svgHormone.append("g")
            .call(d3.axisLeft(y));
        svgHormone.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -margin.left + 12)
            .attr("transform", "rotate(-90)")
            .text("Estimated survival months");

        // Color scale: give me a specie name, I return a color
        var color = d3.scaleOrdinal()
            .domain(["T1", "T2", "T3", "T4"])
            .range(["#9491BF", "#DBB5D8", "#CBE1A6", "#EA908D"])

        // Add dots
        svgHormone.append("g")
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) { 
                    return x(d["Tumor Size"]); } )
                .attr("cy", function (d) { 
                    return y(d["Survival Months"]); } )
                .attr("r", 5)
                .style("fill", function (d) { 
                    return color(d["T Stage "]) } )
                .style("opacity", 0.6)
                .on("mouseover", function(event, d) {
                    d3.select(this).style("opacity", 1); // Brighten the circle
                    tooltipHormone.transition()
                        .duration(200)
                        .style("opacity", 0.9); // Make tooltip visible
                    tooltipHormone.html("<strong>Tumor size:</strong> " + d['Tumor Size'] +
                                    "<br><strong>Estimated survival months:</strong> " + d['Survival Months'] +
                                    "<br><strong>Cancer Stage:</strong> " + d['T Stage '])
                            .style("left", (event.clientX + 10) + "px")  // Adjust left position
                            .style("top", (event.clientY + 10) + "px"); // Adjust top position
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("opacity", 0.6); // Restore original opacity
                    tooltipHormone.transition()
                        .duration(500)
                        .style("opacity", 0); // Hide tooltip
                });

        var annotationStart = { x: x(data[86]["Tumor Size"]), y: y(data[86]["Survival Months"]) };
        var annotationEnd = { x: 430, y: 10 };  // Adjust these coordinates as needed
        
        // Append the annotation line
        svgHormone.append("line")
            .attr("x1", annotationStart.x)
            .attr("y1", annotationStart.y)
            .attr("x2", annotationEnd.x)
            .attr("y2", annotationEnd.y)
            .attr("stroke", "gray")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"));  // Optional: Add a dashed style
        svgHormone.append("text")
            .attr("x", annotationEnd.x - 50)
            .attr("y", annotationEnd.y / 2)
            .text("Cancer stage: T3, Tumor size: 120, Estimated survival months: 83")
            .attr("font-size", "12px")
            .attr("fill", "gray");



        // STAGE BY DEATHS
        // defined color variables for alive and died
        var color1 = "#6B94D0";
        var color2 = "#F3C58A";

        // Select the legend-text div and append the legend text
        var legendText = d3.select("#legend-text-3")
            .style("text-align", "center")
            .style("font-size", "18px")
            .style("margin-top", "10px");

        // Create the legend text with colored spans for each segment
        legendText.html(`<span style="color:${color1};">Alive</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:${color2};">Died</span>&nbsp;&nbsp;&nbsp;&nbsp`);

        var margin = { top: 20, right: 20, bottom: 50, left: 50 };
        var width = 800 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        // Append the SVG object to the body of the page
        var svgStatus = d3.select("#status-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Initial groups and subgroups
        var groups = ['White', 'Black', 'Other']; // Default to race
        var subgroups = ['Alive', 'Dead'];

        // Color palette
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#6B94D0", "#F3C58A"]);

        // Scales
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2]);

        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Axes
        var xAxis = svgStatus.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));
            
        svgStatus.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 38)
            .text("Race");

        svgStatus.append("g")
            .call(d3.axisLeft(y));

        svgStatus.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 12)
            .attr("transform", "rotate(-90)")
            .text("Survival percentage (%)");

        // Tooltip
        var tooltipStatus = d3.select("#status-chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Data aggregation functions
        var dataByRace = Array.from(d3.group(data, d => d['Race']), ([key, data]) => ({
            Race: key,
            Alive: d3.sum(data, d => d['Status'] === 'Alive' ? 1 : 0),
            Dead: d3.sum(data, d => d['Status'] === 'Dead' ? 1 : 0)
        }));

        var dataByMaritalStatus = Array.from(d3.group(data, d => d['Marital Status']), ([key, data]) => ({
            MaritalStatus: key,
            Alive: d3.sum(data, d => d['Status'] === 'Alive' ? 1 : 0),
            Dead: d3.sum(data, d => d['Status'] === 'Dead' ? 1 : 0)
        }));

        console.log(dataByMaritalStatus)

        // Default dataset
        var dataset = 'race';

        // Function to update graph based on selected dataset
        window.updateGraph = function(dataset) {
            // Update aggregated data based on selected dataset
            var aggregatedData = (dataset === 'race') ? dataByRace : dataByMaritalStatus;

            // Update x domain based on dataset
            groups = (dataset === 'race') ? ['White', 'Black', 'Other'] : ['Single', 'Married', 'Separated', 'Divorced', 'Widowed'];
            // groups = (dataset === 'race') ? ['White', 'Black', 'Other'] : ['Married', 'Divorced', 'Single', 'Widowed', 'Separated'];
            x.domain(groups);
            svgStatus.select(".x")
                .text((dataset === 'race') ? "Race" : "Marital Status");

            // Update X axis with transition
            xAxis.transition()
                .duration(500)
                .call(d3.axisBottom(x).tickSize(0));

            // Update tooltip label based on selected dataset
            var tooltipLabel = (dataset === 'race') ? "<strong>Race:</strong> " : "<strong>Marital Status:</strong> ";

            // Normalize the data -> sum of each group must be 100!
            aggregatedData.forEach(function(d) {
                var tot = 0;
                subgroups.forEach(function(name) {
                    tot += +d[name];
                });
                subgroups.forEach(function(name) {
                    d[name] = (d[name] / tot * 100).toFixed(1);
                });
            });

            // Stack the data
            var stackedData = d3.stack()
                .keys(subgroups)
                (aggregatedData);

            console.log(stackedData);

            // Remove existing bars
            svgStatus.selectAll(".bars").remove();

            // Append new bars
            var bars = svgStatus.selectAll(".bars")
                .data(stackedData)
                .enter().append("g")
                .attr("class", "bars")
                .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Race || d.data.MaritalStatus); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
                .style("opacity", 0.6)
                .on("mouseover", function(event, d) {
                    d3.select(this).style("opacity", 1);
                    tooltipStatus.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    tooltipStatus.html(tooltipLabel + (dataset === 'race' ? d.data['Race'] : d.data['MaritalStatus']) +
                            "<br><strong>Percent survived:</strong> " + d.data['Alive'] + "%" +
                            "<br><strong>Percent died:</strong> " + d.data['Dead'] + "%")
                        .style("left", (event.clientX) + 10 + "px")
                        .style("top", (event.clientY) + 10 + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("opacity", 0.6);
                    tooltipStatus.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // Transition bars
            bars.selectAll("rect")
                .transition()
                .duration(1000)
                .attr("x", function(d) { return x(d.data.Race || d.data.MaritalStatus); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());

            // annotations
            svgStatus.selectAll(".annotation").remove();
            svgStatus.append("line")
                .attr("x1", (dataset === 'race' ? 210 : 265))
                .attr("y1", 90)
                .attr("x2", (dataset === 'race' ? 245 : 295))
                .attr("y2", -3)
                .attr("class", "annotation")
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"))  // Optional: Add a dashed style
            svgStatus.append("text")
                .attr("x", 240 - 100)
                .attr("y", -10)
                .attr("class", "annotation")
                .text((dataset === 'race' ? "Race: White, Percent survived: 85.1%, Percent died: 14.9%" : "Marital Status: Married, Percent survived: 86.5%, Percent died: 13.5%") )
                .attr("font-size", "12px")
                .attr("fill", "gray");

        };

        // Initially load the chart with 'race' dataset
        updateGraph('race');



        // // Grouped bar chart
        // svgStatus
        //     .selectAll(".bar")
        //     .data(aggregatedDataNoStage)
        //     .enter()
        //     .append("g")
        //         .attr("class", "bar")
        //         .attr("transform", function(d) { 
        //             return "translate(" + x(d.Race) + ",0)"; })
        //     .selectAll("rect")
        //     .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        //     .enter().append("rect") 
        //         .attr("x", function(d) { return xSubgroup(d.key); } )
        //         .attr("y", function(d) { return y(d.value); })
        //         .attr("width", xSubgroup.bandwidth())
        //         .attr("height", function(d) { return height - y(d.value); })
        //         .attr("fill", function(d) { return color(d.key); });

        });
    });
