import * as d3 from "d3";
import "d3-selection-multi";
import {mockedData, 
    clearView,
    ticked, 
    dragended,
    initDefinitions,
    forceSimulation
} from './utils';

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
let selectedNodes = [];

export const render = (data) => {
    let { links, nodes } = data;
    clearView(svg);
    initDefinitions(svg);

    const simulation = forceSimulation(d3, {width,height});

    const link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)')

    const node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", (d) => dragended(d3, d, simulation))
            .on("drag", function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            })
            .on("end", (d) => dragended(d3, d, simulation))
         );

    node.append('circle').attr("r", 40)
    .attr('id', d => d.id)

    svg.selectAll('circle')
       .on('click', function () {
            selectedNodes.push(d3.event.target.id)
            console.log(selectedNodes)
            if (selectedNodes.length == 2) {
                    createLink(selectedNodes)
                    selectedNodes = []
            }
            d3.selectAll('circle')
            .style("fill", "lightgray");
            d3.select(this)
            .style("stroke-width", "3px");
        })

    const nodeText = node.append("text")
        .attr("dy", -3)
        .attr("y", -25);

    nodeText.selectAll("tspan.text")
        .data((d) =>  d.name.split(" "))
        .enter()
        .append("tspan")
        .attr("class", "text")
        .text(d => d)
        .attr("x", -10)
        .attr("dx", 10)
        .attr("dy", 22);

    node.append("title")
        .text(function (d) {return d.id;});

    simulation
        .nodes(nodes)
        .on("tick", () => { ticked(link, node)});

    simulation.force("link")
        .links(links);
}

render(mockedData);

// Adding Nodes 
const addNode = () => {
    console.log('add node  ', mockedData)
    let {nodes, links} = mockedData
    const index = nodes.length + 1
    nodes.push({
        "name": `Node${index}`,
        "label": `Node${index}`,
        "id": index,
        "links": [index]
    })

    console.log(mockedData)
    render(mockedData)
}
document.getElementById('addBtn').addEventListener('click', addNode, true);

// Create link between clicked items
const createLink = (selectedNodes) => {
    console.log(' create link clicked ')
    let {nodes, links} = mockedData
    links.push({
        "id": links.length + 1,
        "source": selectedNodes[0],
        "target": selectedNodes[1],
    })
    render(mockedData)
}