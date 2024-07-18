// submit

import { shallow } from 'zustand/shallow';
import { useStore } from '../../store/store';
import { CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { useState } from 'react';
import { postData } from '../../service/api'

export const SubmitComponent = () => {
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
    await postData('check_dag', { nodes, edges });
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
