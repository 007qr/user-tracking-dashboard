import {
    Accessor,
    createEffect,
    createResource,
    createSignal,
    For,
    Index,
    onMount,
    Show,
    type Component,
} from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Chart, Title, Tooltip, Colors, ChartOptions } from "chart.js";
import { Line } from "solid-chartjs";
import { parseFilters } from "./utils/parseFilters";
import {
    getCustomer,
    getEvents,
    getMetric,
    getTopKAds,
    getTopKAdsets,
    getTopKCampaign,
    getTopKLandingPage,
} from "./utils/endpoints";
import { createStore } from "solid-js/store";

interface EmailData {
    email: string;
}

type Tabs = "campaign" | "ads" | "adsets" | "landing_page";

function GridCell({ number, text }: { number: string; text: string }) {
    return (
        <div class="col-span-2 text-white">
            <div class="hover:bg-[#242925] transition-[background] duration-200 cursor-pointer p-2">
                <p class="text-5xl font-light">{number}</p>
                <p class="text-[.85rem]">{text}</p>
            </div>
        </div>
    );
}

const App: Component = () => {
    const [eventsData] = createResource(getEvents);
    const [adData] = createResource(getTopKAds);
    const [adSetData] = createResource(getTopKAdsets);
    const [campaignData] = createResource(getTopKCampaign);
    const [metricsData] = createResource(getMetric);
    const [landingPageData] = createResource(getTopKLandingPage);
    const [customerData] = createResource(getCustomer);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [activeTab, setActiveTab] = createSignal<Tabs>("campaign");

    const [emailData, setEmailData] = createSignal<EmailData[]>([]);

    const [step3Aggregate, setStep3Aggregate] = createStore({
        guests: 0,
        signups: 0,
        clicks: 0,
    });

    const [step1Aggregate, setStep1Aggregate] = createStore({ clicks: 0 });

    const [step2Aggregate, setStep2Aggregate] = createStore({
        guests: 0,
        clicks: 0,
    });

    createEffect(() => {
        if (!eventsData.loading) {
            // Step1 Data aggregate
            let customers = eventsData()?.data.filter(
                (val) => val.email === null && val.phone === null
            );

            let clicks = 0;
            customers?.map((val) => {
                clicks = parseInt(val.clicks) + clicks;
            });
            setStep1Aggregate({ clicks: clicks });

            // Step2 Data aggregate
            let guests = eventsData()?.data.filter(
                (val) => val.email !== null && val.phone === null
            );
            clicks = 0;

            guests?.map((val) => {
                clicks = parseInt(val.clicks) + clicks;
            });

            setStep2Aggregate({ guests: guests?.length, clicks: clicks });

            // Step3 Data aggregate

            let signups = eventsData()?.data.filter(
                (val) => val.email !== null && val.phone !== null
            );

            clicks = 0;
            signups?.map((v) => {
                clicks = clicks + parseInt(v.clicks);
            });

            setStep3Aggregate({
                guests: 0,
                signups: signups?.length,
                clicks: clicks,
            });

            console.log(step1Aggregate, step2Aggregate, step3Aggregate);
        }
    });

    onMount(() => {
        Chart.register(Title, Tooltip, Colors);
    });

    createEffect(() => {
        console.log(eventsData()?.data);
    }, [eventsData.loading]);

    // const filteredData = () => {
    //   const currentFilters = filters();
    //   if (!currentFilters.length || !data()) return data()?.data ?? [];

    //   return data()!.data.filter((item) => {
    //     return currentFilters.every((filter) => {
    //       switch (filter.property) {
    //         case "Campaign":
    //           return item.campaign_id === filter.value;
    //         case "Source":
    //           return item.utm_source === filter.value;
    //         case "Content":
    //           return item.ad_id === filter.value;
    //         case "Term":
    //           return item.adset_id === filter.value;
    //         default:
    //           return true;
    //       }
    //     });
    //   });
    // };

    const chartData = {
        labels: ["Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27"],
        datasets: [
            {
                label: "Sales",
                data: [0, 0, 6, 135, 3],
            },
        ],
    };

    const chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <>
            <div class="max-w-[82rem] p-4 pb-0 m-auto">
                {/* <Show when={filters().length}>
          <div class="flex flex-wrap gap-2 mb-4">
            <For each={filters()}>
              {(filter, index) => (
                <div class="flex items-center bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                  <span class="mr-2">
                    {filter.property} {filter.operator} {filter.value}
                  </span>
                  <button
                    class="hover:bg-sky-200 rounded-full p-1"
                    onClick={(e) => {
                      e.stopPropagation();

                      const filterToRemove = filters()[index()];

                      const currentParams = new URLSearchParams(
                        window.location.search
                      );

                      const updatedParams = new URLSearchParams();

                      for (const [key, value] of currentParams.entries()) {
                        if (
                          !key.startsWith(`filters[${index()}]`) &&
                          !key.includes(`[${filterToRemove.property}]`)
                        ) {
                          updatedParams.append(key, value);
                        }
                      }

                      const remainingFilters = filters().filter(
                        (_, i) => i !== index()
                      );

                      setFilters(remainingFilters);

                      if (remainingFilters.length === 0) {
                        window.history.pushState(
                          {},
                          "",
                          window.location.pathname
                        );
                        setSearchParams({});
                        setEmailData([]);
                      } else {
                        const newSearchParams: Record<string, string> = {};

                        remainingFilters.forEach((f, idx) => {
                          newSearchParams[`filters[${idx}][operator]`] =
                            f.operator;
                          newSearchParams[`filters[${idx}][value]`] = f.value;
                          newSearchParams[`filters[${idx}][property]`] =
                            f.property;
                        });

                        setSearchParams(newSearchParams);
                        fetchEmailsBasedOnFilters(remainingFilters);
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </For>
          </div>
        </Show> */}

                <div class="p-4 pb-0 text-lg">
                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-12 grid grid-cols-12 gap-2 bg-[#181b19] rounded-lg">
                            <Show when={!metricsData.loading}>
                                <GridCell
                                    number={
                                        metricsData()?.data[0].guests || "0"
                                    }
                                    text="Guests"
                                />
                                <GridCell
                                    number={
                                        metricsData()?.data[0].signups || "0"
                                    }
                                    text="Signups"
                                />
                            </Show>
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                        </div>

                        {/* <div class="col-span-12 p-4 rounded-lg bg-white">
              <Line data={chartData} options={chartOptions} />
            </div> */}

                        {/* Email Data Section */}
                        <Show when={emailData().length > 0}>
                            <div class="col-span-12 bg-white rounded-lg text-xs p-4">
                                <h3 class="text-lg font-medium mb-3">
                                    Registered Emails ({emailData().length})
                                </h3>
                                <div class="max-h-64 overflow-y-auto">
                                    <For each={emailData()}>
                                        {(item) => (
                                            <div class="p-2 border-b border-gray-100">
                                                {item.email}
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </Show>

                        <div class="col-span-6 bg-white rounded-lg text-xs p-4">
                            <h4 class="text-lg font-medium">Events</h4>
                            <div class="grid p-2 relative self-start font-medium grid-cols-4">
                                <div>Events</div>
                                <div class="text-right">Guests</div>
                                <div class="text-right">Signups</div>
                                <div class="text-right">Completions</div>
                            </div>

                            <Show when={!eventsData.loading}>
                                <div class="grid p-2 text-[.95rem] items-center mb-0.5 grid-cols-4">
                                    <div class="self-start">Step 1</div>
                                    <div class="text-right">0</div>
                                    <div class="text-right">0</div>
                                    <div class="text-right">
                                        {step1Aggregate.clicks}
                                    </div>
                                </div>

                                <div class="grid p-2 text-[.95rem] items-center mb-0.5 grid-cols-4">
                                    <div class="self-start">Step 2</div>
                                    <div class="text-right">
                                        {step2Aggregate.guests}
                                    </div>
                                    <div class="text-right">0</div>
                                    <div class="text-right">
                                        {step2Aggregate.clicks}
                                    </div>
                                </div>

                                <div class="grid p-2 text-[.95rem] items-center mb-0.5 grid-cols-4">
                                    <div class="self-start">Step 3</div>
                                    <div class="text-right">
                                        {step3Aggregate.guests}
                                    </div>
                                    <div class="text-right">
                                        {step3Aggregate.signups}
                                    </div>
                                    <div class="text-right">
                                        {step3Aggregate.clicks}
                                    </div>
                                </div>
                            </Show>
                        </div>

                        <div class="col-span-6 bg-white rounded-lg p-4 flex gap-4 flex-col">
                            <div class="flex gap-4">
                                <span
                                    class="cursor-pointer"
                                    on:click={() => {
                                        setActiveTab("ads");
                                    }}
                                >
                                    Ads
                                </span>
                                <span
                                    class="cursor-pointer"
                                    on:click={() => {
                                        setActiveTab("adsets");
                                    }}
                                >
                                    Adsets
                                </span>
                                <span
                                    class="cursor-pointer"
                                    on:click={() => {
                                        setActiveTab("campaign");
                                    }}
                                >
                                    Campaigns
                                </span>
                                <span
                                    class="cursor-pointer"
                                    on:click={() => {
                                        setActiveTab("landing_page");
                                    }}
                                >
                                    Landing Pages
                                </span>
                            </div>

                            <Show when={activeTab() === "ads"}>
                                <h4 class="text-lg font-medium">Top Ads</h4>
                                <div class="grid p-2 relative self-start font-medium text-xs grid-cols-4 w-full">
                                    <span>Ad id</span>
                                    <span>Guests</span>
                                    <span>Signups</span>
                                    <span>Total Conversions</span>
                                </div>

                                <Show when={!adData.loading}>
                                    <Index each={adData()?.data}>
                                        {(data) => (
                                            <div class="grid p-2 relative self-start font-medium text-sm grid-cols-4 w-full">
                                                <span>{data().ad_id}</span>
                                                <span>{data().guests}</span>
                                                <span>{data().signups}</span>
                                                <span>
                                                    {data().total_conversions}
                                                </span>
                                            </div>
                                        )}
                                    </Index>
                                </Show>
                            </Show>

                            <Show when={activeTab() === "adsets"}>
                                <h4 class="text-lg font-medium">Top Adset</h4>
                                <div class="grid p-2 relative self-start font-medium text-xs grid-cols-4 w-full">
                                    <span>Adset id</span>
                                    <span>Guests</span>
                                    <span>Signups</span>
                                    <span>Total Conversions</span>
                                </div>

                                <Show when={!adSetData.loading}>
                                    <Index each={adSetData()?.data}>
                                        {(data) => (
                                            <div class="grid p-2 relative self-start font-medium text-sm grid-cols-4 w-full">
                                                <span>{data().adset_id}</span>
                                                <span>{data().guests}</span>
                                                <span>{data().signups}</span>
                                                <span>
                                                    {data().total_conversions}
                                                </span>
                                            </div>
                                        )}
                                    </Index>
                                </Show>
                            </Show>

                            <Show when={activeTab() === "campaign"}>
                                <h4 class="text-lg font-medium">
                                    Top Campaigns
                                </h4>
                                <div
                                    class="grid p-2 relative self-start font-medium text-xs w-full"
                                    style="grid-template-columns: repeat(1, 1fr) repeat(3, 12ch)"
                                >
                                    <span>Campaign Id</span>
                                    <span>Guests</span>
                                    <span>Signups</span>
                                    <span>Total Conversions</span>
                                </div>

                                <Show when={!campaignData.loading}>
                                    <Index each={campaignData()?.data}>
                                        {(data) => (
                                            <div
                                                class="grid p-2 relative self-start font-medium text-sm w-full"
                                                style="grid-template-columns: repeat(1, 1fr) repeat(3, 12ch)"
                                            >
                                                <span>
                                                    {data().campaign_id}
                                                </span>
                                                <span>{data().guests}</span>
                                                <span>{data().signups}</span>
                                                <span>
                                                    {data().total_conversions}
                                                </span>
                                            </div>
                                        )}
                                    </Index>
                                </Show>
                            </Show>

                            <Show when={activeTab() === "landing_page"}>
                                <h4 class="text-lg font-medium">
                                    Top Landing Pages
                                </h4>
                                <div
                                    class="grid p-2 relative self-start font-medium text-xs w-full"
                                    style="grid-template-columns: repeat(1, 1fr) repeat(3, 12ch)"
                                >
                                    <span>Landing Id</span>
                                    <span>Guests</span>
                                    <span>Signups</span>
                                    <span>Total Conversions</span>
                                </div>

                                <Show when={!landingPageData.loading}>
                                    <Index each={landingPageData()?.data}>
                                        {(data) => (
                                            <div
                                                class="grid p-2 relative self-start font-medium text-sm w-full"
                                                style="grid-template-columns: repeat(1, 1fr) repeat(3, 12ch)"
                                            >
                                                <span>
                                                    {data().landing_page_id}
                                                </span>
                                                <span>{data().guests}</span>
                                                <span>{data().signups}</span>
                                                <span>
                                                    {data().total_conversions}
                                                </span>
                                            </div>
                                        )}
                                    </Index>
                                </Show>
                            </Show>
                        </div>
                        <div class="col-span-12 bg-white rounded-lg p-4">
                            <h4 class="text-lg font-medium">Signup Details</h4>
                            <div class="grid p-2 relative self-start font-medium text-xs grid-cols-6">
                                <span>Email</span>
                                <span>Phone</span>
                                <span>Ad ID</span>
                                <span>AdSet ID</span>
                                <span>Campaign ID</span>
                                <span>Landing Page ID</span>
                            </div>

                            <Show when={!customerData.loading}>
                                <Index each={customerData()?.data}>
                                    {(data) => (
                                        <div class="grid p-2 relative self-start font-medium text-sm grid-cols-6">
                                            <span>{data().email}</span>
                                            <span>{data().phone}</span>
                                            <span>{data().ad_id}</span>
                                            <span>{data().adset_id}</span>
                                            <span>{data().campaign_id}</span>
                                            <span>
                                                {data().landing_page_id}
                                            </span>
                                        </div>
                                    )}
                                </Index>
                            </Show>
                        </div>

                        {/* <div class="col-span-12 bg-white rounded-lg grid self-start">
              <div
                class="text-xs font-medium self-start grid items-center"
                style="grid-template-columns: repeat(1, 1fr) repeat(2, 12ch)"
              >
                <div>
                  {["campaign", "source", "medium", "content", "term"].map(
                    (tab) => (
                      <button
                        class="inline-block m-2 hover:bg-sky-100 p-2 rounded-lg"
                        classList={{ "bg-sky-200": activeTab() === tab }}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    )
                  )}
                </div>
                <div class="text-right p-2 text-xs"></div>
                <div class="text-right p-2"></div>
              </div>

              <Show when={data()}>
                <div class="p-2">
                  <Index each={filteredData()}>
                    {(item: Accessor<AdDataAggreagate>) => (
                      <div
                        class="p-2 m-3 bg-amber-100 rounded-lg cursor-pointer text-sm font-medium"
                        onClick={() => {
                          switch (activeTab()) {
                            case "campaign":
                              applyFilter("Campaign", item().campaign_id);
                              break;
                            case "source":
                              applyFilter("Source", item().utm_source ?? "");
                              break;
                            case "content":
                              applyFilter("Content", item().ad_id ?? "");
                              break;
                            case "term":
                              applyFilter("Term", item().adset_id ?? "");
                              break;
                          }
                        }}
                      >
                        <span>
                          {activeTab() === "campaign" && item().campaign_id}
                          {activeTab() === "source" && item().utm_source}
                          {activeTab() === "content" && item().ad_id}
                          {activeTab() === "term" && item().adset_id}
                        </span>
                      </div>
                    )}
                  </Index>
                </div>
              </Show>
            </div> */}
                    </div>
                </div>
            </div>

            <div class="h-[10vh]"></div>
        </>
    );
};

export default App;
