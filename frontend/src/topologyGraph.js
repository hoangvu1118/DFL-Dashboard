import * as d3 from "d3";

export function initTopologyGraph(containerSelector, initialData, options = {}) {
  let selectedNodeId = null;
  const container = document.querySelector(containerSelector);
  if (!container) throw new Error(`Container ${containerSelector} not found`);

  // State
  let nodes = initialData?.nodes ? JSON.parse(JSON.stringify(initialData.nodes)) : [];
  let links = initialData?.edges ? JSON.parse(JSON.stringify(initialData.edges)) : [];
  
  // Dimensions
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Cleanup container
  container.innerHTML = "";
  
  // Create UI overlays
  const statusChip = document.createElement("div");
  statusChip.className = "status-chip";
  container.appendChild(statusChip);

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-card";
  container.appendChild(tooltip);

  // SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("class", "topology-svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  // Defs for shadow & markers
  const defs = svg.append("defs");
  
  // Drop shadow filter
  const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("x", "-20%")
    .attr("y", "-20%")
    .attr("width", "140%")
    .attr("height", "140%");
  filter.append("feDropShadow")
    .attr("dx", "0")
    .attr("dy", "4")
    .attr("stdDeviation", "4")
    .attr("flood-opacity", "0.5")
    .attr("flood-color", "#000");

  // Arrow marker for active transfer
  defs.append("marker")
    .attr("id", "arrow-active")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 32) // Push arrowhead out from center
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "var(--edge-ring)");

  // Double click reset
  svg.on("dblclick", () => {
    simulation.alpha(1).restart();
  });

  // Layer groups
  const gRingOverlay = svg.append("g").attr("class", "ring-layer");
  const gLinks = svg.append("g").attr("class", "links-layer");
  const gNodes = svg.append("g").attr("class", "nodes-layer");

  // Simulation
  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(160).strength(0.6))
    .force("charge", d3.forceManyBody().strength(-320))
    .force("center", d3.forceCenter(0, 0))
    .force("collide", d3.forceCollide().radius(52));

  // Zoom / Pan
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on("zoom", (e) => {
      gRingOverlay.attr("transform", e.transform);
      gLinks.attr("transform", e.transform);
      gNodes.attr("transform", e.transform);
    });
  svg.call(zoom);

  function getPhaseColor(phase) {
    switch (phase) {
      case "PHASE_1": return "var(--node-phase1)";
      case "PHASE_2": return "var(--node-phase2)";
      case "PHASE_3": return "var(--node-phase3)";
      case "PHASE_4": return "var(--node-phase4)";
      case "DEAD": return "var(--node-dead)";
      default: return "var(--node-phase1)";
    }
  }

  function updateStatusChip() {
    let phase2Count = nodes.filter(n => n.phase === "PHASE_2").length;
    let mainPhase = phase2Count > 0 ? "PHASE_2" : (nodes[0]?.phase || "UNKNOWN");
    statusChip.innerText = `${nodes.length} nodes · Phase ${mainPhase}`;
  }

  function render() {
    updateStatusChip();

    // 1. Calculate ring links if PHASE_2
    const ringLinks = [];
    nodes.forEach(n => {
      if (n.phase === "PHASE_2" && n.ring_right) {
        const target = nodes.find(t => t.id === n.ring_right);
        if (target) {
          ringLinks.push({ source: n, target });
        }
      }
    });

    const ringLine = gRingOverlay.selectAll("line")
      .data(ringLinks, d => `${d.source.id}->${d.target.id}`);
    
    ringLine.exit().remove();
    const ringLineEnter = ringLine.enter().append("line")
      .attr("stroke", "var(--edge-ring)")
      .attr("stroke-width", 3)
      .attr("opacity", 0.3);
    const ringLineMerge = ringLineEnter.merge(ringLine);

    // 2. Main Links
    const link = gLinks.selectAll("line.base-link")
      .data(links, d => {
        let s = typeof d.source === "object" ? d.source.id : d.source;
        let t = typeof d.target === "object" ? d.target.id : d.target;
        return `${s}::${t}`;
      });

    link.exit().remove();
    const linkEnter = link.enter().append("line")
      .attr("class", "base-link");
    
    const linkMerge = linkEnter.merge(link)
      .attr("stroke", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        if (s?.phase === "DEAD" || t?.phase === "DEAD") return "var(--edge-default)";
        if (s?.phase === "PHASE_2" && t?.phase === "PHASE_2" && (s.ring_right === t.id || t.ring_right === s.id)) return "var(--edge-ring)";
        return "var(--edge-default)";
      })
      .attr("stroke-width", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        if (s?.phase === "PHASE_2" && t?.phase === "PHASE_2" && (s.ring_right === t.id || t.ring_right === s.id)) return 2;
        return 1.5;
      })
      .attr("stroke-dasharray", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        if (s?.phase === "DEAD" || t?.phase === "DEAD") return "4,4";
        return null;
      })
      .attr("opacity", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        if (s?.phase === "DEAD" || t?.phase === "DEAD") return 0.3;
        return 1;
      })
      .classed("edge-animated", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        return s?.phase === "PHASE_2" && t?.phase === "PHASE_2" && (s.ring_right === t.id || t.ring_right === s.id);
      })
      .attr("marker-end", d => {
        let s = typeof d.source === "object" ? d.source : nodes.find(n=>n.id===d.source);
        let t = typeof d.target === "object" ? d.target : nodes.find(n=>n.id===d.target);
        if (s?.phase === "PHASE_2" && t?.phase === "PHASE_2" && s.ring_right === t.id) return "url(#arrow-active)";
        return null;
      });

    // 3. Nodes
    const node = gNodes.selectAll("g.node")
      .data(nodes, d => d.id);

    node.exit().transition().duration(300).attr("transform", "scale(0)").remove();

    const nodeEnter = node.enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        selectedNodeId = d.id;
        if (options.onNodeClick) options.onNodeClick(d);
        // Refresh selection ring immediately
        gNodes.selectAll("g.node").select(".selection-ring")
          .attr("display", n => n.id === selectedNodeId ? null : "none");
      })
      .on("mouseover", (event, d) => {
        tooltip.innerHTML = `
          <div class="tooltip-title">${d.id}</div>
          <div class="tooltip-row"><span class="label">Phase</span><span>${d.phase}</span></div>
          <div class="tooltip-row"><span class="label">Left</span><span>${d.ring_left || "None"}</span></div>
          <div class="tooltip-row"><span class="label">Right</span><span>${d.ring_right || "None"}</span></div>
        `;
        tooltip.classList.add("visible");
        
        // Positioning
        const { clientX, clientY } = event;
        tooltip.style.left = (clientX + 16) + "px";
        tooltip.style.top = (clientY + 16) + "px";
        
        // Highlight logic
        const connectedIds = new Set(links.filter(l => l.source.id === d.id || l.target.id === d.id).map(l => l.source.id === d.id ? l.target.id : l.source.id));
        nodeMerge.attr("opacity", n => n.id === d.id || connectedIds.has(n.id) ? 1 : 0.2);
        linkMerge.attr("opacity", l => l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
      })
      .on("mousemove", (event) => {
        const { clientX, clientY } = event;
        tooltip.style.left = (clientX + 16) + "px";
        tooltip.style.top = (clientY + 16) + "px";
      })
      .on("mouseout", () => {
        tooltip.classList.remove("visible");
        nodeMerge.attr("opacity", n => n.phase === "DEAD" ? 0.45 : 1);
        linkMerge.attr("opacity", l => {
            if (l.source.phase === "DEAD" || l.target.phase === "DEAD") return 0.3;
            return 1;
        });
      });

    // Selection highlight ring (rendered BEHIND the building)
    nodeEnter.append("circle")
      .attr("class", "selection-ring")
      .attr("r", 34)
      .attr("fill", "none")
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", "6 3")
      .attr("display", d => d.id === selectedNodeId ? null : "none")
      .style("filter", "drop-shadow(0 0 6px rgba(56,189,248,0.7))");

    // Hospital building SVG
    nodeEnter.append("rect")
      .attr("class", "building-body")
      .attr("x", -20)
      .attr("y", -24)
      .attr("width", 40)
      .attr("height", 48)
      .attr("rx", 4)
      .attr("filter", "url(#drop-shadow)");

    // Roof
    nodeEnter.append("path")
      .attr("d", "M -24 -24 L 0 -36 L 24 -24 Z")
      .attr("class", "building-roof");

    // Cross base
    nodeEnter.append("rect")
      .attr("x", -10)
      .attr("y", -8)
      .attr("width", 20)
      .attr("height", 20)
      .attr("rx", 2)
      .attr("fill", "rgba(0,0,0,0.15)");
      
    // Cross
    nodeEnter.append("path")
      .attr("d", "M -3 -1 L 3 -1 L 3 -4 L -3 -4 Z M -1 -6 L 1 -6 L 1 0 L -1 0 Z")
      .attr("transform", "translate(0, 2) scale(1.8)")
      .attr("fill", "var(--hospital-cross)");

    // Star badge for bootstrap
    nodeEnter.filter(d => d.is_bootstrap).append("path")
      .attr("d", "M 0 -5 L 1.5 -1.5 L 5 -1.5 L 2 1 L 3.5 4.5 L 0 2.5 L -3.5 4.5 L -2 1 L -5 -1.5 L -1.5 -1.5 Z")
      .attr("transform", "translate(18, -22) scale(1.2)")
      .attr("fill", "var(--node-bootstrap-badge)");

    // Label tag
    const labelGroup = nodeEnter.append("g").attr("transform", "translate(0, 36)");
    labelGroup.append("rect")
      .attr("class", "node-label-bg")
      .attr("rx", 3)
      .attr("height", 16)
      .attr("y", -11);
      
    labelGroup.append("text")
      .attr("class", "node-label")
      .attr("text-anchor", "middle")
      .attr("dy", "0em");

    // Entry animation
    nodeEnter.attr("transform", d => `translate(${d.x || 0},${d.y || 0}) scale(0)`)
      .transition()
      .duration(500)
      .attr("transform", d => `translate(${d.x || 0},${d.y || 0}) scale(1)`);

    const nodeMerge = nodeEnter.merge(node);

    // Sync selection ring on every render
    nodeMerge.select(".selection-ring")
      .attr("display", d => d.id === selectedNodeId ? null : "none");

    // Apply state styles dynamically
    nodeMerge.select(".building-body")
      .attr("fill", d => getPhaseColor(d.phase))
      .attr("stroke", d => d.phase === "DEAD" ? "var(--color-border)" : "none")
      .attr("stroke-dasharray", d => d.phase === "DEAD" ? "4,4" : "none")
      .attr("stroke-width", d => d.phase === "DEAD" ? 2 : 0);

    nodeMerge.select(".building-roof")
      .attr("fill", d => {
        let color = getPhaseColor(d.phase);
        return d3.color(color)?.darker(0.5) || color;
      });

    nodeMerge.attr("opacity", d => d.phase === "DEAD" ? 0.45 : 1);

    nodeMerge.select(".node-label").text(d => d.id);
    nodeMerge.select(".node-label-bg")
      .attr("width", function(d) {
        // Need to calculate bounding box width safely
        let p = d3.select(this.parentNode).select("text").node();
        return p ? p.getBBox().width + 12 : 60;
      })
      .attr("x", function(d) {
        let p = d3.select(this.parentNode).select("text").node();
        return p ? -(p.getBBox().width + 12)/2 : -30;
      });

    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);
    
    function ticked() {
      linkMerge
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
        
      ringLineMerge
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeMerge.attr("transform", d => `translate(${d.x},${d.y})`);
    }
  }

  // Initial render
  render();
  simulation.alpha(1).restart();

  // Clicking empty SVG area clears selection
  svg.on("click", () => {
    selectedNodeId = null;
    gNodes.selectAll("g.node").select(".selection-ring").attr("display", "none");
    if (options.onNodeDeselect) options.onNodeDeselect();
  });

  return {
    setSelected(id) {
      selectedNodeId = id;
      gNodes.selectAll("g.node").select(".selection-ring")
        .attr("display", d => d.id === selectedNodeId ? null : "none");
    },
    update(newData) {
      // Retain existing node positions (x, y, fx, fy, vx, vy)
      const oldNodesMap = new Map(nodes.map(n => [n.id, n]));
      
      nodes = JSON.parse(JSON.stringify(newData.nodes)).map(n => {
        const oldNode = oldNodesMap.get(n.id);
        if (oldNode) {
          n.x = oldNode.x;
          n.y = oldNode.y;
          n.vx = oldNode.vx;
          n.vy = oldNode.vy;
          n.fx = oldNode.fx;
          n.fy = oldNode.fy;
        }
        return n;
      });
      
      links = JSON.parse(JSON.stringify(newData.edges));
      
      const newNodesAdded = newData.nodes.length > oldNodesMap.size;
      
      render();
      
      // If new nodes joined, gently nudge simulation
      if (newNodesAdded && simulation.alpha() < 0.3) {
        simulation.alpha(0.3).restart();
      }
    },
    
    destroy() {
      simulation.stop();
      container.innerHTML = "";
    }
  };
}
