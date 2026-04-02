import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back" }: { label?: string }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition group mb-6"
    >
      <ArrowLeft
        size={16}
        className="transition-transform group-hover:-translate-x-1"
      />
      <span className="tracking-wide">{label}</span>
    </button>
  );
};

export default BackButton;