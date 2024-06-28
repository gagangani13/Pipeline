import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import networkx as nx
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: dict
    data: dict

class Edge(BaseModel):
    source: str
    sourceHandle: str
    target: str
    targetHandle: str
    type: str
    animated: bool
    deletable: bool
    style: dict

class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.post("/pipelines/parse")
async def parse_pipeline(data: PipelineData):
    try:
        nodes = [(node.id, {"type": node.type, "position": node.position, "data": node.data}) for node in data.nodes]
        edges = [(edge.source, edge.target, {"type": edge.type, "sourceHandle": edge.sourceHandle, "targetHandle": edge.targetHandle}) for edge in data.edges]
        
        graph = nx.DiGraph()
        graph.add_nodes_from(nodes)
        graph.add_edges_from(edges)

        num_nodes = len(nodes)
        num_edges = len(edges)

        is_dag = nx.is_directed_acyclic_graph(graph)

        return {
            "response": True,
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag,
        }

    except Exception as e:
        logging.error(f"Error in parse_pipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))
