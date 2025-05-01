import { type Component } from "solid-js";

import EventsBarChart from "./EventsBarChar";
import CombinedMetricsDisplay from "./CombinedMetrics";
import SignupDetails from "./SignupDetails";
import Logo from "./logo";

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
            <div class="m-[10px]">
                <Logo size="32" />
            </div>
            <div class="mx-auto w-max mb-[120px] mt-[12px]">
                <h1 class="text-[64px] font-medium leading-[120%] tracking-[-2%]">
                    870
                </h1>
            </div>

            <div class="grid grid-cols-12 items-center gap-[32px] justify-items-center">
                <div class="col-span-6">
                    <div class="w-[580px] h-[404px] bg-white rounded-[24px] p-[12px]">
                        <CombinedMetricsDisplay />
                    </div>
                </div>
                <div class="col-span-6">
                    <div class="w-[580px] h-[404px] bg-white rounded-[24px] p-[12px]">
                        <EventsBarChart />
                    </div>
                </div>

                
            </div>
            <div class="col-span-12 m-[120px]">
                <SignupDetails />
            </div>
            
            
        </>
    );
};

export default App;
