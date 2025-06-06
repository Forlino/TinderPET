import { Map } from "@/components/Map";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return <Map onBack={handleBack} />;
};

export default MapPage;
