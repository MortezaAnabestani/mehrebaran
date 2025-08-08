"use client";

import React, { useCallback } from "react";
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "شبکه نیازسنجی", p: "asdasd asd asd" },
    position: { x: 0, y: 0 },
    style: { backgroundColor: "#e0f0ff", borderRadius: 12, padding: 10 },
  },
  {
    id: "2",
    data: { label: "محیط زیست", p: "asdasd asd asd" },
    position: { x: 200, y: 150 },
    style: { backgroundColor: "#e0f0ff", borderRadius: 12 },
  },
  {
    id: "3",
    data: { label: "خیّرمؤثر", p: "asdasd asd asd" },
    position: { x: 400, y: 0 },
    style: { backgroundColor: "#e0f0ff" },
  },
  {
    id: "4",
    data: { label: "اردوهای جهادی", p: "asdasd asd asd" },
    position: { x: 600, y: 150 },
  },
  {
    id: "5",
    data: { label: "مسئولیت اجتماعی", p: "asdasd asd asd" },
    position: { x: 800, y: 0 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: {
      stroke: "orange",
      strokeWidth: 3,
      strokeDasharray: "5 5",
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    style: { stroke: "orange", strokeWidth: 3 },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    style: { stroke: "orange", strokeWidth: 3 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: true,
    style: { stroke: "orange", strokeWidth: 3 },
  },
];

const InteractiveDiagram = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "orange", strokeWidth: 3 } }, eds)
      ),
    []
  );

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background gap={16} color="#aaa" />
      </ReactFlow>
    </div>
  );
};

export default InteractiveDiagram;
