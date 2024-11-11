"use client";

import News from '@/components/News';
import Topbar from '@/components/Topbar';
import Weather from '@/components/Weather';

export default function WeatherNews() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-none">
        <Topbar />
      </div>
      <div className="flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        <div className="w-full lg:w-1/3 h-full overflow-auto">
          <Weather />
        </div>
        <div className="w-full lg:w-2/3 h-full overflow-auto">
          <News />
        </div>
      </div>
    </div>
  );
}