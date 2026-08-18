import { Settings, Sliders, Bell, Key } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure application defaults, notification channels, and API tokens.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            General Preferences
          </h2>
          <div className="space-y-3 divide-y divide-slate-800/60 pt-2">
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-medium text-slate-300">Dark Mode Enforcement</p>
                <p className="text-xs text-slate-500">
                  Always load dark slate theme for maximum contrast
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-medium text-slate-300">Automatic Telemetry Polling</p>
                <p className="text-xs text-slate-500">Poll live server metrics every 5 seconds</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" />
            Alert Notifications
          </h2>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Critical Error Alerts</p>
                <p className="text-xs text-slate-500">
                  Send push & email notifications on system failures
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            API & Integration Keys
          </h2>
          <div className="flex items-center justify-between pt-2">
            <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              pb_live_99f82a17...48d0a
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700">
              Regenerate Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
