import { useParams } from "react-router-dom";
import { useTheater } from "../../hooks/useTheater";
import { TheaterDetails } from "../../components/theater/TheaterDetails";

export function TheaterDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { theaters, loading, error, addTheater, editTheater, removeTheater } =
    useTheater();
  console.log("id");

  const theater = theaters.find((theater) => theater.id === id);
  console.log(theater);
  return (
    <div>
      <TheaterDetails
        theater={theater!}
        onEdit={() => {}}
        onDelete={() => {}}
      ></TheaterDetails>
    </div>
  );
}
