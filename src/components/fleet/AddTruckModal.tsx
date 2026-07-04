import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateTruck } from "@/hooks/useTrucks";

const CURRENT_YEAR = new Date().getFullYear();

const truckSchema = z.object({
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
    .regex(
      /^[A-HJ-NPR-Z0-9]+$/i,
      "VIN cannot contain the letters I, O, or Q"
    ),
  license_plate: z.string().min(1, "License plate is required"),
  notes: z.string(),
});

type TruckFormValues = z.infer<typeof truckSchema>;

interface AddTruckModalProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTruckModal({
  companyId,
  open,
  onOpenChange,
}: AddTruckModalProps) {
  const createTruck = useCreateTruck(companyId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TruckFormValues>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      year: CURRENT_YEAR,
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createTruck.mutateAsync({
      ...values,
      vin: values.vin.toUpperCase(),
      company_id: companyId,
    });
    reset();
    onOpenChange(false);
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Truck"
      description="Register a truck under this fleet."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="unit_number" className="form-label">
              Unit number
            </label>
            <input
              id="unit_number"
              type="text"
              className="form-input"
              placeholder="T-104"
              {...register("unit_number")}
            />
            {errors.unit_number && (
              <p className="form-error">{errors.unit_number.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="year" className="form-label">
              Year
            </label>
            <input
              id="year"
              type="number"
              className="form-input"
              {...register("year")}
            />
            {errors.year && (
              <p className="form-error">{errors.year.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="form-label">
              Make
            </label>
            <input
              id="make"
              type="text"
              className="form-input"
              placeholder="Freightliner"
              {...register("make")}
            />
            {errors.make && (
              <p className="form-error">{errors.make.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="model" className="form-label">
              Model
            </label>
            <input
              id="model"
              type="text"
              className="form-input"
              placeholder="Cascadia"
              {...register("model")}
            />
            {errors.model && (
              <p className="form-error">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="vin" className="form-label">
            VIN
          </label>
          <input
            id="vin"
            type="text"
            className="form-input font-mono uppercase"
            placeholder="1FUJGLDR9CSBF1234"
            maxLength={17}
            {...register("vin")}
          />
          {errors.vin && <p className="form-error">{errors.vin.message}</p>}
        </div>

        <div>
          <label htmlFor="license_plate" className="form-label">
            License plate
          </label>
          <input
            id="license_plate"
            type="text"
            className="form-input"
            placeholder="HWT 482"
            {...register("license_plate")}
          />
          {errors.license_plate && (
            <p className="form-error">{errors.license_plate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="form-textarea"
            placeholder="Reefer unit, requires DEF top-off every visit."
            {...register("notes")}
          />
        </div>

        {createTruck.isError && (
          <p className="form-error">
            Could not save the truck. Check your connection and try again.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={createTruck.isPending}>
            Save Truck
          </Button>
        </div>
      </form>
    </Modal>
  );
}
