export interface Device {
    id: string;
    name: string;
    status: 'on' | 'off';
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AutomationRule {
    id: string;
    name: string;
    conditions: string[];
    actions: string[];
}

export type DashboardData = {
    devices: Device[];
    user: User;
    automationRules: AutomationRule[];
};