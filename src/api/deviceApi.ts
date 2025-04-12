import { EventSourcePolyfill } from 'event-source-polyfill';

const BASE_URL = 'https://your-server-url.com/api'; // Replace with your server URL

export const getDeviceStatus = () => {
    console.log('Connecting to SSE endpoint...');
    const eventSource = new EventSourcePolyfill(`${BASE_URL}/device-status`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add auth token if required
        },
    });

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            updateDashboardComponents(data);
        } catch (error) {
            console.error('Error parsing SSE data:', error);
        }
    };

    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
    };

    return () => {
        eventSource.close();
    };
};

const updateDashboardComponents = (data: any) => {
    console.log('Updating dashboard components with data:', data);
    // Assuming you have a way to identify components by their data attributes
    // For example, if you have components with data-dashboard-component="livingRoom"
    // You can use querySelectorAll to find them and dispatch a custom event
    // to update their state or props
    const dashboardComponents = document.querySelectorAll('[data-dashboard-component]');
    dashboardComponents.forEach((component) => {
        if (component instanceof HTMLElement) {
            component.dispatchEvent(new CustomEvent('device-status-update', { detail: data }));
        }
    });
};