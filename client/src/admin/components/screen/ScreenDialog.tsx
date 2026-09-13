import { useEffect, useState, type FormEvent } from "react";
import type { Screen } from "../../../interfaces";
import { ScreenStatusEnum, ScreenTypeEnum } from "../../../enums";

interface ScreenDialogProps {
  theaterId: string;
  screen: Screen | null;
  loading: boolean;
  onClose: () => void;
  onCreate: (payload: Screen) => Promise<void>;
  onUpdate: (screenId: string, payload: Screen) => Promise<void>;
}

const emptyScreen = (theaterId: string): Screen => ({
  id: "",
  theaterId,
  name: "",
  capacity: 0,
  description: "",
  type: ScreenTypeEnum.REGULAR,
  status: ScreenStatusEnum.ACTIVE,
});

export function ScreenDialog({
  theaterId,
  screen,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: ScreenDialogProps) {
  const [values, setValues] = useState<Screen>(
    () => screen ?? emptyScreen(theaterId),
  );
  const isEditing = Boolean(screen);

  useEffect(() => {
    setValues(screen ?? emptyScreen(theaterId));
  }, [screen, theaterId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditing && screen) {
      await onUpdate(screen.id, values);
    } else {
      await onCreate(values);
    }

    onClose();
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
        aria-labelledby="screen-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-dialog-header">
          <div>
            <span className="admin-kicker">Screen inventory</span>
            <h3 id="screen-dialog-title">
              {isEditing ? "Edit screen" : "Add screen"}
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
          <label>
            Screen name
            <input
              value={values.name}
              onChange={(event) =>
                setValues({ ...values, name: event.target.value })
              }
              placeholder="Screen 1"
              required
            />
          </label>
          <div className="admin-form-row">
            <label>
              Capacity
              <input
                type="number"
                min="1"
                value={values.capacity || ""}
                onChange={(event) =>
                  setValues({ ...values, capacity: Number(event.target.value) })
                }
                placeholder="120"
                required
              />
            </label>
            <label>
              Screen type
              <select
                value={values.type}
                onChange={(event) =>
                  setValues({
                    ...values,
                    type: event.target.value as ScreenTypeEnum,
                  })
                }
              >
                {Object.values(ScreenTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea
              value={values.description}
              onChange={(event) =>
                setValues({ ...values, description: event.target.value })
              }
              placeholder="Describe this screen"
              rows={3}
            />
          </label>
          <label>
            Status
            <select
              value={values.status}
              onChange={(event) =>
                setValues({
                  ...values,
                  status: event.target.value as ScreenStatusEnum,
                })
              }
            >
              {Object.values(ScreenStatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
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
                  : "Add screen"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
