import Navbar from "../ui/Navbar";
import "./page.css";
import Chatbox from "../ui/Chatbox";

function CreateAi() {
  return (
    <>
      <Navbar></Navbar>
      <div className="d-flex justify-content-center align-items-center py-3">
        <Chatbox></Chatbox>
      </div>
    </>
  );
}

export default CreateAi;
