'use server';

import { getData, postData, deleteData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiResponse } from 'src/types/crud-types';
import type {
  AppNotification,
  NotificationListResponse,
  NotificationUnreadCount,
} from 'src/types/notification';

export async function getNotifications(params?: {
  skipCount?: number;
  maxResultCount?: number;
}): Promise<ApiResponse<NotificationListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await getData<NotificationListResponse>(
    `${endpoints.notifications.list}${queryString}`
  );
}

export async function getNotificationUnreadCount(): Promise<ApiResponse<NotificationUnreadCount>> {
  return await getData<NotificationUnreadCount>(endpoints.notifications.unreadCount);
}

export async function markNotificationRead(id: string): Promise<ApiResponse<AppNotification>> {
  return await postData<AppNotification, undefined>(
    endpoints.notifications.read(id),
    undefined
  );
}

export async function markAllNotificationsRead(): Promise<ApiResponse<AppNotification>> {
  return await postData<AppNotification, undefined>(
    endpoints.notifications.readAll,
    undefined
  );
}

export async function dismissNotification(id: string): Promise<ApiResponse<AppNotification>> {
  return await deleteData<AppNotification>(endpoints.notifications.dismiss(id));
}