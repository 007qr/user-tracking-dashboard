export default function parseData(data: any) {
    // Separate events by type
    const emailEvents = data.filter((event) => event.name === "email-entered");
    const phoneEvents = data.filter((event) => event.name === "phone-entered");

    // Create maps to store user information
    const userEmails = new Map(); // Map of user_id -> email
    const userPhones = new Map(); // Map of user_id -> phone
    const userMetadata = new Map(); // Map of user_id -> campaign attributes

    // Extract emails and corresponding user IDs
    emailEvents.forEach((event) => {
        const emailIndex = event.meta_key.indexOf("email");
        if (
            emailIndex >= 0 &&
            event.meta_value[emailIndex] &&
            event.meta_value[emailIndex].trim() !== ""
        ) {
            const userId = event.user_id;
            const email = event.meta_value[emailIndex].trim();
            userEmails.set(userId, email);

            // Store campaign attributes
            userMetadata.set(userId, {
                campaign_id: event.campaign_id || "",
                adset_id: event.adset_id || "",
                ad_id: event.ad_id || "",
                utm_source: event.utm_source || "",
                landing_page_id: event.landing_page_id || "",
            });
        }
    });

    // Extract phones and corresponding user IDs
    phoneEvents.forEach((event) => {
        const phoneIndex = event.meta_key.indexOf("phone");
        if (
            phoneIndex >= 0 &&
            event.meta_value[phoneIndex] &&
            event.meta_value[phoneIndex].trim() !== ""
        ) {
            const userId = event.user_id;
            const phone = event.meta_value[phoneIndex].trim();
            userPhones.set(userId, phone);

            // Update campaign attributes if not already stored
            if (!userMetadata.has(userId)) {
                userMetadata.set(userId, {
                    campaign_id: event.campaign_id || "",
                    adset_id: event.adset_id || "",
                    ad_id: event.ad_id || "",
                    utm_source: event.utm_source || "",
                    landing_page_id: event.landing_page_id || "",
                });
            }
        }
    });

    // Create Sets of unique user IDs
    const usersWithEmail = new Set(userEmails.keys());
    const usersWithPhone = new Set(userPhones.keys());

    // Count guests (users with email but no phone)
    const guests = [...usersWithEmail].filter(
        (userId) => !usersWithPhone.has(userId)
    ).length;

    // Count signups (users with phone)
    const signups = usersWithPhone.size;

    // Compile detailed signup data (users with phone numbers)
    const detailedSignups = [...usersWithPhone].map((userId) => {
        const metadata = userMetadata.get(userId) || {
            campaign_id: "",
            adset_id: "",
            ad_id: "",
            utm_source: "",
            landing_page_id: "",
        };

        return {
            user_id: userId,
            email: userEmails.get(userId) || "",
            phone: userPhones.get(userId) || "",
            ...metadata,
        };
    });

    // Group by campaign attributes
    function groupByCampaignAttributes(events) {
        const result = {};

        events.forEach((event) => {
            // Create a key based on campaign attributes
            const key = `${event.campaign_id || ""}|${event.adset_id || ""}|${
                event.ad_id || ""
            }|${event.utm_source || ""}|${event.landing_page_id || ""}`;

            if (!result[key]) {
                result[key] = {
                    campaign_id: event.campaign_id || "",
                    adset_id: event.adset_id || "",
                    ad_id: event.ad_id || "",
                    utm_source: event.utm_source || "",
                    landing_page_id: event.landing_page_id || "",
                    users: new Set(),
                    usersWithEmail: new Set(),
                    usersWithPhone: new Set(),
                };
            }

            // Add this user to the group
            result[key].users.add(event.user_id);

            // Check if user has email for this event
            if (event.name === "email-entered") {
                const emailIndex = event.meta_key.indexOf("email");
                if (
                    emailIndex >= 0 &&
                    event.meta_value[emailIndex] &&
                    event.meta_value[emailIndex].trim() !== ""
                ) {
                    result[key].usersWithEmail.add(event.user_id);
                }
            }

            // Check if user has phone
            if (usersWithPhone.has(event.user_id)) {
                result[key].usersWithPhone.add(event.user_id);
            }
        });

        // Convert the result to an array and calculate guests/signups
        return Object.values(result).map((group) => ({
            campaign_id: group.campaign_id,
            adset_id: group.adset_id,
            ad_id: group.ad_id,
            utm_source: group.utm_source,
            landing_page_id: group.landing_page_id,
            guests: [...group.usersWithEmail].filter(
                (userId) => !usersWithPhone.has(userId)
            ).length,
            signups: group.usersWithPhone.size,
            total_users: group.users.size,
        }));
    }

    // Combine all events for grouping
    const allEvents = [...emailEvents, ...phoneEvents];
    const groupedResults = groupByCampaignAttributes(allEvents);

    // Function to get top K items based on a specific attribute
    function getTopK(data, attribute, groupByKey, k = 5) {
        // Group data by the specified key
        const grouped = {};
        data.forEach((item) => {
            const key = item[groupByKey] || "unknown";
            if (!key) return; // Skip empty keys

            if (!grouped[key]) {
                grouped[key] = {
                    [groupByKey]: key,
                    guests: 0,
                    signups: 0,
                    total_users: 0,
                };
            }

            grouped[key].guests += item.guests;
            grouped[key].signups += item.signups;
            grouped[key].total_users += item.total_users;
        });

        // Convert to array and sort by the specified attribute
        const sortedArray = Object.values(grouped)
            .filter((item) => item[groupByKey] !== "") // Filter out empty values
            .sort((a, b) => b[attribute] - a[attribute]);

        // Return top K items
        return sortedArray.slice(0, k);
    }

    const K = 5;

    // Get top K campaigns, adsets, ads, and landing pages by guests and signups
    const topCampaignsByGuests = getTopK(
        groupedResults,
        "guests",
        "campaign_id",
        K
    );
    const topCampaignsBySignups = getTopK(
        groupedResults,
        "signups",
        "campaign_id",
        K
    );

    const topAdsetsByGuests = getTopK(groupedResults, "guests", "adset_id", K);
    const topAdsetsBySignups = getTopK(
        groupedResults,
        "signups",
        "adset_id",
        K
    );

    const topAdsByGuests = getTopK(groupedResults, "guests", "ad_id", K);
    const topAdsBySignups = getTopK(groupedResults, "signups", "ad_id", K);

    const topLandingPagesByGuests = getTopK(
        groupedResults,
        "guests",
        "landing_page_id",
        K
    );
    const topLandingPagesBySignups = getTopK(
        groupedResults,
        "signups",
        "landing_page_id",
        K
    );

    // Calculate conversion rates
    function addConversionRates(data) {
        return data.map((item) => ({
            ...item,
            conversion_rate:
                item.total_users > 0
                    ? ((item.signups / item.total_users) * 100).toFixed(2) + "%"
                    : "0%",
        }));
    }

    // Add conversion rates to all top K results
    const topCampaignsWithRates = {
        byGuests: addConversionRates(topCampaignsByGuests),
        bySignups: addConversionRates(topCampaignsBySignups),
    };

    const topAdsetsWithRates = {
        byGuests: addConversionRates(topAdsetsByGuests),
        bySignups: addConversionRates(topAdsetsBySignups),
    };

    const topAdsWithRates = {
        byGuests: addConversionRates(topAdsByGuests),
        bySignups: addConversionRates(topAdsBySignups),
    };

    const topLandingPagesWithRates = {
        byGuests: addConversionRates(topLandingPagesByGuests),
        bySignups: addConversionRates(topLandingPagesBySignups),
    };

    // Log the results
    // console.log("Overall counts:");
    // console.log(`Guests (email but no phone): ${guests}`);
    // console.log(`Signups (with phone): ${signups}`);
    // console.log(
    //     `Overall conversion rate: ${(
    //         (signups / (guests + signups)) *
    //         100
    //     ).toFixed(2)}%`
    // );

    // console.log("\nTop ${K} Campaigns by Guests:");
    // console.table(topCampaignsWithRates.byGuests);

    // console.log(`\nTop ${K} Campaigns by Signups:`);
    // console.table(topCampaignsWithRates.bySignups);

    // console.log(`\nTop ${K} Adsets by Guests:`);
    // console.table(topAdsetsWithRates.byGuests);

    // console.log(`\nTop ${K} Adsets by Signups:`);
    // console.table(topAdsetsWithRates.bySignups);

    // console.log(`\nTop ${K} Ads by Guests:`);
    // console.table(topAdsWithRates.byGuests);

    // console.log(`\nTop ${K} Ads by Signups:`);
    // console.table(topAdsWithRates.bySignups);

    // console.log(`\nTop ${K} Landing Pages by Guests:`);
    // console.table(topLandingPagesWithRates.byGuests);

    // console.log(`\nTop ${K} Landing Pages by Signups:`);
    // console.table(topLandingPagesWithRates.bySignups);

    // // Export detailed signup data with emails and phones
    // console.log("\nDetailed Signup Data (Users with phone numbers):");
    // console.table(detailedSignups);
    // console.log(detailedSignups);


    return {
        detailedSignups,
        campaign: topCampaignsBySignups,
        adset: topAdsetsBySignups,
        ad: topAdsBySignups,
        landing_page: topLandingPagesBySignups,
        signups
    }
    
}

// // Optionally export to CSV
    // function exportToCSV(data, filename = 'signup_data.csv') {
    //     // Check if data array is empty
    //     if (!data || data.length === 0) {
    //         console.log("\nNo data available to export to CSV");
    //         return "";
    //     }

    //     // Create header row
    //     const headers = Object.keys(data[0]).join(',');

    //     // Create rows
    //     const rows = data.map(item => {
    //         return Object.values(item).map(value => {
    //             // Handle values with commas by enclosing in quotes
    //             if (typeof value === 'string' && value.includes(',')) {
    //                 return `"${value}"`;
    //             }
    //             return value;
    //         }).join(',');
    //     });

    //     // Combine header and rows
    //     const csv = [headers, ...rows].join('\n');

    //     // In a browser environment, you could trigger a download
    //     // In Node.js, you could write to file system
    //     console.log(`\nCSV Data (copy and paste to save):\n`);
    //     console.log(csv);

    //     return csv;
    // }