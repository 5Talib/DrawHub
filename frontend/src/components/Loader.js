import { BeatLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <BeatLoader color={"#ffffff"} size={20} />
    </div>
  );
};

export default Loader;
