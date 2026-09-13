import { useEffect, useState, type FormEvent } from "react";
import type {
  CreateTheaterPayload,
  UpdateTheaterPayload,
} from "../../apis/theater";
import type { Theater } from "../../../interfaces";
import { TheaterFormFields } from "./TheaterFormFields";

interface TheaterFormDialogProps {
  theater: Theater | null;
  loading: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTheaterPayload) => Promise<void>;
  onUpdate: (theaterId: string, payload: UpdateTheaterPayload) => Promise<void>;
}

const emptyTheater: CreateTheaterPayload = {
  name: "",
  description: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  timezone: "Asia/Kolkata",
};

function getValues(theater: Theater | null): CreateTheaterPayload {
  if (!theater) return emptyTheater;

  return {
    name: theater.name,
    description: theater.description ?? "",
    phoneNumber: theater.phoneNumber ?? "",
    addressLine1: theater.addressLine1 ?? "",
    addressLine2: theater.addressLine2 ?? "",
    city: theater.city,
    state: theater.state ?? "",
    country: theater.country ?? "",
    postalCode: theater.postalCode ?? "",
    timezone: theater.timezone ?? "",
  };
}

export function TheaterFormDialog({
  theater,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: TheaterFormDialogProps) {
  const [values, setValues] = useState(() => getValues(theater));
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(theater);

  useEffect(() => {
    setValues(getValues(theater));
    setError(null);
  }, [theater]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payload = {
      ...values,
      description: values.description || undefined,
      addressLine2: values.addressLine2 || undefined,
    };

    try {
      if (theater) {
        await onUpdate(theater.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch {
      setError(
        isEditing ? "Failed to update theater" : "Failed to create theater",
      );
    }
  };

  return (
    <div
      className="admin-dialog-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="admin-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theater-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-dialog-header">
          <div>
            <span className="admin-kicker">Locations</span>
            <h3 id="theater-dialog-title">
              {isEditing ? "Edit theater" : "Add theater"}
            </h3>
          </div>
          <button
            className="admin-dialog-close"
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <form className="admin-form admin-dialog-form" onSubmit={handleSubmit}>
          <TheaterFormFields
            values={values}
            onChange={(field, value) =>
              setValues((current) => ({ ...current, [field]: value }))
            }
          />
          {error && (
            <p className="profile-error" role="alert">
              {error}
            </p>
          )}
          <div className="admin-form-actions">
            <button
              className="admin-secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="admin-primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add theater"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
