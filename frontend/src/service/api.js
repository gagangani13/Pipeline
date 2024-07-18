import toast from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_DJANGO_API; // Adjust this based on your Django server URL

export async function getData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers here if needed
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const res=await response.json();
    toast.success(res.message);
  } catch (error) {
    return(error.message || 'Something went wrong');
  }
}
export async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers here if needed
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const res= await response.json();
    toast.success(`Nodes: ${res.num_nodes}, Edges: ${res.num_edges}, DAG: ${res.is_dag}`);
  } catch (error) {
    toast.error(error.message || 'Something went wrong');
  }
}
