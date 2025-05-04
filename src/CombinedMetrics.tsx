import { createSignal, For, Show } from "solid-js";

type Tabs = "campaign" | "ad" | "adset" | "landing_page";

const CombinedMetricsDisplay = ({ data }: { data: any }) => {
    const [activeTab, setActiveTab] = createSignal<Tabs>("campaign");

    const filteredData = () => {
        console.log(
            Object.entries(data).filter((vl) => vl[0] == activeTab())[0]
        );
        return Object.entries(data).filter((vl) => vl[0] == activeTab())[0];
    };

    return (
        <div class="w-full h-full flex flex-col">
            {/* Tabs */}
            <div class="flex gap-2 mb-4 font-medium text-[13px] tracking-[0px]">
                <span
                    class={`cursor-pointer px-4 py-2 rounded-full ${
                        activeTab() === "campaign"
                            ? "bg-gray-100 text-black"
                            : "text-black/80"
                    }`}
                    onClick={() => setActiveTab("campaign")}
                >
                    Campaigns
                </span>
                <span
                    class={`cursor-pointer px-4 py-2 rounded-full ${
                        activeTab() === "adset"
                            ? "bg-gray-100 text-black"
                            : "text-black/80"
                    }`}
                    onClick={() => setActiveTab("adset")}
                >
                    Ad Sets
                </span>
                <span
                    class={`cursor-pointer px-4 py-2 rounded-full ${
                        activeTab() === "ad"
                            ? "bg-gray-100 text-black"
                            : "text-black/80"
                    }`}
                    onClick={() => setActiveTab("ad")}
                >
                    Ads
                </span>
                <span
                    class={`cursor-pointer px-4 py-2 rounded-full ${
                        activeTab() === "landing_page"
                            ? "bg-gray-100 text-black"
                            : "text-black/80"
                    }`}
                    onClick={() => setActiveTab("landing_page")}
                >
                    Landing Pages
                </span>
            </div>

            {/* No data state */}
            <Show when={filteredData()[0].length === 0}>
                <div class="w-full p-4 text-center text-gray-500">
                    No data available for {activeTab()}
                </div>
            </Show>

            {/* Data table */}
            <Show when={filteredData()!.length > 0}>
                {/* Header row */}
                <div class="grid grid-cols-4 text-sm font-semibold text-black pb-1 px-2 text-[12px]">
                    <div class="border border-r-0 border-l-0 border-[#1D1D1F14] py-2 w-[50%]">
                        ID
                    </div>
                    <div></div>
                    <div class="text-right border border-r-0 border-l-0 border-[#1D1D1F14] py-2">
                        Guests
                    </div>
                    <div class="text-right border border-r-0 border-l-0 border-[#1D1D1F14] py-2">
                        Signups
                    </div>
                </div>

                {/* Data rows */}
                <div class="flex flex-col divide-y divide-gray-100 text-sm text-gray-700 overflow-y-auto text-[12px]">
                    <For each={filteredData()[1]}>
                        {(el) => (
                            <div class="grid grid-cols-4 py-2 px-2 hover:bg-gray-50 transition-colors duration-150">
                                <div
                                    class="truncate"
                                    title={el[Object.keys(el)[0]]}
                                >
                                    {el[Object.keys(el)[0]]}
                                </div>
                                <div></div>
                                <div class="text-right">{el.guests}</div>
                                <div class="text-right">{el.signups}</div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
};

export default CombinedMetricsDisplay;
