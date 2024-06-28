// submit

import { shallow } from 'zustand/shallow';
import { useStore } from "./store";
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { useState } from 'react';

export const SubmitButton = () => {
  const [loading, setLoading] = useState(false);
    const selector = (state) => ({
        nodes: state.nodes,
        edges: state.edges,
    })
    let {
        nodes,
        edges
      } = useStore(selector, shallow);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges })
      });
      const data = await res.json();
      if (!data.response) {
        throw new Error(data.detail)
      }
      toast.success(`Nodes: ${data.num_nodes}, Edges: ${data.num_edges}, DAG: ${data.is_dag}`);
  
    } catch (error) {
        let msg=error.message||'Something went wrong';
        toast.error(msg)
    }
    setLoading(false);
  };
  return (
      <div className="d-flex justify-content-center align-items-center">
        <button className="submit_btn" type="submit" onClick={handleSubmit}>
          Submit
        </button>
        {loading && (
          <CircularProgress
            size={120}
            sx={{
              color: green[500],
              position: 'absolute',
              margin:'auto'
            }}
          />
        )}
      </div>
  );
};
