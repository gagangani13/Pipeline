
import { Toaster } from "react-hot-toast";
import { ToolbarComponent } from "./components/Toolbar/ToolbarComponent";
import { PipelineComponent } from "./components/Pipeline/PipelineComponent";
import { SubmitComponent } from "./components/Submit/SubmitComponent";
import { useEffect, useRef } from "react";
import { getData } from "./service/api";
function App() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      getData('welcome');
    }
  }, []);
  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={true} />
      <ToolbarComponent />
      <PipelineComponent />
      <SubmitComponent />
    </div>
  );
}

export default App;
