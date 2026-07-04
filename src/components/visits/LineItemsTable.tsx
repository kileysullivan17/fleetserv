import type { ServiceLineItem } from "@/types/database";
import { formatCurrency, SERVICE_TYPE_LABELS } from "@/utils/format";

interface LineItemsTableProps {
  items: ServiceLineItem[];
}

export function LineItemsTable({ items }: LineItemsTableProps) {
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
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
            <td className="font-medium text-brand-navy whitespace-nowrap">
              {SERVICE_TYPE_LABELS[item.service_type]}
            </td>
            <td className="text-gray-600 max-w-md">{item.description}</td>
            <td className="text-right font-mono text-gray-700">
              {Number(item.quantity)}
            </td>
            <td className="text-gray-600">{item.unit}</td>
            <td className="text-right font-mono text-gray-700">
              {formatCurrency(Number(item.unit_price))}
            </td>
            <td className="text-right font-mono text-gray-700">
              {formatCurrency(Number(item.subtotal))}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-brand-sand-dark">
          <td colSpan={5} className="text-right text-sm font-medium text-gray-500">
            Total
          </td>
          <td className="text-right font-mono text-base font-semibold text-brand-navy">
            {formatCurrency(total)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
