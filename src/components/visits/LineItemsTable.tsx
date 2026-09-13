import type { ServiceLineItem } from "@/types/database";
import { formatCurrency, SERVICE_TYPE_LABELS } from "@/utils/format";

interface LineItemsTableProps {
  items: ServiceLineItem[];
}

export function LineItemsTable({ items }: LineItemsTableProps) {
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
    <div className="overflow-x-auto">
      <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Description</th>
          <th className="text-right">Qty</th>
          <th>Unit</th>
          <th className="text-right">Unit Price</th>
          <th className="text-right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="font-medium text-fs-ink-900 whitespace-nowrap">
              {SERVICE_TYPE_LABELS[item.service_type]}
            </td>
            <td className="text-fs-ink-600 max-w-md">{item.description}</td>
            <td className="fs-money text-fs-ink-900">
              {Number(item.quantity)}
            </td>
            <td className="text-fs-ink-600">{item.unit}</td>
            <td className="fs-money text-fs-ink-900">
              {formatCurrency(Number(item.unit_price))}
            </td>
            <td className="fs-money text-fs-ink-900">
              {formatCurrency(Number(item.subtotal))}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-fs-line-200">
          <td colSpan={5} className="text-right text-sm font-medium text-fs-ink-500">
            Total
          </td>
          <td className="fs-money text-base font-semibold text-fs-ink-900">
            {formatCurrency(total)}
          </td>
        </tr>
      </tfoot>
      </table>
    </div>
  );
}
