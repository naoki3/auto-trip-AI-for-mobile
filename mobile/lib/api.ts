import { API_BASE_URL } from './config';
import { loadAuth } from './auth';

async function authHeaders(): Promise<Record<string, string>> {
  const auth = await loadAuth();
  if (!auth) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth.token}`,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data as T;
}

// --- Auth ---
export interface LoginResult {
  token: string;
  userId: string;
  username: string;
}

export function apiLogin(username: string, password: string): Promise<LoginResult> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function apiRegister(username: string, password: string): Promise<LoginResult> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// --- Trips ---
export interface Trip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  days: number;
  main_transport: string;
  luggage_level: string;
  optional_note: string | null;
  created_at: string;
}

export function apiGetTrips(): Promise<{ trips: Trip[] }> {
  return request('/api/trips');
}

export function apiGetTrip(tripId: string): Promise<Trip> {
  return request(`/api/trips/${tripId}`);
}

export interface CreateTripParams {
  origin: string;
  destination: string;
  days: number;
  main_transport: string;
  luggage_level: string;
  optional_note?: string;
}

export function apiCreateTrip(params: CreateTripParams): Promise<{ id: string }> {
  return request('/api/trips', { method: 'POST', body: JSON.stringify(params) });
}

// --- Plans ---
export interface Plan {
  id: string;
  trip_id: string;
  plan_type: 'fastest' | 'cheapest' | 'relaxed' | 'sightseeing';
  summary: string | null;
  estimated_cost: number | null;
  transfer_count: number | null;
  walking_score: number | null;
  created_at: string;
}

export function apiGetPlans(tripId: string): Promise<{ plans: Plan[] }> {
  return request(`/api/trips/${tripId}/plans`);
}

export function apiGeneratePlans(tripId: string): Promise<{ generated: number }> {
  return request(`/api/trips/${tripId}/generate-plans`, { method: 'POST' });
}

// --- Plan Detail ---
export interface ItineraryItem {
  id: string;
  day_id: string;
  item_type: 'spot' | 'move' | 'meal' | 'hotel' | 'luggage';
  start_time: string | null;
  end_time: string | null;
  title: string;
  metadata_json: string | null;
  sort_order: number;
}

export interface ItineraryDay {
  id: string;
  plan_id: string;
  day_number: number;
  title: string | null;
  items: ItineraryItem[];
}

export interface PlanDetail extends Plan {
  days: ItineraryDay[];
}

export function apiGetPlanDetail(planId: string): Promise<PlanDetail> {
  return request(`/api/plans/${planId}`);
}

// --- Replan ---
export function apiReplan(planId: string, userText: string): Promise<{ new_plan_id: string; result_summary: string }> {
  return request(`/api/plans/${planId}/replan`, {
    method: 'POST',
    body: JSON.stringify({ user_text: userText }),
  });
}
