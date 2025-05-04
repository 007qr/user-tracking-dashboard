import { createEffect, createResource, Show, type Component } from "solid-js";

import CombinedMetricsDisplay from "./CombinedMetrics";
import SignupDetails from "./SignupDetails";
import Logo from "./logo";
import { getEventsall, getMetric } from "./utils/endpoints";
import parseData from "./utils/parseData";
import FunnelChart from "./EventsBarChart";

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
    const [metricsData] = createResource(getEventsall);

    createEffect(() => {
        if (!metricsData.loading) {
            console.log(metricsData()?.data);
        }
    });

    return (
        <>
            <div class="m-[10px]">
                <Logo size="32" />
            </div>
            <div class="mx-auto w-max mb-[120px] mt-[12px]">
                <h1 class="text-[64px] font-medium leading-[120%] tracking-[-2%]">
                    <Show when={!metricsData.loading}>
                        {parseData(metricsData()?.data).signups}
                    </Show>
                </h1>
            </div>

            <div class="grid grid-cols-12 items-center gap-[32px] justify-items-center">
                <div class="col-span-6">
                    <div class="w-[580px] h-[404px] bg-white rounded-[24px] p-[12px]">
                        <Show when={!metricsData.loading}>
                            <CombinedMetricsDisplay
                                data={parseData(metricsData()?.data)}
                            />
                        </Show>
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="w-[580px] h-[404px] bg-white rounded-[24px] p-[12px]">
                        {/* <FunnelChart /> */}
                    </div>
                </div>
            </div>
            <div class="col-span-12 m-[120px]">
                <Show
                    when={!metricsData.loading}
                    fallback={
                        <div class="text-center text-gray-500 py-4">
                            Loading signups data...
                        </div>
                    }
                >
                    <SignupDetails data={parseData(metricsData()?.data)} />
                </Show>
            </div>
        </>
    );
};

export default App;
