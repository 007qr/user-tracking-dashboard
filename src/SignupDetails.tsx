import { getCustomer } from "./utils/endpoints";
import { createResource } from "solid-js";
import {
    createSolidTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
} from "@tanstack/solid-table";

export default function SignupDetails() {
    const [customerData] = createResource(getCustomer);

    const columnHelper = createColumnHelper<any>();

    const columns = [
        columnHelper.accessor("email", { header: "Email" }),
        columnHelper.accessor("phone", { header: "Phone" }),
        columnHelper.accessor("ad_id", { header: "Ad ID" }),
        columnHelper.accessor("adset_id", { header: "AdSet ID" }),
        columnHelper.accessor("campaign_id", { header: "Campaign ID" }),
        columnHelper.accessor("landing_page_id", { header: "Landing Page ID" }),
    ];

    const table = createSolidTable({
        get data() {
            return customerData()?.data ?? [];
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div class="bg-white w-full h-full rounded-2xl shadow-sm p-6 overflow-auto">

            <div class="border border-gray-200 rounded-xl overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-50 text-gray-700 font-medium">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr>
                                {headerGroup.headers.map(header => (
                                    <th class="px-4 py-3 text-left whitespace-nowrap">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        {table.getRowModel().rows.map(row => (
                            <tr class="hover:bg-gray-50 transition-colors duration-150">
                                {row.getVisibleCells().map(cell => (
                                    <td class="px-4 py-3 text-gray-800 whitespace-nowrap">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {customerData.loading && (
                    <div class="text-center text-gray-500 py-4">
                        Loading customer data...
                    </div>
                )}
            </div>
        </div>
    );
}
