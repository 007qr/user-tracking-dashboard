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
import {
    Chart,
    Title,
    Tooltip,
    Colors,
    ChartOptions,
    LinearScale,
    CategoryScale,
    BarElement,
} from "chart.js";
import { Line } from "solid-chartjs";
import { parseFilters } from "./utils/parseFilters";
import {
    getCustomer,
    getEvents,
    getMetric,
    getUniqueVisits,
} from "./utils/endpoints";
import { createStore } from "solid-js/store";
import EventsBarChart from "./EventsBarChar";
import CombinedMetricsDisplay from "./CombinedMetrics";

interface EmailData {
    email: string;
}

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
    const [metricsData] = createResource(getMetric);
    const [customerData] = createResource(getCustomer);
    const [searchParams, setSearchParams] = useSearchParams();

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
        // Chart registration can go here if needed
    });

    return (
        <>
            <div class="max-w-[82rem] p-4 pb-0 m-auto">
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

                        <div class="col-span-6 w-full rounded-lg p-4">
                            <EventsBarChart />
                        </div>
                        
                        {/* Integrated Combined Metrics Component */}
                        <CombinedMetricsDisplay />

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
                    </div>
                </div>
            </div>

            <div class="h-[10vh]"></div>
        </>
    );
};

export default App;