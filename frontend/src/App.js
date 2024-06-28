import { PipelineToolbar } from "./pipeline/toolbar/toolbar";
import { PipelineUI } from "./pipeline/ui/ui";
import { SubmitButton } from "./pipeline/submit";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={true} />
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
