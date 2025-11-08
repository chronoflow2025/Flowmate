import { NextRequest } from 'next/server';
import { settingsRepo } from '@/lib/db/repository';
import { getUserId, unauthorized, serverError, success } from '@/lib/api-utils';
import { UserSettings } from '@/types/shared';

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    feedbackTiming: 2,
  },
  appearance: {
    darkMode: false,
    timeFormat: '12h',
    colorPreset: 'blue',
  },
  privacy: {
    dataCollection: true,
  },
};

export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const result = await settingsRepo.getSettings(userId);
    
    if (!result.ok) {
      if (result.error === 'Key not found') {
        return success(defaultSettings);
      }
      console.error('Database error:', result.error);
      return serverError('Failed to fetch settings');
    }

    return success(result.value);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return unauthorized();
    }

    const body = await request.json();
    
    const settings: UserSettings = {
      notifications: body.notifications || defaultSettings.notifications,
      appearance: body.appearance || defaultSettings.appearance,
      privacy: body.privacy || defaultSettings.privacy,
    };

    const result = await settingsRepo.saveSettings(userId, settings);
    
    if (!result.ok) {
      return serverError('Failed to save settings');
    }

    return success(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return serverError();
  }
}
