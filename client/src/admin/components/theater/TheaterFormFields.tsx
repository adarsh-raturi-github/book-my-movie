import type { ChangeEvent } from "react";
import type { CreateTheaterPayload } from "../../apis/theater";

interface TheaterFormFieldsProps {
  values: CreateTheaterPayload;
  onChange: (field: keyof CreateTheaterPayload, value: string) => void;
}

export function TheaterFormFields({
  values,
  onChange,
}: TheaterFormFieldsProps) {
  const field = (name: keyof CreateTheaterPayload) => ({
    name,
    value: values[name] ?? "",
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, event.target.value),
  });

  return (
    <>
      <label>
        Theater name
        <input
          {...field("name")}
          placeholder="e.g. PVR Cinemas Saket"
          required
        />
      </label>
      <label>
        Description
        <textarea
          {...field("description")}
          placeholder="Premium multiplex with IMAX and Dolby Atmos screens."
          rows={3}
        />
      </label>
      <div className="admin-form-row">
        <label>
          Phone number
          <input
            {...field("phoneNumber")}
            placeholder="+919876543210"
            required
          />
        </label>
        <label>
          Timezone
          <input {...field("timezone")} placeholder="Asia/Kolkata" required />
        </label>
      </div>
      <label>
        Address line 1
        <input
          {...field("addressLine1")}
          placeholder="Select Citywalk Mall"
          required
        />
      </label>
      <label>
        Address line 2
        <input
          {...field("addressLine2")}
          placeholder="District Centre, Saket"
        />
      </label>
      <div className="admin-form-row">
        <label>
          City
          <input {...field("city")} placeholder="New Delhi" required />
        </label>
        <label>
          State
          <input {...field("state")} placeholder="Delhi" required />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Country
          <input {...field("country")} placeholder="India" required />
        </label>
        <label>
          Postal code
          <input {...field("postalCode")} placeholder="110017" required />
        </label>
      </div>
    </>
  );
}
