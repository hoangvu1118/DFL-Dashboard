import React from "react";

function NodeTag({ id, selfId }) {
  return (
    <span className={`ns-tag${id === selfId ? " ns-tag-self" : ""}`}>{id}</span>
  );
}

function RumorEntry({ entry }) {
  const ts = entry.rumor_id?.split(":").pop() || "";
  const timeStr = ts ? new Date(parseFloat(ts) * 1000).toLocaleTimeString() : "";
  const type = (entry.type || "").toLowerCase();
  return (
    <div className="ns-rumor-entry">
      <span className="ns-rumor-time">{timeStr}</span>
      <span className={`ns-rumor-type ns-rumor-${type}`}>{entry.type || ""}</span>
      <span className="ns-rumor-origin">{entry.originator_id || ""}</span>
      <span className="ns-rumor-payload">{JSON.stringify(entry.payload || {})}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="ns-section">
      <h3 className="ns-section-title">{title}</h3>
      <div className="ns-section-body">{children}</div>
    </div>
  );
}

function StatGrid({ items }) {
  return (
    <div className="ns-stat-grid">
      {items.map(({ label, value, cls }) => (
        <div className="ns-stat-item" key={label}>
          <div className="ns-stat-label">{label}</div>
          <div className={`ns-stat-value${cls ? " " + cls : ""}`}>{value ?? "—"}</div>
        </div>
      ))}
    </div>
  );
}

export default function NodeSidebar({ nodeId, data, loading, onClose }) {
  const isOpen = !!nodeId;

  return (
    <div className={`node-sidebar${isOpen ? " node-sidebar--open" : ""}`}>
      {/* Header */}
      <div className="ns-header">
        <div>
          <div className="ns-header-label">Node Detail</div>
          <div className="ns-node-id">{nodeId || "—"}</div>
        </div>
        <button className="ns-close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
      </div>

      {/* Loading state */}
      {loading && <div className="ns-loading">Loading…</div>}

      {/* Content */}
      {!loading && data && (
        <div className="ns-content">
          {/* Node Info */}
          <Section title="Node Info">
            <StatGrid items={[
              { label: "Role",         value: data.is_bootstrap ? "Bootstrap" : "Worker", cls: data.is_bootstrap ? "ns-bootstrap" : "ns-worker" },
              { label: "Phase",        value: data.phase },
              { label: "Round",        value: data.current_round ?? 0 },
              { label: "Total Nodes",  value: data.global_table?.length },
              { label: "Table Locked", value: data.table_locked ? "Yes" : "No" },
            ]} />
          </Section>

          {/* Ring Neighbors */}
          <Section title="Ring Neighbors">
            <StatGrid items={[
              { label: "Left",  value: data.ring_left  || "—" },
              { label: "Right", value: data.ring_right || "—" },
            ]} />
          </Section>

          {/* Ready Set P2 */}
          <Section title="Ready Set (PHASE_2)">
            <div className="ns-tag-list">
              {(data.ready_set || []).length > 0
                ? data.ready_set.map(id => <NodeTag key={id} id={id} selfId={data.node_id} />)
                : <span className="ns-empty">None ready yet</span>}
            </div>
          </Section>

          {/* Ready Set P3 */}
          <Section title="Ready Set (PHASE_3)">
            <div className="ns-tag-list">
              {(data.ready_set_p3 || []).length > 0
                ? data.ready_set_p3.map(id => <NodeTag key={id} id={id} selfId={data.node_id} />)
                : <span className="ns-empty">None ready yet</span>}
            </div>
          </Section>

          {/* No Model Set */}
          <Section title="No Model Set">
            <div className="ns-tag-list">
              {(data.no_model_set || []).length > 0
                ? data.no_model_set.map(id => <NodeTag key={id} id={id} />)
                : <span className="ns-empty">None</span>}
            </div>
          </Section>

          {/* Dead This Round */}
          <Section title="Dead This Round">
            <div className="ns-tag-list">
              {(data.dead_this_round || []).length > 0
                ? data.dead_this_round.map(id => <NodeTag key={id} id={id} />)
                : <span className="ns-empty">None</span>}
            </div>
          </Section>

          {/* Rumor Log */}
          <Section title="Rumor Log (newest 20)">
            <div className="ns-rumor-list">
              {(data.rumor_log || []).length > 0
                ? [...data.rumor_log].reverse().slice(0, 20).map((entry, i) => (
                    <RumorEntry key={entry.rumor_id || i} entry={entry} />
                  ))
                : <span className="ns-empty">No rumors yet</span>}
            </div>
          </Section>

          {/* Seen Rumors */}
          <Section title="Seen Rumors (newest 10)">
            <div className="ns-tag-list">
              {(data.seen_rumors || []).length > 0
                ? [...data.seen_rumors].reverse().slice(0, 10).map(id => <NodeTag key={id} id={id} />)
                : <span className="ns-empty">No rumors seen yet</span>}
            </div>
          </Section>

          {/* Heartbeat Seen */}
          <Section title="Heartbeat Seen">
            <div className="ns-tag-list">
              {(data.heartbeat_seen || []).length > 0
                ? data.heartbeat_seen.map(id => <NodeTag key={id} id={id} selfId={data.node_id} />)
                : <span className="ns-empty">No heartbeats seen yet</span>}
            </div>
          </Section>

          {/* Neighbors */}
          <Section title="Neighbors">
            <div className="ns-tag-list">
              {(data.neighbor_map || []).length > 0
                ? data.neighbor_map.map(id => <NodeTag key={id} id={id} selfId={data.node_id} />)
                : <span className="ns-empty">No neighbors yet</span>}
            </div>
          </Section>

          {/* Global Table */}
          <Section title="Global Table">
            <div className="ns-tag-list">
              {(data.global_table || []).length > 0
                ? data.global_table.map(id => <NodeTag key={id} id={id} selfId={data.node_id} />)
                : <span className="ns-empty">Empty</span>}
            </div>
          </Section>

          {/* Dataset Sizes */}
          <Section title="Dataset Sizes">
            {Object.keys(data.dataset_sizes || {}).length > 0
              ? Object.entries(data.dataset_sizes).map(([node, size]) => (
                  <div className="ns-dataset-row" key={node}>
                    <NodeTag id={node} selfId={data.node_id} />
                    <span className="ns-dataset-size">{size}</span>
                    <span className="ns-dataset-unit">samples</span>
                  </div>
                ))
              : <span className="ns-empty">No dataset sizes reported yet</span>}
          </Section>
        </div>
      )}

      {/* No data / dead node state */}
      {!loading && !data && nodeId && (
        <div className="ns-loading">Could not load status for this node.</div>
      )}
    </div>
  );
}
