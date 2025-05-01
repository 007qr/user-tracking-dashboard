import {
  createResource,
  createSignal,
  For,
  Show,
  type Component,
} from "solid-js";
import { getCombinedMetric } from "./utils/endpoints";

type Tabs = "campaign" | "ad" | "adset" | "landing_page";

const CombinedMetricsDisplay: Component = () => {
  const [combinedMetricData] = createResource(getCombinedMetric);
  const [activeTab, setActiveTab] = createSignal<Tabs>("campaign");

  const filteredData = () => {
      if (!combinedMetricData() || combinedMetricData.loading) return [];
      return combinedMetricData()?.data.filter(
          (item) => item.entity_type === activeTab()
      );
  };

  return (
      <div class="w-[580px] h-[404px] flex flex-col leading-[12px]">
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

          {/* Loading state */}
          <Show when={combinedMetricData.loading}>
              <div class="w-full p-4 text-center text-gray-500">
                  Loading metrics data...
              </div>
          </Show>

          {/* No data state */}
          <Show
              when={
                  !combinedMetricData.loading && filteredData()?.length === 0
              }
          >
              <div class="w-full p-4 text-center text-gray-500">
                  No data available for {activeTab()}
              </div>
          </Show>

          {/* Data table */}
          <Show when={!combinedMetricData.loading && filteredData()!.length > 0}>
              {/* Header row */}
              <div class="grid grid-cols-4 text-sm font-semibold text-black pb-1 px-2 text-[12px]">
                  <div class="border border-r-0 border-l-0 border-[#1D1D1F14] py-2 w-[50%]">
                      ID
                  </div>
                  <div></div>
                  <div class="text-right border border-r-0 border-l-0 border-[#1D1D1F14] py-2">Guests</div>
                  <div class="text-right border border-r-0 border-l-0 border-[#1D1D1F14] py-2">Signups</div>
              </div>

              {/* Data rows */}
              <div class="flex flex-col divide-y divide-gray-100 text-sm text-gray-700 overflow-y-auto text-[12px]">
                  <For each={filteredData()}>
                      {(data) => (
                          <div class="grid grid-cols-4 py-2 px-2 hover:bg-gray-50 transition-colors duration-150">
                              <div class="truncate" title={data.entity_id}>
                                  {data.entity_id}
                              </div>
                              <div></div>
                              <div class="text-right">{data.guests_count}</div>
                              <div class="text-right">{data.signups_count}</div>
                          </div>
                      )}
                  </For>
              </div>
          </Show>
      </div>
  );
};

export default CombinedMetricsDisplay;
