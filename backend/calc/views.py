# pipeline_app/views.py
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import networkx as nx
from pydantic import BaseModel
from typing import List, Dict


# Define Pydantic models
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
def welcome(request):
    return JsonResponse({"message": "Welcome to the Pipeline App!"})    

@csrf_exempt
def check_dag(request):
    try:
        if request.method == "POST":
            body = json.loads(request.body)
            data = PipelineData(**body)

            nodes = [(node.id, {"type": node.type, "position": node.position, "data": node.data}) for node in data.nodes]
            edges = [(edge.source, edge.target, {"type": edge.type, "sourceHandle": edge.sourceHandle, "targetHandle": edge.targetHandle}) for edge in data.edges]

            graph = nx.DiGraph()
            graph.add_nodes_from(nodes)
            graph.add_edges_from(edges)

            num_nodes = len(nodes)
            num_edges = len(edges)

            is_dag = nx.is_directed_acyclic_graph(graph)

            return JsonResponse({
                "response": True,
                "num_nodes": num_nodes,
                "num_edges": num_edges,
                "is_dag": is_dag,
            })

    except Exception as e:
        logging.error(f"Error in parse_pipeline: {e}")
        return JsonResponse({"error": str(e)}, status=500)
