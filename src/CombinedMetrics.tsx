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
      <div class="col-span-12 bg-white rounded-lg p-4 flex gap-4 flex-col">
        <div class="flex gap-4">
          <span
            class={`cursor-pointer px-3 py-1 rounded ${
              activeTab() === "ad" ? "bg-sky-100 text-sky-800" : ""
            }`}
            onClick={() => setActiveTab("ad")}
          >
            Ads
          </span>
          <span
            class={`cursor-pointer px-3 py-1 rounded ${
              activeTab() === "adset" ? "bg-sky-100 text-sky-800" : ""
            }`}
            onClick={() => setActiveTab("adset")}
          >
            Adsets
          </span>
          <span
            class={`cursor-pointer px-3 py-1 rounded ${
              activeTab() === "campaign" ? "bg-sky-100 text-sky-800" : ""
            }`}
            onClick={() => setActiveTab("campaign")}
          >
            Campaigns
          </span>
          <span
            class={`cursor-pointer px-3 py-1 rounded ${
              activeTab() === "landing_page" ? "bg-sky-100 text-sky-800" : ""
            }`}
            onClick={() => setActiveTab("landing_page")}
          >
            Landing Pages
          </span>
        </div>
  
        <h4 class="text-lg font-medium">
          {activeTab() === "ad" && "Top Ads"}
          {activeTab() === "adset" && "Top Adsets"}
          {activeTab() === "campaign" && "Top Campaigns"}
          {activeTab() === "landing_page" && "Top Landing Pages"}
        </h4>
  
        <Show when={combinedMetricData.loading}>
          <div class="w-full p-4 text-center text-gray-500">
            Loading metrics data...
          </div>
        </Show>
  
        <Show when={!combinedMetricData.loading && filteredData()?.length === 0}>
          <div class="w-full p-4 text-center text-gray-500">
            No data available for {activeTab()}
          </div>
        </Show>
  
        <Show when={!combinedMetricData.loading && filteredData()!.length > 0}>
          <div
            class="grid p-2 relative self-start font-medium text-xs w-full"
            style="grid-template-columns: repeat(1, 1fr) repeat(5, minmax(12ch, 1fr))"
          >
            <span>
              {activeTab() === "ad" && "Ad ID"}
              {activeTab() === "adset" && "Adset ID"}
              {activeTab() === "campaign" && "Campaign ID"}
              {activeTab() === "landing_page" && "Landing Page ID"}
            </span>
            <span class="text-right">Unique Visitors</span>
            <span class="text-right">Guests</span>
            <span class="text-right">Signups</span>
            <span class="text-right">Guest Only</span>
            <span class="text-right">Visit Only</span>
          </div>
  
          <For each={filteredData()}>
            {(data) => (
              <div
                class="grid p-2 relative self-start text-sm w-full hover:bg-sky-50 transition-colors duration-150"
                style="grid-template-columns: repeat(1, 1fr) repeat(5, minmax(12ch, 1fr))"
              >
                <span class="truncate" title={data.entity_id}>
                  {data.entity_id}
                </span>
                <span class="text-right">{data.unique_visitors}</span>
                <span class="text-right">{data.guests}</span>
                <span class="text-right">{data.signups}</span>
                <span class="text-right">{data.guest_only}</span>
                <span class="text-right">{data.visit_only}</span>
              </div>
            )}
          </For>
        </Show>
      </div>
    );
  };
  
  export default CombinedMetricsDisplay;