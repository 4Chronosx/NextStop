import Navbar from "../../ui/Navbar";
import "./page.css";
import Chatbox from "../../ui/Chatbox";

function CreateAi() {
  return (
    <>
      <Navbar></Navbar>
      <div className="ai-container">
        <Chatbox></Chatbox>
      </div>
    </>
  );
}

export default CreateAi;
