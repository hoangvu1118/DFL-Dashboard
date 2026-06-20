import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { initTopologyGraph } from "../topologyGraph";
import NodeSidebar from "./NodeSidebar";

const API_BASE = "http://localhost:8080/api"; // Spring Boot URL
const POLL_MS = 3000;

export default function NetworkGraph() {
  const containerRef = useRef();
  const graphInstanceRef = useRef(null);
  const deadNodeTimestamps = useRef({}); // { nodeId: timestamp_ms } — tracks when each node first went DEAD

  // Sidebar state
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [sidebarData, setSidebarData]       = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const sidebarIntervalRef = useRef(null);

  // ------------------- Fetch Data -------------------
  const fetchGraphData = async () => {
    try {
      // 1. Fetch Adjacency
      const { data } = await axios.get(`${API_BASE}/adjacency`);
      if (!data || !data.adjacency) return;
      const adjacency = data.adjacency;

      const nodeIds = Object.keys(adjacency);
      const links = [];
      const seenEdges = new Set();

      for (const [src, targets] of Object.entries(adjacency)) {
        for (const tgt of targets) {
          const key = [src, tgt].sort().join("::");
          if (!seenEdges.has(key)) {
            links.push({ source: src, target: tgt });
            seenEdges.add(key);
          }
        }
      }

      // 2. Fetch Status for each node to get phase and ring details
      // If this is too heavy, we can consider doing it less frequently or batching
      // Fetch status for each node using its identifier. The backend proxy will forward the request to the appropriate host/port.
      const nodePromises = nodeIds.map(async (id, index) => {
        try {
          const statusResp = await axios.get(`${API_BASE}/node/${id}/status`);
          const status = statusResp.data;
          return {
            id,
            phase: status.phase || "PHASE_1",
            is_bootstrap: index === 0, // First node in adjacency is considered bootstrap
            ring_left: status.ring_left || null,
            ring_right: status.ring_right || null
          };
        } catch (e) {
          // Fallback if node is unreachable or dead
          return {
            id,
            phase: "DEAD",
            is_bootstrap: index === 0,
            ring_left: null,
            ring_right: null
          };
        }
      });

      const nodes = await Promise.all(nodePromises);

      // --- Dead node grace period logic ---
      const now = Date.now();
      const DEAD_GRACE_MS = 5000; // 5 seconds

      const filteredNodes = nodes.filter(n => {
        if (n.phase === "DEAD") {
          // First time we see this node as DEAD — record the timestamp
          if (!deadNodeTimestamps.current[n.id]) {
            deadNodeTimestamps.current[n.id] = now;
          }
          // Keep it visible only within the grace period
          return (now - deadNodeTimestamps.current[n.id]) < DEAD_GRACE_MS;
        } else {
          // Node is alive — clear any stale dead timestamp
          delete deadNodeTimestamps.current[n.id];
          return true;
        }
      });

      // Drop edges whose endpoints were fully removed
      const survivingIds = new Set(filteredNodes.map(n => n.id));
      const filteredLinks = links.filter(l => survivingIds.has(l.source) && survivingIds.has(l.target));
      // --- End dead node grace period logic ---

      const newGraphData = { nodes: filteredNodes, edges: filteredLinks };

      if (graphInstanceRef.current) {
        graphInstanceRef.current.update(newGraphData);
      }
    } catch (e) {
      console.error("Failed to fetch graph data", e);
    }
  };

  // ------------------- Sidebar Fetch -------------------
  const fetchNodeStatus = useCallback(async (id) => {
    try {
      const resp = await axios.get(`${API_BASE}/node/${id}/status`);
      setSidebarData(resp.data);
    } catch (e) {
      setSidebarData(null);
    } finally {
      setSidebarLoading(false);
    }
  }, []);

  const openSidebar = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setSidebarData(null);
    setSidebarLoading(true);
    if (sidebarIntervalRef.current) clearInterval(sidebarIntervalRef.current);
    fetchNodeStatus(nodeId);
    sidebarIntervalRef.current = setInterval(() => fetchNodeStatus(nodeId), POLL_MS);
  }, [fetchNodeStatus]);

  const closeSidebar = useCallback(() => {
    setSelectedNodeId(null);
    setSidebarData(null);
    if (sidebarIntervalRef.current) {
      clearInterval(sidebarIntervalRef.current);
      sidebarIntervalRef.current = null;
    }
    if (graphInstanceRef.current) graphInstanceRef.current.setSelected(null);
  }, []);

  // ------------------- Initialize Graph -------------------
  useEffect(() => {
    if (!containerRef.current) return;

    // Create the D3 wrapper
    containerRef.current.classList.add("topology-container");
    graphInstanceRef.current = initTopologyGraph(
      ".topology-container",
      { nodes: [], edges: [] },
      {
        onNodeClick: (d) => openSidebar(d.id),
        onNodeDeselect: closeSidebar,
      }
    );

    // Initial fetch
    fetchGraphData();

    // Polling loop
    const interval = setInterval(fetchGraphData, POLL_MS);
    
    return () => {
      clearInterval(interval);
      if (sidebarIntervalRef.current) clearInterval(sidebarIntervalRef.current);
      if (graphInstanceRef.current) {
        graphInstanceRef.current.destroy();
      }
    };
  }, [openSidebar, closeSidebar]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      <NodeSidebar
        nodeId={selectedNodeId}
        data={sidebarData}
        loading={sidebarLoading}
        onClose={closeSidebar}
      />
      <div ref={containerRef} style={{ flex: 1, height: "100%", transition: "margin-left 0.3s ease" }} />
    </div>
  );
}
