export const clearView = (svg) => svg.selectAll("*").remove();

export const mockedData = {
    nodes: [
      {
        "name": "Node1",
        "label": "Node1",
        "id": 1,
        "links": [1, 2]
      },
      {
        "name": "Node2",
        "label": "Node2",
        "id": 2,
        "links": [2]
      },
      {
        "name": "Node3",
        "label": "Node3",
        "id": 3,
        "links": [3, 4]
      },
      {
        "name": "Node4",
        "label": "Node4",
        "id": 4,
        "links": [4]
      }
    ],
    links: [
      {
        "id": 1,
        "source": 1,
        "target": 2,
      },
      {
        "id": 2,
        "source": 1,
        "target": 3,
      },
      {
        "id": 3,
        "source": 3,
        "target": 4,
      }
    ]
}

export const ticked = (link, node) => {
  link
      .attr("x1", function (d) {return d.source.x;})
      .attr("y1", function (d) {return d.source.y;})
      .attr("x2", function (d) {return d.target.x;})
      .attr("y2", function (d) {return d.target.y;});

  node.attr("transform", 
    function (d) {return "translate(" + d.x + ", " + d.y + ")";});
}

export const dragended = (d3, d, simulation) => {
  if (!d3.event.active) simulation.alphaTarget(0.1).restart()
  d.fx = d.x;
  d.fy = d.y;
}

export const initDefinitions = (svg) =>
    svg.append('defs')
    .append('marker')
    .attrs({'id':'arrowhead',
        'viewBox':'-0 -5 10 10',
        'refX':34,
        'refY':0,
        'orient':'auto',
        'markerWidth':8,
        'markerHeight':8,
        'xoverflow':'visible'})
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke','none')

export const forceSimulation = (d3, {width, height}) => d3.forceSimulation()
    .force("link", d3.forceLink()
        .id(function (d) {return d.id;})
        .distance(200)
        .strength(2))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))