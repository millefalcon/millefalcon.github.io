export function render(data_input) {
    const width = 900;
    const height = 800;

    // const nodes = [{}, {}, {}, {}];
    // const nodes = d3.range(100).map(d => ({ radius: Math.random() * 25 }));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // var nodes = d3.range(100).map(function(d) {
    // 	return {radius: Math.random() * 25}
    // })

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.

    // const data_input = await fetch("/data.json").then(r => r.json())
    const nodes = [];
    const links = [];
    for (let p of data_input.toSorted((a, b) => b.dependencies.length - a.dependencies.length)) {
        if (p.dependencies.length === 0) {
            continue;
        }
        if (!nodes.some(n => n.id === p.package.package_name)) {
            nodes.push({ id: p.package.package_name, name: p.package.key })
        }

        for (let d of p.dependencies) {
            const dep_name = d.package_name;
            if (!nodes.find(n => n.id === dep_name)) {
                nodes.push({ id: dep_name, name: dep_name });
                links.push({ target: dep_name, source: p.package.package_name });
            } else {
                links.push({ source: dep_name, target: p.package.package_name });
            }
        }
    }


    var div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).strength(0.09))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        // .force("collision", d3.forceCollide().radius(0))
        .on("tick", ticked);

    // Create the SVG container.
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");


    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", 1);


    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        // .attr("fill", d => color(d.group))
        .attr("fill", "currentColor");

    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .text(function (d) { return d.name; })
        .attr("dx", 12)
        .attr("dy", 5)
        .style("font-size", "0.7em")
        .style("fill", "hsl(0 0% 0% / 0.8)");

    // node.append("title")
    //     .text(d => d.id);

    // // Add the highlighting functionality
    // node
    //     .on('mouseover', function (d) {
    //         // Highlight the nodes: every node is green except of him
    //         // node.style('fill', "#B8B8B8")
    //         // d3.select(this).style('fill', '#69b3b2')
    //         // Highlight the connections
    //         link
    //             .style('stroke', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? '#69b3b2' : 'red'; })
    //             .style('stroke-width', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 10 : 1; })
    //     })
    //     .on('mouseout', function (d) {
    //         // node.style('fill', "#69b3a2")
    //         link
    //             .style('stroke', 'black')
    //             .style('stroke-width', '1')
    //     })

    // Add a drag behavior.
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));


    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);


        label
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; });
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    let transform;

    const zoom = d3.zoom().on("zoom", e => {
        node.attr("transform", (transform = e.transform));

        link.attr("transform", (transform = e.transform));

        label.attr("transform", (transform = e.transform));

    });

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}
