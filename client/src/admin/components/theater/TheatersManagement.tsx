import { useMemo, useState } from "react";
import type { Theater } from "../../../interfaces";
import type {
  CreateTheaterPayload,
  UpdateTheaterPayload,
} from "../../apis/theater";
import { useTheater } from "../../hooks/useTheater";
import { TheaterDetails } from "./TheaterDetails";
import { TheaterFormDialog } from "./TheaterFormDialog";
import { TheaterList } from "./TheaterList";

export function TheatersManagement() {
  const { theaters, loading, error, addTheater, editTheater, removeTheater } =
    useTheater();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [dialogTheater, setDialogTheater] = useState<
    Theater | null | undefined
  >(undefined);

  const locations = useMemo(
    () => Array.from(new Set(theaters.map((theater) => theater.city))).sort(),
    [theaters],
  );

  const filteredTheaters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return theaters.filter((theater) => {
      const matchesLocation =
        selectedLocation === "all" || theater.city === selectedLocation;
      const matchesQuery =
        !query ||
        [theater.name, theater.city, theater.state, theater.phoneNumber]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));

      return matchesLocation && matchesQuery;
    });
  }, [searchQuery, selectedLocation, theaters]);

  const handleCreate = async (payload: CreateTheaterPayload) => {
    await addTheater(payload);
  };

  const handleUpdate = async (
    theaterId: string,
    payload: UpdateTheaterPayload,
  ) => {
    await editTheater(theaterId, payload);
    setSelectedTheater((current) =>
      current?.id === theaterId ? { ...current, ...payload } : current,
    );
  };

  const handleDelete = async (theater: Theater) => {
    if (!window.confirm(`Delete ${theater.name}?`)) return;

    await removeTheater(theater.id);
    setSelectedTheater((current) =>
      current?.id === theater.id ? null : current,
    );
  };

  return (
    <section className="admin-content-section theater-page">
      <div className="theater-page-header">
        <div>
          <span className="admin-kicker">Locations</span>
          <h2>Theaters</h2>
          <p>Manage your cinema locations and their screens.</p>
        </div>
        <button
          className="admin-primary-button theater-add-button"
          type="button"
          onClick={() => setDialogTheater(null)}
        >
          <span>＋</span> Add Theater
        </button>
      </div>

      <div className="theater-toolbar">
        <label className="theater-search">
          <span aria-hidden="true">⌕</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search theaters..."
            aria-label="Search theaters"
          />
        </label>
        <label className="theater-location-filter">
          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            aria-label="Filter by location"
          >
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="profile-error" role="alert">
          {error}
        </p>
      )}

      <TheaterList
        theaters={filteredTheaters}
        loading={loading}
        onSelect={setSelectedTheater}
        onEdit={(theater) => setDialogTheater(theater)}
        onDelete={handleDelete}
      />

      {selectedTheater && (
        <TheaterDetails
          theater={selectedTheater}
          onEdit={() => setDialogTheater(selectedTheater)}
          onDelete={() => handleDelete(selectedTheater)}
        />
      )}

      {dialogTheater !== undefined && (
        <TheaterFormDialog
          theater={dialogTheater}
          loading={loading}
          onClose={() => setDialogTheater(undefined)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </section>
  );
}
