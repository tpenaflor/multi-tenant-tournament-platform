import React from 'react';
import { DesignSettings } from './schema';
import { buildDesignCssVars } from './designUtils';

export interface LocationLogisticsProps {
  venueName?: string;
  address?: string;
  parkingInfo?: string;
  facilityRules?: string;
  design?: DesignSettings;
}

export const LocationLogistics: React.FC<LocationLogisticsProps> = ({
  venueName = "Atlanta Metro Pickleball Center",
  address = "450 Sportsplex Parkway, Atlanta, GA 30301",
  parkingInfo = "Free participant parking in Lot B. Overflow parking in Lot C.",
  facilityRules = "Non-marking court shoes required. Warmup courts open 45 minutes prior to first match.",
  design,
}) => {
  return (
    <div style={buildDesignCssVars(design)} className="my-6 rounded-2xl bg-tenant-bg border border-slate-800 p-6 shadow-xl text-tenant-text grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📍 Venue & Location</span>
        </h3>
        <div>
          <div className="font-bold text-lg text-tenant-primary">{venueName}</div>
          <div className="text-slate-300 text-sm mt-0.5">{address}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">🚗 Parking Instructions</div>
          <div className="text-sm text-slate-200">{parkingInfo}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📋 Facility Rules & Info</span>
        </h3>
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">👟 Court Policy</div>
          <div className="text-sm text-slate-200">{facilityRules}</div>
        </div>
      </div>
    </div>
  );
};
