import {
    type Component,
} from "solid-js";

import EventsBarChart from "./EventsBarChar";
import CombinedMetricsDisplay from "./CombinedMetrics";
import SignupDetails from "./SignupDetails";

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
    // const [metricsData] = createResource(getMetric);

    return (
        <>
            <div class="max-w-[82rem] p-4 pb-0 m-auto">
                <div class="p-4 pb-0 text-[17px]">
                    <div class="grid grid-cols-12 gap-2">
                        <div class="col-span-12 grid grid-cols-12 gap-2 bg-[#181b19] rounded-[24px]">
                            {/* <Show when={!metricsData.loading}>
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
                            </Show> */}
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                            <GridCell number="0" text="Other metric" />
                        </div>

                        {/* Integrated Combined Metrics Component */}
                        <div class="col-span-6 p-[12px] rounded-[24px] w-full bg-white">
                            <CombinedMetricsDisplay />
                        </div>

                        <div class="col-span-6 w-full rounded-[24px] p-[12px] bg-white">
                            <EventsBarChart />
                        </div>

                        <SignupDetails />
                    </div>
                </div>
            </div>

            <div class="h-[10vh]"></div>
        </>
    );
};

export default App;