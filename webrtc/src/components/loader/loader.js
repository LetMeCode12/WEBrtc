import load from "../../icons/load.png";
import "../loader/loader.scss";

const Loader = () => {
  return (
    <div className="Loader">
      <img className="Load" src={load} />
    </div>
  );
};

export default Loader;
