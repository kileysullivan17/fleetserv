import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { useUpdateTruck } from "@/hooks/useTruck";
import type { Truck } from "@/types/database";

const CURRENT_YEAR = new Date().getFullYear();

const truckEditSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .int("Year must be a whole number")
    .min(1980, "Year must be 1980 or later")
    .max(CURRENT_YEAR + 1, `Year cannot be past ${CURRENT_YEAR + 1}`),
  vin: z
    .string()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]+$/i, "VIN cannot contain the letters I, O, or Q"),
  license_plate: z.string().min(1, "License plate is required"),
  notes: z.string(),
});

type TruckEditValues = z.infer<typeof truckEditSchema>;

interface TruckEditFormProps {
  truck: Truck;
  onDone: () => void;
}

export function TruckEditForm({ truck, onDone }: TruckEditFormProps) {
  const updateTruck = useUpdateTruck(truck.id, truck.company_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TruckEditValues>({
    resolver: zodResolver(truckEditSchema),
    defaultValues: {
      unit_number: truck.unit_number,
      make: truck.make,
      model: truck.model,
      year: truck.year,
      vin: truck.vin,
      license_plate: truck.license_plate,
      notes: truck.notes,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await updateTruck.mutateAsync({
      ...values,
      vin: values.vin.toUpperCase(),
    });
    onDone();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit_unit_number" className="form-label">
            Unit number
          </label>
          <input
            id="edit_unit_number"
            type="text"
            className="form-input"
            {...register("unit_number")}
          />
          {errors.unit_number && (
            <p className="form-error">{errors.unit_number.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="edit_year" className="form-label">
            Year
          </label>
          <input
            id="edit_year"
            type="number"
            className="form-input"
            {...register("year")}
          />
          {errors.year && <p className="form-error">{errors.year.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit_make" className="form-label">
            Make
          </label>
          <input
            id="edit_make"
            type="text"
            className="form-input"
            {...register("make")}
          />
          {errors.make && <p className="form-error">{errors.make.message}</p>}
        </div>
        <div>
          <label htmlFor="edit_model" className="form-label">
            Model
          </label>
          <input
            id="edit_model"
            type="text"
            className="form-input"
            {...register("model")}
          />
          {errors.model && (
            <p className="form-error">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="edit_vin" className="form-label">
          VIN
        </label>
        <input
          id="edit_vin"
          type="text"
          className="form-input font-mono uppercase"
          maxLength={17}
          {...register("vin")}
        />
        {errors.vin && <p className="form-error">{errors.vin.message}</p>}
      </div>

      <div>
        <label htmlFor="edit_license_plate" className="form-label">
          License plate
        </label>
        <input
          id="edit_license_plate"
          type="text"
          className="form-input"
          {...register("license_plate")}
        />
        {errors.license_plate && (
          <p className="form-error">{errors.license_plate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="edit_notes" className="form-label">
          Notes
        </label>
        <textarea
          id="edit_notes"
          rows={3}
          className="form-textarea"
          {...register("notes")}
        />
      </div>

      {updateTruck.isError && (
        <p className="form-error">
          Could not save changes. Check your connection and try again.
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={updateTruck.isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
