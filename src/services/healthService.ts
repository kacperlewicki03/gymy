import { Platform } from "react-native";

export interface SessionHealthMetrics {
  caloriesBurned: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  source: "apple_health" | "health_connect" | "estimated";
}

/**
 * Fallback calorie calculation using MET formula for resistance training:
 * Calories = MET (5.0) * weightKg * durationHours
 */
export function estimateStrengthCalories(
  durationSeconds: number,
  weightKg: number = 75,
): number {
  const MET = 5.0;
  const durationHours = Math.max(1, durationSeconds) / 3600;
  return Math.round(MET * weightKg * durationHours);
}

/**
 * Requests read permissions for Heart Rate and Active Calories
 * on Apple Health (iOS) or Health Connect (Android).
 */
export async function requestHealthPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "ios") {
      const AppleHealthKit = require("react-native-health").default;
      if (!AppleHealthKit) return false;

      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          ],
          write: [AppleHealthKit.Constants.Permissions.Workout],
        },
      };

      return await new Promise<boolean>((resolve) => {
        AppleHealthKit.initHealthKit(permissions, (err: string) => {
          if (err) {
            console.warn("Apple HealthKit init error:", err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    if (Platform.OS === "android") {
      const HealthConnect = require("react-native-health-connect");
      if (!HealthConnect) return false;

      const isInitialized = await HealthConnect.initialize();
      if (!isInitialized) return false;

      const granted = await HealthConnect.requestPermission([
        { accessType: "read", recordType: "HeartRate" },
        { accessType: "read", recordType: "ActiveCaloriesBurned" },
        { accessType: "write", recordType: "ExerciseSession" },
      ]);

      return Array.isArray(granted) && granted.length > 0;
    }
  } catch (error) {
    console.warn("Native health module not linked (Expo Go?):", error);
  }

  return false;
}

/**
 * Queries Apple HealthKit for heart rate & active calories between startTime and endTime.
 */
async function queryAppleHealthSession(
  startTime: Date,
  endTime: Date,
): Promise<{ calories?: number; avgHr?: number; maxHr?: number }> {
  const AppleHealthKit = require("react-native-health").default;
  if (!AppleHealthKit) return {};

  const options = {
    startDate: startTime.toISOString(),
    endDate: endTime.toISOString(),
  };

  const calories = await new Promise<number | undefined>((resolve) => {
    AppleHealthKit.getActiveEnergyBurned(
      options,
      (err: string, results: { value: number }[]) => {
        if (err || !Array.isArray(results) || results.length === 0) {
          resolve(undefined);
          return;
        }
        const total = results.reduce((sum, item) => sum + (item.value || 0), 0);
        resolve(total > 0 ? Math.round(total) : undefined);
      },
    );
  });

  const hrStats = await new Promise<{ avgHr?: number; maxHr?: number }>(
    (resolve) => {
      AppleHealthKit.getHeartRateSamples(
        options,
        (err: string, results: { value: number }[]) => {
          if (err || !Array.isArray(results) || results.length === 0) {
            resolve({});
            return;
          }
          const values = results
            .map((r) => r.value)
            .filter((v) => typeof v === "number" && v > 0);
          if (values.length === 0) {
            resolve({});
            return;
          }
          const sum = values.reduce((a, b) => a + b, 0);
          resolve({
            avgHr: Math.round(sum / values.length),
            maxHr: Math.round(Math.max(...values)),
          });
        },
      );
    },
  );

  return { calories, ...hrStats };
}

/**
 * Queries Android Health Connect for heart rate & active calories between startTime and endTime.
 */
async function queryHealthConnectSession(
  startTime: Date,
  endTime: Date,
): Promise<{ calories?: number; avgHr?: number; maxHr?: number }> {
  const HealthConnect = require("react-native-health-connect");
  if (!HealthConnect) return {};

  const isInitialized = await HealthConnect.initialize();
  if (!isInitialized) return {};

  const timeRangeFilter = {
    operator: "between" as const,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  let calories: number | undefined;
  try {
    const calRes = await HealthConnect.readRecords("ActiveCaloriesBurned", {
      timeRangeFilter,
    });
    const records = calRes?.records || [];
    if (records.length > 0) {
      const totalKcal = records.reduce(
        (sum: number, rec: any) => sum + (rec.energy?.inKilocalories || 0),
        0,
      );
      if (totalKcal > 0) calories = Math.round(totalKcal);
    }
  } catch (e) {
    console.warn("Health Connect calories read failed:", e);
  }

  let avgHr: number | undefined;
  let maxHr: number | undefined;
  try {
    const hrRes = await HealthConnect.readRecords("HeartRate", {
      timeRangeFilter,
    });
    const records = hrRes?.records || [];
    const bpmSamples: number[] = [];

    records.forEach((rec: any) => {
      if (Array.isArray(rec.samples)) {
        rec.samples.forEach((s: any) => {
          if (typeof s.beatsPerMinute === "number" && s.beatsPerMinute > 0) {
            bpmSamples.push(s.beatsPerMinute);
          }
        });
      }
    });

    if (bpmSamples.length > 0) {
      const sum = bpmSamples.reduce((a, b) => a + b, 0);
      avgHr = Math.round(sum / bpmSamples.length);
      maxHr = Math.round(Math.max(...bpmSamples));
    }
  } catch (e) {
    console.warn("Health Connect heart rate read failed:", e);
  }

  return { calories, avgHr, maxHr };
}
/**
 * Fetches the single most recent heart rate reading from the last 5 minutes
 * for live display during an active workout session.
 */
export async function fetchLatestHeartRate(): Promise<number | null> {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    if (Platform.OS === "ios") {
      const AppleHealthKit = require("react-native-health").default;
      if (!AppleHealthKit) return null;

      return await new Promise<number | null>((resolve) => {
        AppleHealthKit.getHeartRateSamples(
          {
            startDate: fiveMinutesAgo.toISOString(),
            endDate: now.toISOString(),
            ascending: false,
            limit: 1,
          },
          (err: string, results: { value: number }[]) => {
            if (err || !Array.isArray(results) || results.length === 0) {
              resolve(null);
              return;
            }
            const val = results[0]?.value;
            resolve(
              typeof val === "number" && val > 0 ? Math.round(val) : null,
            );
          },
        );
      });
    }

    if (Platform.OS === "android") {
      const HealthConnect = require("react-native-health-connect");
      if (!HealthConnect) return null;

      const isInitialized = await HealthConnect.initialize();
      if (!isInitialized) return null;

      const hrRes = await HealthConnect.readRecords("HeartRate", {
        timeRangeFilter: {
          operator: "between",
          startTime: fiveMinutesAgo.toISOString(),
          endTime: now.toISOString(),
        },
        ascendingOrder: false,
        pageSize: 1,
      });

      const latestRecord = hrRes?.records?.[0];
      const samples = latestRecord?.samples;
      if (Array.isArray(samples) && samples.length > 0) {
        const lastSample = samples[samples.length - 1];
        if (
          typeof lastSample?.beatsPerMinute === "number" &&
          lastSample.beatsPerMinute > 0
        ) {
          return Math.round(lastSample.beatsPerMinute);
        }
      }
    }
  } catch {
    // Silent fallback when running without native health permissions or in Expo Go
  }

  return null;
}
/**
 * Fetches heart rate & active calories for the workout window,
 * falling back to MET calorie estimation when watch/health data is unavailable.
 */
export async function fetchSessionHealthMetrics(params: {
  startTime: Date;
  endTime: Date;
  durationSeconds: number;
  userWeightKg?: number;
}): Promise<SessionHealthMetrics> {
  const { startTime, endTime, durationSeconds, userWeightKg } = params;
  const fallbackCalories = estimateStrengthCalories(
    durationSeconds,
    userWeightKg,
  );

  try {
    if (Platform.OS === "ios") {
      const data = await queryAppleHealthSession(startTime, endTime);
      if (data.calories !== undefined || data.avgHr !== undefined) {
        return {
          caloriesBurned: data.calories ?? fallbackCalories,
          avgHeartRate: data.avgHr,
          maxHeartRate: data.maxHr,
          source: "apple_health",
        };
      }
    } else if (Platform.OS === "android") {
      const data = await queryHealthConnectSession(startTime, endTime);
      if (data.calories !== undefined || data.avgHr !== undefined) {
        return {
          caloriesBurned: data.calories ?? fallbackCalories,
          avgHeartRate: data.avgHr,
          maxHeartRate: data.maxHr,
          source: "health_connect",
        };
      }
    }
  } catch (error) {
    console.warn("Health provider query error, using fallback:", error);
  }

  return {
    caloriesBurned: fallbackCalories,
    source: "estimated",
  };
}
