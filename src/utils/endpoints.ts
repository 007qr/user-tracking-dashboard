interface ConversionsData {
    guests: number;
    signups: number;
    total_conversions: number;
}

interface Ads extends ConversionsData {
    ad_id: string;
}

interface Adset extends ConversionsData {
    adset_id: string;
}

interface Campaign extends ConversionsData {
    campaign_id: string;
}

interface LandingPage extends ConversionsData {
    landing_page_id: string;
}

interface Customer {
    email: string;
    phone: string;
    adset_id: string;
    landing_page_id: string;
    campaign_id: string;
    ad_id: string;
}

interface Metrics {
    signups: string;
    guests: string;
}

interface Events {
    timestamp: string;
    event_name: string;
    campaign_id: string;
    adset_id: string;
    ad_id: string;
    utm_source: string;
    landing_page_id: string;
    email: string;
    phone: string;
    clicks: string;
}

interface FunnelMetric {
    unique_visitors: number;
    guests: number;
    signups: number;
    visitors_dropoff: number;
    guests_dropoff: number;
}

interface CombinedMetrics {
    entity_type: string;
    entity_id: string;
    total_sessions: string;
    guests_count: string;
    signups_count: string;
    total_conversions: string;
    signup_rate: string;
    guest_rate: string;
    conversion_rate: string;
}

let token = import.meta.env.VITE_TINYBIRD_TOKEN;

async function getTopKAds(): Promise<{ data: Ads[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_k_ad.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getMetric(): Promise<{ data: Metrics[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/metrics.json?limit=1000&token=${token}`
    );
    return await res.json();
}

async function getTopKAdsets(): Promise<{ data: Adset[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_k_adset.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getTopKLandingPage(): Promise<{ data: LandingPage[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_k_landing.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getTopKCampaign(): Promise<{ data: Campaign[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_k_campaign.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getCustomer(): Promise<{ data: Customer[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/users_with_email_and_phone.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getEvents(): Promise<{ data: Events[] }> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/events_all.json?limit=10&token=${token}`
    );
    return await res.json();
}

async function getUniqueVisits(): Promise<{
    data: { date: string; unique_visits: number }[];
}> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/unique_website_visits.json?limit=1000&token=${token}`
    );

    return await res.json();
}

async function getFunnelMetric(): Promise<{
    data: FunnelMetric[];
}> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/funnel_metrics.json?limit=1000&token=${token}`
    );

    return await res.json();
}

async function getCombinedMetric(): Promise<{
    data: CombinedMetrics[];
}> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/performance_metrics.json?campaign_limit=10&adset_limit=10&ad_limit=10&landing_page_limit=10&token=${token}`
    );

    return await res.json();
}

async function getEventsall(): Promise<{data: any[];}> {
    const res = await fetch(
        `https://api.europe-west2.gcp.tinybird.co/v0/pipes/events_all.json?token=${token}`
    );

    return await res.json();
}

export {
    getTopKAds,
    getTopKAdsets,
    getTopKCampaign,
    getTopKLandingPage,
    getCustomer,
    getEvents,
    getMetric,
    getUniqueVisits,
    getFunnelMetric,
    getCombinedMetric,
    getEventsall
};
